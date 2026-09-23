import type { Metadata } from "next";

import { PoetryCard } from "@/components/poetry/poetry-card";
import { PoetryCollectionHero } from "@/components/poetry/poetry-collection-hero";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Ghazals",
    description:
        "Meri Nazmein par mohabbat, judai, khamoshi aur zindagi ke ehsaason se bhari ghazals padhiye — Hindi aur Urdu poetry ka khoobsurat collection.",

    alternates: {
        canonical: "/ghazals",
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },

    openGraph: {
        type: "website",
        title: "Ghazals | Meri Nazmein",
        description:
            "Mohabbat, judai, khamoshi aur zindagi ke ehsaason se bhari ghazals padhiye.",
        url: "/ghazals",
        siteName: "Meri Nazmein",
        locale: "en_IN",
    },

    twitter: {
        card: "summary",
        title: "Ghazals | Meri Nazmein",
        description:
            "Mohabbat, judai, khamoshi aur zindagi ke ehsaason se bhari ghazals padhiye.",
    },

    category: "literature",
};

export default async function GhazalsPage() {
    const poems = await prisma.poem.findMany({
        where: {
            type: "GHAZAL",
            status: "PUBLISHED",
        },
        orderBy: {
            publishedAt: "desc",
        },
        include: {
            author: {
                select: {
                    name: true,
                    username: true,
                    penName: true,
                },
            },
            category: {
                select: {
                    name: true,
                    slug: true,
                },
            },
        },
    });

    return (
        <main className="min-h-[calc(100vh-88px)] bg-mn-ivory">
            <PoetryCollectionHero
                eyebrow="Meri Ghazals"
                title="Ghazals"
                description="Mohabbat, judai, khamoshi aur zindagi ke ehsaason se nikle hue alfaaz."
                count={poems.length}
                itemLabel="Published Ghazal"
                itemLabelPlural="Published Ghazals"
                keywords="Mohabbat • Judai • Ehsaas"
                quote={`“Har ghazal mein ek kahani hai, har sher mein ek ehsaas.”`}
                quoteFooter="Mohabbat • Khamoshi • Zindagi"
            />

            {/* Poetry Collection */}
            <section className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:py-12">
                {poems.length === 0 ? (
                    <div className="rounded-[2rem] border border-mn-border bg-white px-6 py-14 text-center shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mn-gold-dark">
                            Coming Soon
                        </p>

                        <h2 className="mt-3 font-poetry text-4xl font-semibold text-mn-navy">
                            Abhi koi ghazal publish nahi hui.
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-mn-text-muted sm:text-base">
                            Bahut jald yahan mohabbat aur ehsaason se bhari
                            ghazlein padhiye.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {poems.map((poem) => (
                            <PoetryCard
                                key={poem.id}
                                title={poem.title}
                                content={poem.content}
                                penName={
                                    poem.author.penName?.trim() ||
                                    poem.author.name
                                }
                                authorUsername={poem.author.username}
                                publishedAt={poem.publishedAt}
                                categoryName={poem.category?.name}
                                href={`/ghazals/${poem.slug}`}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}