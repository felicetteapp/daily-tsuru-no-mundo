import { EleventyRenderPlugin } from "@11ty/eleventy";
export default async function (eleventyConfig) {
  // Configure Eleventy
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.addPassthroughCopy({ "public/images": "images" });
  eleventyConfig.addPassthroughCopy({ "public/js": "js" });

  // Add felicette img loading utils bundle
  eleventyConfig.addPassthroughCopy({
    "node_modules/@felicetteapp/img-loading/dist/bundle.js":
      "js/img-loading.js",
  });

  // Add public json data
  eleventyConfig.addPassthroughCopy({
    "src/_data/similarColorsUuids.json": "public/data/similarColorsUuids.json",
  });



  // Define a data directory
  eleventyConfig.addGlobalData("data", "src/_data");

  //update when a sass file changes
  eleventyConfig.addWatchTarget("sass/");
  eleventyConfig.addWatchTarget("public/js/");
  eleventyConfig.addPlugin(EleventyRenderPlugin);
}
