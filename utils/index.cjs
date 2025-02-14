const path = require("path");
const fs = require("fs");
const rawImagesPath = path.join(__dirname, "../raw_data");
const uuid = require("uuid");
const sharp = require("sharp");
const { getAll } = require("@felicetteapp/img-loading-utils/dist/index.js");

const tsuruDataFilePath = path.join(__dirname, "../src/_data/tsurus.json");
const allImagesOnPath = [];

fs.readdirSync(rawImagesPath).forEach((file) => {
  if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
    allImagesOnPath.push(file);
  }
});

const generateLowResImage = (file, uuid) => {
  return new Promise((resolve, reject) => {
    const image = sharp(path.join(rawImagesPath, file));
    const imageFile = `${uuid}.webp`;
    image
      .rotate()
      .resize(1080)
      .webp()
      .toFile(path.join(__dirname, "../public/images", imageFile), (err) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(imageFile);
      });
  });
};

const processAllImages = async () => {
  let tsuruData = [];
  if (fs.existsSync(tsuruDataFilePath)) {
    tsuruData = JSON.parse(fs.readFileSync(tsuruDataFilePath, "utf8"));
  }

  for (let i = 0; i < allImagesOnPath.length; i++) {
    const file = allImagesOnPath[i];
    const randomUuid = uuid.v4();
    const [date, rawLocation] = file.split('#')[0].split("_");
    const [location] = rawLocation.split(".");
    const [year, month, day] = date.split("-");
    const generatedImage = await generateLowResImage(file, randomUuid);

    tsuruData.push({
      date: { year, month, day },
      location,
      uuid: randomUuid,
      image: generatedImage,
    });
  }

  tsuruData.sort((a, b) => {
    if (a.date.year !== b.date.year) {
      return a.date.year - b.date.year;
    }
    if (a.date.month !== b.date.month) {
      return a.date.month - b.date.month;
    }
    return a.date.day - b.date.day;
  });

  tsuruData.reverse();

  const inDir = "./public/images";

  const allFilesFromDir = tsuruData.map((tsuru) => tsuru.image);

  getAll(allFilesFromDir, "./public/images/thumbnail", inDir).then(
    (response) => {
      const newTsurusData = [];
      response.forEach(({ thumbnail, mainColor, width, height, fullSize }) => {
        const tsuruDataOfThisImage = tsuruData.find((tsuru) =>
          fullSize.endsWith(tsuru.image)
        );

        const thisTsuruData = {
          ...tsuruDataOfThisImage,
          thumbnail: thumbnail.replace("public/", ""),
          mainColor: `rgb(${mainColor.join(",")})`,
          width,
          height,
        };
        newTsurusData.push(thisTsuruData);
      });
      
      fs.writeFileSync(
        tsuruDataFilePath,
        JSON.stringify(newTsurusData, null, 2)
      );

      console.log("All images processed!");
      // move all processed images to /pre folder
      newTsurusData.forEach((tsuru) => {
        fs.renameSync(
          path.join(rawImagesPath, tsuru.image),
          path.join(rawImagesPath, "pre", tsuru.image)
        );
      });
    }
  );
};

processAllImages();
