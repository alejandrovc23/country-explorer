import { renderCountryCards } from "./display.js";
import { getFavorites, saveFavorite } from "./storage.js";

export function addToFavorites(country) {
  return saveFavorite(country);
}

export function displayFavorites() {
  const favoritesContainer = document.querySelector("#favoritesContainer");
  const favorites = getFavorites();

  renderCountryCards(favoritesContainer, favorites, { showFavoriteButton: false });
}
