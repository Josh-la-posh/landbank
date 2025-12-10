import Link from 'next/link';

const boostPackages = [
  {
    name: 'Homepage Spotlight',
    price: '₦10,000',
    duration: '7 days',
    description: 'Your property featured on the homepage carousel',
    features: [
      'Prime homepage placement',
      'Seen by all visitors',
      'Eye-catching carousel card',
      'Up to 5x more views',
    ],
    icon: '🌟',
    popular: false,
  },
  {
    name: 'Category Top',
    price: '₦5,000',
    duration: '7 days',
    description: 'Rank first in your category search results',
    features: [
      'Top position in category',
      'Priority in search filters',
      'Category badge highlight',
      'Extended visibility',
    ],
    icon: '🎯',
    popular: true,
  },
  {
    name: 'Featured Badge',
    price: '₦3,000',
    duration: '14 days',
    description: 'Eye-catching featured badge on your listing',
    features: [
      'Distinctive featured badge',
      'Stands out in results',
      'Longer duration',
      'Mobile optimized',
    ],
    icon: '⭐',
    popular: false,
  },
  {
    name: 'Weekend Boost',
    price: '₦8,000',
    duration: '3 days',
    description: 'Maximum visibility during peak weekend traffic',
    features: [
      'Friday-Sunday spotlight',
      'Peak traffic exposure',
      'Homepage & category top',
      'Social media feature',
    ],
    icon: '🚀',
    popular: false,
  },
];

const plans = [
  {
    name: 'Starter',
    price: '₦0',
    cadence: 'per month',
    blurb: 'List up to 2 properties and receive basic alerts.',
    features: [
      '2 active listings',
      'Email notifications',
      'Basic analytics',
      'Community support',
    ],
    cta: 'Create free account',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '₦35,000',
    cadence: 'per month',
    blurb: 'Unlock priority placement and concierge diligence.',
    features: [
      '10 active listings',
      'Priority search placement',
      'Advisor office hours',
      'Document vault',
      'Performance dashboard',
    ],
    cta: 'Start 14-day trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: 'per portfolio',
    blurb: 'For institutional sellers and land aggregators.',
    features: [
      'Unlimited listings',
      'Dedicated account manager',
      'Buyer matchmaking',
      'API + webhook access',
      'Tailored due diligence',
    ],
    cta: 'Talk to sales',
    highlighted: false,
  },
];

const faqs = [
  {
    q: 'What counts as an active listing?',
    a: 'Any property that is discoverable in search or featured in ads counts toward your listing limit. Archived properties are free.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes. Upgrades take effect immediately and downgrades apply on your next billing date. Your data stays intact.',
  },
  {
    q: 'Do you charge success fees?',
    a: 'For Growth we charge 0.75% upon deal completion. Enterprise clients have bespoke fee schedules agreed per mandate.',
  },
  {
    q: 'Is there support for buyers?',
    a: 'Buyers on LandBank can access advisory calls, diligence reports, and financing referrals at no additional charge.',
  },
];

const comparisons = [
  { label: 'Listings per month', starter: '2', growth: '10', enterprise: 'Unlimited' },
  { label: 'Featured placement', starter: '—', growth: 'Included', enterprise: 'Priority network' },
  { label: 'Due diligence concierge', starter: '—', growth: '5 reports', enterprise: 'Unlimited' },
  { label: 'Custom API access', starter: '—', growth: 'Add-on', enterprise: 'Included' },
  { label: 'Advisor access', starter: 'Email only', growth: 'Monthly calls', enterprise: 'Dedicated team' },
];

export default function PricingPage() {
  return (
    <main className="bg-surface-secondary">
      <section className="border-b border-border/60 bg-linear-to-br from-gray-50 via-white to-gray-50 py-16 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm uppercase tracking-wide text-secondary">Pricing</p>
          <h1 className="mt-2 text-4xl font-semibold text-primary">Simple plans that scale with your land portfolio</h1>
          <p className="mt-4 text-base text-muted">
            Start for free, then unlock advanced marketing, analytics, and diligence tools as your pipeline grows.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border/70 bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-wide text-secondary">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            72% of sellers upgrade within 45 days
          </div>
        </div>
      </section>

      {/* Boost Your Listings Section */}
      <section className="border-b border-border/60 bg-surface py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-wide mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Premium Visibility
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Boost Your Listings</h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Want extra visibility for specific listings? Purchase individual boosts to feature your properties and get more inquiries faster.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {boostPackages.map((boost) => (
              <article
                key={boost.name}
                className={`relative rounded-2xl border ${
                  boost.popular 
                    ? 'border-brand/50 bg-gradient-to-br from-brand/5 to-transparent shadow-lg ring-2 ring-brand/20' 
                    : 'border-border/70 bg-surface hover:border-brand/30'
                } p-6 transition-all hover:shadow-xl`}
              >
                {boost.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{boost.icon}</div>
                  <h3 className="text-xl font-bold text-primary mb-1">{boost.name}</h3>
                  <p className="text-sm text-muted mb-3">{boost.description}</p>
                </div>

                <div className="text-center mb-4 pb-4 border-b border-border/60">
                  <div className="text-3xl font-bold text-brand mb-1">{boost.price}</div>
                  <div className="text-sm text-secondary">{boost.duration}</div>
                </div>

                <ul className="space-y-2 mb-6">
                  {boost.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-primary">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  boost.popular
                    ? 'bg-brand text-white hover:bg-brand/90 shadow-md'
                    : 'bg-surface-secondary text-primary border border-border hover:bg-brand hover:text-white hover:border-brand'
                }`}>
                  Select Boost
                </button>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-border/60 bg-surface-secondary/60">
              <svg className="w-8 h-8 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="text-left">
                <p className="font-semibold text-primary">Need multiple boosts?</p>
                <p className="text-sm text-secondary">Contact our sales team for custom packages and bulk discounts</p>
              </div>
              <Link href="/contact" className="btn btn-primary whitespace-nowrap">
                Get Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-wide text-secondary">Monthly Plans</p>
          <h2 className="text-3xl font-bold text-primary mb-2">Subscription Options</h2>
          <p className="text-muted">Choose a plan that fits your listing volume</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl border border-border/70 bg-surface p-6 shadow-sm ${
                plan.highlighted ? 'ring-2 ring-brand shadow-lg' : ''
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-secondary">{plan.name}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-semibold text-primary">{plan.price}</span>
                <span className="text-sm text-secondary">{plan.cadence}</span>
              </div>
              <p className="mt-3 text-sm text-muted">{plan.blurb}</p>
              <ul className="mt-6 space-y-3 text-sm text-primary">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`btn mt-8 w-full ${plan.highlighted ? 'btn-primary' : 'btn-ghost'}`}>
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-3xl border border-border/70 bg-surface p-6">
          <h2 className="text-2xl font-semibold text-primary">Plan comparison</h2>
          <p className="text-sm text-secondary">Choose the stack that matches your growth stage.</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-secondary">
                <tr>
                  <th className="py-3 pr-4 font-medium">Feature</th>
                  <th className="py-3 pr-4 font-medium">Starter</th>
                  <th className="py-3 pr-4 font-medium">Growth</th>
                  <th className="py-3 pr-4 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row.label} className="border-t border-border/60">
                    <td className="py-4 pr-4 text-primary">{row.label}</td>
                    <td className="py-4 pr-4 text-secondary">{row.starter}</td>
                    <td className="py-4 pr-4 text-secondary">{row.growth}</td>
                    <td className="py-4 pr-4 text-secondary">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-surface py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-wide text-secondary">FAQ</p>
            <h2 className="text-2xl font-semibold text-primary">Still have questions?</h2>
            <p className="text-sm text-muted">Answers to the questions sellers ask before onboarding.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <details key={item.q} className="rounded-2xl border border-border/70 bg-surface-secondary/60 p-5">
                <summary className="cursor-pointer text-base font-semibold text-primary">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-secondary">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 rounded-3xl border border-border/60 bg-linear-to-br from-brand/10 via-transparent to-transparent p-6 text-center dark:from-brand/20">
            <p className="text-sm text-secondary">Need a tailored bundle?</p>
            <h3 className="mt-2 text-xl font-semibold text-primary">Let&apos;s design a plan for your land bank</h3>
            <p className="mt-2 text-sm text-muted">We work with estates, cooperatives, and DFIs to move inventory faster.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn btn-primary">Book sales call</Link>
              <Link href="/register" className="btn btn-ghost">Create free account</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
