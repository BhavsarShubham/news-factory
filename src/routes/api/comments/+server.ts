import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "@sveltejs/kit";

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, params }) => {
  try {
    const { content } = await request.json();
    const articleId = parseInt(params.id || '');

    if (isNaN(articleId)) {
      return new Response(JSON.stringify({ error: "Invalid article ID." }), { status: 400 });
    }

    if (!content) {
      return new Response(JSON.stringify({ error: "Content is required." }), { status: 400 });
    }

    // Create the comment
    const newComment = await prisma.comment.create({
      data: {
        newsArticleId: articleId,
        content: content,
        author: 'Anonymous',  // Modify this to fetch the actual user if available
        createdAt: new Date()
      }
    });

    // Increment comments count for the article
    await prisma.newsArticle.update({
      where: { id: articleId },
      data: {
        commentCount: { increment: 1 }  // Ensure comments field is an integer
      }
    });

    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return new Response(JSON.stringify({ error: "Error adding comment" }), { status: 500 });
  }
};

export const GET: RequestHandler = async () => {
  try {
    const recentComments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return new Response(JSON.stringify(recentComments), { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new Response(JSON.stringify({ error: "Error fetching comments" }), { status: 500 });
  }
};
