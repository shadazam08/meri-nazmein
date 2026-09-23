"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

type SaveState =
    | "IDLE"
    | "SAVING"
    | "SAVED"
    | "PUBLISHING"
    | "PUBLISHED";

function createSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export default function CreatePoetryPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [type, setType] = useState<PoemType>("NAZM");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");

    const [poemId, setPoemId] = useState<string | null>(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [saveState, setSaveState] =
        useState<SaveState>("IDLE");

    const wordCount = useMemo(() => {
        const trimmed = content.trim();

        if (!trimmed) {
            return 0;
        }

        return trimmed.split(/\s+/).length;
    }, [content]);

    const hasRequiredContent =
        title.trim().length > 0 &&
        content.trim().length > 0 &&
        slug.length > 0;

    const isSaving =
        saveState === "SAVING";

    const isSaved =
        saveState === "SAVED";

    const isPublishing =
        saveState === "PUBLISHING";

    const isPublished =
        saveState === "PUBLISHED";

    function handleTitleChange(value: string) {
        // Once draft is saved, don't modify the saved content.
        if (isSaved || isPublishing || isPublished) {
            return;
        }

        setTitle(value);
        setSlug(createSlug(value));
        setError("");
        setSuccess("");
    }

    function handleContentChange(value: string) {
        if (isSaved || isPublishing || isPublished) {
            return;
        }

        // Keep maximum one blank line between stanzas.
        const normalized = value.replace(
            /\n{3,}/g,
            "\n\n",
        );

        setContent(normalized);
        setError("");
        setSuccess("");
    }

    function handleTypeChange(value: PoemType) {
        if (isSaved || isPublishing || isPublished) {
            return;
        }

        setType(value);
        setError("");
        setSuccess("");
    }

    function handleCategoryChange(value: string) {
        if (isSaved || isPublishing || isPublished) {
            return;
        }

        setCategory(value);
        setError("");
        setSuccess("");
    }

    async function handleSaveDraft() {
        if (isSaving || isSaved || isPublishing || isPublished) {
            return;
        }

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
            setError(
                "Please write your poetry before saving.",
            );
            return;
        }

        if (!slug) {
            setError(
                "A valid URL slug could not be generated.",
            );
            return;
        }

        setSaveState("SAVING");

        try {
            const response = await fetch(
                "/api/author/poems",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: trimmedTitle,
                        content: trimmedContent,
                        type,
                        category: trimmedCategory,
                        status: "DRAFT",
                    }),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                setError(
                    result.error ??
                    "Unable to save poetry.",
                );

                setSaveState("IDLE");
                return;
            }

            /*
             * The API should return the newly-created poem.
             * We store its ID so Publish updates this draft
             * instead of creating another poem.
             */
            const createdPoemId =
                result.poem?.id ??
                result.id ??
                null;

            if (!createdPoemId) {
                setError(
                    "Poetry was saved, but the poem ID was not returned. Please check the API response.",
                );

                setSaveState("IDLE");
                return;
            }

            setPoemId(createdPoemId);
            setSaveState("SAVED");

            setSuccess(
                "Your poetry has been saved as a draft. You can publish it now.",
            );
        } catch {
            setError(
                "Something went wrong while saving. Please try again.",
            );

            setSaveState("IDLE");
        }
    }

    async function handlePublish() {
        if (
            !poemId ||
            saveState !== "SAVED" ||
            isPublishing ||
            isPublished
        ) {
            return;
        }

        setError("");
        setSuccess("");
        setSaveState("PUBLISHING");

        try {
            const response = await fetch(
                `/api/author/poems/${poemId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "PUBLISH",
                    }),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                setError(
                    result.error ??
                    "Unable to publish poetry.",
                );

                setSaveState("SAVED");
                return;
            }

            setSaveState("PUBLISHED");

            setSuccess(
                "Your poetry has been published successfully.",
            );

            setTimeout(() => {
                router.push("/author/poems");
                router.refresh();
            }, 700);
        } catch {
            setError(
                "Something went wrong while publishing. Please try again.",
            );

            setSaveState("SAVED");
        }
    }

    return (
        <main className="min-h-[calc(100vh-88px)] bg-[#F7F4EC]">
            {/* =====================================================
                AUTHOR HEADER
            ===================================================== */}
            <AuthorPageHeader
                title="Write New Poetry"
                description="Apne alfaaz likhiye, pehle unhe draft ke roop mein save kijiye aur review karne ke baad publish kijiye."
                actionLabel="My Poetry"
                actionHref="/author/poems"
                backLabel="Back to Dashboard"
                backHref="/author/dashboard"
            />

            {/* =====================================================
                CONTENT
            ===================================================== */}
            <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-9">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    {/* =================================================
                        MAIN EDITOR
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
                                disabled={
                                    isSaved ||
                                    isPublishing ||
                                    isPublished
                                }
                                placeholder="Enter your poetry title"
                                className="w-full rounded-xl border border-[#DDD4C5] bg-[#F7F2E8] px-4 py-3.5 text-base text-mn-navy outline-none transition placeholder:text-[#918A7D] focus:border-mn-gold focus:bg-[#F3EDE1] focus:ring-4 focus:ring-mn-gold/10 disabled:cursor-not-allowed disabled:opacity-70"
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
                                disabled={
                                    isSaved ||
                                    isPublishing ||
                                    isPublished
                                }
                                placeholder={`Yahan apni nazm, ghazal ya shayari likhiye...

Har lafz ko apna ehsaas banne dijiye...`}
                                rows={22}
                                spellCheck={false}
                                className="w-full resize-y rounded-2xl border border-[#D9D0C0] bg-[#F4EFE5] px-5 py-4 font-poetry text-xl leading-[1.6] text-mn-navy shadow-inner outline-none transition placeholder:font-sans placeholder:text-base placeholder:leading-7 placeholder:text-[#918A7D] focus:border-mn-gold focus:bg-[#F3EDE1] focus:ring-4 focus:ring-mn-gold/10 disabled:cursor-not-allowed disabled:opacity-70"
                            />

                            <p className="mt-3 text-xs leading-5 text-mn-text-muted">
                                Poetry ki line breaks preserve
                                rahengi. Ek blank line se nayi
                                stanza banaiye.
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        PUBLISHING PANEL
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
                                        handleTypeChange(
                                            event.target
                                                .value as PoemType,
                                        )
                                    }
                                    disabled={
                                        isSaved ||
                                        isPublishing ||
                                        isPublished
                                    }
                                    className="w-full appearance-none rounded-xl border border-[#DDD4C5] bg-[#F7F2E8] px-4 py-3.5 text-sm text-mn-navy outline-none transition focus:border-mn-gold focus:bg-[#F3EDE1] focus:ring-4 focus:ring-mn-gold/10 disabled:cursor-not-allowed disabled:opacity-70"
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
                                        handleCategoryChange(
                                            event.target
                                                .value,
                                        )
                                    }
                                    disabled={
                                        isSaved ||
                                        isPublishing ||
                                        isPublished
                                    }
                                    placeholder="e.g. Mohabbat"
                                    className="w-full rounded-xl border border-[#DDD4C5] bg-[#F7F2E8] px-4 py-3.5 text-sm text-mn-navy outline-none transition placeholder:text-[#918A7D] focus:border-mn-gold focus:bg-[#F3EDE1] focus:ring-4 focus:ring-mn-gold/10 disabled:cursor-not-allowed disabled:opacity-70"
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
                                    className="w-full cursor-not-allowed rounded-xl border border-[#DDD4C5] bg-[#EEE8DC] px-4 py-3.5 text-sm text-mn-text-muted outline-none"
                                />

                                <p className="mt-2 text-xs leading-5 text-mn-text-muted">
                                    Ye URL title se
                                    automatically generate
                                    hoga.
                                </p>
                            </div>
                        </div>

                        {/* =================================================
                            STATUS
                        ================================================= */}
                        <div className="mt-7 border-t border-[#E5DED0] pt-6">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-mn-text-muted">
                                    Publishing status
                                </p>

                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${saveState === "SAVED"
                                            ? "bg-mn-gold"
                                            : saveState ===
                                                "PUBLISHING"
                                                ? "bg-mn-blue"
                                                : saveState ===
                                                    "PUBLISHED"
                                                    ? "bg-emerald-500"
                                                    : "bg-slate-300"
                                        }`}
                                />
                            </div>

                            <div className="mt-3 rounded-xl border border-[#E5DED0] bg-[#FBF8F1] px-4 py-3">
                                <p className="text-sm font-semibold text-mn-navy">
                                    {saveState === "IDLE" &&
                                        "Ready to save"}

                                    {saveState === "SAVING" &&
                                        "Saving draft..."}

                                    {saveState === "SAVED" &&
                                        "Draft saved"}

                                    {saveState ===
                                        "PUBLISHING" &&
                                        "Publishing..."}

                                    {saveState ===
                                        "PUBLISHED" &&
                                        "Published"}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-mn-text-muted">
                                    {saveState ===
                                        "IDLE"
                                        ? "Title aur poetry complete karke Save as Draft karein."
                                        : saveState ===
                                            "SAVING"
                                            ? "Aapki poetry save ho rahi hai. Please wait."
                                            : saveState ===
                                                "SAVED"
                                                ? "Draft successfully save ho gaya. Ab aap publish kar sakte hain."
                                                : saveState ===
                                                    "PUBLISHING"
                                                    ? "Aapki poetry publish ho rahi hai."
                                                    : "Ye poetry successfully publish ho chuki hai."}
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

                        {/* =================================================
                            ACTIONS
                        ================================================= */}
                        <div className="mt-6 space-y-3">
                            {/* Save Draft */}
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                disabled={
                                    !hasRequiredContent ||
                                    isSaving ||
                                    isSaved ||
                                    isPublishing ||
                                    isPublished
                                }
                                className="w-full rounded-xl border border-[#DDD4C5] px-5 py-3.5 text-sm font-semibold text-mn-navy transition hover:border-mn-gold hover:bg-mn-cream disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSaving
                                    ? "Saving Draft..."
                                    : isSaved ||
                                        isPublishing ||
                                        isPublished
                                        ? "Draft Saved ✓"
                                        : "Save as Draft"}
                            </button>

                            {/* Publish */}
                            <button
                                type="button"
                                onClick={handlePublish}
                                disabled={
                                    !isSaved ||
                                    !poemId ||
                                    isPublishing ||
                                    isPublished
                                }
                                className="w-full rounded-xl bg-mn-navy px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-mn-blue disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isPublishing
                                    ? "Publishing..."
                                    : isPublished
                                        ? "Published ✓"
                                        : "Publish Poetry"}
                            </button>
                        </div>

                        {/* Workflow hint */}
                        <p className="mt-4 text-center text-[11px] leading-5 text-mn-text-muted">
                            Save your draft first. Publish will
                            become available after the draft is
                            successfully saved.
                        </p>
                    </aside>
                </div>
            </section>
        </main>
    );
}