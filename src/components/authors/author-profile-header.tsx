import Link from "next/link";
import Image from "next/image";

type AuthorProfileHeaderProps = {
    name: string;
    username: string;
    penName: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    publishedPoetryCount: number;
};

export function AuthorProfileHeader({
    name,
    username,
    bio,
    penName,
    avatarUrl,
    publishedPoetryCount,
}: AuthorProfileHeaderProps) {
    const initial = name.trim().charAt(0).toUpperCase();

    return (
        <section className="relative overflow-hidden bg-mn-navy-deep">
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_82%_30%,rgba(18,103,214,0.24),transparent_32%),radial-gradient(circle_at_15%_100%,rgba(212,166,42,0.11),transparent_30%)]"
            />

            <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-12">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-5 sm:gap-7">
                        {/* Avatar */}
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-mn-gold/40 bg-white/5 text-3xl font-semibold text-mn-gold-light sm:h-24 sm:w-24 sm:text-4xl">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt={`${name} profile`}
                                    fill
                                    sizes="64px"
                                    className="object-contain"
                                />
                            ) : (
                                <span className="font-poetry text-2xl font-semibold text-mn-navy">
                                    {initial}
                                </span>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mn-gold-light">
                                Author
                            </p>

                            <h1 className="mt-2 font-poetry text-4xl font-semibold leading-tight text-white sm:text-5xl">
                                {name}
                            </h1>

                            <p className="mt-1 text-sm text-slate-400">
                                {penName}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                @{username}
                            </p>

                            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                {bio ||
                                    "An author sharing thoughts, feelings and stories through words."}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex shrink-0 items-center gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-center">
                            <p className="font-poetry text-3xl font-semibold text-white">
                                {publishedPoetryCount}
                            </p>

                            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-mn-gold-light">
                                {publishedPoetryCount === 1
                                    ? "Published Poem"
                                    : "Published Poems"}
                            </p>
                        </div>

                        <Link
                            href="/authors"
                            className="hidden rounded-full border border-mn-gold/50 px-5 py-2.5 text-sm font-semibold text-mn-gold-light transition hover:bg-white/5 sm:inline-flex"
                        >
                            All Authors →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}