<script>
    import { onMount } from 'svelte';
  
    /**
     * @type {string | any[]}
     */
    let NewsArticle = [];
  
    onMount(async () => {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          NewsArticle = await res.json();
        } else {
          console.error('Failed to fetch news');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    });
  </script>
  
  <main>
    <h1>Feeds</h1>
    {#if NewsArticle.length > 0}
      <ul>
        {#each NewsArticle as article}
          <li>{article.title}</li>
        {/each}
      </ul>
    {:else}
      <p>No news available.</p>
    {/if}
  </main>
  