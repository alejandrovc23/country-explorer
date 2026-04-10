import { saveFavorite } from "./storage.js";

export function addToFavorites(country) {
  return saveFavorite(country);
}
