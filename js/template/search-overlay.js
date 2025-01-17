const searchOverlay = document.getElementById("searchOverlay");
const searchInput = document.getElementById("searchInput");
const recentSearches = document.getElementById("recentSearches");

let markdownFiles = []; // Array to store file paths and metadata

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

// Load file structure dynamically from JSON and extract metadata from markdown files
async function loadFileStructure() {
    try {
        const response = await fetch("assets/data/documentation_file_structure.json");
        if (!response.ok) throw new Error("Failed to fetch file structure");

        const structure = await response.json();

        for (const [type, folders] of Object.entries(structure)) {
            const viewer =
                type === "data_pack"
                    ? "data_pack_documentation.html"
                    : "addon_documentation.html";

            for (const [folder, files] of Object.entries(folders)) {
                for (const file of files) {
                    const filePath = `docs/${type}/${folder}/${file}`;

                    try {
                        // Fetch the markdown file to extract metadata
                        const fileResponse = await fetch(filePath);
                        if (!fileResponse.ok) {
                            console.warn(`Failed to fetch file: ${filePath}`);
                            continue;
                        }

                        const content = await fileResponse.text();
                        const metadata = extractMetadata(content);

                        // Use the extracted title or fall back to file name
                        markdownFiles.push({
                            filePath,
                            metadata: {
                                title: metadata?.title || file.replace(".md", "").replace(/_/g, " "),
                                ...metadata, // Include other metadata if needed
                            },
                            viewer,
                        });
                    } catch (error) {
                        console.error(`Error loading file: ${filePath}`, error);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error loading file structure:", error);
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
                metadata[key] = value.replace(/"|'/g, "").trim();
            });
        return metadata;
    }
    return null;
}

// Perform search based on input
function performSearch(query) {
    const results = markdownFiles.filter((file) =>
        file.metadata.title.toLowerCase().includes(query.toLowerCase())
    );
    displaySearchResults(results);
}

// Display search results and handle navigation
function displaySearchResults(results) {
    recentSearches.innerHTML = results.length
        ? results
              .map(
                  (result) =>
                      `<div>
                          <a href="${result.viewer}?file=${encodeURIComponent(
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
    await loadFileStructure();

    // Handle search input changes
    searchInput.addEventListener("input", (event) => {
        const query = event.target.value.trim();
        if (query) {
            performSearch(query);
        } else {
            recentSearches.innerHTML = "No recent searches";
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