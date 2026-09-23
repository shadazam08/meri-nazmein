import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PoetryActions from "./poetry-actions";

import { AuthorPageHeader } from "@/components/author/author-page-header";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Poetry",
  description: "Manage your poetry on Meri Nazmein.",
  robots: {
    index: false,
    follow: false,
  },
};

type FilterStatus = "ALL" | "DRAFT" | "PUBLISHED";

type PageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

function getFilterStatus(value?: string): FilterStatus {
  if (value === "DRAFT" || value === "PUBLISHED") {
    return value;
  }

  return "ALL";
}

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

  if (normalized.length <= 180) {
    return normalized;
  }

  return `${normalized.slice(0, 180)}...`;
}

export default async function MyPoetryPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const filterStatus = getFilterStatus(params.status);

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
    },
  });

  if (!author) {
    redirect("/author/signup");
  }

  const poems = await prisma.poem.findMany({
    where: {
      authorId: author.id,
      ...(filterStatus !== "ALL"
        ? {
          status: filterStatus,
        }
        : {}),
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  const [
    allCount,
    draftCount,
    publishedCount,
  ] = await Promise.all([
    prisma.poem.count({
      where: {
        authorId: author.id,
      },
    }),

    prisma.poem.count({
      where: {
        authorId: author.id,
        status: "DRAFT",
      },
    }),

    prisma.poem.count({
      where: {
        authorId: author.id,
        status: "PUBLISHED",
      },
    }),
  ]);

  return (
    <main className="min-h-[calc(100vh-88px)] bg-[#F7F4EC]">
      {/* =====================================================
                REUSABLE AUTHOR HEADER
            ===================================================== */}
      <AuthorPageHeader
        title="My Poetry"
        description={`Manage your nazmein, ghazals and shayari from one place.`}
        actionLabel="Write New Poetry"
        actionHref="/author/poems/create"
        backLabel="Back to Dashboard"
        backHref="/author/dashboard"
      />

      {/* =====================================================
                CONTENT
            ===================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-9">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/author/poems"
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${filterStatus === "ALL"
              ? "bg-mn-navy text-white"
              : "border border-[#E5DED0] bg-white text-mn-navy hover:border-mn-gold"
              }`}
          >
            All
            <span className="ml-1 opacity-70">
              {allCount}
            </span>
          </Link>

          <Link
            href="/author/poems?status=DRAFT"
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${filterStatus === "DRAFT"
              ? "bg-mn-navy text-white"
              : "border border-[#E5DED0] bg-white text-mn-navy hover:border-mn-gold"
              }`}
          >
            Drafts
            <span className="ml-1 opacity-70">
              {draftCount}
            </span>
          </Link>

          <Link
            href="/author/poems?status=PUBLISHED"
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${filterStatus === "PUBLISHED"
              ? "bg-mn-navy text-white"
              : "border border-[#E5DED0] bg-white text-mn-navy hover:border-mn-gold"
              }`}
          >
            Published
            <span className="ml-1 opacity-70">
              {publishedCount}
            </span>
          </Link>
        </div>

        {/* =================================================
                    EMPTY STATE
                ================================================= */}
        {poems.length === 0 ? (
          <div className="mt-7 rounded-3xl border border-[#E5DED0] bg-white px-6 py-14 text-center shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mn-gold-dark sm:text-xs">
              {filterStatus === "ALL"
                ? "Your Collection"
                : filterStatus === "DRAFT"
                  ? "No Drafts"
                  : "No Published Poetry"}
            </p>

            <h2 className="mt-3 font-poetry text-3xl font-semibold text-mn-navy sm:text-4xl">
              {filterStatus === "ALL"
                ? "Your poetry will appear here."
                : filterStatus === "DRAFT"
                  ? "You have no saved drafts."
                  : "You have no published poetry yet."}
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-mn-text-muted sm:text-base">
              Apne alfaaz likhna shuru kijiye aur apni poetry
              collection create kijiye.
            </p>

            <Link
              href="/author/poems/create"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-mn-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-mn-blue"
            >
              Write New Poetry
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          /* =================================================
              POETRY LIST
          ================================================= */
          <div className="mt-7 space-y-5">
            {poems.map((poem) => (
              <article
                key={poem.id}
                className="rounded-3xl border border-[#E5DED0] bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* Poetry Information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#F5EFE0] px-3 py-1 text-xs font-semibold text-mn-navy">
                        {getTypeLabel(poem.type)}
                      </span>

                      {poem.category && (
                        <span className="rounded-full border border-[#E5DED0] px-3 py-1 text-xs font-medium text-mn-text-muted">
                          {poem.category.name}
                        </span>
                      )}

                      {poem.status === "DRAFT" ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                          Draft
                        </span>
                      ) : (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Published
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 font-poetry text-3xl font-semibold text-mn-navy sm:text-4xl">
                      {poem.title}
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-mn-text-muted sm:text-base">
                      {getPreview(poem.content)}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-mn-text-muted">
                      <span>
                        Updated{" "}
                        {formatDate(
                          poem.updatedAt,
                        )}
                      </span>

                      <span className="hidden sm:inline">
                        •
                      </span>

                      <span>
                        /{poem.slug}
                      </span>

                      {poem.publishedAt && (
                        <>
                          <span className="hidden sm:inline">
                            •
                          </span>

                          <span>
                            Published{" "}
                            {formatDate(
                              poem.publishedAt,
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-wrap gap-2 lg:w-[300px] lg:justify-end">
                    {poem.status === "DRAFT" && (
                      <Link
                        href={`/author/poems/${poem.id}/edit`}
                        className="rounded-full border border-[#E5DED0] px-4 py-2.5 text-sm font-semibold text-mn-navy transition hover:border-mn-gold hover:bg-[#FBF8F1]"
                      >
                        Edit
                      </Link>
                    )}

                    <PoetryActions
                      poemId={poem.id}
                      poemTitle={poem.title}
                      status={poem.status}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}