import { renderCountryCards } from "./display.js";
import { getFavorites, removeFavorite, saveFavorite } from "./storage.js";

export function addToFavorites(country) {
  return saveFavorite(country);
}

export function displayFavorites() {
  const favoritesContainer = document.querySelector("#favoritesContainer");
  const favorites = getFavorites();

  renderCountryCards(favoritesContainer, favorites, {
    showFavoriteButton: false,
    showRemoveButton: true
  });
}

export function removeFromFavorites(countryName) {
  removeFavorite(countryName);
  displayFavorites();
}
