import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  ignoreDuringBuild:true,

  kit: {
    adapter: vercel(),
    // Additional configuration if needed
  }
};

export default config;
