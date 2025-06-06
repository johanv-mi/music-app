let artists = [];
let selectedList = [];

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

function addToPlaylist(artistId) {
  const artist = artists.find((a) => a.id === parseInt(artistId));
  if (artist && !selectedList.some((a) => a.id === artist.id)) {
    selectedList.push(artist);
    renderPlaylist();
  }
}

function renderPlaylist() {
  listContent.innerHTML = "";

  if (selectedList.length === 0) {
    listContent.innerHTML =
      "<p>Your playlist is empty. Add songs from the artists list.</p>";
    return;
  }

  const playlistList = document.createElement("ul");
  playlistList.className = "playlist-list";

  selectedList.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.className = "playlist-item";

    const songInfo = document.createElement("div");
    songInfo.className = "song-info";

    const artistName = document.createElement("h4");
    artistName.textContent = item.artist;

    const songTitle = document.createElement("p");
    songTitle.textContent = item.title;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-from-list";
    removeButton.textContent = "×";
    removeButton.title = "Remove from playlist";
    removeButton.dataset.index = index;

    songInfo.appendChild(artistName);
    songInfo.appendChild(songTitle);

    listItem.appendChild(songInfo);
    listItem.appendChild(removeButton);

    playlistList.appendChild(listItem);
  });

  listContent.appendChild(playlistList);
}

function removeFromPlaylist(index) {
  selectedList.splice(index, 1);
  renderPlaylist();
}

function savePlaylist() {
  if (selectedList.length > 0) {
    localStorage.setItem("savedPlaylist", JSON.stringify(selectedList));
    alert("Playlist saved successfully!");
  } else {
    alert("Cannot save an empty playlist.");
  }
}

function clearPlaylist() {
  if (selectedList.length > 0) {
    if (confirm("Are you sure you want to clear your playlist?")) {
      selectedList = [];
      renderPlaylist();
    }
  } else {
    alert("Playlist is already empty.");
  }
}

function setupEventListeners() {
  genreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      genreButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      filterArtistsByGenre(button.textContent);
    });
  });

  contentDiv.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-list")) {
      const listItem = event.target.closest(".artist-item");
      if (listItem) {
        addToPlaylist(listItem.dataset.id);
      }
    }
  });

  listContent.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-list")) {
      const index = parseInt(event.target.dataset.index);
      removeFromPlaylist(index);
    }
  });

  if (saveListButton) {
    saveListButton.addEventListener("click", savePlaylist);
  }

  if (clearListButton) {
    clearListButton.addEventListener("click", clearPlaylist);
  }

  const savedPlaylist = localStorage.getItem("savedPlaylist");
  if (savedPlaylist) {
    selectedList = JSON.parse(savedPlaylist);
    renderPlaylist();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchArtists();

  const allButton = document.querySelector(
    ".genreContainer button:first-child"
  );
  if (allButton) {
    allButton.classList.add("active");
  }
});
