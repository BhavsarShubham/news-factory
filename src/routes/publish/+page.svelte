<script>
  import { onMount } from 'svelte';

  let title = '';
  let content = '';
  let category = '';
  let image = '';
  let walletAddress = '';

  let categories = [
    { name: 'World' },
    { name: 'Business' },
    { name: 'India' },
    { name: 'Sports' },
    { name: 'Entertainment' },
    { name: 'Politics' }
  ];

  onMount(async () => {
    try {
      const response = await fetch('/api/user-wallet');
      if (response.ok) {
        const data = await response.json();
        walletAddress = data.walletAddress;
      } else {
        console.error('Failed to fetch wallet address');
      }
    } catch (error) {
      console.error('Error fetching wallet address:', error);
    }
  });

  function submitNews() {
    const newsData = {
      title,
      content,
      category,
      image: image || null,
      userWallet: walletAddress,
    };

    // Store newsData in sessionStorage
    sessionStorage.setItem('newsData', JSON.stringify(newsData));

    // Redirect to payment page
    window.location.href = '/pay';
  }
</script>

<section class="bg-white dark:bg-gray-900">
  <!-- The rest of your component's HTML remains the same -->
</section>


<section class="bg-white dark:bg-gray-900">
  <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
    <header class="mb-8">
      <h1 class="text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Publish News
      </h1>
    </header>

    <div class="flex flex-col lg:flex-row">
      <main class="flex-1 lg:mr-8">
        <form on:submit|preventDefault={submitNews} class="space-y-8">
          <div>
            <label for="wallet-address" class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300">Wallet Address</label>
            <input id="wallet-address" type="text" value={walletAddress} readonly class="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
          </div>

          <div>
            <label for="title" class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300">Title</label>
            <input id="title" type="text" bind:value={title} required class="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
          </div>
          <div>
            <label for="content" class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300">Content</label>
            <textarea id="content" bind:value={content} required class="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
          </div>
          <div>
            <label for="category" class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300">Category</label>
            <select id="category" bind:value={category} required class="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="" disabled>Select a category</option>
              {#each categories as cat}
                <option value={cat.name}>{cat.name}</option>
              {/each}
            </select>
          </div>
          <div>
            <label for="image" class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300">Image URL</label>
            <input id="image" type="text" bind:value={image} class="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
          </div>
          <button type="submit" class="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400">
            Submit
          </button>
        </form>
      </main>

      <aside class="mt-8 lg:mt-0 lg:w-1/4 lg:ml-8">
        <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-700 text-left mb-8">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Publishing Guidelines</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Ensure your article is factual, well-researched, and relevant.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Use proper grammar and punctuation.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Avoid plagiarism and cite your sources properly.</p>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-700 text-left">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Tips for Writing</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Start with a strong headline that captures attention.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Keep your paragraphs short and to the point.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Use images and videos to complement your story.</p>
        </div>
      </aside>
    </div>
  </div>

</section>
