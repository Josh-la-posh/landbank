import { notFound } from 'next/navigation';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { adsApi } from '@/lib/api';
import { mapToListingCards, normalizeAdsPayload, type ListingCard, type AdsApiRecord } from '@/lib/ads';
import LandCard from '@/components/LandCard';

interface MerchantInfo {
  merchantCode: string;
  merchantName: string;
  tradingName?: string;
  businessDescription?: string;
  contactEmail?: string;
}

async function fetchMerchantListings(merchantCode: string): Promise<{ listings: ListingCard[], merchantInfo: MerchantInfo | null, rawAds: AdsApiRecord[] }> {
  try {
    console.log('🔗 Fetching listings for merchantCode:', merchantCode);
    const { data } = await adsApi.list({
      merchantCode,
      pageNumber: 1,
      pageSize: 100,
    });

    console.log('📡 Ads API response:', data);

    if (!data || !data.requestSuccessful || !data.responseData) {
      console.log('⚠️ No valid data from ads API');
      return { listings: [], merchantInfo: null, rawAds: [] };
    }

    const rawAds = normalizeAdsPayload(data.responseData);
    const listings = mapToListingCards(rawAds);
    console.log('✅ Mapped listings count:', listings.length);
    
    // Extract merchant info from first ad's business object
    let merchantInfo: MerchantInfo | null = null;
    if (rawAds.length > 0 && rawAds[0].business) {
      const business = rawAds[0].business;
      merchantInfo = {
        merchantCode: business.merchantCode ?? merchantCode,
        merchantName: business.merchantName ?? business.tradingName ?? 'Merchant',
        tradingName: business.tradingName,
        businessDescription: business.businessDescription ?? undefined,
        contactEmail: business.contactEmail ?? undefined,
      };
      console.log('✅ Extracted merchant info from business object:', merchantInfo);
    }
    
    return { listings, merchantInfo, rawAds };
  } catch (error) {
    console.error('❌ Unable to fetch merchant listings', error);
    return { listings: [], merchantInfo: null, rawAds: [] };
  }
}

export default async function MerchantListingsPage({ params }: { params: Promise<{ merchantCode: string }> }) {
  noStore();
  const { merchantCode } = await params;
  
  console.log('🔍 Merchant Listings Page - merchantCode:', merchantCode);
  
  const { listings, merchantInfo } = await fetchMerchantListings(merchantCode);

  console.log('📊 Fetched data - listings count:', listings.length, 'merchantInfo:', merchantInfo ? 'found' : 'null');

  // If no merchant info found (no listings), show not found
  if (!merchantInfo && listings.length === 0) {
    console.log('❌ No merchant found for merchantCode:', merchantCode);
    notFound();
  }

  const merchantName = merchantInfo?.tradingName ?? merchantInfo?.merchantName ?? 'Merchant';

  return (
    <main className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <section className="bg-linear-to-br from-rose-50 via-white to-rose-50/60 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-brand hover:text-brand/80 mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to marketplace
          </Link>
          
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-20 h-20 rounded-full bg-linear-to-br from-brand to-rose-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {merchantName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/50 mb-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-medium text-rose-700 dark:text-rose-300">Verified Seller</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                  {merchantName}
                </h1>
                {merchantInfo?.businessDescription && (
                  <p className="mt-2 text-secondary max-w-2xl">
                    {merchantInfo.businessDescription}
                  </p>
                )}
              </div>
            </div>
            
            <Link
              href={`/profile/${merchantCode}`}
              className="btn btn-primary"
            >
              View Profile
            </Link>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">
            All Listings
          </h2>
          <p className="text-secondary">
            {listings.length} {listings.length === 1 ? 'property' : 'properties'} available from {merchantName}
          </p>
        </div>

        {listings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <LandCard
                key={listing.id}
                title={listing.title}
                price={listing.price}
                size={listing.size}
                location={listing.location}
                featured={listing.featured}
                imageUrl={listing.imageUrl}
                merchantCode={listing.merchantCode}
                merchantName={listing.merchantName}
                status={listing.status}
                propertyType={listing.propertyType}
                landType={listing.landType}
                verification={listing.verification}
                href={`/lands/${listing.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border/60 bg-surface p-16 text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-surface-secondary flex items-center justify-center">
              <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-lg font-medium text-primary mb-2">No listings available</p>
            <p className="text-sm text-secondary">This merchant hasn&apos;t published any properties yet</p>
          </div>
        )}
      </section>

      {/* Contact Section */}
      {merchantInfo?.contactEmail && (
        <section className="bg-surface border-t border-border/60">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="card p-8 text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-primary mb-2">Interested in these properties?</h3>
              <p className="text-secondary mb-6">
                Contact {merchantName} directly for more information or to schedule a viewing
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href={`mailto:${merchantInfo.contactEmail}`}
                  className="btn btn-primary"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </a>
                <Link href="/" className="btn btn-ghost">
                  Browse All Properties
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
