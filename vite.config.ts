import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		postcss: {
			plugins: [
				autoprefixer({
					overrideBrowserslist: [
						'Android 4.1',
						'iOS 7.1',
						'Chrome > 31',
						'ff > 31',
						'ie >= 8',
						'> 1%',
					],
					grid: true,
				}),
			],
		},
	},
});
