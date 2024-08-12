import NeucronSDK from 'neucron-sdk';
import prisma from './database';

export const actions = {
  login: async ({ request }: { request: Request }) => {
    try {
      const data = await request.formData();
      console.log('Form Data:', Object.fromEntries(data.entries()));

      const neucron = new NeucronSDK();
      const authModule = neucron.authentication;
      const walletModule = neucron.wallet;

      const loginResponse = await authModule.login({
        email: data.get('email') as string,
        password: data.get('password') as string
      });
      console.log('Login Response:', loginResponse);

      const accessToken = loginResponse.data.access_token; // Store the access_token

      const DefaultWalletBalance = await walletModule.getWalletBalance({});
      console.log('Wallet Balance:', DefaultWalletBalance);

      const addresses = await walletModule.getAddressesByWalletId({});
      console.log('Wallet Addresses:', addresses);

      const user = await prisma.user.upsert({
        where: { email: data.get('email') as string },
        update: {
          password: data.get('password') as string,
          walletAddress: addresses.data.addresses[0] as string,
          accessToken: accessToken // Save accessToken to the database
        },
        create: {
          email: data.get('email') as string,
          password: data.get('password') as string,
          walletAddress: addresses.data.addresses[0] as string,
          accessToken: accessToken // Save accessToken to the database
        }
      });
      console.log('User:', user);

      // Print the access_token in the console
      console.log('Access Token:', accessToken);

      // Return the necessary data in the response
      return {
        success: true,
        token: accessToken,
        address: addresses.data.addresses[0],
        balance: DefaultWalletBalance.data.balance.summary
      };
      
    } catch (err) {
      console.error('Error:', err);
      return { success: false, error: 'An error occurred' };
    }
  },
};
