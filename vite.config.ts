import preact from "@preact/preset-vite"
import UnoCSS from "unocss/vite"
import { defineConfig } from "vite"
import { chunkSplitPlugin } from "vite-plugin-chunk-split"

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: "./target/web/",
		assetsDir: "",
		modulePreload: { polyfill: false },
	},

	plugins: [
		UnoCSS(),
		preact(),

		chunkSplitPlugin({
			strategy: "unbundle",

			customChunk: ({ file: modulePath }) => {
				const croppedPath = modulePath.replace(/(\.\.\/)+/, "")

				if (/\.(ts|tsx|js|jsx)$/.test(modulePath)) {
					return croppedPath.includes("node_modules")
						? ["vendor", croppedPath.match(/node_modules\/(.*?)\/(.*?)@/).at(2)].join("/")
						: croppedPath.replace(/src\//, "").replace(/\.(ts|tsx)$/, "")
				} else {
					return null
				}
			},
		}),
	],
})
