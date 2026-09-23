import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AuthorProfileHeader } from "@/components/authors/author-profile-header";
import { PoetryCard } from "@/components/poetry/poetry-card";
import { prisma } from "@/lib/prisma";
import { AuthorJsonLd } from "@/components/seo/author-json-ld";

type PageProps = {
    params: Promise<{
        username: string;
    }>;
};

async function getAuthor(username: string) {
    return prisma.author.findUnique({
        where: {
            username,
        },
        select: {
            id: true,
            name: true,
            username: true,
            penName: true,
            bio: true,
            poems: {
                where: {
                    status: "PUBLISHED",
                },
                orderBy: {
                    publishedAt: "desc",
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    content: true,
                    type: true,
                    publishedAt: true,
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { username } = await params;

    const author = await getAuthor(username);

    if (!author) {
        return {
            title: "Author Not Found",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const authorName = author.penName?.trim() || author.name;

    const description = author.bio || `Read the published poetry of ${author.name} on Meri Nazmein.`;

    return {
        title: `${authorName} | Author`,
        description,

        authors: [
            {
                name: authorName,
            },
        ],

        alternates: {
            canonical: `/authors/${author.username}`,
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
            title: `${authorName} | Meri Nazmein`,
            description,
            url: `/authors/${author.username}`,
            siteName: "Meri Nazmein",
            type: "profile",
            locale: "en_IN",
        },

        twitter: {
            card: "summary",
            title: `${authorName} | Meri Nazmein`,
            description,
        },

        category: "literature",
    };
}

export default async function AuthorProfilePage({
    params,
}: PageProps) {
    const { username } = await params;

    const author = await getAuthor(username);

    if (!author) {
        notFound();
    }

    return (
        <main className="min-h-[calc(100vh-88px)] bg-mn-ivory">
            {/* Profile Header */}
            <AuthorProfileHeader
                name={author.name}
                penName={author.penName}
                username={author.username}
                bio={author.bio}
                publishedPoetryCount={author.poems.length}
            />

            {/* Published Poetry */}
            <section className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:py-12">
                <div className="flex items-end justify-between gap-5 border-b border-mn-border pb-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mn-gold-dark">
                            Collection
                        </p>

                        <h2 className="mt-2 font-poetry text-4xl font-semibold text-mn-navy">
                            {author.name}&apos;s Poetry
                        </h2>

                        <p className="mt-2 text-sm text-mn-text-muted">
                            Published nazmein, ghazals aur shayari.
                        </p>
                    </div>

                    <Link
                        href="/authors"
                        className="hidden text-sm font-semibold text-mn-blue transition hover:text-mn-gold-dark sm:inline-flex"
                    >
                        ← All Authors
                    </Link>
                </div>

                {author.poems.length === 0 ? (
                    <div className="mt-7 rounded-[2rem] border border-mn-border bg-white px-6 py-14 text-center shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mn-gold-dark">
                            Coming Soon
                        </p>

                        <h2 className="mt-3 font-poetry text-4xl font-semibold text-mn-navy">
                            Abhi koi poetry publish nahi hui.
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-mn-text-muted">
                            Is author ke naye alfaaz bahut jald yahan
                            nazar aayenge.
                        </p>
                    </div>
                ) : (
                    <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {author.poems.map((poem) => (
                            <PoetryCard
                                key={poem.id}
                                title={poem.title}
                                content={poem.content}
                                penName={author.penName}
                                authorUsername={author.username}
                                publishedAt={poem.publishedAt}
                                categoryName={poem.category?.name}
                                href={
                                    poem.type === "NAZM"
                                        ? `/nazmein/${poem.slug}`
                                        : poem.type === "GHAZAL"
                                            ? `/ghazals/${poem.slug}`
                                            : `/shayari/${poem.slug}`
                                }
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Mobile Back Link */}
            <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
                <Link
                    href="/authors"
                    className="inline-flex text-sm font-semibold text-mn-blue transition hover:text-mn-gold-dark sm:hidden"
                >
                    ← All Authors
                </Link>
            </section>
            <AuthorJsonLd
                name={author.name}
                penName={author.penName}
                username={author.username}
                bio={author.bio}
            />
        </main>
    );
}