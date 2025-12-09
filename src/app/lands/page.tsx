import LandCard from '@/components/LandCard';
import HeroSearch from '@/components/HeroSearch';
import Link from 'next/link';

const featuredListings = [
  {
    title: 'Ocean view plots – Elegushi',
    price: '₦150,000,000',
    size: '1,000 sqm',
    location: 'Lekki, Lagos',
    featured: true,
  },
  {
    title: 'Golf estate parcel – Katampe',
    price: '₦65,000,000',
    size: '650 sqm',
    location: 'Abuja, FCT',
    featured: true,
  },
  {
    title: 'Industrial dry land – Trans Amadi',
    price: '₦58,000,000',
    size: '900 sqm',
    location: 'Port Harcourt, Rivers',
    featured: true,
  },
];

const marketSnapshots = [
  {
    label: 'Avg. title processing timeline',
    value: '21 days',
    change: '↓ 3 days vs last month',
  },
  {
    label: 'Verified commercial plots',
    value: '312 listings',
    change: '+28 this week',
  },
  {
    label: 'Average deal size (Lagos)',
    value: '₦82m',
    change: '+6% QoQ',
  },
];

const curatedCollections = [
  {
    title: 'Waterfront developments',
    blurb: 'Curated coastal land with governor’s consent and paved access.',
    pill: 'Ikoyi • Banana Island • Oniru',
  },
  {
    title: 'Logistics + warehousing hubs',
    blurb: 'Plots within 5km of major ports, airports, and expressways.',
    pill: 'Epe • Trans Amadi • Agbara',
  },
  {
    title: 'Eco & farmland estates',
    blurb: 'Fertile landbanks with irrigation and power already on-site.',
    pill: 'Kwara • Nasarawa • Ogun',
  },
];

const advisors = [
  {
    name: 'Chidinma N.',
    focus: 'Lekki corridor & new towns',
  },
  {
    name: 'Bolu A.',
    focus: 'Northern growth poles',
  },
  {
    name: 'Farida Y.',
    focus: 'Agricultural cooperatives',
  },
];

export default function LandsPage() {
  return (
    <main className="bg-surface-secondary">
      <section className="border-b border-border/60 bg-linear-to-br from-rose-50 via-white to-rose-50/60 py-16 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-center">
          <div className="md:w-1/2">
            <p className="text-sm uppercase tracking-wide text-secondary">Marketplace</p>
            <h1 className="mt-2 text-4xl font-semibold text-primary">Browse Lands</h1>
            <p className="mt-3 text-base text-muted">
              Search verified plots across emerging corridors, compare documentation, and request diligence support—all in one workspace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-secondary">
              <span className="rounded-full border border-border/80 px-3 py-1">Governor&apos;s consent ready</span>
              <span className="rounded-full border border-border/80 px-3 py-1">Digital survey packs</span>
              <span className="rounded-full border border-border/80 px-3 py-1">Financing partners</span>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="rounded-3xl border border-border/70 bg-surface p-6 shadow-xl">
              <p className="text-sm font-medium text-secondary">Fine-tune your search</p>
              <HeroSearch />
              <p className="mt-4 text-xs text-muted">Need a concierge search? <Link className="text-brand hover:underline" href="/dashboard/requests">Submit a request</Link>.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {marketSnapshots.map((item) => (
            <div key={item.label} className="rounded-3xl border border-border/70 bg-surface px-5 py-6 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-secondary">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-primary">{item.value}</p>
              <p className="mt-1 text-sm text-brand">{item.change}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary">Handpicked this week</p>
            <h2 className="text-2xl font-semibold text-primary">Featured listings</h2>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-brand hover:underline">
            Save to dashboard
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredListings.map((listing) => (
            <LandCard key={listing.title} {...listing} />
          ))}
        </div>
      </section>

      <section className="bg-surface py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-wide text-secondary">Collections</p>
            <h2 className="text-2xl font-semibold text-primary">Browse by strategy</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {curatedCollections.map((collection) => (
              <article key={collection.title} className="rounded-3xl border border-border/70 bg-surface-secondary/70 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Collection</p>
                <h3 className="mt-2 text-lg font-semibold text-primary">{collection.title}</h3>
                <p className="mt-2 text-sm text-secondary">{collection.blurb}</p>
                <p className="mt-4 text-xs uppercase tracking-wide text-muted">Hotspots</p>
                <p className="text-sm font-medium text-primary">{collection.pill}</p>
                <button className="btn btn-ghost mt-4 w-full">Explore</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="rounded-3xl border border-border/70 bg-surface p-6">
            <div className="flex flex-col gap-3 pb-6">
              <p className="text-sm text-secondary">Need more guidance?</p>
              <h2 className="text-2xl font-semibold text-primary">Talk to a land acquisition advisor</h2>
              <p className="text-sm text-muted">Our advisors help you diligence documentation, arrange joint ventures, and structure payments.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {advisors.map((advisor) => (
                <div key={advisor.name} className="rounded-2xl border border-border/60 bg-surface-secondary p-4 text-center">
                  <p className="text-base font-semibold text-primary">{advisor.name}</p>
                  <p className="text-xs uppercase tracking-wide text-secondary">{advisor.focus}</p>
                  <button className="btn btn-ghost mt-4 w-full">Book intro</button>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-linear-to-br from-brand/10 via-transparent to-transparent p-6 dark:from-brand/20">
            <p className="text-sm text-secondary">Have an asset?</p>
            <h2 className="text-2xl font-semibold text-primary">List your land with LandBank</h2>
            <p className="mt-2 text-sm text-muted">
              Upload documentation, syndicate to vetted buyers, and monitor interest in your dashboard.
            </p>
            <Link href="/dashboard/ads" className="btn btn-primary mt-6 w-full">
              Create a listing
            </Link>
            <Link href="/contact" className="btn btn-ghost mt-3 w-full">
              Talk to our team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
