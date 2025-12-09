const milestones = [
  {
    year: '2021',
    title: 'Idea on a whiteboard',
    detail: 'We set out to give land buyers real transparency and documentation standards.',
  },
  {
    year: '2023',
    title: '1,000 verified plots',
    detail: 'Partnered with regional land aggregators across Lagos, Abuja, PH, and Kano.',
  },
  {
    year: '2024',
    title: 'Launch of LandBank OS',
    detail: 'Released dashboards, ad tools, and diligence workflows for institutional sellers.',
  },
];

const values = [
  {
    title: 'Transparency first',
    detail: 'Every listing carries documentation, video walkthroughs, and diligence notes.',
  },
  {
    title: 'Local partnerships',
    detail: 'We collaborate with community surveyors, valuers, and realtors to vet each plot.',
  },
  {
    title: 'Inclusive ownership',
    detail: 'We design financing journeys so more Africans can unlock land as an asset class.',
  },
];

const team = [
  {
    name: 'Mayowa Okubanjo',
    title: 'Co-founder & CEO',
  },
  {
    name: 'Ify Adigwe',
    title: 'COO',
  },
  {
    name: 'Hussein Bello',
    title: 'Head of Product',
  },
  {
    name: 'Christiana O.',
    title: 'VP, Customer Experience',
  },
];

export default function AboutPage() {
  return (
    <main className="bg-surface-secondary">
      <section className="border-b border-border/60 bg-linear-to-br from-rose-50 via-white to-rose-50/60 py-16 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm uppercase tracking-wide text-secondary">About us</p>
          <h1 className="mt-2 text-4xl font-semibold text-primary">Digitising land transactions across Africa</h1>
          <p className="mt-4 text-base text-muted">
            LandBank brings clarity to the land value chain—connecting verified sellers, institutional buyers, and everyday investors through shared data and modern workflows.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: 'Verified plots uploaded', stat: '3,400+' },
            { label: 'Cities covered', stat: '26' },
            { label: 'Avg. deal closing time', stat: '21 days' },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-border/70 bg-surface px-6 py-8 text-center">
              <p className="text-3xl font-semibold text-primary">{item.stat}</p>
              <p className="mt-2 text-sm text-secondary">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-wide text-secondary">Our story</p>
            <h2 className="text-2xl font-semibold text-primary">From manual files to structured data</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {milestones.map((step) => (
              <article key={step.year} className="rounded-3xl border border-border/70 bg-surface-secondary/60 p-6">
                <p className="text-xs uppercase tracking-wide text-secondary">{step.year}</p>
                <h3 className="mt-2 text-lg font-semibold text-primary">{step.title}</h3>
                <p className="mt-2 text-sm text-secondary">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="rounded-3xl border border-border/70 bg-surface p-6">
            <h2 className="text-2xl font-semibold text-primary">What drives us</h2>
            <p className="text-sm text-secondary">Purpose-built to reduce friction and risk in land deals.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {values.map((value) => (
                <article key={value.title} className="rounded-2xl border border-border/60 bg-surface-secondary px-4 py-3">
                  <h3 className="text-base font-semibold text-primary">{value.title}</h3>
                  <p className="mt-2 text-sm text-secondary">{value.detail}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-linear-to-br from-brand/10 via-transparent to-transparent p-6 dark:from-brand/20">
            <p className="text-sm text-secondary">Impact</p>
            <h2 className="text-2xl font-semibold text-primary">Economic empowerment</h2>
            <p className="mt-3 text-sm text-muted">
              We help communities convert idle land into thriving estates, farms, and logistics hubs while protecting provenance and cultural ties.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-primary">
              <li>• ₦48B in facilitated land value</li>
              <li>• 7 co-ops digitised land records</li>
              <li>• 120+ surveyors trained on our stack</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-surface py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-wide text-secondary">Leadership</p>
            <h2 className="text-2xl font-semibold text-primary">Humans behind LandBank</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="rounded-3xl border border-border/70 bg-surface-secondary/70 p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-lg font-semibold text-brand">
                  {member.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </div>
                <p className="mt-4 text-base font-semibold text-primary">{member.name}</p>
                <p className="text-sm text-secondary">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="text-3xl font-semibold text-primary">Ready to reshape land transactions?</h2>
        <p className="mt-3 text-base text-muted">
          Partner with us to bring trust, velocity, and capital to your land portfolio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="/register" className="btn btn-primary">Create free account</a>
          <a href="/contact" className="btn btn-ghost">Talk to our team</a>
        </div>
      </section>
    </main>
  );
}
