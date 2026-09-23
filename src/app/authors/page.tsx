import type { Metadata } from "next";

import { AuthorCard } from "@/components/authors/author-card";
import { PoetryCollectionHero } from "@/components/poetry/poetry-collection-hero";
import { prisma } from "@/lib/prisma";
import { AuthorsJsonLd } from "@/components/seo/authors-json-ld";

export const metadata: Metadata = {
    title: "Authors",
    description:
        "Meri Nazmein ke authors ko discover kijiye aur unki nazmein, ghazals aur shayari padhiye.",

    alternates: {
        canonical: "/authors",
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
        title: "Authors | Meri Nazmein",
        description:
            "Meri Nazmein ke authors ko discover kijiye aur unki nazmein, ghazals aur shayari padhiye.",
        url: "/authors",
        siteName: "Meri Nazmein",
        locale: "en_IN",
    },

    twitter: {
        card: "summary",
        title: "Authors | Meri Nazmein",
        description:
            "Meri Nazmein ke authors ko discover kijiye aur unki nazmein, ghazals aur shayari padhiye.",
    },

    category: "literature",
};

export default async function AuthorsPage() {
    const authors =
        await prisma.author.findMany({
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
                penName: true,
                username: true,
                bio: true,
                avatarUrl: true,
                poems: {
                    where: {
                        status: "PUBLISHED",
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });

    const authorsWithCount =
        authors.map((author) => ({
            id: author.id,
            name: author.name,
            penName: author.penName,
            username: author.username,
            bio: author.bio,
            avatarUrl: author.avatarUrl,
            publishedPoetryCount: author.poems.length,
        }));

    return (
        <main className="min-h-[calc(100vh-88px)] bg-mn-ivory">
            <AuthorsJsonLd
                authors={authorsWithCount.map(
                    (author) => ({
                        name: author.name,
                        penName: author.penName,
                        username: author.username,
                    }),
                )}
            />
            {/* =================================================
                COLLECTION HERO
            ================================================= */}
            <PoetryCollectionHero
                eyebrow="Meri Nazmein"
                title="Authors"
                description="Un alfaaz ke peeche maujood un logon ko discover kijiye jo apne ehsaas aur kahaniyan lafzon mein pirote hain."
                count={authorsWithCount.length}
                itemLabel="Author"
                itemLabelPlural="Authors"
                keywords="Alfaaz • Ehsaas • Kahani"
                quote={`“Har alfaaz ke peeche ek dil hai, har kahani ke peeche ek awaaz.”`}
                quoteFooter="Authors • Alfaaz • Kahani"
            />

            {/* =================================================
                AUTHORS COLLECTION
            ================================================= */}
            <section className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:py-12">
                {authorsWithCount.length ===
                    0 ? (
                    <div className="rounded-[2rem] border border-mn-border bg-white px-6 py-14 text-center shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mn-gold-dark">
                            Coming Soon
                        </p>

                        <h2 className="mt-3 font-poetry text-4xl font-semibold text-mn-navy">
                            Abhi koi author available nahi hai.
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-mn-text-muted sm:text-base">
                            Bahut jald yahan naye authors aur unke alfaaz se
                            mulaqat hogi.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {authorsWithCount.map(
                            (author) => (
                                <AuthorCard
                                    key={author.id}
                                    name={author.name}
                                    penName={author.penName}
                                    username={author.username}
                                    bio={author.bio}
                                    avatarUrl={author.avatarUrl}
                                    publishedPoetryCount={
                                        author.publishedPoetryCount
                                    }
                                    href={`/authors/${author.username}`}
                                />
                            ),
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}