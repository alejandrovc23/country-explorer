import { getAllCountries } from "./api.js";

console.log("Country Explorer initialized");

loadCountries();

async function loadCountries() {
  const countries = await getAllCountries();
  console.log(countries);
}
