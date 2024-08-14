import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default {
	plugins: [sveltekit()],
	optimizeDeps: {
	  include: ['some-dependency'],
	},
  };