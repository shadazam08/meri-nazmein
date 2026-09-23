import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthorPageHeader } from "@/components/author/author-page-header";
import { AuthorProfileForm } from "@/components/author/author-profile-form";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
    title: "Edit Profile",
    description:
        "Manage your Meri Nazmein author profile and account security.",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function AuthorProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/author/login");
    }

    const author = await prisma.author.findUnique({
        where: {
            supabaseUserId: user.id,
        },
        select: {
            name: true,
            penName: true,
            username: true,
            bio: true,
            avatarUrl: true,
        },
    });

    if (!author) {
        redirect("/author/signup");
    }

    return (
        <main className="min-h-[calc(100vh-88px)] bg-[#F7F4EC]">
            <AuthorPageHeader
                title="Edit Profile"
                description="Apni author identity, public profile aur account security ko manage kijiye."
                actionLabel="My Poetry"
                actionHref="/author/poems"
                backLabel="Back to Dashboard"
                backHref="/author/dashboard"
            />

            <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-9">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <Link
                        href={`/authors/${author.username}`}
                        className="text-sm font-semibold text-mn-blue transition hover:text-mn-gold-dark"
                    >
                        View Public Profile →
                    </Link>
                </div>

                <AuthorProfileForm
                    profile={{
                        name: author.name,
                        penName: author.penName,
                        username: author.username,
                        bio: author.bio,
                        avatarUrl: author.avatarUrl,
                        email: user.email ?? "",
                    }}
                />
            </section>
        </main>
    );
}