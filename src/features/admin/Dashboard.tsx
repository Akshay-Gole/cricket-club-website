function Dashboard() {
  return (
    <div>
      <section className="relative overflow-hidden rounded border border-white/[0.07] bg-[#121513] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(45,138,71,0.14),transparent_30%)]"
        />

        <div className="relative max-w-[700px]">
          <div className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[4px] text-gold">
            Administration Overview
          </div>

          <h2 className="font-display text-[38px] leading-none tracking-[1px] text-white sm:text-[48px]">
            Welcome To The Command Centre.
          </h2>

          <p className="mt-4 font-body text-sm font-light leading-[1.8] text-muted">
            Your admin foundation is ready. Dashboard statistics, fixtures,
            messages and quick actions will be added in Phase 2.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
