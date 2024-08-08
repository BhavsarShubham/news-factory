<script>
  import { onMount } from 'svelte';

  // User profile data
  let email = '';
  let walletAddress = '';
  let profileErrorMessage = '';

  // News articles data
  let newsArticles = [];
  let newsErrorMessage = '';

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        email = data.email;
        walletAddress = data.walletAddress;
      } else {
        const errorData = await response.json();
        profileErrorMessage = errorData.error || 'Failed to fetch user profile';
      }
    } catch (error) {
      profileErrorMessage = 'Error fetching user profile';
      console.error('Error:', error);
    }
  };

  // Fetch previous day's news
  const fetchPreviousDayNews = async () => {
    try {
      const response = await fetch('/api/previous-day-news');
      if (response.ok) {
        newsArticles = await response.json();
      } else {
        const errorData = await response.json();
        newsErrorMessage = errorData.error || 'Failed to fetch news articles';
      }
    } catch (error) {
      newsErrorMessage = 'Error fetching news articles';
      console.error('Error:', error);
    }
  };

  // Load data on mount
  onMount(async () => {
    await fetchUserProfile();
    await fetchPreviousDayNews();
  });
</script>

<div class="flex h-screen bg-gray-200">
  <!-- Sidebar -->
  <div class="fixed inset-y-0 left-0 w-60 bg-white text-gray-900 -transform transform lg:transform-none lg:static z-30">
    <div class="flex items-center justify-center h-16 bg-gray-100 border-b border-gray-300">
      <h1 class="block py-2.5 px-10 font-bold text-gray-900">Profile</h1>
    </div>
    <nav class="mt-4">
      <a class="flex items-center justify-center h-12 text-gray-700 hover:bg-gray-100 hover:text-blue-700" href="/profile">Profile</a>
      <a class="flex items-center justify-center h-12 text-gray-700 hover:bg-gray-100 hover:text-blue-700" href="/">Account Settings</a>
      <a class="flex items-center justify-center h-12 text-gray-700 hover:bg-gray-100 hover:text-blue-700" href="/">Subscription Preferences</a>
    </nav>
  </div>

  <!-- Main content -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="flex items-center justify-between p-6 bg-gray-100 border-b border-gray-300">
      <h1 class="text-2xl font-bold text-gray-700">User Profile</h1>
    </header>

    <!-- Main content area -->
    <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
      <div class="container mx-auto px-4">
        <!-- Error message for profile -->
        {#if profileErrorMessage}
          <p class="text-red-600 dark:text-red-400">{profileErrorMessage}</p>
        {/if}

        <!-- User Information -->
        <section class="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
          <h2 class="text-2xl font-semibold mb-4 text-gray-900">User Information</h2>
          <div class="flex items-center space-x-4">
            <img src="https://t4.ftcdn.net/jpg/04/83/90/95/360_F_483909569_OI4LKNeFgHwvvVju60fejLd9gj43dIcd.jpg" alt="Profile picture of {email}" class="w-24 h-24 rounded-full border border-gray-300">
            <div>
              <p class="text-lg font-semibold text-gray-900">{email}</p>
            </div>
          </div>
          <h2 class="text-2xl font-semibold mb-4 text-gray-900">Connected Wallet Details</h2>
          <ul class="space-y-4">
            <li class="flex justify-between text-gray-700">
              <span>Wallet Address:</span>
              <span>{walletAddress}</span>
            </li>
          </ul>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      

          <!-- Recent News -->
          <section class="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900">Recent News</h2>
            
            {#if newsErrorMessage}
              <p class="text-red-600">{newsErrorMessage}</p>
            {:else if newsArticles.length === 0}
              <p class="text-lg font-medium text-gray-600">No recent news available.</p>
            {:else}
              {#each newsArticles as article}
                <div class="p-4 mb-4 bg-gray-100 rounded-lg shadow-md">
                  <h3 class="text-xl font-bold text-gray-800">{article.title}</h3>
                  <p class="text-gray-700">{article.content}</p>
                  {#if article.image}
                    <img src={article.image} alt={article.title} class="w-full h-auto mt-2 rounded-lg"/>
                  {/if}
                  <div class="mt-4 text-sm text-gray-600">
                    <span>Published by: {article.userEmail || 'Anonymous'}</span>
                    <span class="ml-4">Category: {article.category.name}</span>
                  </div>
                </div>
              {/each}
            {/if}
          </section>
        </div>
      </div>
    </main>
  </div>
</div>

<style>
  .bg-gray-200 {
    background-color: #e2e8f0;
  }

  .bg-gray-100 {
    background-color: #f7fafc;
  }

  .bg-white {
    background-color: #fff;
  }

  .border-gray-200 {
    border-color: #edf2f7;
  }

  .border-gray-300 {
    border-color: #e2e8f0;
  }

  .text-gray-700 {
    color: #4a5568;
  }

  .text-gray-900 {
    color: #1a202c;
  }

  .text-red-600 {
    color: #e53e3e;
  }

  .rounded-lg {
    border-radius: 0.5rem;
  }

  .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
</style>
