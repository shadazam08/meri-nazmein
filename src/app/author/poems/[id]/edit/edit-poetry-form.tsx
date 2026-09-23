"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { AuthorPageHeader } from "@/components/author/author-page-header";

const poetryTypes = [
    { value: "NAZM", label: "Nazm" },
    { value: "GHAZAL", label: "Ghazal" },
    { value: "SHAYARI", label: "Shayari" },
    { value: "OTHER", label: "Other" },
];

type PoemType =
    | "NAZM"
    | "GHAZAL"
    | "SHAYARI"
    | "OTHER";

type PoemStatus =
    | "DRAFT"
    | "PUBLISHED";

type EditPoetryFormProps = {
    poem: {
        id: string;
        title: string;
        slug: string;
        content: string;
        type: PoemType;
        status: PoemStatus;
        category: string;
    };
};

function createSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export default function EditPoetryForm({
    poem,
}: EditPoetryFormProps) {
    const router = useRouter();

    const [title, setTitle] = useState(poem.title);
    const [slug, setSlug] = useState(poem.slug);
    const [type, setType] = useState<PoemType>(poem.type);
    const [category, setCategory] = useState(poem.category);
    const [content, setContent] = useState(poem.content);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [saving, setSaving] = useState(false);

    const wordCount = useMemo(() => {
        const trimmed = content.trim();

        if (!trimmed) {
            return 0;
        }

        return trimmed.split(/\s+/).length;
    }, [content]);

    function handleTitleChange(value: string) {
        setTitle(value);
        setSlug(createSlug(value));
    }

    function handleContentChange(value: string) {
        // Maximum 1 blank line between stanzas.
        const normalized = value.replace(/\n{3,}/g, "\n\n");

        setContent(normalized);
    }

    async function handleSave() {
        setError("");
        setSuccess("");

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();
        const trimmedCategory = category.trim();

        if (!trimmedTitle) {
            setError("Poetry title is required.");
            return;
        }

        if (!trimmedContent) {
            setError("Poetry content is required.");
            return;
        }

        if (!slug) {
            setError(
                "A valid URL slug could not be generated.",
            );
            return;
        }

        if (saving) {
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(
                `/api/author/poems/${poem.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "UPDATE",
                        title: trimmedTitle,
                        content: trimmedContent,
                        type,
                        category: trimmedCategory,
                    }),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                setError(
                    result.error ??
                    "Unable to update poetry.",
                );
                return;
            }

            setSuccess(
                "Your poetry has been updated successfully.",
            );

            setTimeout(() => {
                router.push("/author/poems");
                router.refresh();
            }, 700);
        } catch {
            setError(
                "Something went wrong. Please try again.",
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="min-h-[calc(100vh-88px)] bg-[#F7F4EC]">
            {/* =====================================================
                REUSABLE AUTHOR HEADER
            ===================================================== */}
            <AuthorPageHeader
                title="Edit Poetry"
                description="Apni poetry ko update kijiye. URL slug title ke saath automatically manage hoga."
                actionLabel="Write New Poetry"
                actionHref="/author/poems/create"
                backLabel="Back to Dashboard"
                backHref="/author/dashboard"
            />

            {/* =====================================================
                CONTENT
            ===================================================== */}
            <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-9">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    {/* =================================================
                        EDITOR
                    ================================================= */}
                    <div className="rounded-3xl border border-[#E5DED0] bg-white p-6 shadow-sm sm:p-8">
                        {/* Title */}
                        <div>
                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-semibold text-mn-navy"
                            >
                                Poetry Title
                            </label>

                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    handleTitleChange(
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-xl border border-[#DDD4C5] bg-[#F7F2E8] px-4 py-3.5 text-base text-mn-navy outline-none transition focus:border-mn-gold focus:ring-4 focus:ring-mn-gold/10"
                            />
                        </div>

                        {/* Poetry */}
                        <div className="mt-6">
                            <label
                                htmlFor="content"
                                className="mb-2 flex items-center justify-between text-sm font-semibold text-mn-navy"
                            >
                                <span>Poetry</span>

                                <span className="font-normal text-mn-text-muted">
                                    {wordCount}{" "}
                                    {wordCount === 1
                                        ? "word"
                                        : "words"}
                                </span>
                            </label>

                            <textarea
                                id="content"
                                value={content}
                                onChange={(event) =>
                                    handleContentChange(
                                        event.target.value,
                                    )
                                }
                                rows={22}
                                spellCheck={false}
                                className="w-full resize-y rounded-2xl border border-[#D9D0C0] bg-[#F4EFE5] px-5 py-4 font-poetry text-xl leading-[1.2] text-mn-navy shadow-inner outline-none transition placeholder:text-[#918A7D] focus:border-mn-gold focus:bg-[#F3EDE1] focus:ring-4 focus:ring-mn-gold/10"
                            />

                            <p className="mt-3 text-xs leading-5 text-mn-text-muted">
                                Poetry ki line breaks preserve
                                rahengi.
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        DETAILS
                    ================================================= */}
                    <aside className="h-fit rounded-3xl border border-[#E5DED0] bg-white p-6 shadow-sm sm:p-7 lg:sticky lg:top-28">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mn-gold-dark">
                                Publishing
                            </p>

                            <h2 className="mt-2 font-poetry text-2xl font-semibold text-mn-navy sm:text-3xl">
                                Poetry Details
                            </h2>
                        </div>

                        <div className="mt-6 space-y-5">
                            {/* Type */}
                            <div>
                                <label
                                    htmlFor="type"
                                    className="mb-2 block text-sm font-semibold text-mn-navy"
                                >
                                    Type
                                </label>

                                <select
                                    id="type"
                                    value={type}
                                    onChange={(event) =>
                                        setType(
                                            event.target
                                                .value as PoemType,
                                        )
                                    }
                                    className="w-full appearance-none rounded-xl border border-[#DDD4C5] bg-[#F7F2E8] px-4 py-3 text-sm text-mn-navy outline-none transition focus:border-mn-gold focus:ring-4 focus:ring-mn-gold/10"
                                >
                                    {poetryTypes.map(
                                        (item) => (
                                            <option
                                                key={
                                                    item.value
                                                }
                                                value={
                                                    item.value
                                                }
                                            >
                                                {item.label}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>

                            {/* Category */}
                            <div>
                                <label
                                    htmlFor="category"
                                    className="mb-2 block text-sm font-semibold text-mn-navy"
                                >
                                    Category
                                    <span className="ml-1 font-normal text-mn-text-muted">
                                        (optional)
                                    </span>
                                </label>

                                <input
                                    id="category"
                                    type="text"
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(
                                            event.target
                                                .value,
                                        )
                                    }
                                    placeholder="e.g. Mohabbat"
                                    className="w-full rounded-xl border border-[#DDD4C5] bg-[#F7F2E8] px-4 py-3 text-sm text-mn-navy outline-none transition placeholder:text-[#918A7D] focus:border-mn-gold focus:ring-4 focus:ring-mn-gold/10"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label
                                    htmlFor="slug"
                                    className="mb-2 block text-sm font-semibold text-mn-navy"
                                >
                                    URL Slug
                                </label>

                                <input
                                    id="slug"
                                    type="text"
                                    value={slug}
                                    readOnly
                                    aria-readonly="true"
                                    className="w-full cursor-not-allowed rounded-xl border border-[#DDD4C5] bg-[#EEE8DC] px-4 py-3 text-sm text-mn-text-muted outline-none"
                                />

                                <p className="mt-2 text-xs leading-5 text-mn-text-muted">
                                    Title ke basis par
                                    automatically generate
                                    hota hai.
                                </p>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="mt-7 border-t border-[#E5DED0] pt-6">
                            <p className="text-sm font-medium text-mn-text-muted">
                                Current status
                            </p>

                            <div className="mt-3 rounded-xl border border-[#E5DED0] bg-[#FBF8F1] px-4 py-3">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-mn-navy">
                                        {poem.status ===
                                            "DRAFT"
                                            ? "Draft"
                                            : "Published"}
                                    </p>

                                    <span
                                        aria-hidden="true"
                                        className={`h-2 w-2 rounded-full ${poem.status ===
                                                "PUBLISHED"
                                                ? "bg-emerald-500"
                                                : "bg-mn-gold"
                                            }`}
                                    />
                                </div>

                                <p className="mt-1 text-xs leading-5 text-mn-text-muted">
                                    Update karne ke baad
                                    existing publication
                                    status same rahega.
                                </p>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                role="alert"
                                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                            >
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div
                                role="status"
                                className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
                            >
                                {success}
                            </div>
                        )}

                        {/* Save */}
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-mn-navy px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-mn-blue disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving Changes..."
                                : "Save Changes"}

                            {!saving && (
                                <span aria-hidden="true">
                                    →
                                </span>
                            )}
                        </button>
                    </aside>
                </div>
            </section>
        </main>
    );
}