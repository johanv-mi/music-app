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

function renderArtists(artistsToRender) {
  contentDiv.innerHTML = "";

  if (artistsToRender.length === 0) {
    contentDiv.innerHTML = "<p>No artists found for this genre.</p>";
    return;
  }

  const artistList = document.createElement("ul");
  artistList.className = "artist-list";

  artistsToRender.forEach((artist) => {
    const listItem = document.createElement("li");
    listItem.className = "artist-item";
    listItem.dataset.id = artist.id;

    const artistName = document.createElement("h4");
    artistName.textContent = artist.artist;

    const songTitle = document.createElement("p");
    songTitle.textContent = artist.title;

    const genreTag = document.createElement("span");
    genreTag.className = "genre-tag";
    genreTag.textContent = artist.genre;

    const addButton = document.createElement("button");
    addButton.className = "add-to-list";
    addButton.textContent = "+";
    addButton.title = "Add to playlist";

    listItem.appendChild(artistName);
    listItem.appendChild(songTitle);
    listItem.appendChild(genreTag);
    listItem.appendChild(addButton);

    artistList.appendChild(listItem);
  });

  contentDiv.appendChild(artistList);
}

function filterArtistsByGenre(genre) {
  if (genre === "All") {
    renderArtists(artists);
  } else {
    const filteredArtists = artists.filter((artist) => artist.genre === genre);
    renderArtists(filteredArtists);
  }
}
