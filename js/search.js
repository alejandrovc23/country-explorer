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
