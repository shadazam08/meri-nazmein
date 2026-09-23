import Link from "next/link";

import { HeroFeaturedContent } from "@/components/home/hero-featured-content";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { SiteJsonLd } from "@/components/seo/site-json-ld";

export default async function Home() {
  const supabase = await createClient();

  const [
    {
      data: { user },
    },
    featuredPoems,
  ] = await Promise.all([
    supabase.auth.getUser(),

    prisma.poem.findMany({
      where: {
        status: "PUBLISHED",
        type: {
          in: [
            "NAZM",
            "GHAZAL",
            "SHAYARI",
          ],
        },
      },
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        type: true,
        publishedAt: true,
        author: {
          select: {
            name: true,
            penName: true,
            username: true,
          },
        },
      },
    }),
  ]);

  const isAuthenticated =
    Boolean(user);

  const heroPoems = featuredPoems
    .filter(
      (
        poem,
      ): poem is typeof poem & {
        type: "NAZM" | "GHAZAL" | "SHAYARI";
        publishedAt: Date;
      } =>
        poem.publishedAt !== null &&
        poem.type !== "OTHER",
    )
    .map((poem) => ({
      id: poem.id,
      title: poem.title,
      slug: poem.slug,
      content: poem.content,
      type: poem.type,
      publishedAt:
        poem.publishedAt.toISOString(),
      author: poem.author,
    }));

  return (
    <main className="min-h-[calc(100vh-88px)] bg-mn-ivory">
      <SiteJsonLd />
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-mn-navy-deep">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(18,103,214,0.28),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(212,166,42,0.12),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.88fr] lg:gap-14">
            {/* =====================================================
                LEFT
            ===================================================== */}
            <div className="max-w-3xl">
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.3em] text-mn-gold-light">
                Meri Nazmein
              </p>

              <h1 className="font-poetry text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
                Alfaaz se aage,
                <br />
                ehsaason tak.
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
                Nazmein, ghazals aur
                shayari — jahan har lafz
                ek ehsaas hai aur har nazm
                apni ek kahani.
              </p>

              {/* Hero Actions */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/nazmein"
                  className="inline-flex items-center justify-center rounded-full bg-mn-gold px-7 py-3.5 font-semibold text-mn-navy-deep transition hover:bg-mn-gold-light"
                >
                  Explore Poetry
                  <span
                    className="ml-2"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>

                {isAuthenticated ? (
                  <Link
                    href="/author/dashboard"
                    className="inline-flex items-center justify-center rounded-full border border-mn-gold/60 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
                  >
                    Author Dashboard
                    <span
                      className="ml-2"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/author/signup"
                    className="inline-flex items-center justify-center rounded-full border border-mn-gold/60 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
                  >
                    Become an Author
                    <span
                      className="ml-2"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {/* =====================================================
                RIGHT
            ===================================================== */}
            <HeroFeaturedContent poems={heroPoems} />
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-mn-blue/20 blur-3xl" />

        <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-mn-gold/10 blur-3xl" />
      </section>

      {/* =========================================================
          DISCOVER
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-mn-gold-dark">
            Discover
          </p>

          <h2 className="mt-3 font-poetry text-4xl font-semibold text-mn-navy sm:text-5xl">
            Lafzon ki duniya
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-mn-text-muted">
            Apne pasand ke alfaaz
            padhiye, naye authors discover
            kijiye aur un ehsaason se
            judiye jo dil tak pahunchte
            hain.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Nazmein",
              description:
                "Kahani, ehsaas aur khayalon ko nazm ke andaaz mein.",
              href: "/nazmein",
            },
            {
              title: "Ghazals",
              description:
                "Mohabbat, judai aur zindagi ke khoobsurat alfaaz.",
              href: "/ghazals",
            },
            {
              title: "Shayari",
              description:
                "Chhote alfaaz, gehre ehsaas aur dil ki baatein.",
              href: "/shayari",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-2xl border border-mn-border bg-white p-7 transition-all hover:-translate-y-1 hover:border-mn-gold/60 hover:shadow-xl"
            >
              <h3 className="font-poetry text-3xl font-semibold text-mn-navy">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-mn-text-muted">
                {item.description}
              </p>

              <span className="mt-6 inline-block text-sm font-semibold text-mn-blue transition group-hover:text-mn-gold-dark">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

