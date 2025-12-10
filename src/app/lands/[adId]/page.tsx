import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { adsApi } from '@/lib/api';
import {
  formatLabel,
  formatLocationLabel,
  formatPriceLabel,
  formatSizeLabel,
  normalizeAdsPayload,
  type AdsApiRecord,
} from '@/lib/ads';

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
};

async function fetchListing(adId: string): Promise<AdsApiRecord | null> {
  try {
    const { data } = await adsApi.list({ merchantCode: '', adId });

    if (!data || !data.requestSuccessful || !data.responseData) {
      return null;
    }

    return normalizeAdsPayload(data.responseData)[0] ?? null;
  } catch (error) {
    console.error('Unable to fetch listing', error);
    return null;
  }
}

export default async function LandDetailsPage({ params }: { params: Promise<{ adId: string }> }){
  noStore();
  const { adId } = await params;
  const listing = await fetchListing(adId);

  if (!listing) {
    notFound();
  }

  const priceLabel = formatPriceLabel(listing.price, listing.currency);
  const sizeLabel = formatSizeLabel(listing.landSize, listing.landSizeUnit);
  const locationLabel = formatLocationLabel(listing);
  
  // Extract media images
  const mediaImages = listing.media ?? [];
  const primaryImage = mediaImages[0]?.link;
  
  // Extract merchant info
  const merchantName = listing.business?.merchantName ?? listing.business?.tradingName;
  const merchantCode = listing.business?.merchantCode;

  const summaryStats = [
    { label: 'Status', value: formatLabel(listing.status) || 'Unspecified' },
    { label: 'Property type', value: formatLabel(listing.propertyType) || '—' },
    { label: 'Land use', value: formatLabel(listing.landType) || '—' },
    { label: 'Verification', value: formatLabel(listing.verification ?? listing.verificationStatus) || '—' },
    { label: 'Title document', value: listing.titleDocumentType ? formatLabel(listing.titleDocumentType) : listing.hasTitleDocument ? 'Provided' : 'Pending' },
    { label: 'Ad ID', value: listing.adId ?? '—' },
  ];

  const amenityFlags = [
    { label: 'Perimeter fencing', value: listing.isFenced },
    { label: 'Title document uploaded', value: listing.hasTitleDocument },
    { label: 'Accessible road network', value: listing.hasAccessRoad },
    { label: 'Utilities available', value: listing.hasUtilities },
  ];

  return (
    <main className="bg-surface-secondary min-h-screen">
      {/* Hero Image Gallery */}
      <section className="relative">
        {primaryImage ? (
          <div className="relative">
            {/* Main Image */}
            <div className="relative w-full h-[60vh] md:h-[70vh]">
              <Image
                src={primaryImage}
                alt={listing.title ?? 'Property image'}
                fill
                className="object-cover"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Back button */}
              <Link 
                href="/" 
                className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-sm font-medium text-primary hover:bg-white dark:hover:bg-gray-900 transition-all shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>

              {/* Image counter */}
              {mediaImages.length > 1 && (
                <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  1 / {mediaImages.length}
                </div>
              )}

              {/* Property info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      {formatLabel(listing.verification ?? listing.verificationStatus) || 'Pending'}
                    </span>
                    {listing.status && (
                      <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                        {formatLabel(listing.status)}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                    {listing.title ?? 'Untitled listing'}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-lg">{locationLabel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {mediaImages.length > 1 && (
              <div className="bg-surface border-t border-border/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {mediaImages.slice(0, 6).map((media, idx) => (
                      <div 
                        key={media.id ?? idx} 
                        className="relative flex-shrink-0 w-24 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden border-2 border-border/60 hover:border-brand transition-all cursor-pointer"
                      >
                        <Image
                          src={media.link ?? ''}
                          alt={`Property image ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {mediaImages.length > 6 && (
                      <div className="relative flex-shrink-0 w-24 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden border-2 border-border/60 bg-surface-secondary flex items-center justify-center">
                        <span className="text-sm font-semibold text-secondary">+{mediaImages.length - 6}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full h-[60vh] bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            <Link 
              href="/" 
              className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-sm font-medium text-primary hover:bg-white dark:hover:bg-gray-900 transition-all shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <p className="text-secondary">No images available</p>
          </div>
        )}
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Card */}
            <div className="card p-6 md:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-secondary mb-1">Price</p>
                  <p className="text-4xl md:text-5xl font-bold text-brand">{priceLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-secondary mb-1">Size</p>
                  <p className="text-2xl font-semibold text-primary">{sizeLabel}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn btn-primary flex-1 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Seller
                </button>
                <button className="btn btn-ghost flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="btn btn-ghost flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Property Details */}
            <div className="card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Property Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {summaryStats.map((stat) => (
                  <div key={stat.label} className="flex items-start gap-3 p-4 rounded-xl bg-surface-secondary/60 border border-border/40">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-secondary mb-1">{stat.label}</p>
                      <p className="font-semibold text-primary">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div className="card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Description
              </h2>
              <p className="text-secondary leading-relaxed">
                {listing.description || 'The vendor has not provided a detailed description yet. Reach out to request documentation or schedule a site inspection.'}
              </p>
            </div>

            {/* Features */}
            <div className="card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Features & Amenities
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {amenityFlags.map((amenity) => (
                  <div key={amenity.label} className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-surface-secondary/40">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      amenity.value 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}>
                      {amenity.value ? '✓' : '!'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary">{amenity.label}</p>
                      <p className="text-xs text-secondary">{amenity.value ? 'Available' : 'Not confirmed'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Seller Card */}
            {merchantName && merchantCode && (
              <div className="card p-6 sticky top-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="shrink-0 w-14 h-14 rounded-full bg-linear-to-br from-brand to-rose-600 flex items-center justify-center text-white font-bold text-xl">
                    {merchantName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary mb-1">Seller</p>
                    <p className="font-bold text-primary">{merchantName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-xs text-secondary">Verified Seller</span>
                    </div>
                  </div>
                </div>
                <Link 
                  href={`/merchant/${merchantCode}/listings`}
                  className="btn btn-primary w-full justify-center mb-3"
                >
                  View All Listings
                </Link>
                <Link 
                  href={`/profile/${merchantCode}`}
                  className="btn btn-ghost w-full justify-center"
                >
                  View Profile
                </Link>
              </div>
            )}

            {/* Contact Form */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-primary mb-4">Send Message</h3>
              <form className="space-y-4">
                <input className="input" placeholder="Your name" required />
                <input className="input" placeholder="Email address" type="email" required />
                <input className="input" placeholder="Phone number" type="tel" />
                <textarea className="input min-h-[100px]" placeholder="I'm interested in this property..." />
                <button type="submit" className="btn btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>

            {/* Help Card */}
            <div className="card p-6 bg-linear-to-br from-brand/10 to-rose-500/10 border-brand/20">
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">Need Help?</p>
                  <p className="text-sm text-secondary">
                    Our team can assist with verification, documentation, and secure transactions.
                  </p>
                </div>
              </div>
            </div>

            {/* Ad Info */}
            <div className="text-xs text-secondary space-y-1 px-2">
              <p>Listed: {formatDate(listing.createdDate as string | undefined)}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
