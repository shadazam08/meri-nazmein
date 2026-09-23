import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PoetryDetail } from "@/components/poetry/poetry-detail";
import { getPublishedPoem } from "@/lib/poetry";
import { PoetryJsonLd } from "@/components/seo/poetry-json-ld";

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const poem = await getPublishedPoem(
        slug,
        "NAZM",
    );

    if (!poem) {
        return {
            title: "Nazm Not Found",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const authorName =
        poem.author.penName?.trim() ||
        poem.author.name;

    const plainText = poem.content
        .replace(/\s+/g, " ")
        .trim();

    const description =
        plainText.length > 155
            ? `${plainText.slice(0, 155)}...`
            : plainText;

    const canonicalUrl = `/nazmein/${poem.slug}`;

    return {
        title: poem.title,
        description,

        authors: [
            {
                name: authorName,
            },
        ],

        alternates: {
            canonical: canonicalUrl,
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
            type: "article",
            title: `${poem.title} | Meri Nazmein`,
            description,
            url: canonicalUrl,
            siteName: "Meri Nazmein",
            publishedTime:
                poem.publishedAt?.toISOString(),
            modifiedTime:
                poem.updatedAt.toISOString(),
            authors: [authorName],
        },

        twitter: {
            card: "summary",
            title: `${poem.title} | Meri Nazmein`,
            description,
        },
    };
}

export default async function NazmDetailPage({
    params,
}: PageProps) {
    const { slug } = await params;

    const poem = await getPublishedPoem(
        slug,
        "NAZM",
    );

    if (!poem) {
        notFound();
    }

    return (
        <>
            <PoetryJsonLd
                title={poem.title}
                content={poem.content}
                slug={poem.slug}
                type="NAZM"
                publishedAt={poem.publishedAt}
                updatedAt={poem.updatedAt}
                author={poem.author}
            />
            <PoetryDetail
                poem={{
                    ...poem,
                    type: "NAZM",
                }}
            />
        </>
    );
}