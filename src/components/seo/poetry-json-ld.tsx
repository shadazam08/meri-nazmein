type PoetryType = "NAZM" | "GHAZAL" | "SHAYARI";

type PoetryJsonLdProps = {
    title: string;
    content: string;
    slug: string;
    type: PoetryType;
    publishedAt: Date | null;
    updatedAt: Date;
    author: {
        name: string;
        penName: string | null;
        username: string;
    };
};

const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://meri-nazmein.vercel.app/"
).replace(/\/$/, "");

const TYPE_CONFIG: Record<
    PoetryType,
    {
        label: string;
        path: string;
    }
> = {
    NAZM: {
        label: "Nazmein",
        path: "/nazmein",
    },
    GHAZAL: {
        label: "Ghazals",
        path: "/ghazals",
    },
    SHAYARI: {
        label: "Shayari",
        path: "/shayari",
    },
};

function cleanText(content: string) {
    return content
        .replace(/\s+/g, " ")
        .trim();
}

function createDescription(content: string) {
    const plainText = cleanText(content);

    return plainText.length > 155
        ? `${plainText.slice(0, 155)}...`
        : plainText;
}

function safeJsonLd(data: unknown) {
    return JSON.stringify(data)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");
}

export function PoetryJsonLd({
    title,
    content,
    slug,
    type,
    publishedAt,
    updatedAt,
    author,
}: PoetryJsonLdProps) {
    const config = TYPE_CONFIG[type];

    const authorName =
        author.penName?.trim() ||
        author.name;

    const poemUrl =
        `${SITE_URL}${config.path}/${slug}`;

    const collectionUrl =
        `${SITE_URL}${config.path}`;

    const authorUrl =
        `${SITE_URL}/authors/${author.username}`;

    const description =
        createDescription(content);

    const publishedDate =
        publishedAt?.toISOString();

    const modifiedDate =
        updatedAt.toISOString();

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": `${poemUrl}#poem`,
        name: title,
        headline: title,
        description,
        genre: "Poetry",
        url: poemUrl,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": poemUrl,
        },
        author: {
            "@type": "Person",
            name: authorName,
            url: authorUrl,
        },
        isPartOf: {
            "@type": "CollectionPage",
            name: config.label,
            url: collectionUrl,
        },
        ...(publishedDate
            ? {
                datePublished: publishedDate,
            }
            : {}),
        dateModified: modifiedDate,
        publisher: {
            "@type": "Organization",
            name: "Meri Nazmein",
            url: SITE_URL,
        },
    };

    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${poemUrl}#breadcrumb`,
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: config.label,
                item: collectionUrl,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: title,
                item: poemUrl,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: safeJsonLd(
                        structuredData,
                    ),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: safeJsonLd(
                        breadcrumbData,
                    ),
                }}
            />
        </>
    );
}