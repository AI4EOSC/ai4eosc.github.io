// @ts-check
import { defineConfig } from "astro/config";
import alpinejs from "@astrojs/alpinejs";
import tailwindcss from "@tailwindcss/vite";
import yaml from "@rollup/plugin-yaml";
import sitemap from "@astrojs/sitemap";
// https://astro.build/config
export default defineConfig({
	site: "https://ai4eosc.eu",
	integrations: [alpinejs(), sitemap()],
	vite: {
		plugins: [tailwindcss(), yaml()],
	},
});
