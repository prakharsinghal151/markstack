import db from "@/lib/database";

export async function GET() {
  try {
    const blogs = await db.blog.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        title: true,
        description: true,
        slug: true,
        readTime: true,
        createdAt: true,
        coverImage: true,
      },
    });

    return Response.json(blogs);
  } catch (error) {
    return Response.json([], { status: 200 });
  }
}
