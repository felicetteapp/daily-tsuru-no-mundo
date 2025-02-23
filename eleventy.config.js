import { EleventyRenderPlugin } from "@11ty/eleventy";
import { readFileSync } from "fs";
import MarkdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";

const readPackageJsonData = async () => {
  const packageJson = readFileSync("./package.json");
  return JSON.parse(packageJson);
};

export default async function (eleventyConfig) {
  // Configure Eleventy
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.addPassthroughCopy({ "public/images": "images" });
  eleventyConfig.addPassthroughCopy({ "public/js": "js" });

  // Add custom MD library to handle more attrs
  const mdOptions = {
    html: true,
    breaks: true,
    linkify: true,
  };

  const markdownLib = MarkdownIt(mdOptions)
    .use(markdownItAttrs)
    .disable("code");

  eleventyConfig.setLibrary("md", markdownLib);

  // Add felicette img loading utils bundle
  eleventyConfig.addPassthroughCopy({
    "node_modules/@felicetteapp/img-loading/dist/bundle.js":
      "js/img-loading.js",
  });

  // Add public json data
  eleventyConfig.addPassthroughCopy({
    "src/_data/similarColorsUuids.json": "public/data/similarColorsUuids.json",
  });
  eleventyConfig.addPassthroughCopy({
    "src/_data/akas.json": "public/data/akas.json",
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
  eleventyConfig.addWatchTarget("public/js/");
  eleventyConfig.addPlugin(EleventyRenderPlugin);
}
