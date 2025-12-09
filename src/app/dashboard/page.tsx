import LandCard from '@/components/LandCard';
import Link from 'next/link';
import { BellRing, Heart, Lock, MapPin, Megaphone, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type QuickAction = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type AccountDetail = {
  label: string;
  value: string;
};

type AlertCard = {
  title: string;
  detail: string;
  time: string;
};

const savedSearches = [
  {
    id: 1,
    title: 'Ikoyi waterfront plots',
    criteria: '₦50m - ₦120m • 600-1000sqm • Lagos',
    lastRun: '2 days ago',
  },
  {
    id: 2,
    title: 'Abuja commercial lots',
    criteria: '₦20m - ₦60m • FCT districts',
    lastRun: '5 days ago',
  },
];

const recommended = [
  {
    title: 'Orchid Road, Lekki',
    price: '₦85,000,000',
    size: '750 sqm',
    location: 'Lekki Phase 2, Lagos',
    featured: true,
  },
  {
    title: 'Katampe Extension',
    price: '₦42,000,000',
    size: '600 sqm',
    location: 'Katampe, Abuja',
  },
  {
    title: 'Trans Amadi Industrial',
    price: '₦61,500,000',
    size: '900 sqm',
    location: 'Port Harcourt, Rivers',
  },
];

const insights = [
  {
    label: 'Lagos Island avg. price',
    change: '+4.2% MoM',
    value: '₦92m',
  },
  {
    label: 'New premium listings',
    change: '18 added this week',
    value: '42 total',
  },
  {
    label: 'Saved searches with alerts',
    change: '2 active',
    value: '5 total',
  },
];

const tasks = [
  {
    title: 'Book a viewing for Orchid Road plot',
    action: 'Schedule',
  },
  {
    title: 'Upload proof of funds',
    action: 'Upload',
  },
  {
    title: 'Add preferred closing partner',
    action: 'Add now',
  },
];

const quickActions: QuickAction[] = [
  {
    title: 'My Saved Property',
    description: 'View the properties you have bookmarked.',
    href: '/dashboard/saved',
    icon: Heart,
  },
  {
    title: 'My Property Requests',
    description: 'Review open requests and responses.',
    href: '/dashboard/requests',
    icon: Megaphone,
  },
  {
    title: 'My Profile',
    description: 'Phone number, email, and address management.',
    href: '/dashboard/profile',
    icon: UserRound,
  },
  {
    title: 'Change Password',
    description: 'Keep your account secure with a new password.',
    href: '/dashboard/security',
    icon: Lock,
  },
];

const accountDetails: AccountDetail[] = [
  { label: 'Merchant code', value: 'MOH4f30bd6' },
  { label: 'Primary email', value: 'mohammedola1234@gmail.com' },
  { label: 'Phone number', value: '+234 813 832 9684' },
];

const alerts: AlertCard[] = [
  {
    title: 'Price drop on your saved Ikoyi lot',
    detail: '3% lower than last week',
    time: '2h ago',
  },
  {
    title: '3 clients viewed your Lekki listing',
    detail: 'Follow up to keep momentum high',
    time: 'Yesterday',
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-surface-secondary">
      <section className="relative isolate overflow-hidden border-b border-border/60 bg-linear-to-br from-rose-50 via-white to-rose-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <p className="text-sm text-secondary">Discovery dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            Welcome back, Mohammed
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted">
            Pick up where you left off. Your saved searches, recommended plots, and next steps are curated below.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard/ads" className="btn btn-primary">
              Create a new ad
            </Link>
            <Link href="/lands" className="btn btn-ghost">
              Browse marketplace
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {insights.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border/60 bg-surface p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-secondary">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-primary">{item.value}</p>
                <p className="mt-1 text-sm font-medium text-brand">{item.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-3xl border border-border/60 bg-surface p-6 shadow-lg">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-secondary">Quick actions</p>
              <h2 className="text-xl font-semibold text-primary">Jump into the most common tasks</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {quickActions.map(({ title, description, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group flex items-start gap-4 rounded-2xl border border-border/60 p-5 transition hover:border-brand hover:bg-brand/5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border/80 bg-surface-secondary text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-semibold text-primary group-hover:text-brand">{title}</p>
                  <p className="text-sm text-secondary">{description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          <div className="rounded-3xl border border-border/60 bg-surface shadow-lg">
            <div className="border-b border-border/60 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Saved searches</p>
                  <h2 className="text-lg font-semibold text-primary">Quickly rerun your best filters</h2>
                </div>
                <Link href="/lands" className="text-sm font-medium text-brand hover:underline">
                  Manage all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-border/60">
              {savedSearches.map((search) => (
                <div key={search.id} className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-medium text-primary">{search.title}</p>
                    <p className="text-sm text-secondary">{search.criteria}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">Last run {search.lastRun}</span>
                    <button className="btn btn-outline">Open</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Handpicked for you</p>
                <h2 className="text-lg font-semibold text-primary">Fresh listings that match your interest</h2>
              </div>
              <Link href="/lands" className="text-sm font-medium text-brand hover:underline">
                See all
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((card) => (
                <LandCard key={card.title} {...card} />
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-3xl border border-border/60 bg-surface p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-brand/10 p-3 text-brand">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-secondary">Account snapshot</p>
                <h3 className="text-lg font-semibold text-primary">Personalise your profile</h3>
              </div>
            </div>
            <dl className="mt-4 space-y-3">
              {accountDetails.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border/60 px-4 py-3">
                  <dt className="text-xs uppercase tracking-wide text-secondary">{item.label}</dt>
                  <dd className="text-sm font-medium text-primary">{item.value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/dashboard/profile" className="btn btn-ghost mt-4 w-full">
              Update profile
            </Link>
          </div>

          <div className="rounded-3xl border border-border/60 bg-surface p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-primary">Next best actions</h3>
            <p className="mt-1 text-sm text-muted">Complete these to keep your acquisition timeline on track.</p>
            <ul className="mt-4 space-y-4">
              {tasks.map((task) => (
                <li key={task.title} className="rounded-2xl border border-border/60 px-4 py-3">
                  <p className="text-sm font-medium text-primary">{task.title}</p>
                  <button className="mt-2 text-sm font-medium text-brand hover:underline">{task.action}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border/60 bg-surface p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <BellRing className="h-5 w-5 text-brand" />
              <div>
                <p className="text-sm text-secondary">Notifications</p>
                <h3 className="text-lg font-semibold text-primary">What needs your attention</h3>
              </div>
            </div>
            <ul className="mt-4 space-y-4">
              {alerts.map((alert) => (
                <li key={alert.title} className="rounded-2xl border border-border/60 px-4 py-3">
                  <p className="text-sm font-medium text-primary">{alert.title}</p>
                  <p className="text-xs text-secondary">{alert.detail}</p>
                  <p className="text-xs text-muted">{alert.time}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border/60 bg-linear-to-br from-brand/10 via-transparent to-transparent p-6 shadow-lg dark:from-brand/20">
            <h3 className="text-lg font-semibold text-primary">Need a second set of eyes?</h3>
            <p className="mt-2 text-sm text-muted">
              Share your shortlist with our advisory team to get diligence notes, comparable sales, and closing guidance within 24 hours.
            </p>
            <button className="btn btn-primary mt-4 w-full">Book advisory call</button>
          </div>
        </aside>
      </section>
    </main>
  );
}
