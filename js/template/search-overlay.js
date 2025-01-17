const searchOverlay = document.getElementById("searchOverlay");
const searchInput = document.getElementById("searchInput");
const recentSearches = document.getElementById("recentSearches");

let markdownFiles = []; // Array to store file paths and metadata
let searches = [];

// Open the search overlay
function openSearchOverlay() {
    searchOverlay.style.display = "flex";
    searchInput.focus();
}

// Close the search overlay
function closeSearchOverlay() {
    searchOverlay.style.display = "none";
}

// Clear the search input
function clearSearchInput() {
    searchInput.value = "";
}

// Load all markdown files and extract their metadata
async function loadMarkdownFiles() {
    const fileStructure = {
        introduction: ["overview.md", "getting_started.md", "format.md"],
        datapack_guides: ["define_origin.md", "define_power.md"],
        json_format: ["badge.md", "origin.md", "power.md"],
    };

    for (const folder in fileStructure) {
        for (const fileName of fileStructure[folder]) {
            const filePath = `docs/${folder}/${fileName}`;
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    const content = await response.text();
                    const metadata = extractMetadata(content);
                    if (metadata) {
                        markdownFiles.push({ filePath, metadata });
                    }
                }
            } catch (error) {
                console.error(`Failed to load file ${filePath}:`, error);
            }
        }
    }
}

// Extract metadata from markdown content
function extractMetadata(content) {
    const metadataRegex = /^---[\s\S]*?---/;
    const match = content.match(metadataRegex);
    if (match) {
        const metadataBlock = match[0];
        const metadata = {};
        metadataBlock
            .split("\n")
            .filter((line) => line.includes(":"))
            .forEach((line) => {
                const [key, value] = line.split(":").map((item) => item.trim());
                metadata[key] = value.replace(/"|'/g, "").split(",").map((item) => item.trim());
            });
        return metadata;
    }
    return null;
}

// Perform search based on input
function performSearch(query) {
    const results = markdownFiles.filter((file) =>
        Object.values(file.metadata).some((value) =>
            Array.isArray(value)
                ? value.some((item) => item.toLowerCase().includes(query.toLowerCase()))
                : value.toLowerCase().includes(query.toLowerCase())
        )
    );
    displaySearchResults(results);
}

// Display search results and redirect on click
function displaySearchResults(results) {
    recentSearches.innerHTML = results.length
        ? results
              .map(
                  (result) =>
                      `<div>
                          <a href="data_pack_documentation.html?file=${encodeURIComponent(
                              result.filePath
                          )}" class="search-result">
                              ${result.metadata.title}
                          </a>
                      </div>`
              )
              .join("")
        : "No results found.";
}

// Initialize search overlay functionality
document.addEventListener("DOMContentLoaded", async () => {
    await loadMarkdownFiles();

    // Handle search input changes
    searchInput.addEventListener("input", (event) => {
        const query = event.target.value.trim();
        if (query) {
            searches.push(query);
            performSearch(query);
        }
    });

    // Open overlay with CTRL + K
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key === "k") {
            event.preventDefault();
            openSearchOverlay();
        }
        if (event.key === "Escape") {
            closeSearchOverlay();
        }
    });
});