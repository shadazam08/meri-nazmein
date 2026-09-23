import type { Metadata } from "next";

import { PoetryCard } from "@/components/poetry/poetry-card";
import { PoetryCollectionHero } from "@/components/poetry/poetry-collection-hero";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Shayari",
    description:
        "Meri Nazmein par chhote alfaaz, gehre ehsaas aur dil ki baatein padhiyé — khoobsurat Hindi aur Urdu shayari ka majmua.",

    alternates: {
        canonical: "/shayari",
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
        title: "Shayari | Meri Nazmein",
        description:
            "Chhote alfaaz, gehre ehsaas aur dil ki baatein — khoobsurat Hindi aur Urdu shayari padhiye.",
        url: "/shayari",
        siteName: "Meri Nazmein",
        locale: "en_IN",
    },

    twitter: {
        card: "summary",
        title: "Shayari | Meri Nazmein",
        description:
            "Chhote alfaaz, gehre ehsaas aur dil ki baatein — khoobsurat Hindi aur Urdu shayari padhiye.",
    },

    category: "literature",
};

export default async function ShayariPage() {
    const poems = await prisma.poem.findMany({
        where: {
            type: "SHAYARI",
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
                eyebrow="Meri Shayari"
                title="Shayari"
                description="Chhote alfaaz, gehre ehsaas aur dil ki woh baatein jo seedha dil tak pahunchti hain."
                count={poems.length}
                itemLabel="Published Shayari"
                itemLabelPlural="Published Shayari"
                keywords="Alfaaz • Dil • Ehsaas"
                quote={`“Kuch alfaaz chhote hote hain, magar unke ehsaas gehre.”`}
                quoteFooter="Shayari • Dil • Zindagi"
            />

            {/* Poetry Collection */}
            <section className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:py-12">
                {poems.length === 0 ? (
                    <div className="rounded-[2rem] border border-mn-border bg-white px-6 py-14 text-center shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mn-gold-dark">
                            Coming Soon
                        </p>

                        <h2 className="mt-3 font-poetry text-4xl font-semibold text-mn-navy">
                            Abhi koi shayari publish nahi hui.
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-mn-text-muted sm:text-base">
                            Bahut jald yahan dil se nikle hue naye alfaaz aur gehre ehsaas
                            padhiye.
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
                                href={`/shayari/${poem.slug}`}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}