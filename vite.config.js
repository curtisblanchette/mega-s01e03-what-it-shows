import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { resolve } from 'node:path';
export default defineConfig({ plugins: [sveltekit({
  extensions: ['.svelte', '.svx'],
  preprocess: [vitePreprocess(), mdsvex({ extensions: ['.svx'], layout: { runbook: resolve('src/lib/layouts/runbook.svelte') } })],
  adapter: adapter({ pages: 'rendered', assets: 'rendered' }),
  alias: { '#lib': resolve('src/lib') }
})] });
