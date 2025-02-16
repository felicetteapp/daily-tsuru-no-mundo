const path = require("path");
const fs = require("fs");
const rawImagesPath = path.join(__dirname, "../raw_data/pre");

const allImagesOnPath = [];
const placeholderLocation = process.argv[2] ?? "Curitiba, PR - Brasil";

fs.readdirSync(rawImagesPath).forEach((file) => {
  if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
    allImagesOnPath.push(file);
  }
});


//sample of aceptable file name: IMG_20210807_123456.jpg or 20210807_123456.jpg
const fileNameMatchPattern = /^(IMG_)?\d{8}_\d{6}\.(jpg|jpeg|png|gif)$/i;

const nameHasPattern = (name) => {
  console.log(name, fileNameMatchPattern.test(name));
  return fileNameMatchPattern.test(name);
};

const generateNewName = (initialName) => {


  const hasImgPrefix = initialName.startsWith("IMG");
  const [_, date, time] = (hasImgPrefix ? initialName : `IMG_${initialName}`).split("_");
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  const location = placeholderLocation;
  return `${year}-${month}-${day}_${location}#${time}`;
};

const processAllImages = async () => {
  for (let i = 0; i < allImagesOnPath.length; i++) {
    const file = allImagesOnPath[i];

    const nameIsValid = nameHasPattern(file);

    if (!nameIsValid) {
      continue;
    }
    const newFileName = generateNewName(file);

    fs.renameSync(
      path.join(rawImagesPath, file),
      path.join(rawImagesPath, "..", newFileName)
    );
  }
};

processAllImages();
