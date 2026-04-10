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

export function renderCountryCards(container, countries, options = {}) {
  if (!container) {
    return;
  }

  const { favorites = [], compact = false } = options;
  container.innerHTML = "";

  countries.forEach((country) => {
    const countryCard = createCountryCard(country, {
      isFavorite: favorites.includes(country.cca3 ?? country.name?.common ?? ""),
      compact
    });
    container.appendChild(countryCard);
  });
}

function createCountryCard(country, options) {
  const { isFavorite, compact } = options;
  const article = document.createElement("article");
  article.className = "country-card";

  const countryCode = country.cca3 ?? country.name?.common ?? "";
  const countryName = country.name?.common ?? "Unknown country";
  const region = country.region ?? "Unknown region";
  const capital = country.capital?.[0] ?? "No capital listed";
  const population = country.population?.toLocaleString() ?? "Unknown population";
  const { primaryFlagUrl, fallbackFlagUrl } = getCountryFlagUrls(country);
  const flagAlt = country.flags?.alt ?? `${countryName} flag`;

  article.dataset.countryCode = countryCode;
  article.dataset.countryName = countryName;
  article.tabIndex = 0;

  article.innerHTML = `
    <img class="country-flag" src="${primaryFlagUrl}" alt="${flagAlt}">
    <div class="country-card-content">
      <h3>${countryName}</h3>
      <p><strong>Region:</strong> ${region}</p>
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Population:</strong> ${population}</p>
      <div class="card-actions">
        <button type="button" class="favorite-button" data-country-code="${countryCode}">
          ${isFavorite ? "Saved" : "Add to Favorites"}
        </button>
        ${compact ? `<button type="button" class="remove-favorite" data-country-name="${countryName}">Remove</button>` : ""}
      </div>
    </div>
  `;

  const flagImage = article.querySelector(".country-flag");

  if (flagImage) {
    attachFlagFallback(flagImage, fallbackFlagUrl);
  }

  return article;
}

export function renderRecentCountries(container, recentCountries) {
  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (recentCountries.length === 0) {
    container.innerHTML = `<span class="recent-chip">No countries opened yet.</span>`;
    return;
  }

  recentCountries.forEach((countryName) => {
    const chip = document.createElement("span");
    chip.className = "recent-chip";
    chip.textContent = countryName;
    container.appendChild(chip);
  });
}

export function renderPagination(currentPage, totalPages) {
  const previousButton = document.querySelector("#previousPageButton");
  const nextButton = document.querySelector("#nextPageButton");
  const paginationLabel = document.querySelector("#paginationLabel");
  const paginationControls = document.querySelector("#paginationControls");

  if (!previousButton || !nextButton || !paginationLabel || !paginationControls) {
    return;
  }

  const safeTotalPages = Math.max(totalPages, 1);
  paginationLabel.textContent = `Page ${currentPage} of ${safeTotalPages}`;
  previousButton.disabled = currentPage <= 1;
  nextButton.disabled = currentPage >= safeTotalPages;
  paginationControls.hidden = totalPages <= 1;
}

export function setStatusVisibility({ isLoading, hasError, hasNoResults }) {
  const loadingSpinner = document.querySelector("#loadingSpinner");
  const errorMessage = document.querySelector("#errorMessage");
  const noResultsMessage = document.querySelector("#noResultsMessage");
  const resultsContainer = document.querySelector("#results");

  loadingSpinner?.toggleAttribute("hidden", !isLoading);
  errorMessage?.toggleAttribute("hidden", !hasError);
  noResultsMessage?.toggleAttribute("hidden", !hasNoResults);
  resultsContainer?.toggleAttribute("hidden", isLoading || hasError || hasNoResults);
}

export function setErrorMessage(message) {
  const errorMessage = document.querySelector("#errorMessage");

  if (errorMessage) {
    errorMessage.textContent = message;
  }
}

export function updateHoverStatus(countryName) {
  const hoverStatus = document.querySelector("#hoverStatus");

  if (!hoverStatus) {
    return;
  }

  hoverStatus.textContent = countryName
    ? `Previewing ${countryName}`
    : "Hover over a country card to preview it.";
}

export function populateModal(country) {
  const modalFlag = document.querySelector("#modalFlag");
  const modalCountryName = document.querySelector("#modalCountryName");
  const modalCapital = document.querySelector("#modalCapital");
  const modalRegion = document.querySelector("#modalRegion");
  const modalSubregion = document.querySelector("#modalSubregion");
  const modalPopulation = document.querySelector("#modalPopulation");
  const modalArea = document.querySelector("#modalArea");
  const modalLanguages = document.querySelector("#modalLanguages");
  const modalCurrencies = document.querySelector("#modalCurrencies");

  if (
    !modalFlag ||
    !modalCountryName ||
    !modalCapital ||
    !modalRegion ||
    !modalSubregion ||
    !modalPopulation ||
    !modalArea ||
    !modalLanguages ||
    !modalCurrencies
  ) {
    return;
  }

  const countryName = country.name?.common ?? "Unknown country";
  const capital = country.capital?.[0] ?? "No capital listed";
  const { primaryFlagUrl, fallbackFlagUrl } = getCountryFlagUrls(country);

  modalFlag.src = primaryFlagUrl;
  modalFlag.alt = country.flags?.alt ?? `${countryName} flag`;
  attachFlagFallback(modalFlag, fallbackFlagUrl);
  modalCountryName.textContent = countryName;
  modalCapital.textContent = capital;
  modalRegion.textContent = country.region ?? "Unknown region";
  modalSubregion.textContent = country.subregion ?? "Unknown subregion";
  modalPopulation.textContent = country.population?.toLocaleString() ?? "Unknown population";
  modalArea.textContent = typeof country.area === "number" ? `${country.area.toLocaleString()} km²` : "Unknown area";
  modalLanguages.textContent = Object.values(country.languages ?? {}).join(", ") || "No languages listed";
  modalCurrencies.textContent = Object.values(country.currencies ?? {})
    .map((currency) => currency.name)
    .join(", ") || "No currencies listed";
}

export function setWeatherLoadingState(capital) {
  setWeatherState({
    heading: `Weather in ${capital}`,
    status: "Loading weather...",
    temperature: "--",
    windSpeed: "--"
  });
}

export function setWeatherUnavailableState(capital) {
  setWeatherState({
    heading: `Weather in ${capital}`,
    status: "Weather data unavailable",
    temperature: "--",
    windSpeed: "--"
  });
}

export function setWeatherData(capital, weather) {
  setWeatherState({
    heading: `Weather in ${capital}`,
    status: "",
    temperature: typeof weather.temperature === "number" ? `${weather.temperature}°C` : "--",
    windSpeed: typeof weather.windspeed === "number" ? `${weather.windspeed} km/h` : "--"
  });
}

function setWeatherState({ heading, status, temperature, windSpeed }) {
  const modalWeatherHeading = document.querySelector("#modalWeatherHeading");
  const modalWeatherStatus = document.querySelector("#modalWeatherStatus");
  const modalTemperature = document.querySelector("#modalTemperature");
  const modalWindSpeed = document.querySelector("#modalWindSpeed");

  if (!modalWeatherHeading || !modalWeatherStatus || !modalTemperature || !modalWindSpeed) {
    return;
  }

  modalWeatherHeading.textContent = heading;
  modalWeatherStatus.textContent = status;
  modalTemperature.textContent = temperature;
  modalWindSpeed.textContent = windSpeed;
}

export function openModal() {
  const countryModal = document.querySelector("#countryModal");
  countryModal?.classList.add("is-open");
  countryModal?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

export function closeModal() {
  const countryModal = document.querySelector("#countryModal");
  countryModal?.classList.remove("is-open");
  countryModal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}
