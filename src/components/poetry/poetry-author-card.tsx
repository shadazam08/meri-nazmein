import Link from "next/link";

type PoetryAuthorCardProps = {
    name: string;
    username: string;
    penName: string | null,
    bio?: string | null;
    authorHref?: string;
};

export function PoetryAuthorCard({
    name,
    penName,
    username,
    bio,
    authorHref,
}: PoetryAuthorCardProps) {
    const href = authorHref ?? `/authors/${username}`;

    return (
        <section className="mx-auto max-w-6xl px-5 pt-8 pb-10 sm:px-8 sm:pt-10 sm:pb-12">
            <div className="rounded-[2rem] bg-mn-navy-deep p-7 text-white shadow-sm sm:p-9">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-mn-gold-light">
                            Written by
                        </p>

                        <h2 className="mt-2 font-poetry text-3xl font-semibold sm:text-4xl">
                            {penName || name}
                        </h2>

                        <p className="mt-1 text-sm text-slate-300">
                            @{username}
                        </p>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                            {bio ||
                                "An author sharing thoughts, feelings and stories through words."}
                        </p>
                    </div>

                    <Link
                        href={href}
                        className="inline-flex shrink-0 items-center justify-center rounded-full border border-mn-gold/60 px-5 py-3 text-sm font-semibold text-mn-gold-light transition hover:bg-white/5"
                    >
                        View Author →
                    </Link>
                </div>
            </div>
        </section>
    );
}