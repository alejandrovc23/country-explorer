import { getAllCountries, getCountriesByRegion, getCountryWeather } from "./api.js";
import { attachFlagFallback, displayCountries, getCountryFlagUrls } from "./display.js";
import { addToFavorites, displayFavorites, removeFromFavorites } from "./favorites.js";
import { searchCountries, sortCountries } from "./search.js";
import {
  getDarkModePreference,
  getFavorites,
  getLastSearch,
  getRecentCountries,
  getSelectedRegion,
  saveDarkModePreference,
  saveLastSearch,
  saveRecentCountry,
  saveSelectedRegion
} from "./storage.js";

const ITEMS_PER_PAGE = 20;

const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#country-search");
const regionFilter = document.querySelector("#regionFilter");
const sortSelect = document.querySelector("#sortSelect");
const darkModeToggle = document.querySelector("#darkModeToggle");
const loadingElement = document.querySelector("#loadingSpinner");
const errorMessage = document.querySelector("#errorMessage");
const noResultsMessage = document.querySelector("#noResultsMessage");
const hoverStatus = document.querySelector("#hoverStatus");
const paginationControls = document.querySelector("#paginationControls");
const paginationLabel = document.querySelector("#paginationLabel");
const previousPageButton = document.querySelector("#previousPageButton");
const nextPageButton = document.querySelector("#nextPageButton");
const favoritesContainer = document.querySelector("#favoritesContainer");
const recentCountriesContainer = document.querySelector("#recentCountries");
const resultsContainer = document.querySelector("#results");
const countryModal = document.querySelector("#countryModal");
const closeModalButton = document.querySelector("#closeModalButton");
const modalFlag = document.querySelector("#modalFlag");
const modalCountryName = document.querySelector("#modalCountryName");
const modalCapital = document.querySelector("#modalCapital");
const modalRegion = document.querySelector("#modalRegion");
const modalSubregion = document.querySelector("#modalSubregion");
const modalPopulation = document.querySelector("#modalPopulation");
const modalArea = document.querySelector("#modalArea");
const modalLanguages = document.querySelector("#modalLanguages");
const modalCurrencies = document.querySelector("#modalCurrencies");
const modalWeatherHeading = document.querySelector("#modalWeatherHeading");
const modalWeatherStatus = document.querySelector("#modalWeatherStatus");
const modalTemperature = document.querySelector("#modalTemperature");
const modalWindSpeed = document.querySelector("#modalWindSpeed");

let allCountries = [];
let visibleCountries = [];
let currentPage = 1;
let activeWeatherRequestId = 0;

initializeApp();

function initializeApp() {
  initializeDarkMode();
  hydrateSavedFilters();
  renderRecentCountries();
  displayFavorites();
  attachEventListeners();
  loadCountries();
}

function attachEventListeners() {
  searchForm?.addEventListener("submit", handleSearchSubmit);
  searchInput?.addEventListener("input", handleSearchInput);
  regionFilter?.addEventListener("change", handleRegionChange);
  sortSelect?.addEventListener("change", handleSortChange);
  darkModeToggle?.addEventListener("click", toggleDarkMode);
  previousPageButton?.addEventListener("click", () => changePage(-1));
  nextPageButton?.addEventListener("click", () => changePage(1));
  resultsContainer?.addEventListener("click", handleResultsClick);
  resultsContainer?.addEventListener("mouseover", handleResultsMouseover);
  favoritesContainer?.addEventListener("click", handleFavoritesClick);
  closeModalButton?.addEventListener("click", closeCountryModal);
  countryModal?.addEventListener("click", handleModalClick);
  document.addEventListener("keydown", handleDocumentKeydown);
}

function hydrateSavedFilters() {
  if (searchInput) {
    searchInput.value = getLastSearch();
  }

  if (regionFilter) {
    regionFilter.value = getSelectedRegion();
  }
}

async function loadCountries() {
  showLoading();
  hideError();

  try {
    allCountries = await getAllCountries();
    await refreshVisibleCountries();
  } catch (error) {
    console.error("Error fetching countries:", error);
    allCountries = [];
    visibleCountries = [];
    displayCountries([]);
    showError("Failed to load countries. Please try again.");
  } finally {
    hideLoading();
  }
}

async function refreshVisibleCountries() {
  const selectedRegion = regionFilter?.value ?? "all";

  if (selectedRegion === "all") {
    visibleCountries = [...allCountries];
  } else {
    visibleCountries = await getCountriesByRegion(selectedRegion);
  }

  applyFilters();
}

function applyFilters() {
  const query = searchInput?.value ?? "";
  const selectedSortOption = sortSelect?.value ?? "name";
  const filteredCountries = searchCountries(visibleCountries, query);
  const sortedCountries = sortCountries(filteredCountries, selectedSortOption);

  renderResults(sortedCountries);
}

function renderResults(countries) {
  const totalPages = Math.max(1, Math.ceil(countries.length / ITEMS_PER_PAGE));

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCountries = countries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const shouldShowNoResults = countries.length === 0;

  toggleNoResultsMessage(shouldShowNoResults);
  displayCountries(paginatedCountries);
  updatePagination(totalPages, shouldShowNoResults);
}

function updatePagination(totalPages, shouldHide) {
  if (!paginationControls || !paginationLabel || !previousPageButton || !nextPageButton) {
    return;
  }

  paginationControls.hidden = shouldHide || totalPages <= 1;
  paginationLabel.textContent = `Page ${currentPage} of ${totalPages}`;
  previousPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;
}

function showLoading() {
  loadingElement?.removeAttribute("hidden");
  errorMessage?.setAttribute("hidden", "");
  noResultsMessage?.setAttribute("hidden", "");
  paginationControls?.setAttribute("hidden", "");
  resultsContainer?.setAttribute("hidden", "");
}

function hideLoading() {
  loadingElement?.setAttribute("hidden", "");
  resultsContainer?.removeAttribute("hidden");
}

function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.removeAttribute("hidden");
  }

  resultsContainer?.setAttribute("hidden", "");
  paginationControls?.setAttribute("hidden", "");
  noResultsMessage?.setAttribute("hidden", "");
}

function hideError() {
  errorMessage?.setAttribute("hidden", "");
}

function toggleNoResultsMessage(shouldShow) {
  if (shouldShow) {
    noResultsMessage?.removeAttribute("hidden");
    resultsContainer?.setAttribute("hidden", "");
    return;
  }

  noResultsMessage?.setAttribute("hidden", "");
  resultsContainer?.removeAttribute("hidden");
}

function handleSearchSubmit(event) {
  event.preventDefault();
  currentPage = 1;
  saveLastSearch(searchInput?.value ?? "");
  applyFilters();
}

function handleSearchInput() {
  currentPage = 1;
  saveLastSearch(searchInput?.value ?? "");
  applyFilters();
}

async function handleRegionChange() {
  currentPage = 1;
  saveSelectedRegion(regionFilter?.value ?? "all");
  showLoading();
  hideError();

  try {
    await refreshVisibleCountries();
  } catch (error) {
    console.error("Error fetching region countries:", error);
    visibleCountries = [];
    displayCountries([]);
    showError("Failed to load countries. Please try again.");
  } finally {
    hideLoading();
  }
}

function handleSortChange() {
  currentPage = 1;
  applyFilters();
}

function changePage(direction) {
  const totalPages = Math.max(1, Math.ceil(searchCountries(visibleCountries, searchInput?.value ?? "").length / ITEMS_PER_PAGE));
  const nextPage = currentPage + direction;

  if (nextPage < 1 || nextPage > totalPages) {
    return;
  }

  currentPage = nextPage;
  applyFilters();
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

  const selectedCountry = findCountryByCode(countryCard.dataset.countryCode);

  if (selectedCountry) {
    openCountryModal(selectedCountry);
  }
}

function handleResultsMouseover(event) {
  const countryCard = event.target.closest(".country-card");

  if (!hoverStatus) {
    return;
  }

  hoverStatus.textContent = countryCard
    ? `Previewing ${countryCard.dataset.countryName ?? "country"}`
    : "Hover over a country card to preview it.";
}

function handleFavoriteClick(favoriteButton) {
  const countryCode = favoriteButton.dataset.countryCode;
  const selectedCountry = findCountryByCode(countryCode);

  if (!selectedCountry) {
    return;
  }

  addToFavorites(selectedCountry);
  displayFavorites();
}

function handleFavoritesClick(event) {
  const removeButton = event.target.closest(".remove-favorite");

  if (removeButton) {
    removeFromFavorites(removeButton.dataset.countryName ?? "");
    return;
  }

  const countryCard = event.target.closest(".country-card");

  if (!countryCard) {
    return;
  }

  const selectedCountry = findFavoriteByCode(countryCard.dataset.countryCode);

  if (selectedCountry) {
    openCountryModal(selectedCountry);
  }
}

function findCountryByCode(countryCode) {
  if (!countryCode) {
    return null;
  }

  return allCountries.find(
    (country) => (country.cca3 ?? country.name?.common) === countryCode
  ) ?? visibleCountries.find(
    (country) => (country.cca3 ?? country.name?.common) === countryCode
  ) ?? null;
}

function findFavoriteByCode(countryCode) {
  if (!countryCode) {
    return null;
  }

  return getFavorites().find(
    (country) => (country.cca3 ?? country.name?.common) === countryCode
  ) ?? null;
}

async function openCountryModal(country) {
  if (
    !countryModal ||
    !modalFlag ||
    !modalCountryName ||
    !modalCapital ||
    !modalRegion ||
    !modalSubregion ||
    !modalPopulation ||
    !modalArea ||
    !modalLanguages ||
    !modalCurrencies ||
    !modalWeatherHeading ||
    !modalWeatherStatus ||
    !modalTemperature ||
    !modalWindSpeed
  ) {
    return;
  }

  const countryName = country.name?.common ?? "Unknown country";
  const capital = country.capital?.[0] ?? "No capital listed";
  const region = country.region ?? "Unknown region";
  const subregion = country.subregion ?? "Unavailable";
  const population = country.population?.toLocaleString() ?? "Unknown population";
  const area = typeof country.area === "number" ? `${country.area.toLocaleString()} km²` : "Unavailable";
  const languages = Object.values(country.languages ?? {}).join(", ") || "Unavailable";
  const currencies = Object.values(country.currencies ?? {})
    .map((currency) => currency.name)
    .join(", ") || "Unavailable";
  const { primaryFlagUrl, fallbackFlagUrl } = getCountryFlagUrls(country);
  const flagAlt = country.flags?.alt ?? `${countryName} flag`;

  modalFlag.src = primaryFlagUrl;
  modalFlag.alt = flagAlt;
  attachFlagFallback(modalFlag, fallbackFlagUrl);
  modalCountryName.textContent = countryName;
  modalCapital.textContent = capital;
  modalRegion.textContent = region;
  modalSubregion.textContent = subregion;
  modalPopulation.textContent = population;
  modalArea.textContent = area;
  modalLanguages.textContent = languages;
  modalCurrencies.textContent = currencies;
  setWeatherLoadingState(capital);
  saveRecentCountry(country);
  renderRecentCountries();

  countryModal.classList.add("is-open");
  countryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const [lat, lon] = country.latlng ?? [];

  if (typeof lat !== "number" || typeof lon !== "number") {
    setWeatherUnavailableState(capital);
    return;
  }

  const requestId = ++activeWeatherRequestId;
  const weather = await getCountryWeather(lat, lon);

  if (requestId !== activeWeatherRequestId || !countryModal.classList.contains("is-open")) {
    return;
  }

  if (!weather) {
    setWeatherUnavailableState(capital);
    return;
  }

  setWeatherData(capital, weather);
}

function closeCountryModal() {
  if (!countryModal) {
    return;
  }

  activeWeatherRequestId += 1;
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

function renderRecentCountries() {
  if (!recentCountriesContainer) {
    return;
  }

  const recentCountries = getRecentCountries();
  recentCountriesContainer.innerHTML = "";

  if (recentCountries.length === 0) {
    recentCountriesContainer.innerHTML = '<span class="recent-chip">No countries opened yet.</span>';
    return;
  }

  recentCountries.forEach((countryName) => {
    const chip = document.createElement("span");
    chip.className = "recent-chip";
    chip.textContent = countryName;
    recentCountriesContainer.appendChild(chip);
  });
}

function initializeDarkMode() {
  const prefersDarkMode = getDarkModePreference();
  document.body.classList.toggle("dark-mode", prefersDarkMode);
  updateDarkModeToggleLabel(prefersDarkMode);
}

function toggleDarkMode() {
  const isDarkMode = !document.body.classList.contains("dark-mode");
  document.body.classList.toggle("dark-mode", isDarkMode);
  saveDarkModePreference(isDarkMode);
  updateDarkModeToggleLabel(isDarkMode);
}

function updateDarkModeToggleLabel(isDarkMode) {
  if (!darkModeToggle) {
    return;
  }

  darkModeToggle.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
}

function setWeatherLoadingState(capital) {
  if (
    !modalWeatherHeading ||
    !modalWeatherStatus ||
    !modalTemperature ||
    !modalWindSpeed
  ) {
    return;
  }

  modalWeatherHeading.textContent = `Weather in ${capital}`;
  modalWeatherStatus.textContent = "Loading weather...";
  modalTemperature.textContent = "--";
  modalWindSpeed.textContent = "--";
}

function setWeatherUnavailableState(capital) {
  if (
    !modalWeatherHeading ||
    !modalWeatherStatus ||
    !modalTemperature ||
    !modalWindSpeed
  ) {
    return;
  }

  modalWeatherHeading.textContent = `Weather in ${capital}`;
  modalWeatherStatus.textContent = "Weather data unavailable";
  modalTemperature.textContent = "--";
  modalWindSpeed.textContent = "--";
}

function setWeatherData(capital, weather) {
  if (
    !modalWeatherHeading ||
    !modalWeatherStatus ||
    !modalTemperature ||
    !modalWindSpeed
  ) {
    return;
  }

  modalWeatherHeading.textContent = `Weather in ${capital}`;
  modalWeatherStatus.textContent = "";
  modalTemperature.textContent =
    typeof weather.temperature === "number" ? `${weather.temperature}°C` : "--";
  modalWindSpeed.textContent =
    typeof weather.windspeed === "number" ? `${weather.windspeed} km/h` : "--";
}
