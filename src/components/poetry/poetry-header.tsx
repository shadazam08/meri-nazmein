import Link from "next/link";

type PoetryHeaderProps = {
    type: string;
    title: string;
    authorName: string;
    penName: string | null,
    authorUsername: string;
    publishedAt?: Date | null;
    categoryName?: string | null;
    categoryHref?: string;
};

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function getTypeHref(type: string) {
    switch (type.toLowerCase()) {
        case "nazm":
        case "nazmein":
            return "/nazmein";

        case "ghazal":
        case "ghazals":
            return "/ghazals";

        case "shayari":
            return "/shayari";

        default:
            return "/";
    }
}

export function PoetryHeader({
    type,
    title,
    authorName,
    penName,
    authorUsername,
    publishedAt,
    categoryName,
    categoryHref,
}: PoetryHeaderProps) {
    const typeHref = getTypeHref(type);

    return (
        <section className="border-b border-[#E7E3DA] bg-[#FCFBF8]">
            {/* Breadcrumb */}
            <div className="border-b border-[#ECE9E2] bg-white">
                <div className="mx-auto max-w-6xl px-5 py-2.5 sm:px-8">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-2 text-[11px] text-mn-text-muted sm:text-xs"
                    >
                        <Link
                            href="/"
                            className="transition-colors hover:text-mn-blue"
                        >
                            Home
                        </Link>

                        <span aria-hidden="true" className="text-slate-300">
                            /
                        </span>

                        <Link
                            href={typeHref}
                            className="transition-colors hover:text-mn-blue"
                        >
                            {type}
                        </Link>

                        <span aria-hidden="true" className="text-slate-300">
                            /
                        </span>

                        <span
                            className="max-w-[220px] truncate font-medium text-mn-navy sm:max-w-none"
                            title={title}
                        >
                            {title}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Main Header */}
            <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8 sm:py-5">
                <div className="flex items-start justify-between gap-8">
                    {/* Main Content */}
                    <div className="min-w-0">
                        {/* Category */}
                        {categoryName && (
                            <div className="mb-2">
                                {categoryHref ? (
                                    <Link
                                        href={categoryHref}
                                        className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mn-gold-dark transition-colors hover:text-mn-blue sm:text-[11px]"
                                    >
                                        {categoryName}
                                    </Link>
                                ) : (
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mn-gold-dark sm:text-[11px]">
                                        {categoryName}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="max-w-3xl font-poetry text-3xl font-semibold leading-tight tracking-[-0.01em] text-mn-navy sm:text-4xl">
                            {title}
                        </h1>

                        {/* Author + Date */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mn-text-muted sm:text-sm">
                            <span>
                                By{" "}
                                <Link
                                    href={`/authors/${authorUsername}`}
                                    className="font-semibold text-mn-blue transition-colors hover:text-mn-gold-dark"
                                >
                                    {penName || authorName}
                                </Link>
                            </span>

                            {publishedAt && (
                                <>
                                    <span
                                        aria-hidden="true"
                                        className="text-slate-300"
                                    >
                                        •
                                    </span>

                                    <span>{formatDate(publishedAt)}</span>
                                </>
                            )}
                        </div>

                        <div className="mt-3 h-px w-10 bg-mn-gold" />
                    </div>

                    {/* Brand Detail */}
                    <div className="hidden shrink-0 self-start pt-1 sm:block">
                        <div className="flex items-center justify-end gap-3">
                            <div className="h-px w-12 bg-mn-gold/60" />

                            <p className="font-poetry text-xl font-medium leading-none text-mn-navy">
                                Meri Nazmein
                            </p>
                        </div>

                        <p className="mt-2 text-right text-[9px] font-semibold uppercase tracking-[0.28em] text-mn-blue/70">
                            Alfaaz • Ehsaas • Kahani
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}