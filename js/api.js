const COUNTRY_FIELDS = [
  "name",
  "capital",
  "region",
  "population",
  "flags",
  "cca2",
  "cca3",
  "latlng"
].join(",");

export async function getAllCountries() {
  return fetchCountriesByUrl(
    `https://restcountries.com/v3.1/all?fields=${COUNTRY_FIELDS}`
  );
}

export async function getCountriesByRegion(region) {
  return fetchCountriesByUrl(
    `https://restcountries.com/v3.1/region/${region}?fields=${COUNTRY_FIELDS}`
  );
}

async function fetchCountriesByUrl(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getCountryWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    if (!response.ok) {
      throw new Error(`Weather request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.current_weather ?? null;
  } catch (error) {
    console.error("Weather API error:", error);
    return null;
  }
}
