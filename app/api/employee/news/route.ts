import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContentManagerSession } from "@/lib/employeeAuth";
import { slugify } from "@/lib/slug";

// List all posts (incl. drafts) for management — staff only.
export async function GET() {
  try {
    const guard = await requireContentManagerSession();
    if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

    const posts = await prisma.newsPost.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Employee news GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  let slug = slugify(base);
  let n = 1;
  // Ensure uniqueness
  while (true) {
    const existing = await prisma.newsPost.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const guard = await requireContentManagerSession();
    if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

    const { title, category, excerpt, content, imageUrl, published } = body;
    if (!title || !content) {
      return NextResponse.json({ success: false, message: "Title and content are required." }, { status: 400 });
    }

    const post = await prisma.newsPost.create({
      data: {
        title: String(title).trim(),
        slug: await uniqueSlug(title),
        category: category ? String(category) : "Announcement",
        excerpt: excerpt ? String(excerpt) : null,
        body: String(content),
        imageUrl: imageUrl ? String(imageUrl) : null,
        published: published === true,
        publishedAt: published === true ? new Date() : null,
        authorName: guard.employee.name,
      },
    });
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Employee news POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const guard = await requireContentManagerSession();
    if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

    const { id, title, category, excerpt, content, imageUrl, published } = body;
    if (!id) return NextResponse.json({ success: false, message: "Post id required." }, { status: 400 });

    const current = await prisma.newsPost.findUnique({ where: { id: Number(id) } });
    if (!current) return NextResponse.json({ success: false, message: "Post not found." }, { status: 404 });

    const nowPublished = published === true;
    const post = await prisma.newsPost.update({
      where: { id: Number(id) },
      data: {
        title: title ? String(title).trim() : current.title,
        slug: title && title !== current.title ? await uniqueSlug(title, current.id) : current.slug,
        category: category ?? current.category,
        excerpt: excerpt !== undefined ? excerpt : current.excerpt,
        body: content ?? current.body,
        imageUrl: imageUrl !== undefined ? imageUrl : current.imageUrl,
        published: nowPublished,
        // set publishedAt the first time it goes live
        publishedAt: nowPublished ? current.publishedAt ?? new Date() : null,
      },
    });
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Employee news PUT error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const guard = await requireContentManagerSession();
    if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

    if (!body.id) return NextResponse.json({ success: false, message: "Post id required." }, { status: 400 });
    await prisma.newsPost.delete({ where: { id: Number(body.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Employee news DELETE error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
