import { EleventyRenderPlugin } from "@11ty/eleventy";
export default async function (eleventyConfig) {
  // Configure Eleventy
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.addPassthroughCopy({ "public/images": "images" });

  // Define a data directory
  eleventyConfig.addGlobalData("data", "src/_data");

  //update when a sass file changes
  eleventyConfig.addWatchTarget("sass/");
  eleventyConfig.addPlugin(EleventyRenderPlugin);
}
