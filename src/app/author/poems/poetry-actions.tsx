"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PoetryActionsProps = {
    poemId: string;
    poemTitle: string;
    status: "DRAFT" | "PUBLISHED";
};

export default function PoetryActions({
    poemId,
    poemTitle,
    status,
}: PoetryActionsProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    async function handleAction(
        action: "PUBLISH" | "DELETE",
    ) {
        if (loading) {
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `/api/author/poems/${poemId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action,
                    }),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                setError(
                    result.error ??
                    "Unable to complete this action.",
                );
                return;
            }

            setShowDeleteModal(false);

            router.refresh();
        } catch {
            setError(
                "Something went wrong. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="flex flex-wrap gap-2">
                {/* =============================================
                    DRAFT → PUBLISH
                ============================================= */}
                {status === "DRAFT" && (
                    <button
                        type="button"
                        onClick={() =>
                            handleAction("PUBLISH")
                        }
                        disabled={loading}
                        className="rounded-full bg-mn-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-mn-blue disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Publishing..."
                            : "Publish"}
                    </button>
                )}

                {/* =============================================
                    DRAFT ONLY → DELETE
                ============================================= */}
                {status === "DRAFT" && (
                    <button
                        type="button"
                        onClick={() =>
                            setShowDeleteModal(true)
                        }
                        disabled={loading}
                        className="rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Delete
                    </button>
                )}

                {/* =============================================
                    ERROR
                ============================================= */}
                {error && (
                    <p
                        role="alert"
                        className="basis-full text-xs leading-5 text-red-600"
                    >
                        {error}
                    </p>
                )}
            </div>

            {/* ================================================
                DELETE CONFIRMATION MODAL
            ================================================= */}
            {showDeleteModal && status === "DRAFT" && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-mn-navy-deep/60 px-5 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-poetry-title"
                >
                    <div className="w-full max-w-md rounded-3xl border border-mn-border bg-white p-7 shadow-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
                            Delete Poetry
                        </p>

                        <h2
                            id="delete-poetry-title"
                            className="mt-3 font-poetry text-3xl font-semibold text-mn-navy"
                        >
                            Are you sure?
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-mn-text-muted">
                            You are about to permanently
                            delete{" "}
                            <span className="font-semibold text-mn-navy">
                                “{poemTitle}”
                            </span>
                            . This action cannot be undone.
                        </p>

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowDeleteModal(false)
                                }
                                disabled={loading}
                                className="rounded-full border border-mn-border px-5 py-3 text-sm font-semibold text-mn-navy transition hover:bg-mn-cream disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleAction("DELETE")
                                }
                                disabled={loading}
                                className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Deleting..."
                                    : "Delete Poetry"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}