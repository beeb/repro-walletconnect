import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'
import Icons from 'unplugin-icons/vite'
import svg from '@poppanator/sveltekit-svg'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import inject from '@rollup/plugin-inject'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

const MODE = process.env.NODE_ENV
const development = MODE === 'development'
/** @type {import('@sveltejs/kit').Config} */

const config: UserConfig = {
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		}),
		svg({
			includePaths: ['./src/lib/assets/']
		}),
		development &&
			nodePolyfills({
				include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js'), 'http', 'crypto']
			})
	],
	resolve: {
		alias: {
			stream: 'stream-browserify',
			assert: 'assert'
		}
	},
	build: {
		rollupOptions: {
			external: ['@web3-onboard/*'],
			plugins: [nodePolyfills({ include: ['crypto', 'http', 'global'] }), inject({ Buffer: ['Buffer', 'Buffer'] })]
		},
		commonjsOptions: {
			transformMixedEsModules: true
		}
	},
	optimizeDeps: {
		exclude: ['@ethersproject/hash', 'wrtc', 'http'],
		include: ['@web3-onboard/core', 'js-sha3', '@ethersproject/bignumber'],
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis'
			},
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true
				})
			]
		}
	},

}

export default config
