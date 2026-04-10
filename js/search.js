export function searchCountries(countries, query) {
  const normalizedQuery = query.toLowerCase().trim();

  return countries.filter((country) =>
    country.name.common.toLowerCase().includes(normalizedQuery)
  );
}

export function filterByRegion(countries, region) {
  const normalizedRegion = region.toLowerCase().trim();

  if (normalizedRegion === "all") {
    return countries;
  }

  return countries.filter(
    (country) => country.region?.toLowerCase() === normalizedRegion
  );
}

export function sortCountries(countries, option) {
  const countriesToSort = [...countries];

  if (option === "population") {
    return countriesToSort.sort(
      (firstCountry, secondCountry) =>
        (secondCountry.population ?? 0) - (firstCountry.population ?? 0)
    );
  }

  return countriesToSort.sort((firstCountry, secondCountry) =>
    (firstCountry.name?.common ?? "").localeCompare(
      secondCountry.name?.common ?? ""
    )
  );
}
