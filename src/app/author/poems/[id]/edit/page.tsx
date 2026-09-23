import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

import EditPoetryForm from "./edit-poetry-form";

export const metadata: Metadata = {
    title: "Edit Poetry",
    description: "Edit your poetry on Meri Nazmein.",
    robots: {
        index: false,
        follow: false,
    },
};

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditPoetryPage({
    params,
}: PageProps) {
    const { id } = await params;

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
            id: true,
        },
    });

    if (!author) {
        redirect("/author/signup");
    }

    const poem = await prisma.poem.findFirst({
        where: {
            id,
            authorId: author.id,
        },
        include: {
            category: {
                select: {
                    name: true,
                },
            },
        },
    });

    if (!poem) {
        notFound();
    }

    return (
        <EditPoetryForm
            poem={{
                id: poem.id,
                title: poem.title,
                slug: poem.slug,
                content: poem.content,
                type: poem.type,
                status: poem.status,
                category: poem.category?.name ?? "",
            }}
        />
    );
}