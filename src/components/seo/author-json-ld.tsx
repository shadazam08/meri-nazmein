type AuthorJsonLdProps = {
    name: string;
    penName: string | null;
    username: string;
    bio: string | null;
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

export function AuthorJsonLd({
    name,
    penName,
    username,
    bio,
}: AuthorJsonLdProps) {
    const displayName =
        penName?.trim() || name;

    const authorUrl =
        `${SITE_URL}/authors/${username}`;

    const description =
        bio?.trim() ||
        `Read published nazmein, ghazals aur shayari by ${displayName} on Meri Nazmein.`;

    const personData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${authorUrl}#person`,
        name: displayName,
        url: authorUrl,
        description,
        worksFor: {
            "@type": "Organization",
            name: "Meri Nazmein",
            url: SITE_URL,
        },
    };

    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${authorUrl}#breadcrumb`,
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
            {
                "@type": "ListItem",
                position: 3,
                name: displayName,
                item: authorUrl,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: safeJsonLd(
                        personData,
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