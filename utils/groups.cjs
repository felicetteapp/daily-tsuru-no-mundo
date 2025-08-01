const fs = require("fs");
const path = require("path");
const tsurusJsonData = require("../src/_data/tsurus.json");
const chroma = require("chroma-js");

// grouped by year
const groupedByYear = tsurusJsonData.reduce((acc, tsuru) => {
  const { year } = tsuru.date;
  if (!acc[year]) {
    acc[year] = [];
  }
  acc[year].push(tsuru);
  return acc;
}, {});

const availableYears = Object.keys(groupedByYear).sort().reverse();

const groupedByYearData = {
  availableYears,
  groupedByYear,
};

const groupedByYearDataFilePath = path.join(
  __dirname,
  "../src/_data/groupedByYear.json"
);

fs.writeFileSync(
  groupedByYearDataFilePath,
  JSON.stringify(groupedByYearData, null, 2)
);

// grouped by month

const months = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  10: "October",
  11: "November",
  12: "December",
};

const groupedByMonth = tsurusJsonData.reduce((acc, tsuru) => {
  const { month } = tsuru.date;
  if (!acc[month]) {
    acc[month] = [];
  }
  acc[month].push(tsuru);
  return acc;
}, {});

const availableMonths = Object.keys(groupedByMonth)
  .sort()
  .reverse()
  .map((month) => {
    return {
      month,
      name: months[month],
    };
  });

const groupedByMonthData = {
  availableMonths,
  groupedByMonth,
};

const groupedByMonthDataFilePath = path.join(
  __dirname,
  "../src/_data/groupedByMonth.json"
);

fs.writeFileSync(
  groupedByMonthDataFilePath,
  JSON.stringify(groupedByMonthData, null, 2)
);

const countriesFlags = {
  Argentina: "🇦🇷",
  Brasil: "🇧🇷",
  Chile: "🇨🇱",
  España: "🇪🇸",
  France: "🇫🇷",
  Deutschland: "🇩🇪",
  Nederland: "🇳🇱",
  Uruguay: "🇺🇾",
  Türkiye: "🇹🇷",
  Portugal: "🇵🇹",
};

// grouped by country

const groupedByCountry = tsurusJsonData.reduce((acc, tsuru) => {
  const { location } = tsuru;

  const splitedLocation = location.split("-");

  const country = splitedLocation[splitedLocation.length - 1].trim();

  if (!acc[country]) {
    acc[country] = [];
  }
  acc[country].push(tsuru);
  return acc;
}, {});

const availableCountries = Object.keys(groupedByCountry)
  .sort()
  .map((country) => {
    return {
      name: country,
      flag: countriesFlags[country] || "",
    };
  });

const groupedByCountryData = {
  availableCountries,
  groupedByCountry,
};

const groupedByCountryDataFilePath = path.join(
  __dirname,
  "../src/_data/groupedByCountry.json"
);

fs.writeFileSync(
  groupedByCountryDataFilePath,
  JSON.stringify(groupedByCountryData, null, 2)
);

// grouped by city

const groupedByCity = tsurusJsonData.reduce((acc, tsuru) => {
  const { location } = tsuru;

  const splitedLocation = location.split("-");

  const city = splitedLocation[0].split(",")[0].trim();

  if (!acc[city]) {
    acc[city] = [];
  }
  acc[city].push(tsuru);
  return acc;
}, {});

const availableCities = Object.keys(groupedByCity).sort();

const groupedByCityData = {
  availableCities,
  groupedByCity,
};

const groupedByCityDataFilePath = path.join(
  __dirname,
  "../src/_data/groupedByCity.json"
);

fs.writeFileSync(
  groupedByCityDataFilePath,
  JSON.stringify(groupedByCityData, null, 2)
);

// grouped by similar colors

const colorsAreSimilar = (color1, color2) => {
  const [r1, g1, b1] = color1.split("(")[1].split(")")[0].split(",");
  const [r2, g2, b2] = color2.split("(")[1].split(")")[0].split(",");
  const threshold = 10;

  const distance = chroma.deltaE(
    chroma.rgb(r1, g1, b1),
    chroma.rgb(r2, g2, b2)
  );

  return distance < threshold;
};

const groupedBySimilarColors = tsurusJsonData.reduce((acc, tsuru) => {
  const { mainColor } = tsuru;

  const actualColors = Object.keys(acc);

  const similarColor = actualColors.find((color) =>
    colorsAreSimilar(color, mainColor)
  );

  if (similarColor) {
    acc[similarColor].push(tsuru);
  } else {
    acc[mainColor] = [tsuru];
  }

  return acc;
}, {});

const availableColors = Object.keys(groupedBySimilarColors);

const distanceToWhite = (color) => {
  const white = chroma("white");
  return chroma.deltaE(color, white);
};

const groupedBySimilarColorsData = {
  availableColors,
  groupedBySimilarColors,
  similarColorsGradients: availableColors
    .map((color) => {
      const allColorsOfThisGroup = groupedBySimilarColors[color];
      const gradients = allColorsOfThisGroup.map((tsuru) => tsuru.mainColor);
      const average = chroma.average(gradients);

      return {
        color,
        average: `rgb(${average.rgb().join(",")})`,
      };
    })
    .sort((a, b) => {
      const [r1, g1, b1] = a.color.split("(")[1].split(")")[0].split(",");
      const [r2, g2, b2] = b.color.split("(")[1].split(")")[0].split(",");

      const color1 = chroma.rgb(r1, g1, b1);
      const color2 = chroma.rgb(r2, g2, b2);

      return distanceToWhite(color1) - distanceToWhite(color2);
    }),
};

const groupedBySimilarColorsDataFilePath = path.join(
  __dirname,
  "../src/_data/groupedBySimilarColors.json"
);

fs.writeFileSync(
  groupedBySimilarColorsDataFilePath,
  JSON.stringify(groupedBySimilarColorsData, null, 2)
);

const similarColorsUuids =
  groupedBySimilarColorsData.similarColorsGradients.map(
    ({ color, average }) => {
      const tsurus = groupedBySimilarColors[color];
      return {
        color,
        average,
        tsurus: tsurus.map(({ uuid }) => uuid),
      };
    }
  );

const similarColorsUuidsFilePath = path.join(
  __dirname,
  "../src/_data/similarColorsUuids.json"
);

fs.writeFileSync(
  similarColorsUuidsFilePath,
  JSON.stringify(similarColorsUuids, null, 2)
);
