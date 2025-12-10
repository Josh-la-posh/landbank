import { notFound } from 'next/navigation';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { userApi } from '@/lib/api';
import type { BusinessProfile } from '@/lib/api';

async function fetchBusinessProfile(merchantCode: string): Promise<{ profile: BusinessProfile | null; isUnauthorized: boolean }> {
  try {
    console.log('🏢 Fetching business profile for:', merchantCode);
    
    const { data, status } = await userApi.getBusinessProfile(merchantCode);

    console.log('📡 Business API response:', data, 'Status:', status);

    // Check for 401 Unauthorized
    if (status === 401) {
      console.log('🔒 Unauthorized access - user needs to log in');
      return { profile: null, isUnauthorized: true };
    }

    if (!data || !data.requestSuccessful || !data.responseData) {
      console.log('⚠️ No valid business profile data');
      return { profile: null, isUnauthorized: false };
    }

    console.log('✅ Business profile fetched successfully');
    return { profile: data.responseData, isUnauthorized: false };
  } catch (error) {
    console.error('❌ Unable to fetch business profile', error);
    return { profile: null, isUnauthorized: false };
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ merchantCode: string }> }) {
  noStore();
  const { merchantCode } = await params;
  
  console.log('🔍 Profile Page - merchantCode:', merchantCode);
  
  const { profile, isUnauthorized } = await fetchBusinessProfile(merchantCode);

  console.log('📊 Profile data:', profile ? 'found' : 'null', 'Unauthorized:', isUnauthorized);

  // If unauthorized, show login prompt
  if (isUnauthorized) {
    return (
      <main className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
        <div className="card p-8 md:p-12 max-w-2xl text-center">
          <div className="mx-auto w-20 h-20 mb-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-4">Authentication Required</h1>
          <p className="text-lg text-secondary mb-8">
            You need to be logged in to view detailed merchant profiles. Please sign in to continue.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/login" className="btn btn-primary">
              Sign In
            </Link>
            <Link href={`/merchant/${merchantCode}/listings`} className="btn btn-ghost">
              View Listings Instead
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    console.log('❌ No profile found, showing 404');
    notFound();
  }

  const displayName = profile.tradingName ?? profile.legalBusinessName ?? 'Business Profile';

  const infoRows = [
    { label: 'Trading Name', value: profile.tradingName },
    { label: 'Legal Business Name', value: profile.legalBusinessName },
    { label: 'Merchant Code', value: profile.merchantCode },
    { label: 'RC Number', value: profile.rcNumber },
    { label: 'Ownership Type', value: profile.ownershipType?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) },
    { label: 'Country', value: profile.countryCode },
    { label: 'Address', value: profile.merchantAddress },
    { label: 'Staff Strength', value: profile.staffStrength },
    { label: 'Number of Locations', value: profile.numberOfLocations },
    { label: 'Industry', value: profile.industry },
    { label: 'Industry Category', value: profile.industryCategory },
    { label: 'Incorporation Date', value: profile.incorporationDate },
    { label: 'Business Commencement', value: profile.businessCommencementDate },
    { label: 'Website', value: profile.website },
    { label: 'Contact Email', value: profile.contactEmail },
    { label: 'Support Email', value: profile.supportEmail },
    { label: 'Dispute Email', value: profile.disputeEmail },
  ];

  return (
    <main className="min-h-screen bg-surface-secondary pb-20">
      {/* Header */}
      <section className="bg-linear-to-br from-rose-50 via-white to-rose-50/60 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border-b border-border/60">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-brand hover:text-brand/80 mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to marketplace
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-20 h-20 rounded-full bg-linear-to-br from-brand to-rose-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/50 mb-2">
                <svg className="w-4 h-4 text-rose-600 dark:text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium text-rose-700 dark:text-rose-300">Merchant Profile</span>
              </div>
              
              <h1 className="text-4xl font-bold text-primary mb-2">
                {displayName}
              </h1>
              
              {profile.businessDescription && (
                <p className="text-lg text-secondary max-w-3xl mt-2">
                  {profile.businessDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Business Details */}
      <section className="mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-surface p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-primary mb-6">Business Information</h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {infoRows.map((row) => (
              row.value && (
                <div key={row.label} className="rounded-2xl border border-dashed border-border/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-secondary mb-1">{row.label}</p>
                  <p className="text-base font-medium text-primary">
                    {row.label === 'Website' && row.value && typeof row.value === 'string' ? (
                      <a href={row.value} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                        {row.value}
                      </a>
                    ) : row.label.includes('Email') && row.value && typeof row.value === 'string' ? (
                      <a href={`mailto:${row.value}`} className="text-brand hover:underline">
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </p>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 rounded-3xl border border-border/60 bg-surface p-8 shadow-md text-center">
          <h3 className="text-xl font-semibold text-primary mb-2">Browse their listings</h3>
          <p className="text-secondary mb-6">
            View all properties available from {displayName}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href={`/merchant/${merchantCode}/listings`}
              className="btn btn-primary"
            >
              View All Listings
            </Link>
            {profile.contactEmail && (
              <a
                href={`mailto:${profile.contactEmail}`}
                className="btn btn-ghost"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
