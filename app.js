let artists = [];

const contentDiv = document.querySelector(".artistContainer .content");
const genreButtons = document.querySelectorAll(".genreContainer button");
const listContent = document.querySelector(".listContainer .content");
const saveListButton = document.querySelector(
  ".footerContainerList button:nth-child(1)"
);
const clearListButton = document.querySelector(
  ".footerContainerList button:nth-child(2)"
);

async function fetchArtists() {
  try {
    const response = await fetch("artists.json");
    if (!response.ok) {
      throw new Error("Failed to fetch artists data");
    }
    const data = await response.json();
    artists = data.artists;
    renderArtists(artists);
    setupEventListeners();
  } catch (error) {
    console.error("Error loading artists:", error);
    contentDiv.innerHTML =
      "<p>Error loading artists. Please try again later.</p>";
  }
}
