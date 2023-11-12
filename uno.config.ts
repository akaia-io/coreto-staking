import { presetAttributify, presetIcons, presetTypography, presetUno } from "unocss"
import { defineConfig } from "unocss/vite"

export default defineConfig({
	theme: {
		colors: {
			base: "#000000",
			primary: "#000000",
			accent: "#325ce8",
		},
	},

	presets: [presetIcons(), presetUno(), presetTypography(), presetAttributify()],
})
