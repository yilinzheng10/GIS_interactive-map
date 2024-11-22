// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://yilinzheng10.github.io",
  base: "GIS_interactive-map",
  integrations: [mdx(), sitemap(), tailwind()],
});
