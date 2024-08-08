import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "@sveltejs/kit";

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
  try {
    const today = new Date();
    const yesterdayStart = new Date(today);
    yesterdayStart.setDate(today.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdayEnd = new Date(yesterdayStart);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const newsArticles = await prisma.newsArticle.findMany({
      where: {
        createdAt: {
          gte: yesterdayStart,
          lt: today, // Assuming you want to include articles until today
        },
      },
      include: { category: true, comments: true },
      orderBy: { createdAt: 'desc' },
    });

    return new Response(JSON.stringify(newsArticles), { status: 200 });
  } catch (error) {
    console.error("Error fetching previous day's news:", error);
    return new Response(JSON.stringify({ error: "Error fetching previous day's news" }), { status: 500 });
  }
};
