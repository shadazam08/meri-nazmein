type AuthorItem = {
    name: string;
    penName: string | null;
    username: string;
};

type AuthorsJsonLdProps = {
    authors: AuthorItem[];
};

const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://meri-nazmein.vercel.app/"
).replace(/\/$/, "");

function safeJsonLd(data: unknown) {
    return JSON.stringify(data)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");
}

export function AuthorsJsonLd({
    authors,
}: AuthorsJsonLdProps) {
    const authorItems = authors.map(
        (author, index) => {
            const displayName =
                author.penName?.trim() ||
                author.name;

            const authorUrl =
                `${SITE_URL}/authors/${author.username}`;

            return {
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "Person",
                    name: displayName,
                    url: authorUrl,
                },
            };
        },
    );

    const itemListData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${SITE_URL}/authors#author-list`,
        name: "Meri Nazmein Authors",
        url: `${SITE_URL}/authors`,
        numberOfItems: authors.length,
        itemListOrder:
            "https://schema.org/ItemListOrderAscending",
        itemListElement: authorItems,
    };

    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/authors#breadcrumb`,
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
                name: "Authors",
                item: `${SITE_URL}/authors`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: safeJsonLd(
                        itemListData,
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