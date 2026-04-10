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
    const { primaryFlagUrl, fallbackFlagUrl } = getCountryFlagUrls(country);
    const flagAlt = country.flags?.alt ?? `${countryName} flag`;

    countryCard.dataset.countryCode = countryCode;
    countryCard.tabIndex = 0;

    countryCard.innerHTML = `
      <img class="country-flag" src="${primaryFlagUrl}" alt="${flagAlt}">
      <div class="country-card-content">
        <h3>${countryName}</h3>
        <p><strong>Region:</strong> ${region}</p>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${population}</p>
        <button type="button" class="favorite-button" data-country-code="${countryCode}">&#11088; Add to Favorites</button>
      </div>
    `;

    const flagImage = countryCard.querySelector(".country-flag");

    if (flagImage) {
      attachFlagFallback(flagImage, fallbackFlagUrl);
    }

    resultsContainer.appendChild(countryCard);
  });
}

export function getCountryFlagUrls(country) {
  const countryCode = country.cca2?.toLowerCase();
  const cdnFlagUrl = countryCode ? `https://flagcdn.com/w320/${countryCode}.png` : "";
  const primaryFlagUrl = country.flags?.svg ?? country.flags?.png ?? cdnFlagUrl;
  const fallbackFlagUrl = country.flags?.png ?? cdnFlagUrl;

  return {
    primaryFlagUrl,
    fallbackFlagUrl: fallbackFlagUrl !== primaryFlagUrl ? fallbackFlagUrl : ""
  };
}

export function attachFlagFallback(imageElement, fallbackFlagUrl) {
  imageElement.onerror = () => {
    if (fallbackFlagUrl && imageElement.src !== fallbackFlagUrl) {
      imageElement.src = fallbackFlagUrl;
      return;
    }

    imageElement.onerror = null;
    imageElement.removeAttribute("src");
  };
}
