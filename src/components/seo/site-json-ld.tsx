const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://meri-nazmein.vercel.app/"
).replace(/\/$/, "");

const SITE_NAME = "Meri Nazmein";

const SITE_DESCRIPTION =
    "Meri Nazmein par nazmein, ghazals aur shayari padhiye aur naye authors ke alfaaz discover kijiye. Alfaaz se aage, ehsaason tak.";

function safeJsonLd(data: unknown) {
    return JSON.stringify(data)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");
}

export function SiteJsonLd() {
    const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: "en-IN",
        publisher: {
            "@id": `${SITE_URL}/#organization`,
        },
    };

    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: safeJsonLd(
                        websiteData,
                    ),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: safeJsonLd(
                        organizationData,
                    ),
                }}
            />
        </>
    );
}