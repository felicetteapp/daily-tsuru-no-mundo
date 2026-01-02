const tsurusJsonData = require("../src/_data/tsurus.json");

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// get parameters from cli args
const initialDateArg = process.argv[2];
const finalDateArg = process.argv[3];

const getDateFromTsuru = (tsuru) => {
  const date = tsuru.date;
  const { year, month, day } = date;
  return new Date(year, month - 1, day);
};

const filterTsurusByDate = (tsuru) => {
  const tsuruDate = getDateFromTsuru(tsuru);

  if (initialDateArg) {
    const initialDate = new Date(initialDateArg);
    if (tsuruDate < initialDate) {
      return false;
    }
  }

  if (finalDateArg) {
    const finalDate = new Date(finalDateArg);
    if (tsuruDate > finalDate) {
      return false;
    }
  }

  return true;
};

const sortTsurusByDate = (a, b) => {
  const dateA = getDateFromTsuru(a);
  const dateB = getDateFromTsuru(b);

  return dateA - dateB;
};

const filteredTsurus = tsurusJsonData.filter(filterTsurusByDate);
const sortedTsurus = filteredTsurus.sort(sortTsurusByDate);

console.log(sortedTsurus);

const outputPath = path.join(__dirname, "..", "exported_data");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

fs.writeFileSync(
  path.join(outputPath, "sorted_tsurus.json"),
  JSON.stringify(sortedTsurus, null, 2)
);

const imageOutputPath = path.join(outputPath, "images");

if (!fs.existsSync(imageOutputPath)) {
  fs.mkdirSync(imageOutputPath);
}

const processImages = async () => {
  let i = 0;
  for (const tsuru of sortedTsurus) {
    i++;
    console.log(`Processing image ${i} of ${sortedTsurus.length}`);
    const sourceImagePath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      tsuru.image.replace(/^\/+/g, "")
    );
    const destImagePath = path.join(
      imageOutputPath,
      i + "_" + path.basename(tsuru.image).replace(/\.[^/.]+$/, ".png")
    );

    await sharp(sourceImagePath).png().toFile(destImagePath);
    console.log(`image ${i} saved to ${destImagePath}`);
  }
};

processImages();
