import { json } from '@sveltejs/kit';
import NeucronSDK from 'neucron-sdk';

const neucron = new NeucronSDK();
const PAYMAIL_ADDRESS = '1DSwTcaF7XtuqwU6zytAqijVaxyDz7h58i';

export async function POST({ request }: { request: Request }) {
  try {
    const data = await request.formData();
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const amount = parseInt(data.get('amount') as string);
    console.log('Form Data:', data);

    // Authenticate using NeucronSDK
    const loginResponse = await neucron.authentication.login({ email, password });
    console.log('Login Response:', loginResponse);

    if (loginResponse.error) {
      console.error('Authentication Error:', loginResponse.error);
      return json({ success: false, error: `Authentication failed: ${loginResponse.error.message}` });
    }

    // Get the default wallet balance
    const DefaultWalletBalance = await neucron.wallet.getWalletBalance({});
    console.log('Wallet Balance:', DefaultWalletBalance);

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
    try {
      const payResponse = await neucron.pay.txSpend(options);
      console.log('Payment Response:', payResponse);

      const transactionId = payResponse.data?.txid; // Use the correct key 'txid'
      if (transactionId) {
        console.log('Payment Details:', {
          email,
          amount,
          transactionId
        });
        return json({
          success: true,
          transactionId
        });
      } else {
        console.error('Transaction ID not found in payment response.');
        return json({ success: false, error: 'Transaction ID not found in payment response.' });
      }
    } catch (payError) {
      console.error('Payment Error Details:', payError.response ? payError.response.data : payError);
      return json({ success: false, error: `Payment request failed: ${payError.message}` });
    }
    
  } catch (err) {
    console.error('Error:', err);
    return json({ success: false, error: 'An error occurred' });
  }
}
