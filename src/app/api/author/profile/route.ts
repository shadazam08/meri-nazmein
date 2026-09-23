import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

function isValidUsername(username: string) {
  return /^[a-z0-9_]{3,30}$/.test(username);
}

function isValidAvatarUrl(value: string, supabaseUserId: string) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      return false;
    }

    if (url.hostname !== "hebbdjsusuqmauicoenx.supabase.co") {
      return false;
    }

    const expectedPath = `/storage/v1/object/public/avatars/${supabaseUserId}/avatar`;

    return url.pathname === expectedPath;
  } catch {
    return false;
  }
}

async function getAuthenticatedAuthor() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const author = await prisma.author.findUnique({
    where: {
      supabaseUserId: user.id,
    },
  });

  if (!author) {
    return null;
  }

  return {
    user,
    author,
  };
}

export async function GET() {
  try {
    const authenticated = await getAuthenticatedAuthor();

    if (!authenticated) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const { user, author } = authenticated;

    return NextResponse.json({
      success: true,
      profile: {
        id: author.id,
        name: author.name,
        penName: author.penName,
        username: author.username,
        bio: author.bio,
        avatarUrl: author.avatarUrl,
        email: user.email ?? "",
        createdAt: author.createdAt,
      },
    });
  } catch (error) {
    console.error("Get author profile error:", error);

    return NextResponse.json(
      {
        error: "Unable to fetch your profile.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const authenticated = await getAuthenticatedAuthor();

    if (!authenticated) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const { author } = authenticated;

    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";

    const penName = typeof body.penName === "string" ? body.penName.trim() : "";

    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";

    const bio = typeof body.bio === "string" ? body.bio.trim() : "";

    const avatarUrl = typeof body.avatarUrl === "string" ? body.avatarUrl.trim() : "";

    /* =====================================================
           NAME
        ===================================================== */

    if (!name) {
      return NextResponse.json(
        {
          error: "Name is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          error: "Name must contain at least 2 characters.",
        },
        {
          status: 400,
        },
      );
    }

    if (name.length > 80) {
      return NextResponse.json(
        {
          error: "Name must be 80 characters or less.",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
           PEN NAME
        ===================================================== */

    if (penName.length > 80) {
      return NextResponse.json(
        {
          error: "Pen name must be 80 characters or less.",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
           USERNAME
        ===================================================== */

    if (!username) {
      return NextResponse.json(
        {
          error: "Username is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidUsername(username)) {
      return NextResponse.json(
        {
          error: "Username can contain only lowercase letters, numbers and underscores, with 3–30 characters.",
        },
        {
          status: 400,
        },
      );
    }

    const usernameOwner = await prisma.author.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (usernameOwner && usernameOwner.id !== author.id) {
      return NextResponse.json(
        {
          error: "This username is already in use.",
        },
        {
          status: 409,
        },
      );
    }

    /* =====================================================
           BIO
        ===================================================== */

    if (bio.length > 500) {
      return NextResponse.json(
        {
          error: "Bio must be 500 characters or less.",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
           AVATAR
        ===================================================== */

    if (avatarUrl.length > 700) {
      return NextResponse.json(
        {
          error: "Avatar URL is too long.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidAvatarUrl(avatarUrl, author.supabaseUserId)) {
      return NextResponse.json(
        {
          error: "Invalid avatar image.",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
           UPDATE AUTHOR
        ===================================================== */

    const updatedAuthor = await prisma.author.update({
      where: {
        id: author.id,
      },
      data: {
        name,
        penName: penName || null,
        username,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      },
      select: {
        id: true,
        name: true,
        penName: true,
        username: true,
        bio: true,
        avatarUrl: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      profile: updatedAuthor,
    });
  } catch (error) {
    console.error("Update author profile error:", error);

    return NextResponse.json(
      {
        error: "Unable to update your profile.",
      },
      {
        status: 500,
      },
    );
  }
}
