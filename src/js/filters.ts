const filteredYears: string[] = [];
const filteredMonths: string[] = [];
const filteredCountries: string[] = [];
const filteredColors: string[] = [];
const filteredCities: string[] = [];
let filtersButton, filterToggleButton;

interface TsuruColorData {
  color: `rgb(${number}, ${number}, ${number})`;
  average: `rgb(${number}, ${number}, ${number})`;
  tsurus: string[];
}
const tsurusGroupedBySimilarColors: TsuruColorData[] = [];

const fetchJsonData = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

fetchJsonData("public/data/similarColorsUuids.json").then((data) => {
  data.forEach((color: TsuruColorData) => {
    tsurusGroupedBySimilarColors.push(color);
  });
});

const filterNodesByYears = (nodes: Iterable<HTMLElement>, years: string[]) => {
  if (years.length === 0) {
    return nodes;
  }
  const filteredNodes = Array.from(nodes).filter((node) => {
    return years.includes(node.getAttribute("t-date-year") ?? "");
  });
  return filteredNodes;
};

const filterNodesByMonths = (
  nodes: Iterable<HTMLElement>,
  months: string[]
) => {
  if (months.length === 0) {
    return nodes;
  }
  const filteredNodes = Array.from(nodes).filter((node) => {
    return months.includes(node.getAttribute("t-date-month") ?? "");
  });
  return filteredNodes;
};

const filterNodesByCountries = (
  nodes: Iterable<HTMLElement>,
  countries: string[]
) => {
  if (countries.length === 0) {
    return nodes;
  }
  const filteredNodes = Array.from(nodes).filter((node) => {
    const splitedLocation = node.getAttribute("t-location")?.split("-") ?? [];
    const thisNodeCountry = splitedLocation[splitedLocation.length - 1].trim();
    return countries.includes(thisNodeCountry);
  });
  return filteredNodes;
};

const filterNodesByCities = (
  nodes: Iterable<HTMLElement>,
  cities: string[]
) => {
  if (cities.length === 0) {
    return nodes;
  }
  const filteredNodes = Array.from(nodes).filter((node) => {
    const location = node.getAttribute("t-location") ?? "";

    return cities.some((city) => location.includes(city));
  });
  return filteredNodes;
};

const filterNodesByColors = (
  nodes: Iterable<HTMLElement>,
  colors: string[]
) => {
  if (colors.length === 0) {
    return nodes;
  }

  const filteredNodes = Array.from(nodes).filter((node) => {
    return colors.some((color) => {
      const thisColorData = tsurusGroupedBySimilarColors.find(
        ({ color: iColor }) => iColor === color
      );

      return thisColorData?.tsurus.includes(node.getAttribute("t-uuid") ?? "");
    });
  });
  return filteredNodes;
};

const handleFilterButtonClick = (event: MouseEvent) => {
  const targetElement = event.target as HTMLElement;
  const type: string = targetElement.getAttribute("t-filter-type") || "";
  const value: string = targetElement.getAttribute("t-filter-value") || "";
  const allTsurus = document.querySelectorAll<HTMLElement>("[t-item]");

  targetElement.classList.toggle("filter--active");

  if (type === "year") {
    filteredYears.includes(value)
      ? filteredYears.splice(filteredYears.indexOf(value), 1)
      : filteredYears.push(value);
  }

  if (type === "month") {
    filteredMonths.includes(value)
      ? filteredMonths.splice(filteredMonths.indexOf(value), 1)
      : filteredMonths.push(value);
  }

  if (type === "country") {
    filteredCountries.includes(value)
      ? filteredCountries.splice(filteredCountries.indexOf(value), 1)
      : filteredCountries.push(value);
  }

  if (type === "color") {
    filteredColors.includes(value)
      ? filteredColors.splice(filteredColors.indexOf(value), 1)
      : filteredColors.push(value);
  }

  if (type === "city") {
    filteredCities.includes(value)
      ? filteredCities.splice(filteredCities.indexOf(value), 1)
      : filteredCities.push(value);
  }

  const filteredByYears = filterNodesByYears(allTsurus, filteredYears);
  const filteredByMonths = filterNodesByMonths(filteredByYears, filteredMonths);
  const filteredByCountries = filterNodesByCountries(
    filteredByMonths,
    filteredCountries
  );

  const filteredByCities = filterNodesByCities(
    filteredByCountries,
    filteredCities
  );
  const filteredByColors = filterNodesByColors(
    filteredByCities,
    filteredColors
  );

  allTsurus.forEach((tsuru) => {
    tsuru.style.display = "none";
  });

  Array.from(filteredByColors).forEach((tsuru) => {
    tsuru.style.display = "";
  });

  document.documentElement.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleFilterToggle = () => {
  document.body.classList.toggle("filter--open");

  if (document.body.classList.contains("filter--open")) {
    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};

const handleFiltersOnLoad = () => {
  filtersButton =
    document.querySelectorAll<HTMLButtonElement>("[t-filter-btn]");
  filterToggleButton = document.querySelector<HTMLButtonElement>(
    "[t-filter-toggle-btn]"
  );

  if (!filtersButton || !filterToggleButton) {
    return;
  }

  filterToggleButton.addEventListener("click", handleFilterToggle);

  filtersButton.forEach((button) => {
    button.addEventListener("click", handleFilterButtonClick);
  });
};
window.addEventListener("load", handleFiltersOnLoad);
