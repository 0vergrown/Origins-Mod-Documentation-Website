const searchOverlay = document.getElementById("searchOverlay");
const searchInput = document.getElementById("searchInput");
const recentSearches = document.getElementById("recentSearches");
let searches = [];

function openSearchOverlay() {
    searchOverlay.style.display = "flex";
    searchInput.focus();
}

function closeSearchOverlay() {
    searchOverlay.style.display = "none";
}

function clearSearchInput() {
    searchInput.value = "";
}

// Open overlay with CTRL + K
document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        openSearchOverlay();
    }
    if (event.key === "Escape") {
        closeSearchOverlay();
    }
});

// Track recent searches
searchInput.addEventListener("change", function () {
    const value = searchInput.value.trim();
    if (value) {
        searches.push(value);
        updateRecentSearches();
    }
});

function updateRecentSearches() {
    if (searches.length > 0) {
        recentSearches.innerHTML = searches.map((search) => `<div>${search}</div>`).join("");
    } else {
        recentSearches.innerHTML = "NO RECENT SEARCHES";
    }
}