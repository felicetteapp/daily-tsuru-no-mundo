const fs = require("fs");
const path = require("path");

const groupedByCountryDataFilePath = path.join(
  __dirname,
  "../src/_data/groupedByCountry.json"
);

const groupedByCityDataFilePath = path.join(
  __dirname,
  "../src/_data/groupedByCity.json"
);

const translatedToPortugueseCountries = {
  Argentina: { name: "Argentina", genre: "F", number: "S" },
  Brasil: { name: "Brasil", genre: "M", number: "S" },
  Chile: { name: "Chile", genre: "M", number: "S" },
  España: { name: "Espanha", genre: "F", number: "S" },
  France: { name: "França", genre: "F", number: "S" },
  Deutschland: { name: "Alemanha", genre: "F", number: "S" },
  Nederland: { name: "Paises Baixos", genre: "M", number: "P" },
  Uruguay: { name: "Uruguai", genre: "M", number: "S" },
  Türkiye: { name: "Turquia", genre: "F", number: "S" },
  Portugal: { name: "Portugal", genre: "M", number: "S" },
};

const translatedToPortugueseCities = {
  Amsterdam: { name: "Amsterdã", genre: "N", number: "S" },
  "Belo Horizonte": { name: "Belo Horizonte", genre: "N", number: "S" },
  "Campina Grande do Sul": {
    name: "Campina Grande do Sul",
    genre: "N",
    number: "S",
  },
  "İstanbul Havalimanı": {
    name: "Aeroporto de Istambul",
    genre: "N",
    number: "S",
  },
  "Rio Claro": { name: "Rio Claro", genre: "N", number: "S" },
  Carrasco: { name: "Carrasco", genre: "N", number: "S" },
  Curitiba: { name: "Curitiba", genre: "N", number: "S" },
  Duisburg: { name: "Duisburg", genre: "N", number: "S" },
  "Estancia Harberton": { name: "Estancia Harberton", genre: "N", number: "S" },
  "Isla Martillo": { name: "Isla Martillo", genre: "N", number: "S" },
  Madrid: { name: "Madrid", genre: "N", number: "S" },
  Matinhos: { name: "Matinhos", genre: "N", number: "S" },
  Montevideo: { name: "Montevideo", genre: "N", number: "S" },
  Morretes: { name: "Morretes", genre: "N", number: "S" },
  Paris: { name: "Paris", genre: "N", number: "S" },
  "Punta Arenas": { name: "Punta Arenas", genre: "N", number: "S" },
  "Santiago de Chile": { name: "Santiago de Chile", genre: "N", number: "S" },
  "São José dos Pinhais": {
    name: "São José dos Pinhais",
    genre: "N",
    number: "S",
  },
  "São Paulo": { name: "São Paulo", genre: "N", number: "S" },
  Ushuaia: { name: "Ushuaia", genre: "N", number: "S" },
  "Viña del Mar": { name: "Viña del Mar", genre: "N", number: "S" },
  Lisboa: { name: "Lisboa", genre: "N", number: "S" },
};

const getCountryDataAsJson = () => {
  const fileData = fs.readFileSync(groupedByCountryDataFilePath);
  return JSON.parse(fileData);
};

const allAvailableCountries = getCountryDataAsJson().availableCountries.map(
  ({ name }) => name
);

const missingTranslations = allAvailableCountries.filter(
  (country) => !translatedToPortugueseCountries[country]
);

console.warn(
  "Missing translations for the following countries:",
  missingTranslations
);

const countriesWithTranslation = allAvailableCountries.map((country) => {
  const translation = translatedToPortugueseCountries[country];
  return {
    name: country,
    ...translation,
  };
});

const getCityDataAsJson = () => {
  const fileData = fs.readFileSync(groupedByCityDataFilePath);
  return JSON.parse(fileData);
};

const allAvailableCities = getCityDataAsJson().availableCities;

const missingCityTranslations = allAvailableCities.filter(
  (city) => !translatedToPortugueseCities[city]
);

console.warn(
  "Missing translations for the following cities:",
  missingCityTranslations
);

const citiesWithTranslation = allAvailableCities.map((city) => {
  const translation = translatedToPortugueseCities[city];
  return {
    name: city,
    ...translation,
  };
});

// saveToJsonFile

const dataToSave = {
  availableCountries: countriesWithTranslation,
  availableCities: citiesWithTranslation,
};

const akaDataFilePath = path.join(__dirname, "../src/_data/akas.json");

fs.writeFileSync(akaDataFilePath, JSON.stringify(dataToSave, null, 2));
