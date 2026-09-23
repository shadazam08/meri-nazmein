import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type PoemType = "NAZM" | "GHAZAL" | "SHAYARI" | "OTHER";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isPoemType(value: unknown): value is PoemType {
  return value === "NAZM" || value === "GHAZAL" || value === "SHAYARI" || value === "OTHER";
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

async function createUniquePoemSlug(baseSlug: string, poemId: string) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingPoem = await prisma.poem.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (!existingPoem || existingPoem.id === poemId) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Poetry ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const author = await getAuthenticatedAuthor();

    if (!author) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const existingPoem = await prisma.poem.findFirst({
      where: {
        id,
        authorId: author.id,
      },
    });

    if (!existingPoem) {
      return NextResponse.json(
        {
          error: "Poetry not found.",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    const action = typeof body.action === "string" ? body.action.trim() : "";

    /* =========================================================
       PUBLISH
       Only DRAFT can be published.
    ========================================================= */
    if (action === "PUBLISH") {
      if (existingPoem.status === "PUBLISHED") {
        return NextResponse.json(
          {
            error: "Published poetry is already locked.",
          },
          {
            status: 409,
          },
        );
      }

      const updatedPoem = await prisma.poem.update({
        where: {
          id: existingPoem.id,
        },
        data: {
          status: "PUBLISHED",
          publishedAt: existingPoem.publishedAt ?? new Date(),
        },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        poem: updatedPoem,
      });
    }

    /* =========================================================
       UNPUBLISH
       Completely disabled.
    ========================================================= */
    if (action === "UNPUBLISH") {
      return NextResponse.json(
        {
          error: "Published poetry cannot be unpublished.",
        },
        {
          status: 403,
        },
      );
    }

    /* =========================================================
       DELETE
       Only DRAFT can be deleted.
    ========================================================= */
    if (action === "DELETE") {
      if (existingPoem.status === "PUBLISHED") {
        return NextResponse.json(
          {
            error: "Published poetry cannot be deleted.",
          },
          {
            status: 403,
          },
        );
      }

      await prisma.poem.delete({
        where: {
          id: existingPoem.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Poetry deleted successfully.",
      });
    }

    /* =========================================================
       UPDATE
       Only DRAFT can be edited.
    ========================================================= */
    if (action === "UPDATE") {
      if (existingPoem.status === "PUBLISHED") {
        return NextResponse.json(
          {
            error: "Published poetry cannot be edited.",
          },
          {
            status: 403,
          },
        );
      }

      const title = typeof body.title === "string" ? body.title.trim() : "";

      const content = typeof body.content === "string" ? body.content.trim() : "";

      const category = typeof body.category === "string" ? body.category.trim() : "";

      const type = body.type;

      if (!title) {
        return NextResponse.json(
          {
            error: "Poetry title is required.",
          },
          {
            status: 400,
          },
        );
      }

      if (!content) {
        return NextResponse.json(
          {
            error: "Poetry content is required.",
          },
          {
            status: 400,
          },
        );
      }

      if (!isPoemType(type)) {
        return NextResponse.json(
          {
            error: "Invalid poetry type.",
          },
          {
            status: 400,
          },
        );
      }

      const baseSlug = createSlug(title);

      if (!baseSlug) {
        return NextResponse.json(
          {
            error: "A valid URL slug could not be generated from the title.",
          },
          {
            status: 400,
          },
        );
      }

      const slug = await createUniquePoemSlug(baseSlug, existingPoem.id);

      let categoryId: string | null = null;

      if (category) {
        const categorySlug = createSlug(category);

        if (!categorySlug) {
          return NextResponse.json(
            {
              error: "Invalid category name.",
            },
            {
              status: 400,
            },
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

      const updatedPoem = await prisma.poem.update({
        where: {
          id: existingPoem.id,
        },
        data: {
          title,
          slug,
          content,
          type,
          categoryId,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          type: true,
          status: true,
          publishedAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        poem: updatedPoem,
      });
    }

    /* =========================================================
       INVALID ACTION
    ========================================================= */
    return NextResponse.json(
      {
        error: "Invalid action.",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    console.error("Manage author poem error:", error);

    return NextResponse.json(
      {
        error: "Unable to manage poetry.",
      },
      {
        status: 500,
      },
    );
  }
}
