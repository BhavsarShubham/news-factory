import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "@sveltejs/kit";

const prisma = new PrismaClient();

// Placeholder function to extract user ID from the request
const getUserIdFromRequest = (request: Request): number | null => {
  // Replace this with the actual implementation to extract user ID
  return 1;
};

export const GET: RequestHandler = async ({ request }) => {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, walletAddress: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ email: user.email, walletAddress: user.walletAddress }), { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return new Response(JSON.stringify({ error: "Error fetching user profile" }), { status: 500 });
  }
};
