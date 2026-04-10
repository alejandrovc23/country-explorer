import { getAllCountries } from "./api.js";
import { displayCountries } from "./display.js";
import { addToFavorites } from "./favorites.js";
import { filterByRegion, searchCountries } from "./search.js";
import { getFavorites } from "./storage.js";

console.log("Country Explorer initialized");

const searchInput = document.querySelector("#country-search");
const searchButton = document.querySelector(".search-controls button");
const regionFilter = document.querySelector("#regionFilter");
const resultsContainer = document.querySelector("#results");

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
resultsContainer?.addEventListener("click", handleFavoriteClick);

function applyFilters() {
  const query = searchInput?.value ?? "";
  const selectedRegion = regionFilter?.value ?? "all";
  const countriesByRegion = filterByRegion(allCountries, selectedRegion);
  const filteredCountries = searchCountries(countriesByRegion, query);
  displayCountries(filteredCountries);
}

function handleFavoriteClick(event) {
  const favoriteButton = event.target.closest(".favorite-button");

  if (!favoriteButton) {
    return;
  }

  const countryCode = favoriteButton.dataset.countryCode;
  const selectedCountry = allCountries.find(
    (country) => (country.cca3 ?? country.name?.common) === countryCode
  );

  if (!selectedCountry) {
    return;
  }

  addToFavorites(selectedCountry);
  console.log("Favorites:", getFavorites());
}
