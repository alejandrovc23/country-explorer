const FAVORITES_KEY = "favoritesCountries";
const REGION_KEY = "selectedRegion";
const SEARCH_KEY = "lastSearch";
const RECENT_KEY = "recentCountries";
const DARK_MODE_KEY = "countryExplorerDarkMode";

function readJson(key, fallbackValue) {
  const value = localStorage.getItem(key);

  if (!value) {
    return fallbackValue;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(`Unable to parse localStorage key "${key}".`, error);
    return fallbackValue;
  }
}

export function getFavorites() {
  return readJson(FAVORITES_KEY, []);
}

export function saveFavorite(country) {
  const favorites = getFavorites();
  const countryCode = country.cca3 ?? country.name?.common;
  const alreadySaved = favorites.some(
    (favorite) => (favorite.cca3 ?? favorite.name?.common) === countryCode
  );

  if (alreadySaved) {
    return favorites;
  }

  const updatedFavorites = [...favorites, country];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  return updatedFavorites;
}

export function removeFavorite(countryName) {
  const updatedFavorites = getFavorites().filter(
    (favorite) => (favorite.name?.common ?? "") !== countryName
  );

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  return updatedFavorites;
}

export function getSelectedRegion() {
  return localStorage.getItem(REGION_KEY) ?? "all";
}

export function saveSelectedRegion(region) {
  localStorage.setItem(REGION_KEY, region);
}

export function getLastSearch() {
  return localStorage.getItem(SEARCH_KEY) ?? "";
}

export function saveLastSearch(query) {
  localStorage.setItem(SEARCH_KEY, query);
}

export function getRecentCountries() {
  return readJson(RECENT_KEY, []);
}

export function saveRecentCountry(country) {
  const recentCountries = getRecentCountries();
  const countryName = country.name?.common ?? "Unknown country";
  const filteredCountries = recentCountries.filter((entry) => entry !== countryName);
  const updatedCountries = [countryName, ...filteredCountries].slice(0, 6);

  localStorage.setItem(RECENT_KEY, JSON.stringify(updatedCountries));
  return updatedCountries;
}

export function getDarkModePreference() {
  return localStorage.getItem(DARK_MODE_KEY) === "true";
}

export function saveDarkModePreference(isDarkMode) {
  localStorage.setItem(DARK_MODE_KEY, String(isDarkMode));
}
