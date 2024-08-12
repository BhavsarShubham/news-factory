<script lang="ts">
  import { slide } from 'svelte/transition';

  export let form: { success?: boolean; balance?: number; address?: string; token?: string };
  if (typeof window !== 'undefined' && form?.success && form.token) {
  localStorage.setItem('token', form.token);
  console.log("Token stored in local storage:", localStorage.getItem('token'));
  window.location.href = "/dashboard";  // Redirect to the dashboard page
}


  let showLogin = true;

  function toggleForm() {
    showLogin = !showLogin;
  }
</script>

<!-- Your HTML structure -->
<div class="min-h-screen flex flex-col items-center justify-center space-y-10 bg-gray-900 text-white">
  <div class="w-full max-w-md p-8 bg-gray-800 rounded-lg ring-2 ring-gray-700">
    {#if showLogin}
      <h2 class="text-2xl font-bold mb-6 text-center" transition:slide>Login</h2>
      <form method="POST" action="?/login" class="space-y-6" transition:slide>
        <div>
          <label for="paymail" class="block text-sm font-medium">Paymail</label>
          <input type="text" id="paymail" name="email" placeholder="Enter Paymail" class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter Password" class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
        <div>
          <button type="submit" class="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">Log In</button>
        </div>
      </form>
      <p class="mt-4 text-center">Don't have an account? <a href="javascript:void(0)" class="text-primary-500 hover:text-primary-700" on:click={toggleForm}>Sign Up</a></p>
    {/if}
    {#if !showLogin}
      <h2 class="text-2xl font-bold mb-6 text-center" transition:slide>Sign Up</h2>
      <form method="POST" action="?/signup" class="space-y-6" transition:slide>
        <div>
          <label for="paymail" class="block text-sm font-medium">Paymail</label>
          <input type="text" id="paymail" name="email" placeholder="Enter Paymail" class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter Password" class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
        <div>
          <button type="submit" class="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">Sign Up</button>
        </div>
      </form>
      <p class="mt-4 text-center">Already have an account? <a href="javascript:void(0)" class="text-primary-500 hover:text-primary-700" on:click={toggleForm}>Log In</a></p>
    {/if}
    {#if form?.success}
      <p class="pt-2 text-green-500">Logged In. Your Balance is {form?.balance}</p>
      <p class="pt-2 text-green-500">Your Address is {form?.address}</p>
    {/if}
  </div>
</div>
