import Link from "next/link";

type PoetryCardProps = {
    title: string;
    content: string;
    penName?: string | null;
    authorUsername: string;
    publishedAt?: Date | null;
    categoryName?: string | null;
    href: string;
    featured?: boolean;
};

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function getPreview(content: string, maxLength = 220) {
    const text = content.replace(/\s+/g, " ").trim();

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength)}...`;
}

export function PoetryCard({
    title,
    content,
    penName,
    authorUsername,
    publishedAt,
    categoryName,
    href,
    featured = false,
}: PoetryCardProps) {
    if (featured) {
        return (
            <article className="group overflow-hidden rounded-2xl border border-mn-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-mn-gold/60 hover:shadow-lg sm:rounded-3xl">
                <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
                    {/* Poetry Information */}
                    <div className="border-b border-mn-border bg-mn-cream/35 p-6 sm:p-7 lg:border-b-0 lg:border-r">
                        {categoryName && (
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-mn-gold-dark">
                                {categoryName}
                            </p>
                        )}

                        <h2 className="mt-3 font-poetry text-3xl font-semibold leading-tight text-mn-navy sm:text-4xl">
                            {title}
                        </h2>

                        <div className="mt-4 h-px w-11 bg-mn-gold" />

                        <div className="mt-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mn-gold-dark">
                                Written by
                            </p>

                            <p className="mt-1 text-sm font-semibold text-mn-navy">
                                {penName}
                            </p>

                            <p className="mt-0.5 text-xs text-mn-text-muted">
                                @{authorUsername}
                            </p>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="flex flex-col justify-between p-6 sm:p-7">
                        <p className="max-w-2xl font-poetry text-lg leading-8 text-mn-text sm:text-xl sm:leading-8">
                            {getPreview(content, 300)}
                        </p>

                        <div className="mt-6 flex items-center justify-between gap-4 border-t border-mn-border pt-4">
                            {publishedAt ? (
                                <p className="text-xs text-mn-text-muted">
                                    {formatDate(publishedAt)}
                                </p>
                            ) : (
                                <span />
                            )}

                            <Link
                                href={href}
                                className="inline-flex items-center gap-2 rounded-full bg-mn-navy px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-mn-blue"
                            >
                                Read
                                <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article className="group relative flex h-full overflow-hidden rounded-2xl border border-mn-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-mn-gold/60 hover:shadow-lg">
            {/* Gold Accent */}
            <div className="w-1 shrink-0 bg-mn-gold/80 transition-colors group-hover:bg-mn-gold" />

            <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
                {/* Category only when available */}
                {categoryName && (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-mn-gold-dark">
                        {categoryName}
                    </p>
                )}

                {/* Title */}
                <h2 className="mt-3 font-poetry text-2xl font-semibold leading-tight text-mn-navy sm:text-[1.7rem]">
                    {title}
                </h2>

                <div className="mt-3 h-px w-10 bg-mn-gold" />

                {/* Preview */}
                <p className="mt-4 flex-1 text-sm leading-6 text-mn-text-muted">
                    {getPreview(content)}
                </p>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-mn-border pt-4">
                    <div className="min-w-0">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-mn-gold-dark">
                            Written by
                        </p>

                        <p className="mt-0.5 truncate text-sm font-semibold text-mn-navy">
                            {penName}
                        </p>

                        {publishedAt && (
                            <p className="mt-0.5 text-[11px] text-mn-text-muted">
                                {formatDate(publishedAt)}
                            </p>
                        )}
                    </div>

                    <Link
                        href={href}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-mn-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-mn-blue"
                    >
                        Read
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </article>
    );
}