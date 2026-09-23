import { prisma } from "@/lib/prisma";

export type PublicPoetryType = "NAZM" | "GHAZAL" | "SHAYARI";

export async function getPublishedPoem(slug: string, type: PublicPoetryType) {
  return prisma.poem.findFirst({
    where: {
      slug,
      type,
      status: "PUBLISHED",
    },
    include: {
      author: {
        select: {
          name: true,
          penName: true,
          username: true,
          bio: true,
          avatarUrl: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });
}

export function getPoetryCollection(type: PublicPoetryType) {
  switch (type) {
    case "NAZM":
      return {
        label: "Nazm",
        pluralLabel: "Nazmein",
        href: "/nazmein",
      };

    case "GHAZAL":
      return {
        label: "Ghazal",
        pluralLabel: "Ghazals",
        href: "/ghazals",
      };

    case "SHAYARI":
      return {
        label: "Shayari",
        pluralLabel: "Shayari",
        href: "/shayari",
      };
  }
}
