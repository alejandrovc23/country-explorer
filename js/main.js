import { getAllCountries } from "./api.js";
import { attachFlagFallback, displayCountries, getCountryFlagUrls } from "./display.js";
import { addToFavorites } from "./favorites.js";
import { filterByRegion, searchCountries, sortCountries } from "./search.js";
import { getFavorites } from "./storage.js";

console.log("Country Explorer initialized");

const searchInput = document.querySelector("#country-search");
const searchButton = document.querySelector(".search-controls button");
const regionFilter = document.querySelector("#regionFilter");
const sortSelect = document.querySelector("#sortSelect");
const resultsContainer = document.querySelector("#results");
const countryModal = document.querySelector("#countryModal");
const closeModalButton = document.querySelector("#closeModalButton");
const modalFlag = document.querySelector("#modalFlag");
const modalCountryName = document.querySelector("#modalCountryName");
const modalCapital = document.querySelector("#modalCapital");
const modalRegion = document.querySelector("#modalRegion");
const modalPopulation = document.querySelector("#modalPopulation");

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
sortSelect?.addEventListener("change", applyFilters);
resultsContainer?.addEventListener("click", handleResultsClick);
closeModalButton?.addEventListener("click", closeCountryModal);
countryModal?.addEventListener("click", handleModalClick);
document.addEventListener("keydown", handleDocumentKeydown);

function applyFilters() {
  const query = searchInput?.value ?? "";
  const selectedRegion = regionFilter?.value ?? "all";
  const selectedSortOption = sortSelect?.value ?? "name";
  const countriesByRegion = filterByRegion(allCountries, selectedRegion);
  const filteredCountries = searchCountries(countriesByRegion, query);
  const sortedCountries = sortCountries(filteredCountries, selectedSortOption);

  displayCountries(sortedCountries);
}

function handleResultsClick(event) {
  const favoriteButton = event.target.closest(".favorite-button");

  if (favoriteButton) {
    handleFavoriteClick(favoriteButton);
    return;
  }

  const countryCard = event.target.closest(".country-card");

  if (!countryCard) {
    return;
  }

  const countryCode = countryCard.dataset.countryCode;
  const selectedCountry = findCountryByCode(countryCode);

  if (!selectedCountry) {
    return;
  }

  openCountryModal(selectedCountry);
}

function handleFavoriteClick(favoriteButton) {
  const countryCode = favoriteButton.dataset.countryCode;
  const selectedCountry = findCountryByCode(countryCode);

  if (!selectedCountry) {
    return;
  }

  addToFavorites(selectedCountry);
  console.log("Favorites:", getFavorites());
}

function findCountryByCode(countryCode) {
  if (!countryCode) {
    return null;
  }

  return allCountries.find(
    (country) => (country.cca3 ?? country.name?.common) === countryCode
  );
}

function openCountryModal(country) {
  if (
    !countryModal ||
    !modalFlag ||
    !modalCountryName ||
    !modalCapital ||
    !modalRegion ||
    !modalPopulation
  ) {
    return;
  }

  const countryName = country.name?.common ?? "Unknown country";
  const capital = country.capital?.[0] ?? "No capital listed";
  const region = country.region ?? "Unknown region";
  const population = country.population?.toLocaleString() ?? "Unknown population";
  const { primaryFlagUrl, fallbackFlagUrl } = getCountryFlagUrls(country);
  const flagAlt = country.flags?.alt ?? `${countryName} flag`;

  modalFlag.src = primaryFlagUrl;
  modalFlag.alt = flagAlt;
  attachFlagFallback(modalFlag, fallbackFlagUrl);
  modalCountryName.textContent = countryName;
  modalCapital.textContent = capital;
  modalRegion.textContent = region;
  modalPopulation.textContent = population;
  countryModal.classList.add("is-open");
  countryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeCountryModal() {
  if (!countryModal) {
    return;
  }

  countryModal.classList.remove("is-open");
  countryModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function handleModalClick(event) {
  if (event.target instanceof Element && event.target.matches("[data-close-modal='true']")) {
    closeCountryModal();
  }
}

function handleDocumentKeydown(event) {
  if (event.key === "Escape") {
    closeCountryModal();
  }
}
