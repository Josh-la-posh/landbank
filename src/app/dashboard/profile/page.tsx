'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Building2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserCircle,
  UserRound,
} from 'lucide-react';
import { BusinessProfile, userApi } from '@/lib/api';
import { getAuthUser, type AuthUser } from '@/lib/auth';

const formatDate = (value?: string | null) => {
  if (!value) return 'Not provided';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not provided';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
};

const humanize = (value?: string | null) => {
  if (!value) return 'Not provided';
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [merchantCode, setMerchantCode] = useState<string | null>(null);
  const [needsCompliance, setNeedsCompliance] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      if (typeof window === 'undefined') return;

      setLoading(true);
      setError(null);
      setNeedsCompliance(false);

      // Get user from localStorage
      const authUser = getAuthUser();
      
      if (!authUser) {
        if (!cancelled) {
          setError('You are not signed in. Please log in to view your profile.');
          setLoading(false);
        }
        return;
      }

      // Set user data
      setUser(authUser);
      setMerchantCode(authUser.userCode);

      // Try to fetch business profile
      const storedToken = localStorage.getItem('authToken') || undefined;

      try {
        const { data, error } = await userApi.getBusinessProfile(authUser.userCode, storedToken);

        if (cancelled) return;

        if (!data) {
          // Network error
          setError(error || 'Unable to connect to the profile service.');
          setProfile(null);
        } else if (!data.requestSuccessful) {
          // Check if it's a compliance issue
          if (data.message?.toLowerCase().includes('user not found') || data.responseCode === '99') {
            setNeedsCompliance(true);
            setProfile(null);
            setError(null);
          } else {
            setError(data.message || 'We could not load your business profile.');
            setProfile(null);
          }
        } else if (data.responseData) {
          setProfile(data.responseData);
          setError(null);
          setNeedsCompliance(false);
        }
      } catch (err) {
        console.error('Failed to fetch business profile', err);
        if (!cancelled) {
          setError('An unexpected error occurred while loading your profile.');
          setProfile(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const statusChecks = useMemo(() => {
    if (!profile) return [];
    return [
      { label: 'Address verified', value: profile.merchantAddressStatus },
      { label: 'Ownership confirmed', value: profile.ownershipTypeStatus },
      { label: 'RC number verified', value: profile.rcNumberStatus },
      { label: 'Website live', value: profile.websiteStatus },
    ];
  }, [profile]);

  const contactChannels = useMemo(() => {
    if (!profile) return [];
    return [
      { label: 'Support email', value: profile.supportEmail, icon: Mail },
      { label: 'Dispute email', value: profile.disputeEmail, icon: Mail },
      { label: 'Primary contact', value: profile.contactEmail, icon: UserRound },
      { label: 'Website', value: profile.website, icon: Globe, href: profile.website || undefined },
    ];
  }, [profile]);

  const operations = useMemo(() => {
    if (!profile) return [];
    return [
      { label: 'Staff strength', value: profile.staffStrength },
      { label: 'Locations', value: profile.numberOfLocations },
      { label: 'Ownership type', value: humanize(profile.ownershipType) },
      { label: 'Country', value: profile.countryCode },
      { label: 'Incorporation date', value: formatDate(profile.incorporationDate) },
      { label: 'Commencement date', value: formatDate(profile.businessCommencementDate) },
    ];
  }, [profile]);

  const renderState = () => {
    if (loading) {
      return (
        <div className="rounded-3xl border border-border/60 bg-surface p-10 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand" />
          <p className="mt-4 text-sm text-secondary">Fetching your profile…</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-3xl border border-red-200 bg-red-50/80 p-6 text-red-700 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Unable to load profile</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Try again
            </button>
            <Link href="/" className="btn btn-ghost">
              Go home
            </Link>
          </div>
        </div>
      );
    }

    // Show compliance notice if business profile not found
    if (needsCompliance) {
      return (
        <div className="space-y-6">
          {/* User Personal Details */}
          {user && (
            <section className="rounded-3xl border border-border/70 bg-surface shadow-lg">
              <div className="border-b border-border/60 px-6 py-6">
                {/* <p className="text-sm text-secondary">Personal Information</p> */}
                <h2 className="mt-2 text-2xl font-semibold text-primary">
                  {user.firstName} {user.lastName}
                </h2>
              </div>
              <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border/60 p-5">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-brand" />
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">Email Address</h3>
                  </div>
                  <p className="mt-3 text-base text-primary">{user.email}</p>
                  {user.isEmailConfirmed ? (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <ShieldCheck className="h-3 w-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-3 w-3" />
                      Not verified
                    </span>
                  )}
                </div>
                <div className="rounded-2xl border border-border/60 p-5">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-brand" />
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">Phone Number</h3>
                  </div>
                  <p className="mt-3 text-base text-primary">{user.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
            </section>
          )}

          {/* Compliance Notice */}
          <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-8 dark:border-amber-900/40 dark:bg-amber-900/10">
            <div className="flex items-start gap-4">
              <Building2 className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
                  Complete Your Business Profile
                </h2>
                <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
                  Your business profile has not been set up yet. To list properties and access advanced marketplace features, 
                  you need to complete the compliance process.
                </p>
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">What you'll need:</h3>
                  <ul className="ml-5 list-disc space-y-2 text-sm text-amber-800 dark:text-amber-200">
                    <li>Business registration details (RC number)</li>
                    <li>Trading name and legal business name</li>
                    <li>Registered business address</li>
                    <li>Contact information for support and disputes</li>
                    <li>Ownership and incorporation documents</li>
                  </ul>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/dashboard/ads" className="btn btn-primary">
                    Start Compliance
                  </Link>
                  <Link href="/dashboard" className="btn btn-ghost">
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="rounded-3xl border border-border/60 bg-surface p-10 text-center">
          <Building2 className="mx-auto h-10 w-10 text-brand" />
          <p className="mt-4 text-lg font-semibold text-primary">No business profile found.</p>
          <p className="mt-2 text-sm text-secondary">
            Once you complete your onboarding, your business details will appear here.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* User Personal Details */}
        {user && (
          <section className="rounded-3xl border border-border/70 bg-surface shadow-lg">
            <div className="border-b border-border/60 px-6 py-6">
              {/* <p className="text-sm text-secondary">Personal Information</p> */}
              <h2 className="mt-2 text-2xl font-semibold text-primary">
                {user.firstName} {user.lastName}
              </h2>
            </div>
            <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border/60 p-5">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-brand" />
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">Email Address</h3>
                </div>
                <p className="mt-3 text-base text-primary">{user.email}</p>
                {user.isEmailConfirmed ? (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                ) : (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    Not verified
                  </span>
                )}
              </div>
              <div className="rounded-2xl border border-border/60 p-5">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-brand" />
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">Phone Number</h3>
                </div>
                <p className="mt-3 text-base text-primary">{user.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
          </section>
        )}

        {/* Business Profile Section */}
        <section className="rounded-3xl border border-border/70 bg-surface shadow-lg">
          <div className="border-b border-border/60 px-6 py-6">
            <p className="text-sm text-secondary">Business profile</p>
            <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-primary">{profile.tradingName || 'Trading name not provided'}</h1>
                <p className="text-sm text-muted">{profile.businessDescription || 'Add a short description so buyers know what you do.'}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-border/60 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-secondary">
                  Merchant code: {profile.merchantCode || merchantCode}
                </span>
                {profile.rcNumber && (
                  <span className="rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold text-brand">
                    RC {profile.rcNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-6 px-6 py-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 p-5">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-brand" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">Registered address</h2>
              </div>
              <p className="mt-3 text-base text-primary">{profile.merchantAddress || 'Address not provided'}</p>
            </div>
            <div className="rounded-2xl border border-border/60 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-brand" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">Legal business name</h2>
              </div>
              <p className="mt-3 text-base text-primary">{profile.legalBusinessName || 'Legal name not provided'}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-border/70 bg-surface p-6">
              <h2 className="text-lg font-semibold text-primary">Operational snapshot</h2>
              <p className="text-sm text-secondary">Key facts about your organisation.</p>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {operations.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/60 px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-secondary">{item.label}</dt>
                    <dd className="text-base font-medium text-primary">
                      {item.value === null || item.value === undefined || item.value === ''
                        ? 'Not provided'
                        : typeof item.value === 'number'
                        ? item.value.toLocaleString()
                        : item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-3xl border border-border/70 bg-surface p-6">
              <h2 className="text-lg font-semibold text-primary">Status checks</h2>
              <p className="text-sm text-secondary">Track what is verified and what still needs attention.</p>
              <ul className="mt-4 space-y-3">
                {statusChecks.map((item) => (
                  <li key={item.label} className="flex items-center justify-between rounded-2xl border border-border/60 px-4 py-3">
                    <span className="text-sm font-medium text-primary">{item.label}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.value ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200'
                      }`}
                    >
                      {item.value ? 'Verified' : 'Pending'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-border/70 bg-surface p-6">
              <h2 className="text-lg font-semibold text-primary">Contact channels</h2>
              <p className="text-sm text-secondary">Buyers will reach you through these entries.</p>
              <ul className="mt-4 space-y-4">
                {contactChannels.map(({ label, value, icon: Icon, href }) => (
                  <li key={label} className="rounded-2xl border border-border/60 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-secondary">{label}</p>
                    {value ? (
                      href ? (
                        <a
                          href={href.startsWith('http') ? href : `https://${href}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
                        >
                          <Icon className="h-4 w-4" />
                          {value}
                        </a>
                      ) : (
                        <span className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-primary">
                          <Icon className="h-4 w-4 text-brand" />
                          {value}
                        </span>
                      )
                    ) : (
                      <span className="mt-1 text-sm text-muted">Not provided</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border/70 bg-surface p-6">
              <h2 className="text-lg font-semibold text-primary">Need to update something?</h2>
              <p className="text-sm text-secondary">
                Reach out to our onboarding team to amend your legal records or submit new verification documents.
              </p>
              <div className="mt-4 space-y-3">
                <a href="mailto:support@digitallandbank.com" className="btn btn-primary w-full">
                  Contact support
                </a>
                <Link href="/dashboard" className="btn btn-ghost w-full">
                  Back to dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-surface-secondary">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">
            Review your business information. Keep these records accurate to unlock more marketplace features.
          </p>
        </div>
        {/* {merchantCode && (
          <div className="rounded-2xl border border-border/60 bg-surface px-4 py-2 text-xs font-medium uppercase tracking-wide text-secondary">
            Signed in as: {merchantCode}
          </div>
        )} */}
        {renderState()}
      </div>
    </main>
  );
}
