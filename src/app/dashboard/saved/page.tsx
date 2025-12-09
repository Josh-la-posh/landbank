import Link from 'next/link';
import { Heart, Lock, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const navItems: Array<{
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
}> = [
  {
    label: 'My Saved Property',
    description: 'View and manage your bookmarked listings',
    href: '/dashboard/saved',
    icon: Heart,
    active: true,
  },
  {
    label: 'My Profile',
    description: 'Update your contact information and preferences',
    href: '/dashboard/profile',
    icon: UserRound,
  },
  {
    label: 'Change Password',
    description: 'Keep your account secure with a fresh password',
    href: '/dashboard/security',
    icon: Lock,
  },
];

export default function SavedPropertiesPage() {
  return (
    <main className="min-h-screen bg-surface-secondary">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-border/70 bg-surface shadow-lg">
          <header className="border-b border-border/60 px-6 py-6">
            <p className="text-sm text-secondary">Collections</p>
            <h1 className="mt-1 text-2xl font-semibold text-primary">My Saved Property</h1>
            <p className="mt-2 text-sm text-muted">
              Keep tabs on every plot you are considering in one clean workspace.
            </p>
          </header>

          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[280px,1fr]">
            <nav className="rounded-2xl border border-border/70 bg-surface-secondary/60">
              <ul className="divide-y divide-border/60">
                {navItems.map(({ label, description, href, icon: Icon, active }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-start gap-3 px-5 py-4 transition hover:bg-brand/5 ${
                        active
                          ? 'bg-brand text-white hover:bg-brand'
                          : 'text-primary'
                      }`}
                    >
                      <span
                        className={`mt-0.5 rounded-full border border-border/80 p-2 ${
                          active ? 'text-white border-white/60' : 'text-brand'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <p className={`text-sm font-semibold ${active ? 'text-white' : 'text-primary'}`}>
                          {label}
                        </p>
                        <p className={`text-xs ${active ? 'text-white/80' : 'text-secondary'}`}>
                          {description}
                        </p>
                      </span>
                      <span className={`ml-auto mt-1 text-xs ${active ? 'text-white' : 'text-muted'}`}>
                        ›
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <section className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-border/70 bg-surface-secondary/80 text-center">
              <div className="rounded-full bg-white p-4 text-brand shadow-sm">
                <Heart className="h-6 w-6" />
              </div>
              <p className="mt-4 text-lg font-semibold text-primary">You do not have any saved property.</p>
              <p className="mt-2 max-w-md text-sm text-secondary">
                Bookmark listings you like from the marketplace or dashboard recommendations.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/lands" className="btn btn-primary">
                  Browse properties
                </Link>
                <Link href="/dashboard" className="btn btn-ghost">
                  Back to dashboard
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
