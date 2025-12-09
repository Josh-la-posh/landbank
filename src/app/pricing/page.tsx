import Link from 'next/link';

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

      <section className="mx-auto max-w-6xl px-4 py-12">
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
