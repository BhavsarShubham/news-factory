import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import NeucronSDK from 'neucron-sdk'; // Import Neucron SDK
import type { RequestHandler } from "@sveltejs/kit";


// TypeScript interface for the request body in POST requests
interface NewsArticlePayload {
  title: string;
  content: string;
  category: string;
  image?: string;
  userWallet: string;
}

// GET request handler
export const GET: RequestHandler = async ({ url }) => {
  try {
    const category = url.searchParams.get('category');
    const date = url.searchParams.get('date');
    const popularity = url.searchParams.get('popularity');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');

    let whereClause: any = {};

    if (category) whereClause.category = { name: category };
    if (date) whereClause.createdAt = { gte: new Date(date) };
    if (popularity) whereClause.popularity = popularity;

    const newsArticles = await prisma.newsArticle.findMany({
      where: whereClause,
      include: { category: true, comments: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    return new Response(JSON.stringify(newsArticles), { status: 200 });
  } catch (error) {
    console.error("Error fetching news:", error);
    return new Response(JSON.stringify({ error: "Error fetching news" }), { status: 500 });
  }
};
const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret';
// Middleware to verify JWT token
async function verifyJWT(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return (decoded as any).email;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}

// POST request handler
export const POST: RequestHandler = async ({ request }) => {
  try {
    const email = await verifyJWT(request);
    if (!email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { title, content, category, image, userWallet }: NewsArticlePayload = await request.json();

    if (!title || !content || !category || !userWallet) {
      return new Response(JSON.stringify({ error: "Title, content, category, and user wallet are required." }), { status: 400 });
    }

    let categoryRecord = await prisma.category.findUnique({ where: { name: category } });
    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({ data: { name: category } });
    }

    const newArticle = await prisma.newsArticle.create({
      data: {
        title,
        content,
        image: image || null,
        category: { connect: { id: categoryRecord.id } },
        likes: 0,
        createdAt: new Date(),
        comments: { create: [] },
        commentsCount: 0,
        userWallet,
      },
    });

    // Example of making a raw HTTP request if the SDK doesn't support it directly
    const transactionData = {
      walletId: userWallet,
      data: `Article ID: ${newArticle.id}`,
      metadata: `Published news article with title: ${title}`,
    };

    const neucron = new NeucronSDK();
    const transactionModule = neucron.transactionModule || neucron.transaction;

    if (transactionModule && typeof transactionModule.createTransaction === 'function') {
      const transactionResponse = await transactionModule.createTransaction(transactionData);
      const transactionLink = transactionResponse.data.transactionLink;

      // Return the news article with the blockchain transaction link
      return new Response(JSON.stringify({ ...newArticle, transactionLink }), { status: 201 });
    } else {
      // Fallback: Handle it manually or log a more detailed error
      console.error("Transaction module or createTransaction method not found.");
      // You can use this section to make a manual HTTP request to the blockchain, if needed.
      // const transactionLink = await createTransactionManually(transactionData);
      return new Response(JSON.stringify({ ...newArticle, transactionLink: "Transaction failed: Manual step needed" }), { status: 201 });
    }
  } catch (error) {
    console.error("Error creating news article:", error);
    return new Response(JSON.stringify({ error: `Error creating news article: ${error.message}` }), { status: 500 });
  }
};
