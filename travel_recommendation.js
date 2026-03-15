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

  if (keyword === "beach" || keyword === "beaches") {
    results = travelData.beaches;
  } else if (keyword === "temple" || keyword === "temples") {
    results = travelData.temples;
  } else {
    travelData.countries.forEach(country => {
      if (country.name.toLowerCase().includes(keyword)) {
        results = results.concat(country.cities);
      }

      country.cities.forEach(city => {
        if (
          city.name.toLowerCase().includes(keyword) ||
          city.description.toLowerCase().includes(keyword)
        ) {
          results.push(city);
        }
      });
    });

    travelData.temples.forEach(temple => {
      if (
        temple.name.toLowerCase().includes(keyword) ||
        temple.description.toLowerCase().includes(keyword)
      ) {
        results.push(temple);
      }
    });

    travelData.beaches.forEach(beach => {
      if (
        beach.name.toLowerCase().includes(keyword) ||
        beach.description.toLowerCase().includes(keyword)
      ) {
        results.push(beach);
      }
    });
  }

  if (results.length === 0) {
    resultsContainer.innerHTML = "<p style='color:white;'>No results found.</p>";
    return;
  }

  displayResults(results);
});

function displayResults(results) {
  resultsContainer.innerHTML = "";

  results.forEach(place => {
    const card = document.createElement("div");
    card.classList.add("result-card");

    card.innerHTML = `
      <img src="${place.imageUrl}" alt="${place.name}">
      <h3>${place.name}</h3>
      <p>${place.description}</p>
      <button>Visit</button>
    `;

    resultsContainer.appendChild(card);
  });
}

clearBtn.addEventListener("click", function () {
  searchInput.value = "";
  resultsContainer.innerHTML = "";
});