import { getAllCountries } from "./api.js";
import { displayCountries } from "./display.js";
import { filterByRegion, searchCountries } from "./search.js";

console.log("Country Explorer initialized");

const searchInput = document.querySelector("#country-search");
const searchButton = document.querySelector(".search-controls button");
const regionFilter = document.querySelector("#regionFilter");

let allCountries = [];

loadCountries();

async function loadCountries() {
  const countries = await getAllCountries();
  console.log(countries);

  allCountries = countries ?? [];
  applyFilters();
}

searchButton?.addEventListener("click", applyFilters);
searchInput?.addEventListener("input", applyFilters);
regionFilter?.addEventListener("change", applyFilters);

function applyFilters() {
  const query = searchInput?.value ?? "";
  const selectedRegion = regionFilter?.value ?? "all";
  const countriesByRegion = filterByRegion(allCountries, selectedRegion);
  const filteredCountries = searchCountries(countriesByRegion, query);
  displayCountries(filteredCountries);
}
