import { EleventyRenderPlugin } from "@11ty/eleventy";
import { readFileSync } from "fs";
import MarkdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import MarkdownItContainer from "markdown-it-container";
import hljs from "highlight.js";

const readPackageJsonData = async () => {
  const packageJson = readFileSync("./package.json");
  return JSON.parse(packageJson);
};

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.addPassthroughCopy({ "public/images": "images" });
  eleventyConfig.addPassthroughCopy({ "public/js": "js" });
  eleventyConfig.addPassthroughCopy({ "public/.well-known": ".well-known" });

  const mdOptions = {
    html: true,
    breaks: true,
    linkify: true,
    highlight: (str, lang) => {
      const code =
        lang && hljs.getLanguage(lang)
          ? hljs.highlight(str, {
              language: lang,
              ignoreIllegals: true,
            }).value
          : md.utils.escapeHtml(str);
      return `<pre class="hljs"><code>${code}</code></pre>`;
    },
  };

  const markdownLib = MarkdownIt(mdOptions)
    .use(MarkdownItContainer, "md-flex")
    .use(MarkdownItContainer, "md-flex-vert", { marker: ";" })
    .use(markdownItAttrs)
    .disable("code");

  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.addPassthroughCopy({
    "node_modules/highlight.js/styles/tokyo-night-dark.css":
      "css/highlight.css",
    "node_modules/lenis/dist/lenis.css": "css/lenis.css",
  });

  // Add public json data
  eleventyConfig.addPassthroughCopy({
    "src/_data/similarColorsUuids.json": "public/data/similarColorsUuids.json",
  });
  eleventyConfig.addPassthroughCopy({
    "src/_data/akas.json": "public/data/akas.json",
  });
  eleventyConfig.addPassthroughCopy({
    "src/_data/tsurusGifs.json": "public/data/tsurusGifs.json",
  });

  const packageJson = await readPackageJsonData();

  // Extract version from package.json
  eleventyConfig.addGlobalData("version", packageJson.version);

  // Save the current DateTime to a global daata
  eleventyConfig.addGlobalData("buildTime", new Date().toISOString());

  // Define a data directory
  eleventyConfig.addGlobalData("data", "src/_data");

  //update when a sass file changes
  eleventyConfig.addWatchTarget("package.json");
  eleventyConfig.addWatchTarget("CHANGELOG.md");
  eleventyConfig.addWatchTarget("sass/");
  eleventyConfig.addWatchTarget("public/js/script.js");
  eleventyConfig.addPlugin(EleventyRenderPlugin);
}
