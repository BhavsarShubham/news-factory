<script lang="ts">
  import { onMount } from 'svelte';

  interface Category {
    name: string;
  }

  interface Comment {
    user: string;
    content: string;
    date: string;
  }

  interface NewsArticle {
    id: number;
    title: string;
    content: string;
    image?: string;
    userEmail?: string;
    userWallet?: string;
    category: Category;
    popularity?: string;
    likes: number;
    createdAt: string;
    comments: Comment[];
  }

  let news: NewsArticle[] = [];
  let trendingNews: NewsArticle[] = [];
  let recentComments: Comment[] = [];
  let errorMessage = '';
  let isLoading = true;
  let newCommentContent = '';

  const categories = [
    'World',
    'Business',
    'India',
    'Sports',
    'Entertainment',
    'Politics'
  ];

  let selectedCategory = '';
  let selectedDate = '';
  let selectedPopularity = '';

  async function fetchNews() {
    isLoading = true;
    errorMessage = '';
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedDate) params.append('date', selectedDate);
      if (selectedPopularity) params.append('popularity', selectedPopularity);

      const response = await fetch(`/api/news?${params.toString()}`);
      if (response.ok) {
        news = await response.json();
        // Sort by createdAt to display recent news on top
        news.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // Filter trending news
        trendingNews = news.filter(article => article.popularity === 'high');
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

  async function fetchComments() {
    try {
      const response = await fetch('/api/comments');
      if (response.ok) {
        recentComments = await response.json();
      } else {
        const errorData = await response.json();
        console.error(`Failed to fetch comments: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }

  async function likeArticle(articleId: number) {
    try {
      const response = await fetch(`/api/news/${articleId}/like`, { method: 'POST' });
      if (response.ok) {
        const updatedArticle = await response.json();
        news = news.map(article => article.id === articleId ? updatedArticle : article);
        trendingNews = news.filter(article => article.popularity === 'high');
      } else {
        const errorData = await response.json();
        console.error(`Failed to like article: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }

  async function addComment(articleId: number) {
    try {
      const response = await fetch(`/api/news/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newCommentContent })
      });
      if (response.ok) {
        const newComment = await response.json();
        news = news.map(article => article.id === articleId ? { ...article, comments: [...article.comments, newComment] } : article);
        newCommentContent = '';
      } else {
        const errorData = await response.json();
        console.error(`Failed to add comment: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }

  onMount(() => {
    fetchNews();
    fetchComments();
  });

  $: if (selectedCategory || selectedDate || selectedPopularity) {
    fetchNews();
  }
</script>

<section class="bg-white dark:bg-gray-900">
  <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
    <header class="mb-8">
      <h1 class="text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        News Feed
      </h1>
    </header>

    <div class="flex flex-col lg:flex-row">
      <main class="flex-1 lg:mr-8">
        {#if isLoading}
          <p class="text-lg font-medium text-gray-600 dark:text-gray-400">Loading...</p>
        {:else if errorMessage}
          <p class="text-red-600 dark:text-red-400">{errorMessage}</p>
        {:else if news.length === 0}
          <p class="text-lg font-medium text-gray-600 dark:text-gray-400">No news articles available.</p>
        {:else}
          {#each news as article}
            <div class="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
              <h2 class="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">{article.title}</h2>
              <p class="mb-4 text-gray-700 dark:text-gray-300">{article.content}</p>
              {#if article.image}
                <img src={article.image} alt={article.title} class="w-full h-auto mb-4 rounded-lg"/>
              {/if}
              <div class="flex items-center justify-between mt-4">
                <span class="text-sm text-gray-600 dark:text-gray-400">Published by: {article.userWallet ? `${article.userWallet.slice(-4)}` : 'Anonymous'}</span>
                <span class="text-sm text-gray-600 dark:text-gray-400">Category: {article.category.name}</span>
                <span class="text-sm text-gray-600 dark:text-gray-400">Popularity: {article.popularity || 'N/A'}</span>
              </div>
              <button on:click={() => likeArticle(article.id)} class="mt-2 text-blue-500">Like ({article.likes})</button>
              <div class="mt-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Comments</h3>
                {#each article.comments as comment}
                  <div class="mb-2">
                    <p class="text-sm text-gray-700 dark:text-gray-300"><strong>{comment.user}:</strong> {comment.content}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">{comment.date}</p>
                  </div>
                {/each}
                <form on:submit|preventDefault={() => addComment(article.id)}>
                  <input type="text" placeholder="Add a comment" bind:value={newCommentContent} class="w-full p-2.5 mt-2 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                  <button type="submit" class="mt-2 text-blue-500">Submit</button>
                </form>
              </div>
            </div>
          {/each}
        {/if}
      </main>

      <aside class="mt-8 lg:mt-0 lg:w-1/4 lg:ml-8">
        <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-700 mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Filters</h2>
          <div class="mb-4">
            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select id="category" bind:value={selectedCategory} class="mt-1 block w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="">All</option>
              {#each categories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>
          <div class="mb-4">
            <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input type="date" id="date" bind:value={selectedDate} class="mt-1 block w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
          </div>
          <div>
            <label for="popularity" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Popularity</label>
            <select id="popularity" bind:value={selectedPopularity} class="mt-1 block w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-700 mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Trending News</h2>
          {#each trendingNews as article}
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{article.title}</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">{article.content}</p>
            </div>
          {/each}
        </div>

        <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-700">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Recent Comments</h2>
          {#each recentComments as comment}
            <div class="mb-2">
              <p class="text-sm text-gray-700 dark:text-gray-300"><strong>{comment.user}:</strong> {comment.content}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">{comment.date}</p>
            </div>
          {/each}
        </div>
      </aside>
    </div>
  </div>
</section>