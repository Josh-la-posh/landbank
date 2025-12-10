import { unstable_noStore as noStore } from 'next/cache';
import HeroSearch from '@/components/HeroSearch';
import LandCard from '@/components/LandCard';
import ListingExplorer from '@/components/ListingExplorer';
import { adsApi } from '@/lib/api';
import { mapToListingCards, normalizeAdsPayload, type ListingCard } from '@/lib/ads';

async function fetchFeaturedListings(): Promise<ListingCard[]> {
  try {
    const { data } = await adsApi.list({
      merchantCode: '',
      pageNumber: 1,
      pageSize: 3,
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

async function fetchInitialListings(): Promise<ListingCard[]> {
  try {
    const { data } = await adsApi.list({
      merchantCode: '',
      pageNumber: 1,
      pageSize: 9,
      status: 'ACTIVE',
      verification: 'VERIFIED',
    });

    if (!data || !data.requestSuccessful || !data.responseData) {
      return [];
    }

    return mapToListingCards(normalizeAdsPayload(data.responseData));
  } catch (error) {
    console.error('Unable to load listings', error);
    return [];
  }
}

export default async function Home(){
  noStore();
  const featuredListings = await fetchFeaturedListings();
  const initialListings = await fetchInitialListings();
  return (
    <>
      {/* Hero - Dramatic gradient background with mesh pattern */}
      <section className="relative overflow-hidden bg-linear-to-br from-rose-50 via-white to-rose-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient orbs */}
          <div className="absolute top-0 -left-20 w-96 h-96 bg-rose-300/20 dark:bg-rose-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl"></div>
          {/* Mesh pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40 dark:opacity-20"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/50 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-sm font-medium text-rose-700 dark:text-rose-300">1000+ verified listings</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Find your perfect
              <br />
              <span className="bg-linear-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">
                land property
              </span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover verified land listings with transparent pricing. 
              <br className="hidden sm:block" />
              From agricultural plots to commercial developments.
            </p>
            
            {/* <div className="mt-10">
              <HeroSearch />
            </div> */}
            
            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Verified sellers
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Clear documentation
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Secure transactions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured lands - Clean white/dark section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Featured Properties</h2>
              <p className="text-secondary">Handpicked premium listings</p>
            </div>
            <a 
              href="/featured" 
              className="group inline-flex items-center gap-2 text-sm font-medium transition-colors text-brand hover:text-rose-700 dark:hover:text-rose-300"
            >
              View all
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          {featuredListings.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-surface p-10 text-center text-secondary">
              No advertisements have been published yet. Please check back soon.
            </div>
          )}
        </div>
      </section>

      <ListingExplorer
        initialListings={initialListings}
        initialFilters={{ status: 'ACTIVE', verification: 'VERIFIED', pageSize: '9' }}
        showViewAll={true}
      />

      {/* Neighbouring lands - Gradient accent section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background with subtle gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-rose-50/30 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30 dark:opacity-10"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 mb-4">
              <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Location based</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">Properties Near You</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              Enable location access to discover available land in your area
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({length:3}).map((_,i)=> (
              <LandCard key={i} title="Coming soon" price="—" size="—" location="Your vicinity" />
            ))}
          </div>
        </div>
      </section>

      {/* Blog section - Clean professional look */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">Knowledge Hub</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              Learn everything you need to know about land acquisition and ownership
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { 
                title: 'Understanding C of O and Survey Plans',
                desc: 'A comprehensive guide to the essential documents you need before purchasing land in Nigeria.',
                tag: 'Documentation'
              },
              { 
                title: 'Land Investment Tips for 2025',
                desc: 'Expert insights on making smart land investments and maximizing returns in the current market.',
                tag: 'Investment'
              },
              { 
                title: 'How to Verify Land Ownership',
                desc: 'Step-by-step process to ensure the land you\'re buying has clear and legitimate ownership.',
                tag: 'Legal'
              }
            ].map((post, i)=> (
              <article key={i} className="card p-6 group hover:shadow-xl transition-all duration-300">
                <div className="inline-block px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/50 mb-4">
                  <span className="text-xs font-medium text-rose-600 dark:text-rose-400">{post.tag}</span>
                </div>
                <h3 className="font-bold text-lg text-primary mb-3 group-hover:text-brand transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-secondary leading-relaxed mb-4">
                  {post.desc}
                </p>
                <a 
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-brand hover:gap-3" 
                  href="#"
                >
                  Read article
                  <svg className="w-4 h-4 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}