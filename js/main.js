import { getAllCountries } from "./api.js";
import { displayCountries } from "./display.js";
import { searchCountries } from "./search.js";

console.log("Country Explorer initialized");

const searchInput = document.querySelector("#country-search");
const searchButton = document.querySelector(".search-controls button");

let allCountries = [];

loadCountries();

async function loadCountries() {
  const countries = await getAllCountries();
  console.log(countries);

  allCountries = countries ?? [];
  displayCountries(allCountries);
}

searchButton?.addEventListener("click", handleSearch);

function handleSearch() {
  const query = searchInput?.value ?? "";
  const filteredCountries = searchCountries(allCountries, query);
  displayCountries(filteredCountries);
}
