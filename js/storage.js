const FAVORITES_KEY = "countryExplorerFavorites";

export function getFavorites() {
  const favorites = localStorage.getItem(FAVORITES_KEY);

  if (!favorites) {
    return [];
  }

  try {
    return JSON.parse(favorites);
  } catch (error) {
    console.error("Unable to parse favorites from storage.", error);
    return [];
  }
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
