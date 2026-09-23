import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function createUniquePoemSlug(baseSlug: string) {
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.poem.findUnique({ where: { slug } })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

async function getAuthenticatedAuthor() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const author = await prisma.author.findUnique({
    where: {
      supabaseUserId: user.id,
    },
  });

  return author;
}

export async function GET() {
  try {
    const author = await getAuthenticatedAuthor();

    if (!author) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        { status: 401 },
      );
    }

    const poems = await prisma.poem.findMany({
      where: {
        authorId: author.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      poems,
    });
  } catch (error) {
    console.error("Get author poems error:", error);

    return NextResponse.json(
      {
        error: "Unable to fetch your poetry.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";

    const content = typeof body.content === "string" ? body.content.trim() : "";

    const category = typeof body.category === "string" ? body.category.trim() : "";

    const type = typeof body.type === "string" ? body.type : "";

    if (!title) {
      return NextResponse.json(
        {
          error: "Poetry title is required.",
        },
        { status: 400 },
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          error: "Poetry content is required.",
        },
        { status: 400 },
      );
    }

    if (!["NAZM", "GHAZAL", "SHAYARI", "OTHER"].includes(type)) {
      return NextResponse.json(
        {
          error: "Invalid poetry type.",
        },
        { status: 400 },
      );
    }

    const baseSlug = createSlug(title);

    if (!baseSlug) {
      return NextResponse.json(
        {
          error: "A valid URL slug could not be generated from the title.",
        },
        { status: 400 },
      );
    }

    const author = await getAuthenticatedAuthor();

    if (!author) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        { status: 401 },
      );
    }

    /*
     * CREATE API ALWAYS CREATES A DRAFT.
     *
     * Publishing happens later through:
     *
     * PATCH /api/author/poems/[id]
     * action: "PUBLISH"
     *
     * This prevents direct creation of a published poem.
     */
    const slug = await createUniquePoemSlug(baseSlug);

    let categoryId: string | null = null;

    if (category) {
      const categorySlug = createSlug(category);

      if (!categorySlug) {
        return NextResponse.json(
          {
            error: "Invalid category name.",
          },
          { status: 400 },
        );
      }

      const existingCategory = await prisma.category.findUnique({
        where: {
          slug: categorySlug,
        },
      });

      const poemCategory =
        existingCategory ??
        (await prisma.category.create({
          data: {
            name: category,
            slug: categorySlug,
          },
        }));

      categoryId = poemCategory.id;
    }

    const poem = await prisma.poem.create({
      data: {
        title,
        slug,
        content,
        type: type as "NAZM" | "GHAZAL" | "SHAYARI" | "OTHER",

        // IMPORTANT:
        // New poetry is ALWAYS created as DRAFT.
        status: "DRAFT",

        publishedAt: null,

        authorId: author.id,
        categoryId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        poem: {
          id: poem.id,
          title: poem.title,
          slug: poem.slug,
          status: poem.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create poem error:", error);

    return NextResponse.json(
      {
        error: "Unable to create poetry.",
      },
      { status: 500 },
    );
  }
}
