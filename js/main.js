import { getAllCountries } from "./api.js";
import { displayCountries } from "./display.js";

console.log("Country Explorer initialized");

loadCountries();

async function loadCountries() {
  const countries = await getAllCountries();
  console.log(countries);
  displayCountries(countries);
}
