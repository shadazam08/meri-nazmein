import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { AuthorPageHeader } from "@/components/author/author-page-header";

export const metadata: Metadata = {
  title: "Author Dashboard",
  description:
    "Manage your poetry, profile and published work on Meri Nazmein.",
  robots: {
    index: false,
    follow: false,
  },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getTypeLabel(type: string) {
  switch (type) {
    case "NAZM":
      return "Nazm";

    case "GHAZAL":
      return "Ghazal";

    case "SHAYARI":
      return "Shayari";

    default:
      return "Other";
  }
}

function getPreview(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (normalized.length <= 120) {
    return normalized;
  }

  return `${normalized.slice(0, 120)}...`;
}

export default async function AuthorDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/author/login");
  }

  const author = await prisma.author.findUnique({
    where: {
      supabaseUserId: user.id,
    },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  if (!author) {
    redirect("/author/signup");
  }

  const [
    totalPoetry,
    publishedPoetry,
    draftPoetry,
    recentPoems,
  ] = await Promise.all([
    prisma.poem.count({
      where: {
        authorId: author.id,
      },
    }),

    prisma.poem.count({
      where: {
        authorId: author.id,
        status: "PUBLISHED",
      },
    }),

    prisma.poem.count({
      where: {
        authorId: author.id,
        status: "DRAFT",
      },
    }),

    prisma.poem.findMany({
      where: {
        authorId: author.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 6,
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        status: true,
        updatedAt: true,
        publishedAt: true,
      },
    }),
  ]);

  return (
    <main className="min-h-[calc(100vh-88px)] bg-[#F7F4EC]">
      {/* =====================================================
                DASHBOARD HEADER
            ===================================================== */}

      <AuthorPageHeader
        title={`Welcome, ${author.name}`}
        description={`Manage your poetry and publish your words.`}
        actionLabel="Write New Poetry"
        actionHref="/author/poems/create"
      // backLabel="Back to Dashboard"
      // backHref="/author/dashboard"
      />

      {/* =====================================================
                DASHBOARD CONTENT
            ===================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:py-9">
        {/* =================================================
                    STATS
                ================================================= */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Total Poetry */}
          <article className="rounded-2xl border border-[#E5DED0] bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-mn-text-muted">
                Total Poetry
              </p>

              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-mn-gold"
              />
            </div>

            <div className="mt-2 flex items-end justify-between gap-4">
              <p className="font-poetry text-3xl font-semibold text-mn-navy">
                {totalPoetry}
              </p>

              <p className="text-[11px] text-mn-text-muted">
                All your writing
              </p>
            </div>
          </article>

          {/* Published */}
          <article className="rounded-2xl border border-[#E5DED0] bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-mn-text-muted">
                Published
              </p>

              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-emerald-500"
              />
            </div>

            <div className="mt-2 flex items-end justify-between gap-4">
              <p className="font-poetry text-3xl font-semibold text-mn-navy">
                {publishedPoetry}
              </p>

              <p className="text-[11px] text-mn-text-muted">
                Live on Meri Nazmein
              </p>
            </div>
          </article>

          {/* Drafts */}
          <article className="rounded-2xl border border-[#E5DED0] bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-mn-text-muted">
                Drafts
              </p>

              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-amber-400"
              />
            </div>

            <div className="mt-2 flex items-end justify-between gap-4">
              <p className="font-poetry text-3xl font-semibold text-mn-navy">
                {draftPoetry}
              </p>

              <p className="text-[11px] text-mn-text-muted">
                Waiting to be finished
              </p>
            </div>
          </article>
        </div>

        {/* =================================================
                    YOUR WORK + YOUR IDENTITY
                ================================================= */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
          {/* Your Work */}
          <section className="rounded-3xl border border-[#E5DED0] bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-[#E5DED0] px-6 py-4 sm:px-7">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mn-gold-dark">
                  Your Work
                </p>

                <h2 className="mt-1.5 font-poetry text-2xl font-semibold text-mn-navy sm:text-3xl">
                  Manage your writing
                </h2>
              </div>

              <Link
                href="/author/poems"
                className="text-xs font-semibold text-mn-blue transition hover:text-mn-gold-dark sm:text-sm"
              >
                View all →
              </Link>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <Link
                href="/author/poems/create"
                className="group rounded-2xl border border-[#E5DED0] bg-[#FBF8F1] p-5 transition hover:border-mn-gold/60 hover:shadow-sm"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mn-gold-dark">
                  Create
                </p>

                <h3 className="mt-2 font-poetry text-xl font-semibold text-mn-navy">
                  Write Poetry
                </h3>

                <p className="mt-2 text-xs leading-6 text-mn-text-muted sm:text-sm">
                  Create a new nazm, ghazal or shayari.
                </p>

                <span className="mt-4 inline-flex text-xs font-semibold text-mn-blue transition group-hover:text-mn-gold-dark sm:text-sm">
                  Start writing →
                </span>
              </Link>

              <Link
                href="/author/poems"
                className="group rounded-2xl border border-[#E5DED0] bg-[#FBF8F1] p-5 transition hover:border-mn-gold/60 hover:shadow-sm"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mn-gold-dark">
                  Collection
                </p>

                <h3 className="mt-2 font-poetry text-xl font-semibold text-mn-navy">
                  My Poetry
                </h3>

                <p className="mt-2 text-xs leading-6 text-mn-text-muted sm:text-sm">
                  Edit, publish and manage all your poems.
                </p>

                <span className="mt-4 inline-flex text-xs font-semibold text-mn-blue transition group-hover:text-mn-gold-dark sm:text-sm">
                  Manage poetry →
                </span>
              </Link>
            </div>
          </section>

          {/* Your Identity */}
          <aside className="rounded-3xl bg-mn-navy-deep p-6 text-white shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-mn-gold-light">
              Your Identity
            </p>

            <div className="mt-4 flex items-center gap-4">
              {author.avatarUrl ? (
                <Image
                  src={author.avatarUrl}
                  alt={`${author.name} profile`}
                  width={56}
                  height={56}
                  unoptimized
                  className="h-14 w-14 rounded-full object-cover ring-1 ring-mn-gold/40"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-mn-gold/40 bg-white/5 font-poetry text-xl text-mn-gold-light">
                  {author.name
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <h2 className="font-poetry text-2xl font-semibold">
                  {author.name}
                </h2>

                <p className="mt-1 text-xs text-slate-300">
                  @{author.username}
                </p>
              </div>
            </div>

            <div className="my-5 h-px bg-white/10" />

            <p className="text-xs leading-6 text-slate-300 sm:text-sm">
              {author.bio ||
                "Your author bio will appear here. Add something about your writing and your journey."}
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                href="/author/profile"
                className="inline-flex items-center justify-center rounded-full border border-mn-gold/50 px-4 py-2 text-xs font-semibold text-mn-gold-light transition hover:bg-white/5"
              >
                Edit Profile
              </Link>

              <Link
                href={`/authors/${author.username}`}
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/5"
              >
                Public Profile
              </Link>
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Author since
                </p>

                <p className="text-[11px] text-slate-300">
                  {formatDate(author.createdAt)}
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* =================================================
                    RECENT POETRY
                ================================================= */}
        <section className="mt-5 overflow-hidden rounded-3xl border border-[#E5DED0] bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-[#E5DED0] px-6 py-4 sm:px-7">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mn-gold-dark">
                Recent Poetry
              </p>

              <h2 className="mt-1 font-poetry text-2xl font-semibold text-mn-navy">
                Your latest writing
              </h2>
            </div>

            <Link
              href="/author/poems"
              className="shrink-0 text-xs font-semibold text-mn-blue transition hover:text-mn-gold-dark sm:text-sm"
            >
              View all poetry →
            </Link>
          </div>

          {recentPoems.length === 0 ? (
            <div className="px-6 py-10 text-center sm:px-7">
              <p className="font-poetry text-xl text-mn-navy">
                Your poetry will appear here.
              </p>

              <p className="mt-2 text-xs text-mn-text-muted sm:text-sm">
                Start writing your first piece.
              </p>

              <Link
                href="/author/poems/create"
                className="mt-4 inline-flex text-xs font-semibold text-mn-blue transition hover:text-mn-gold-dark sm:text-sm"
              >
                Write your first poetry →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#E5DED0]">
              {recentPoems.map((poem) => (
                <div
                  key={poem.id}
                  className="grid gap-3 px-6 py-3.5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:px-7"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#F5EFE0] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-mn-navy">
                        {getTypeLabel(poem.type)}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${poem.status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                          }`}
                      >
                        {poem.status === "PUBLISHED"
                          ? "Published"
                          : "Draft"}
                      </span>
                    </div>

                    <h3 className="mt-1.5 truncate font-poetry text-lg font-semibold text-mn-navy">
                      {poem.title}
                    </h3>

                    <p className="line-clamp-1 text-[11px] leading-5 text-mn-text-muted">
                      {getPreview(poem.content)}
                    </p>
                  </div>

                  <div className="text-[11px] text-mn-text-muted sm:text-right">
                    {formatDate(poem.updatedAt)}
                  </div>

                  <Link
                    href={`/author/poems/${poem.id}/edit`}
                    className="inline-flex w-fit items-center justify-center rounded-full border border-[#E5DED0] px-3.5 py-1.5 text-[11px] font-semibold text-mn-navy transition hover:border-mn-gold hover:bg-[#FBF8F1] sm:justify-self-end"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}