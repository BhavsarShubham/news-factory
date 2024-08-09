import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import axios from 'axios'; 
import type { RequestHandler } from "@sveltejs/kit";

const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret'; 
const BLOCKCHAIN_API_URL = 'https://api.whatsonchain.com/v1/bsv/main/tx/hash/'; 
interface NewsArticlePayload {
  title: string;
  content: string;
  category: string;
  image?: string;
  userWallet: string;
}

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

    // Prepare the data for blockchain transaction
    const transactionData = {
      walletId: userWallet,
      data: `Article ID: ${newArticle.id}`,
      metadata: `Published news article with title: ${title}`,
    };

    // Push the data to the blockchain via API
    try {
      const response = await axios.post(BLOCKCHAIN_API_URL, transactionData, {
        headers: { 'Authorization': `Bearer ${request.headers.get('Authorization')}` }
      });
      const transactionLink = response.data.transactionLink || "Transaction link not available";

      return new Response(JSON.stringify({ ...newArticle, transactionLink }), { status: 201 });
    } catch (transactionError) {
      console.error("Error creating transaction:", transactionError);
      return new Response(JSON.stringify({ ...newArticle, transactionLink: "Transaction failed: " + transactionError }), { status: 201 });
    }

  } catch (error) {
    console.error("Error creating news article:", error);
    return new Response(JSON.stringify({ error: `Error creating news article: ${error}` }), { status: 500 });
  }
};
