<script lang="ts">
  import { onMount } from 'svelte';

  interface Category {
    name: string;
  }

  interface NewsArticle {
    title: string;
    content: string;
    image?: string;
    userEmail?: string;
    category: Category;
    popularity?: string;
    txId?: string; // Include txId field
  }

  let recentNews: NewsArticle[] = [];
  let popularNews: NewsArticle[] = [];
  let errorMessage = '';
  let isLoading = true;
  let selectedCategory = '';

  async function fetchNews() {
    isLoading = true;
    errorMessage = '';
    try {
      let query = '/api/news';
      if (selectedCategory) {
        query += `?category=${selectedCategory}`;
      }
      const response = await fetch(query);
      if (response.ok) {
        const news = await response.json();
        recentNews = news.slice(0, 3); // Display the first 3 news articles as recent news
        popularNews = news.filter(article => article.popularity === 'high').slice(0, 3); // Display the first 3 popular news articles
      } else {
        const errorData = await response.json();
        errorMessage = `Failed to fetch news: ${errorData.error}`;
      }
    } catch (error) {
      console.error('Network error:', error);
      errorMessage = 'Failed to fetch news due to network error.';
    } finally {
      isLoading = false;
    }
  }

  function handleCategoryClick(category: string) {
    selectedCategory = category;
    fetchNews();
  }

  function handleTransactionClick(txId?: string) {
    if (txId) {
      window.location.href = `https://whatsonchain.com/tx/${txId}`;
    }
  }

  onMount(() => {
    fetchNews();
  });
</script>

<div class="flex h-screen bg-gray-200">
  <!-- Sidebar -->
  <div class="fixed inset-y-0 left-0 w-60 bg-white text-gray-900 -transform transform lg:transform-none lg:static z-30">
    <div class="flex items-center justify-center h-16 bg-gray-100 border-b border-gray-300">
      <h1 class="block py-2.5 px-10 font-bold text-gray-900">Dashboard</h1>
    </div>
    <nav class="mt-4">
      <a class="flex items-center justify-center h-12 text-gray-700 hover:bg-gray-100 hover:text-blue-700" href="/publish">Publish</a>
      <a class="flex items-center justify-center h-12 text-gray-700 hover:bg-gray-100 hover:text-blue-700" href="/feeds">Feeds</a>
      <a class="flex items-center justify-center h-12 text-gray-700 hover:bg-gray-100 hover:text-blue-700" href="/profile">Profile</a>
      <a class="flex items-center justify-center h-12 text-gray-700 hover:bg-gray-100 hover:text-blue-700" href="/settings">Settings</a>
    </nav>
    <!-- Categories and Notifications -->
    <div class="p-6 bg-gray-100 border-t border-gray-300 mt-4">
      <h2 class="text-xl font-semibold mb-4 text-gray-900">Categories</h2>
      <ul class="space-y-2">
        {#each ['India', 'World', 'Sports', 'Entertainment', 'Politics'] as category}
          <li>
            <button class="text-blue-500 hover:underline" on:click={() => handleCategoryClick(category)}>
              {category}
            </button>
          </li>
        {/each}
      </ul>
      <h2 class="text-xl font-semibold mt-8 mb-4 text-gray-900">Notifications</h2>
      <p class="text-gray-700">You have 3 new notifications.</p>
    </div>
  </div>

  <!-- Main content -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 bg-gray-100 border-b border-gray-300">
      <button class="lg:hidden text-gray-500 focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      <h1 class="text-xl font-bold text-gray-700">Welcome</h1>
    </div>

    <!-- Main content area -->
    <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Recent News -->
          <div class="flex-1 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900">Recent News</h2>
            {#if isLoading}
              <p class="text-lg font-medium text-gray-600">Loading...</p>
            {:else if errorMessage}
              <p class="text-red-600">{errorMessage}</p>
            {:else if recentNews.length === 0}
              <p class="text-lg font-medium text-gray-600">No recent news available.</p>
            {:else}
              {#each recentNews as article}
                <div class="p-4 mb-4 bg-gray-100 rounded-lg shadow-md">
                  <h3 class="text-xl font-bold text-gray-800">{article.title}</h3>
                  <p class="text-gray-700">{article.content}</p>
                  {#if article.image}
                    <img src={article.image} alt={article.title} class="w-full h-auto mt-2 rounded-lg"/>
                  {/if}
                  <div class="flex items-center justify-between mt-4">
                    <span class="text-sm text-gray-600">Published by: {article.userEmail || 'Anonymous'}</span>
                    <span class="text-sm text-gray-600">Category: {article.category.name}</span>
                    {#if article.txId}
                    <button on:click={() => handleTransactionClick(article.txId)} class="text-red-500">View Transaction</button>
                  {:else}
                    <span class="text-sm text-gray-600">No Transaction ID</span>
                  {/if}
                  </div>
                </div>
              {/each}
            {/if}
          </div>

          <!-- Popular News -->
          <div class="flex-1 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900">Popular News</h2>
            {#if isLoading}
              <p class="text-lg font-medium text-gray-600">Loading...</p>
            {:else if errorMessage}
              <p class="text-red-600">{errorMessage}</p>
            {:else if popularNews.length === 0}
              <p class="text-lg font-medium text-gray-600">No popular news available.</p>
            {:else}
              {#each popularNews as article}
                <div class="p-4 mb-4 bg-gray-100 rounded-lg shadow-md">
                  <h3 class="text-xl font-bold text-gray-800">{article.title}</h3>
                  <p class="text-gray-700">{article.content}</p>
                  {#if article.image}
                    <img src={article.image} alt={article.title} class="w-full h-auto mt-2 rounded-lg"/>
                  {/if}
                  <div class="flex items-center justify-between mt-4">
                    <span class="text-sm text-gray-600">Published by: {article.userEmail || 'Anonymous'}</span>
                    <span class="text-sm text-gray-600">Category: {article.category.name}</span>
                    <span class="text-sm text-gray-600">Popularity: {article.popularity || 'N/A'}</span>
                    {#if article.txId}
                      <button on:click={() => handleTransactionClick(article.txId)} class="text-red-500">View Transaction</button>
                    {:else}
                      <span class="text-sm text-gray-600">No Transaction ID</span>
                    {/if}
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    </main>
  </div>
</div>
