export function displayCountries(countries) {
  const resultsContainer = document.querySelector("#results");

  if (!resultsContainer) {
    return;
  }

  resultsContainer.innerHTML = "";

  countries.forEach((country) => {
    const countryCard = document.createElement("article");
    countryCard.className = "country-card";

    const countryCode = country.cca3 ?? country.name?.common ?? "";
    const countryName = country.name?.common ?? "Unknown country";
    const region = country.region ?? "Unknown region";
    const capital = country.capital?.[0] ?? "No capital listed";
    const population = country.population?.toLocaleString() ?? "Unknown population";
    const flagUrl = country.flags?.png ?? country.flags?.svg ?? "";
    const flagAlt = country.flags?.alt ?? `${countryName} flag`;

    countryCard.innerHTML = `
      <img class="country-flag" src="${flagUrl}" alt="${flagAlt}">
      <div class="country-card-content">
        <h3>${countryName}</h3>
        <p><strong>Region:</strong> ${region}</p>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${population}</p>
        <button type="button" class="favorite-button" data-country-code="${countryCode}">⭐ Add to Favorites</button>
      </div>
    `;

    resultsContainer.appendChild(countryCard);
  });
}
