import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public: published news posts only.
export async function GET() {
  try {
    const posts = await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true, title: true, slug: true, category: true, excerpt: true,
        imageUrl: true, authorName: true, publishedAt: true, createdAt: true,
      },
    });
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("News GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
