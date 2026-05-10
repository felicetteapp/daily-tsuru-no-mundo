import { EleventyRenderPlugin } from "@11ty/eleventy";
import { readFileSync } from "fs";
import MarkdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import MarkdownItContainer from "markdown-it-container";
import hljs from "highlight.js";
import Image, { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import htmlmin from "html-minifier-terser";

const readPackageJsonData = async () => {
  const packageJson = readFileSync("./package.json");
  return JSON.parse(packageJson);
};

const tsurusGifs = JSON.parse(
  readFileSync("./src/_data/tsurusGifs.json", "utf8"),
);

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
  eleventyConfig.setInputDirectory("src");
  //  eleventyConfig.addPassthroughCopy({ "public/images": "images" });
  eleventyConfig.addPassthroughCopy({ "public/js": "js" });
  eleventyConfig.addPassthroughCopy({ "public/.well-known": ".well-known" });

  eleventyConfig.addLiquidFilter("gifUrl", (uuid) => {
    const foundGif = tsurusGifs.find((gif) => gif.uuid === uuid);
    if (!foundGif) {
      console.log("foundGif", foundGif);
    }
    return foundGif ? `../public/${foundGif.path}` : "";
  });

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

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    transformOnRequest: false,
    sharpOptions: {
      animated: true,
    },
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
      pictureAttributes: {},
    },
  });

  eleventyConfig.addTransform("htmlmin", function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyJs: true,
        removeEmptyAttributes: (attributeName, tag) => {
          const galleryAttrs = ["gc", "gl", "gloc", "gbc", "gf"];
          const photoAttrs = ["dc", "dl", "dloc", "dbc", "df"];
          const ilAttrs = ["il-", "t-"];

          if (
            galleryAttrs.includes(attributeName) ||
            photoAttrs.includes(attributeName) ||
            ilAttrs.some((prefix) => attributeName.startsWith(prefix))
          ) {
            return false;
          }
          return true;
        },
      });

      return minified;
    }

    return content;
  });
}
