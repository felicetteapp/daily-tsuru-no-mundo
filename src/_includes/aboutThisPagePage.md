# About this page

This site is open-source and you can view the source code on [GitHub](https://github.com/felicetteapp/daily-tsuru-no-mundo){target="_blank" rel="noopener"}

**This page is a work in progress. I'm hoping to add more details**

I made this site from scratch using:

- [Eleventy](https://www.11ty.dev/), a static site generator.
- The majority of the content is written in Markdown (using [markdown-it](https://github.com/markdown-it/markdown-it){target="_blank" rel="noopener"} as parsed with [markdown-it-attrs](https://github.com/arve0/markdown-it-attrs){target="_blank" rel="noopener"} and [markdown-it-container](https://github.com/markdown-it/markdown-it-container){target="_blank" rel="noopener"} extensions )
- The style is written in [scss](https://sass-lang.com/){target="_blank" rel="noopener"} and compiled with [Sass](https://www.npmjs.com/package/sass){target="_blank" rel="noopener"}

## Images

To display the images i use:

- [@felicetteapp/img-loading](https://github.com/felicetteapp/img-loading){target="_blank" rel="noopener"} to lazy load the images

To handle the images i made some node scripts using:

- [sharp](https://www.npmjs.com/package/sharp){target="_blank" rel="noopener"} to resize and optimize the images
- [chroma-js](https://www.npmjs.com/package/chroma-js){target="_blank" rel="noopener"} to get color information from the images
- [@felicetteapp/img-loading-utils](https://github.com/felicetteapp/img-loading-utils){target="_blank" rel="noopener"} to generate the image loading placeholders and all the data needed for the lazy loading
