import { unstable_noStore as noStore } from 'next/cache';
import LandCard from '@/components/LandCard';
import { adsApi } from '@/lib/api';
import { mapToListingCards, normalizeAdsPayload, type ListingCard } from '@/lib/ads';

async function fetchAllFeaturedListings(): Promise<ListingCard[]> {
  try {
    const { data } = await adsApi.list({
      merchantCode: '',
      pageNumber: 1,
      pageSize: 100, // Get all featured listings
      status: 'ACTIVE',
      verification: 'VERIFIED',
      isFeatured: 'YES',
    });

    if (!data || !data.requestSuccessful || !data.responseData) {
      return [];
    }

    return mapToListingCards(normalizeAdsPayload(data.responseData));
  } catch (error) {
    console.error('Unable to load featured listings', error);
    return [];
  }
}

export default async function FeaturedPage() {
  noStore();
  const featuredListings = await fetchAllFeaturedListings();

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <section className="relative overflow-hidden bg-linear-to-br from-rose-50 via-white to-rose-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-20 w-96 h-96 bg-rose-300/20 dark:bg-rose-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40 dark:opacity-20"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/50 mb-6">
              <svg className="w-4 h-4 text-rose-600 dark:text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-rose-700 dark:text-rose-300">Premium Selection</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Featured Properties
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Handpicked verified land listings with premium features and transparent pricing
            </p>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {featuredListings.length ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-secondary">
                  Showing {featuredListings.length} featured {featuredListings.length === 1 ? 'property' : 'properties'}
                </p>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  All properties verified
                </div>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {featuredListings.map((land) => (
                  <LandCard
                    key={land.id}
                    title={land.title}
                    price={land.price}
                    size={land.size}
                    location={land.location}
                    featured={land.featured}
                    imageUrl={land.imageUrl}
                    merchantCode={land.merchantCode}
                    merchantName={land.merchantName}
                    status={land.status}
                    propertyType={land.propertyType}
                    landType={land.landType}
                    verification={land.verification}
                    href={`/lands/${land.id}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-surface p-16 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-secondary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg font-medium text-primary mb-2">No featured properties available</p>
              <p className="text-sm text-secondary">Check back soon for new premium listings</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
