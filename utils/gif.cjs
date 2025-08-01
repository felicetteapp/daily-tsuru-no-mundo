const { GifEncoder } = require("@skyra/gifenc");
const { loadImage, Canvas } = require("canvas-constructor/skia");
const { buffer } = require("node:stream/consumers");
const sharp = require("sharp");
const fs = require("fs");
const chroma = require("chroma-js");
const path = require("path");

const targetSize = {
  width: 88,
  height: 31,
};

const getImageWithMetadata = async (webpImage) => {
  const sharpImg = sharp(webpImage);
  const originalMetadata = await sharpImg.metadata();

  const expectedHeight = originalMetadata.height * 0.75;

  const cropped = await sharpImg
    .extract({
      left: 0,
      top: Math.round((originalMetadata.height - expectedHeight) / 2),
      width: originalMetadata.width,
      height: Math.round(expectedHeight),
    })
    .toBuffer();

  const metadata = await sharp(cropped).metadata();

  const data = cropped;
  const image = await loadImage(data);
  return { image, metadata };
};

const getContrastedText = (color) => {
  const contrastedColor = chroma(color).luminance() > 0.5 ? "black" : "white";
  return contrastedColor;
};

const generateGif = async (input) => {
  const canvas = new Canvas(targetSize.width, targetSize.height);
  const encoder = new GifEncoder(targetSize.width, targetSize.height);
  const stream = encoder.createReadStream();
  encoder.setRepeat(0).setDelay(150).setQuality(5).start();

  const thumbnailPath = path.join(__dirname, "..", "public", input.thumbnail);
  const { image, metadata } = await getImageWithMetadata(thumbnailPath);
  const extraFrames = 3;
  const frameHeight = targetSize.height / extraFrames;

  const actualExpectedWidthFit = targetSize.width * 1.35;
  const leftOffset = (actualExpectedWidthFit - targetSize.width) / 2;

  const imgSizeResizedToFitWidth = {
    width: actualExpectedWidthFit,
    height: metadata.height * (actualExpectedWidthFit / metadata.width),
  };

  const verticalSlicesCount = Math.ceil(
    imgSizeResizedToFitWidth.height / frameHeight
  );

  for (let i = 0; i < verticalSlicesCount + 1 * extraFrames; i++) {
    const y = targetSize.height - i * frameHeight;
    const thisImgColor = input.mainColor;
    canvas.setColor(thisImgColor);
    canvas.printRectangle(0, 0, targetSize.width, targetSize.height);
    canvas.setColor(getContrastedText(thisImgColor));

    const verticalPadding = (targetSize.height - 20) / 2;
    const horizontalPadding = 5;

    canvas.setTextFont("normal 900 10px Arial");
    canvas.printText("TsuruNoMundo", horizontalPadding, verticalPadding + 10);
    canvas.setTextFont("normal 300 10px Arial");
    canvas.printText("Daily", horizontalPadding, verticalPadding + 20);
    canvas.printImage(
      image,
      -leftOffset,
      y,
      imgSizeResizedToFitWidth.width,
      imgSizeResizedToFitWidth.height
    );
    encoder.addFrame(canvas);
  }

  encoder.finish();

  return new Promise((resolve) => {
    buffer(stream).then((result) => {
      const outputPath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "gifs",
        input.uuid + ".gif"
      );
      fs.writeFileSync(outputPath, result);

      resolve({
        uuid: input.uuid,
        path: `images/gifs/${input.uuid}.gif`,
      });
    });
  });
};

const pathToGifsJson = path.join(__dirname, "../src/_data/tsurusGifs.json");
const tsurusJsonData = require("../src/_data/tsurus.json");

const gifsJsonExists = fs.existsSync(pathToGifsJson);

if (!gifsJsonExists) {
  fs.writeFileSync(pathToGifsJson, "[]");
}

const currentGifsJsonRawDta = fs.readFileSync(pathToGifsJson);
const currentGifsJsonData = JSON.parse(currentGifsJsonRawDta);

const tsurus = tsurusJsonData.filter((t) => {
  const thisTsuruUuidExists = currentGifsJsonData.some((g) => {
    return g.uuid === t.uuid;
  });

  return !thisTsuruUuidExists;
});

const generateGifsFromTsurus = async () => {
  const generated = [];

  for (const tsuru of tsurus) {
    generated.push(await generateGif(tsuru));
  }

  fs.writeFileSync(
    pathToGifsJson,
    JSON.stringify([...currentGifsJsonData, ...generated], null, 2)
  );
};

generateGifsFromTsurus();
