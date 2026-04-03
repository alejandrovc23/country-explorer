export function searchCountries(countries, query) {
  const normalizedQuery = query.toLowerCase().trim();

  return countries.filter((country) =>
    country.name.common.toLowerCase().includes(normalizedQuery)
  );
}
