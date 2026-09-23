import Link from "next/link";

type AuthorPageHeaderProps = {
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    showAction?: boolean;
    backLabel?: string;
    backHref?: string;
};

export function AuthorPageHeader({

    title,
    description,
    actionLabel = "Write New Poetry",
    actionHref = "/author/poems/create",
    showAction = true,
    backLabel,
    backHref,
}: AuthorPageHeaderProps) {
    return (
        <section className="relative overflow-hidden border-b border-mn-navy/20 bg-mn-navy-deep text-white">
            {/* Brand Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(18,103,214,0.24),transparent_34%),radial-gradient(circle_at_15%_90%,rgba(212,166,42,0.10),transparent_30%)]"
            />

            <div className="relative mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-7 lg:py-8">
                {/* Back Link */}
                {backHref && (
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 transition-colors hover:text-mn-gold-light sm:text-sm"
                    >
                        <span aria-hidden="true">←</span>
                        {backLabel ?? "Back"}
                    </Link>
                )}

                <div
                    className={`flex flex-col gap-5 md:flex-row md:items-center md:justify-between ${backHref ? "mt-4" : ""
                        }`}
                >
                    {/* Content */}
                    <div className="min-w-0">

                        <h1 className="mt-2 font-poetry text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                            {title}
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                            {description}
                        </p>
                    </div>

                    {/* Action */}
                    {showAction && actionHref && (
                        <Link
                            href={actionHref}
                            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-mn-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-mn-blue hover:shadow-md md:self-center"
                        >
                            {actionLabel}

                            <span
                                aria-hidden="true"
                                className="text-mn-gold-light"
                            >
                                →
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}