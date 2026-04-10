export async function getAllCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,cca2,cca3"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}
