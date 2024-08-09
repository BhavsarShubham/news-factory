import jwt from 'jsonwebtoken';
import NeucronSDK from 'neucron-sdk';
import prisma from './database';

const JWT_SECRET = 'your_jwt_secret';

export const actions = {
  login: async ({ request }: { request: Request }) => {
    const data = await request.formData();

    const neucron = new NeucronSDK();
    const authModule = neucron.authentication;
    const walletModule = neucron.wallet;

    const loginResponse = await authModule.login({
      email: data.get('email') as string,
      password: data.get('password') as string
    });

    const DefaultWalletBalance = await walletModule.getWalletBalance({});
    const addresses = await walletModule.getAddressesByWalletId({});

    try {
      const user = await prisma.user.upsert({
        where: { email: data.get('email') as string },
        update: {
          password: data.get('password') as string,
          walletAddress: addresses.data.addresses[0] as string
        },
        create: {
          email: data.get('email') as string,
          password: data.get('password') as string,
          walletAddress: addresses.data.addresses[0] as string
        }
      });

      // Generate JWT token
      const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      console.log(token)

      // Send the token to the client in the response
      return {

        success: true,
        token, // Send token to be handled on the client side
        address: addresses.data.addresses[0],
        balance: DefaultWalletBalance.data.balance.summary
      };
      
    } catch (err) {
      console.error('Database error:', err);
      return { success: false, error: 'Database error' };
    }
  },
};
console.log(actions.login)