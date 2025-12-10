import { unstable_noStore as noStore } from 'next/cache';
import { adsApi } from '@/lib/api';
import { mapToListingCards, normalizeAdsPayload, type ListingCard } from '@/lib/ads';
import ListingExplorer from '@/components/ListingExplorer';

async function fetchAllListings(): Promise<ListingCard[]> {
  try {
    const { data } = await adsApi.list({
      merchantCode: '',
      pageNumber: 1,
      pageSize: 100,
      status: 'ACTIVE',
      verification: 'VERIFIED',
    });

    if (!data || !data.requestSuccessful || !data.responseData) {
      return [];
    }

    return mapToListingCards(normalizeAdsPayload(data.responseData));
  } catch (error) {
    console.error('Unable to fetch all listings', error);
    return [];
  }
}

export default async function BrowsePage() {
  noStore();
  const initialListings = await fetchAllListings();

  return (
    <main className="min-h-screen bg-surface-secondary">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-rose-50 via-white to-rose-50/60 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/50 mb-6">
            <svg className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm font-medium text-rose-700 dark:text-rose-300">Browse All Properties</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Discover Your Perfect Land
          </h1>
          <p className="text-lg text-secondary max-w-3xl mx-auto">
            Explore our complete collection of verified land listings. Use advanced filters to find exactly what you're looking for.
          </p>
        </div>
      </section>

      {/* Listings Explorer */}
      <ListingExplorer initialListings={initialListings} maxItems={90} />
    </main>
  );
}
