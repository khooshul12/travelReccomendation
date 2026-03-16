let travelData = null;

const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

fetch("travel_recommendation_api.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to load JSON");
    }
    return response.json();
  })
  .then(data => {
    travelData = data;
    console.log("Data loaded:", data);
  })
  .catch(error => {
    console.error("Error loading JSON:", error);
  });

searchBtn.addEventListener("click", function () {
  if (!travelData) {
    resultsContainer.innerHTML = "<p style='color:white;'>Data is still loading...</p>";
    return;
  }

  const keyword = searchInput.value.trim().toLowerCase();
  resultsContainer.innerHTML = "";

  let results = [];

  // beach / beaches
  if (keyword === "beach" || keyword === "beaches") {
    results = travelData.beaches.slice(0, 2);
  }

  // temple / temples
  else if (keyword === "temple" || keyword === "temples") {
    results = travelData.temples.slice(0, 2);
  }

  // country search → only 2 cities from that country
  else {
    const matchedCountry = travelData.countries.find(country =>
      country.name.toLowerCase() === keyword ||
      country.name.toLowerCase().includes(keyword)
    );

    if (matchedCountry) {
      results = matchedCountry.cities.slice(0, 2);
    }
  }

  if (results.length === 0) {
    resultsContainer.innerHTML = "<p style='color:white;'>No results found.</p>";
    return;
  }

  displayResults(results, keyword);
});

function displayResults(results, keyword) {
  let heading = "Search Results";

  if (keyword === "beach" || keyword === "beaches") {
    heading = "Beach Recommendations";
  } else if (keyword === "temple" || keyword === "temples") {
    heading = "Temple Recommendations";
  } else {
    heading = "Country Recommendations";
  }

  resultsContainer.innerHTML = `
    <h2 class="results-title">${heading}</h2>
    <div class="results-grid" id="resultsGrid"></div>
  `;

  const resultsGrid = document.getElementById("resultsGrid");

  results.forEach(place => {
    const card = document.createElement("div");
    card.classList.add("result-card");

    card.innerHTML = `
      <img src="${place.imageUrl}" alt="${place.name}">
      <h3>${place.name}</h3>
      <p>${place.description}</p>
      <button>Visit</button>
    `;

    resultsGrid.appendChild(card);
  });
}

clearBtn.addEventListener("click", function () {
  searchInput.value = "";
  resultsContainer.innerHTML = "";
});
