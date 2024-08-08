import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "@sveltejs/kit";

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
  try {
    const trendingNews = await prisma.newsArticle.findMany({
      orderBy: { commentCount: 'desc' }, // Use comments field if it's for count
      take: 5
    });

    return new Response(JSON.stringify(trendingNews), { status: 200 });
  } catch (error) {
    console.error("Error fetching trending news:", error);
    return new Response(JSON.stringify({ error: "Error fetching trending news" }), { status: 500 });
  }
};
