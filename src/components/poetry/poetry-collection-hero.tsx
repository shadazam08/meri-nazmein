type PoetryCollectionHeroProps = {
    eyebrow: string;
    title: string;
    description: string;
    count: number;
    itemLabel: string;
    itemLabelPlural: string;
    keywords: string;
    quote: string;
    quoteFooter: string;
};

export function PoetryCollectionHero({
    eyebrow,
    title,
    description,
    count,
    itemLabel,
    itemLabelPlural,
    keywords,
    quote,
    quoteFooter,
}: PoetryCollectionHeroProps) {
    const countLabel =
        count === 1 ? itemLabel : itemLabelPlural;

    return (
        <section className="relative overflow-hidden bg-mn-navy-deep">
            {/* Soft Background Light */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_82%_30%,rgba(18,103,214,0.26),transparent_32%),radial-gradient(circle_at_15%_100%,rgba(212,166,42,0.12),transparent_30%)]"
            />

            <div className="relative mx-auto max-w-7xl px-5 py-11 sm:px-8 lg:py-13">
                <div className="grid items-center gap-8 lg:grid-cols-[1.35fr_0.65fr]">
                    {/* Main Content */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-mn-gold-light sm:text-sm">
                            {eyebrow}
                        </p>

                        <h1 className="mt-3 font-poetry text-5xl font-semibold leading-[1.05] text-white sm:text-6xl">
                            {title}
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                            {description}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-mn-gold/40 bg-white/5 px-4 py-2 text-sm font-medium text-mn-gold-light">
                                {count} {countLabel}
                            </span>

                            <span
                                aria-hidden="true"
                                className="h-px w-10 bg-mn-gold/60"
                            />

                            <span className="text-sm tracking-wide text-slate-400">
                                {keywords}
                            </span>
                        </div>
                    </div>

                    {/* Editorial Quote */}
                    <div className="hidden lg:block">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm">
                            <div className="mb-5 h-px w-16 bg-mn-gold" />

                            <p className="font-poetry text-3xl italic leading-relaxed text-slate-100">
                                {quote}
                            </p>

                            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-mn-gold-light">
                                {quoteFooter}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}