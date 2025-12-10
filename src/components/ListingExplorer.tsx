'use client';

import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import {
  FEATURED_FILTER_OPTIONS,
  LAND_SIZE_UNITS,
  LAND_TYPES,
  PROPERTY_TYPES,
  STATUS_OPTIONS,
  VERIFICATION_FILTER_OPTIONS,
} from '@/constants/ads';
import LandCard from '@/components/LandCard';
import { adsApi } from '@/lib/api';
import { mapToListingCards, normalizeAdsPayload, type ListingCard } from '@/lib/ads';

const DEFAULT_FILTERS = {
  propertyType: '',
  landType: '',
  landSizeUnit: '',
  status: 'ACTIVE',
  verification: 'VERIFIED',
  isFeatured: '',
  city: '',
  state: '',
  pageSize: '9',
  query: '',
};

type FilterState = typeof DEFAULT_FILTERS;

type Props = {
  initialListings: ListingCard[];
  initialFilters?: Partial<FilterState>;
  showViewAll?: boolean;
};

export default function ListingExplorer({ initialListings, initialFilters, showViewAll = false }: Props){
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize filters from URL params or defaults
  const getInitialFilters = useCallback(() => {
    const urlFilters: Partial<FilterState> = {};
    searchParams.forEach((value, key) => {
      if (key in DEFAULT_FILTERS) {
        urlFilters[key as keyof FilterState] = value;
      }
    });
    return { ...DEFAULT_FILTERS, ...initialFilters, ...urlFilters };
  }, [searchParams, initialFilters]);

  const [filters, setFilters] = useState<FilterState>(getInitialFilters);
  const [listings, setListings] = useState<ListingCard[]>(initialListings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Update URL when filters change
  const updateURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== DEFAULT_FILTERS[key as keyof FilterState]) {
        params.set(key, value);
      }
    });
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '/';
    router.replace(newUrl, { scroll: false });
  }, [router]);

  const displayedListings = useMemo(() => {
    if (!filters.query?.trim()) return listings;
    const query = filters.query.toLowerCase();
    return listings.filter((listing) =>
      listing.title.toLowerCase().includes(query) || listing.location.toLowerCase().includes(query)
    );
  }, [filters.query, listings]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await adsApi.list({
        merchantCode: '',
        pageNumber: 1,
        pageSize: filters.pageSize,
        propertyType: filters.propertyType || undefined,
        landType: filters.landType || undefined,
        landSizeUnit: filters.landSizeUnit || undefined,
        status: filters.status || undefined,
        verification: filters.verification || undefined,
        isFeatured: filters.isFeatured || undefined,
        city: filters.city || undefined,
        state: filters.state || undefined,
      });

      if (!data || !data.requestSuccessful) {
        setError(data?.message || error || 'Unable to fetch listings.');
        setListings([]);
        setHasSearched(true);
        return;
      }

      console.log('Raw API response:', data.responseData);
      const normalized = normalizeAdsPayload(data.responseData);
      console.log('Normalized ads:', normalized);
      const cards = mapToListingCards(normalized);
      console.log('Mapped cards:', cards);
      setListings(cards);
      setHasSearched(true);

      if (!cards.length) {
        setError('No advertisements available right now. Please check back soon or adjust your filters.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unable to fetch listings.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateURL(filters);
    fetchListings();
  };

  const handleReset = () => {
    const resetFilters = DEFAULT_FILTERS;
    setFilters(resetFilters);
    setListings(initialListings);
    setError(null);
    setHasSearched(false);
    updateURL(resetFilters);
  };

  useEffect(() => {
    if (initialListings.length) return;
    fetchListings();
  }, [fetchListings, initialListings.length]);

  return (
    <section className="py-16 md:py-24 bg-surface-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <p className="text-sm uppercase tracking-wide text-secondary">Marketplace</p>
          <h2 className="text-3xl font-semibold text-primary">Filter land that fits your plan</h2>
          <p className="text-secondary">Tune property type, verification status, and visibility to quickly narrow thousands of listings.</p>
          {showViewAll && (
            <div className="mt-4">
              <Link href="/lands" className="btn btn-primary">
                View All Listings
              </Link>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="rounded-3xl border border-border/60 bg-surface p-6 shadow-md space-y-6">
          {/* Primary filters - always visible */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="label" htmlFor="propertyType">Property type</label>
              <select id="propertyType" name="propertyType" className="input" value={filters.propertyType} onChange={handleInputChange}>
                <option value="">All property types</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll('_', ' ').toLowerCase().replace(/^./, (char) => char.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="landType">Land use</label>
              <select id="landType" name="landType" className="input" value={filters.landType} onChange={handleInputChange}>
                <option value="">All uses</option>
                {LAND_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll('_', ' ').toLowerCase().replace(/^./, (char) => char.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="status">Listing status</label>
              <select id="status" name="status" className="input" value={filters.status} onChange={handleInputChange}>
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll('_', ' ').toLowerCase().replace(/^./, (char) => char.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="verification">Verification</label>
              <select id="verification" name="verification" className="input" value={filters.verification} onChange={handleInputChange}>
                <option value="">Any status</option>
                {VERIFICATION_FILTER_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.toLowerCase().replace(/^./, (char) => char.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* More search options - collapsible */}
          {showMoreOptions && (
            <div className="space-y-4 pt-4 border-t border-border/40">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="label" htmlFor="landSizeUnit">Size unit</label>
                  <select id="landSizeUnit" name="landSizeUnit" className="input" value={filters.landSizeUnit} onChange={handleInputChange}>
                    <option value="">All units</option>
                    {LAND_SIZE_UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit.replaceAll('_', ' ').toLowerCase().replace(/^./, (char) => char.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="isFeatured">Featured</label>
                  <select id="isFeatured" name="isFeatured" className="input" value={filters.isFeatured} onChange={handleInputChange}>
                    {FEATURED_FILTER_OPTIONS.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="pageSize">Results</label>
                  <select id="pageSize" name="pageSize" className="input" value={filters.pageSize} onChange={handleInputChange}>
                    {[6, 9, 12, 18, 24].map((size) => (
                      <option key={size} value={String(size)}>
                        {size} per page
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="label" htmlFor="city">City</label>
                  <input id="city" name="city" className="input" placeholder="e.g. Lekki" value={filters.city} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="label" htmlFor="state">State</label>
                  <input id="state" name="state" className="input" placeholder="e.g. Lagos" value={filters.state} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="label" htmlFor="query">Keyword</label>
                  <input id="query" name="query" className="input" placeholder="Search title or location" value={filters.query} onChange={handleInputChange} />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
            >
              {showMoreOptions ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Less search options
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  More search options
                </>
              )}
            </button>
            <div className="flex gap-3">
              <button type="button" className="btn btn-ghost" onClick={handleReset} disabled={loading}>
                Reset
              </button>
              <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />} Apply filters
              </button>
            </div>
          </div>
        </form>

        <div className="mt-10 space-y-4">
          {error && (
            <div className="rounded-2xl border border-brand/40 bg-brand/10 px-4 py-3 text-sm text-brand">
              {error}
            </div>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {!loading && !displayedListings.length && !error && (
              <div className="col-span-full rounded-2xl border border-dashed border-border/60 bg-surface p-10 text-center text-secondary">
                No advertisements available yet. Use different filters or check back later.
              </div>
            )}
            {loading && (
              <div className="col-span-full rounded-2xl border border-dashed border-border/60 bg-surface p-10 text-center text-secondary">
                Fetching listings…
              </div>
            )}
            {!loading &&
              displayedListings.map((listing) => (
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
        </div>
      </div>
    </section>
  );
}
