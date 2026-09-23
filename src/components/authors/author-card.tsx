import Image from "next/image";
import Link from "next/link";

type AuthorCardProps = {
  name: string;
  penName?: string | null;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  publishedPoetryCount: number;
  href: string;
};

export function AuthorCard({
  name,
  penName,
  username,
  bio,
  avatarUrl,
  publishedPoetryCount,
  href,
}: AuthorCardProps) {
  const displayName = penName?.trim() || name ;

  const initial = displayName
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <article className="group overflow-hidden rounded-2xl border border-mn-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-mn-gold/60 hover:shadow-lg">
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          {/* Avatar */}
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-mn-gold/30 bg-mn-cream">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`${displayName} profile`}
                fill
                sizes="64px"
                className="object-contain"
              />
            ) : (
              <span className="font-poetry text-2xl font-semibold text-mn-navy">
                {initial || "A"}
              </span>
            )}
          </div>

          {/* Poetry Count */}
          <span className="rounded-full bg-mn-cream px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-mn-gold-dark">
            {publishedPoetryCount}{" "}
            {publishedPoetryCount === 1
              ? "Poem"
              : "Poems"}
          </span>
        </div>

        {/* Author */}
        <h2 className="mt-5 font-poetry text-3xl font-semibold leading-tight text-mn-navy">
          {penName}
        </h2>

        <p className="mt-1 text-sm text-mn-text-muted">
          @{username}
        </p>

        <div className="mt-4 h-px w-10 bg-mn-gold" />

        <p className="mt-4 min-h-12 text-sm leading-6 text-mn-text-muted">
          {bio ||
            "An author sharing thoughts, feelings and stories through words."}
        </p>

        {/* Action */}
        <div className="mt-6 border-t border-mn-border pt-4">
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-mn-blue transition-colors hover:text-mn-gold-dark"
          >
            View Author
            <span
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}