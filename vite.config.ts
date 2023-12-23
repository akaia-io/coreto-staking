import preact from "@preact/preset-vite"
import UnoCSS from "unocss/vite"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: "./target/web/",
		assetsDir: "",
		modulePreload: { polyfill: false },
	},

	plugins: [UnoCSS(), preact()],
})
