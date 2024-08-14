import { json } from '@sveltejs/kit';
import NeucronSDK from 'neucron-sdk';
import { PrismaClient } from '@prisma/client';

const neucron = new NeucronSDK();
const prisma = new PrismaClient();
const PAYMAIL_ADDRESS = '1DSwTcaF7XtuqwU6zytAqijVaxyDz7h58i';

export async function POST({ request }: { request: Request }) {
  try {
    // Read the form data
    const data = await request.formData();
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const amount = parseInt(data.get('amount') as string);
    const newsDataStr = data.get('newsData') as string;
    
    if (!newsDataStr) {
      return json({ success: false, error: 'Missing news data' });
    }

    const newsData = JSON.parse(newsDataStr);

    console.log('Received newsData:', newsData);

    // Authenticate using NeucronSDK
    const loginResponse = await neucron.authentication.login({ email, password });
    if (loginResponse.error) {
      return json({ success: false, error: `Authentication failed: ${loginResponse.error.message}` });
    }

    // Prepare payment options
    const options = {
      outputs: [
        {
          address: PAYMAIL_ADDRESS,
          note: '',
          amount: amount
        }
      ]
    };

    // Perform payment
    const payResponse = await neucron.pay.txSpend(options);
    console.log('Payment response:', payResponse);
    const transactionId = payResponse.data?.txid;

    if (!transactionId) {
      return json({ success: false, error: 'Transaction ID not found in payment response.' });
    }

    // Check if category exists or create it
    let category = await prisma.category.findUnique({
      where: { name: newsData.category }
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: newsData.category }
      });
    }

    // Log data before saving
    console.log('Saving news article with transaction ID:', {
      title: newsData.title,
      content: newsData.content,
      categoryId: category.id,
      image: newsData.image,
      userWallet: newsData.userWallet,
      transactionId: transactionId,
    });

    // Save news article to the database
    await prisma.newsArticle.create({
      data: {
        title: newsData.title,
        content: newsData.content,
        categoryId: category.id,
        image: newsData.image || null,
        userWallet: newsData.userWallet,
        txId: transactionId, // Ensure this matches the schema
      },
    });

    return json({ success: true, transactionId });

  } catch (err) {
    console.error('Payment processing error:', err);
    return json({ success: false, error: `An error occurred: ${err.message}` });
  }
}
