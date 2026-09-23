import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const username = typeof body.username === "string" ? normalizeUsername(body.username) : "";

    if (!name || !username) {
      return NextResponse.json(
        {
          error: "Name and username are required.",
        },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      return NextResponse.json(
        {
          error: "Username can contain only lowercase letters, numbers and underscores.",
        },
        { status: 400 },
      );
    }

    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        {
          error: "Username must be between 3 and 30 characters.",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        { status: 401 },
      );
    }

    const existingAuthor = await prisma.author.findFirst({
      where: {
        OR: [
          {
            supabaseUserId: user.id,
          },
          {
            username,
          },
        ],
      },
    });

    if (existingAuthor) {
      if (existingAuthor.supabaseUserId === user.id) {
        return NextResponse.json({
          success: true,
          author: {
            id: existingAuthor.id,
            username: existingAuthor.username,
          },
        });
      }

      return NextResponse.json(
        {
          error: "This username is already taken.",
        },
        { status: 409 },
      );
    }

    const author = await prisma.author.create({
      data: {
        supabaseUserId: user.id,
        name,
        username,
      },
    });

    return NextResponse.json(
      {
        success: true,
        author: {
          id: author.id,
          name: author.name,
          username: author.username,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create author error:", error);

    return NextResponse.json(
      {
        error: "Unable to create author profile.",
      },
      { status: 500 },
    );
  }
}
