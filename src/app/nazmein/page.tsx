import type { Metadata } from "next";

import { PoetryCard } from "@/components/poetry/poetry-card";
import { PoetryCollectionHero } from "@/components/poetry/poetry-collection-hero";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Nazmein",
    description: "Meri Nazmein par khoobsurat nazmein padhiye — alfaaz, ehsaas aur kahaniyon se bhari Hindi aur Urdu poetry.",

    alternates: {
        canonical: "/nazmein",
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
        title: "Nazmein | Meri Nazmein",
        description: "Khoobsurat nazmein padhiye — alfaaz, ehsaas aur kahaniyon se bhari Hindi aur Urdu poetry.",
        url: "/nazmein",
        siteName: "Meri Nazmein",
        locale: "en_IN",
    },

    twitter: {
        card: "summary",
        title: "Nazmein | Meri Nazmein",
        description: "Khoobsurat nazmein padhiye — alfaaz, ehsaas aur kahaniyon se bhari Hindi aur Urdu poetry.",
    },

    category: "literature",
};

export default async function NazmeinPage() {
    const poems = await prisma.poem.findMany({
        where: {
            type: "NAZM",
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
            {/* Hero */}
            <PoetryCollectionHero
                eyebrow="Meri Nazmein"
                title="Nazmein"
                description="Lafzon, ehsaason aur khayalon ki woh kahaniyan jo dil se nikli hain aur dil tak pahunchti hain."
                count={poems.length}
                itemLabel="Published Nazm"
                itemLabelPlural="Published Nazmein"
                keywords="Alfaaz • Ehsaas • Kahani"
                quote={`“Har nazm ek safar hai, har lafz ek ehsaas.”`}
                quoteFooter="Shayari • Soch • Zindagi"
            />

            {/* Poetry Collection */}
            <section className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:py-12">
                {poems.length === 0 ? (
                    <div className="rounded-[2rem] border border-mn-border bg-white px-6 py-14 text-center shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mn-gold-dark">
                            Coming Soon
                        </p>

                        <h2 className="mt-3 font-poetry text-4xl font-semibold text-mn-navy">
                            Abhi koi nazm publish nahi hui.
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-mn-text-muted sm:text-base">
                            Bahut jald yahan naye alfaaz aur naye ehsaas padhiye.
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
                                href={`/nazmein/${poem.slug}`}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}