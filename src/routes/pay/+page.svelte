<script lang="ts">
    import { onMount } from 'svelte';
    let email = '';
    let amount = 10; // Hardcoded amount for now
    let password = '';
    let responseMessage = '';
  
    async function handlePayment() {
      const response = await fetch('/api/payments', {
        method: 'POST',
        body: new URLSearchParams({
          email,
          amount: amount.toString(),
          password // Include password in the request
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
  
      const result = await response.json();
      responseMessage = result.success
        ? `Payment successful. Transaction ID: ${result.transactionId}`
        : `Payment failed: ${result.error}`;
    }
  </script>
  
  <style>
    .payment-form {
      background: #1e293b; /* Darker background for better contrast */
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .payment-form h2 {
      color: #fef9c3; /* Light yellow text */
    }
    .payment-form input {
      background: #334155; /* Slightly lighter background */
      border-color: #4b5563; /* Gray border */
    }
    .payment-form button {
      background: #3b82f6; /* Bright blue button */
      border: none;
      color: #ffffff;
    }
    .payment-form button:hover {
      background: #2563eb; /* Darker blue on hover */
    }
    .response-message {
      color: #d1fae5; /* Light green for success */
    }
  </style>
  
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="payment-form max-w-md w-full p-6">
      <h2 class="text-2xl font-bold mb-6 text-center">Make a Payment</h2>
      <form on:submit|preventDefault={handlePayment} class="space-y-5">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-200">Email</label>
          <input type="text" id="email" name="email" bind:value={email} placeholder="Enter your email" class="mt-1 block w-full px-4 py-3 rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-200">Password</label>
          <input type="password" id="password" name="password" bind:value={password} placeholder="Enter your password" class="mt-1 block w-full px-4 py-3 rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-200">Amount (Satoshis)</label>
          <input type="number" id="amount" name="amount" bind:value={amount} placeholder="Enter amount" class="mt-1 block w-full px-4 py-3 rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div>
          <button type="submit" class="w-full py-3 px-4 rounded-md text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Pay</button>
        </div>
      </form>
      {#if responseMessage}
        <p class="mt-4 text-center response-message">{responseMessage}</p>
      {/if}
    </div>
  </div>
  