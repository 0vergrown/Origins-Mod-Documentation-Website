document.addEventListener("DOMContentLoaded", async function () {
    const sidebarMenu = document.getElementById("sidebar-menu");
    const markdownContent = document.getElementById("markdownContent");
    const headersMenu = document.getElementById("headers-menu");

    const viewerType = window.location.pathname.includes("data_pack")
        ? "data_pack"
        : "addon"; // Determine the type of viewer based on the URL

    function capitalizeAndFormat(str) {
        return str
            .replace(/^\d+_/, "") // Remove leading numbers and underscore
            .replace(/_/g, " ") // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
    }

    async function loadSidebar() {
        try {
            const response = await fetch("assets/data/documentation_file_structure.json");
            if (!response.ok) throw new Error("Failed to fetch file structure");

            const fileStructure = (await response.json())[viewerType]; // Load only relevant section

            for (const folder in fileStructure) {
                const folderItem = document.createElement("li");
                folderItem.textContent = capitalizeAndFormat(folder);
                folderItem.classList.add("folder");
                sidebarMenu.appendChild(folderItem);

                const sublist = document.createElement("ul");
                fileStructure[folder].forEach((file) => {
                    const fileItem = document.createElement("li");
                    fileItem.textContent = capitalizeAndFormat(file.replace(".md", ""));
                    fileItem.classList.add("file-item");
                    fileItem.onclick = () => loadMarkdown(folder, file);
                    sublist.appendChild(fileItem);
                });
                sidebarMenu.appendChild(sublist);
            }
        } catch (error) {
            console.error("Error loading sidebar:", error);
            sidebarMenu.innerHTML = "<p>Failed to load sidebar. Please try again later.</p>";
        }
    }

    async function loadMarkdown(folder, fileName) {
        const filePath = `docs/${viewerType}/${folder}/${fileName}`;
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Failed to fetch file: ${filePath}`);

            let markdownText = await response.text();

            // Remove metadata
            const metadataRegex = /^---[\s\S]*?---\s*/;
            markdownText = markdownText.replace(metadataRegex, "");

            markdownContent.innerHTML = marked.parse(markdownText);
            addCopyButtonsToCodeBlocks();
            populateHeaders(markdownText);
            highlightActiveFile(folder, fileName);
        } catch (error) {
            console.error("Error loading markdown:", error);
            markdownContent.innerHTML = "<p>Failed to load content. Please try again later.</p>";
        }
    }

    function addCopyButtonsToCodeBlocks() {
        const codeBlocks = markdownContent.querySelectorAll("pre");
        codeBlocks.forEach((block) => {
            const copyButton = document.createElement("button");
            copyButton.className = "copy-button";
            copyButton.innerHTML =
                '<img src="https://img.icons8.com/material-outlined/24/000000/copy.png" alt="Copy Icon">';
            block.appendChild(copyButton);

            copyButton.onclick = () => {
                const code = block.querySelector("code").innerText;
                navigator.clipboard.writeText(code).then(() => {
                    copyButton.innerHTML =
                        '<img src="https://img.icons8.com/material-outlined/24/000000/checkmark.png" alt="Copied Icon">';
                    setTimeout(
                        () =>
                            (copyButton.innerHTML =
                                '<img src="https://img.icons8.com/material-outlined/24/000000/copy.png" alt="Copy Icon">'),
                        2000
                    );
                });
            };
        });
    }

    function populateHeaders(markdownText) {
        headersMenu.innerHTML = "";
        const lines = markdownText.split("\n");
        lines.forEach((line) => {
            if (line.startsWith("#")) {
                const headerItem = document.createElement("li");
                headerItem.textContent = line.replace(/^#+\s*/, "");
                headersMenu.appendChild(headerItem);
            }
        });
    }

    function highlightActiveFile(folder, fileName) {
        const fileItems = document.querySelectorAll(".file-item");
        fileItems.forEach((item) => item.classList.remove("active"));

        const activeFileItem = Array.from(fileItems).find(
            (item) => item.textContent === capitalizeAndFormat(fileName.replace(".md", ""))
        );
        if (activeFileItem) {
            activeFileItem.classList.add("active");
        }
    }

    async function loadMarkdownFromQuery() {
        const filePath = new URLSearchParams(window.location.search).get("file");
        if (filePath) {
            const [folder, fileName] = filePath.split("/").slice(-2);
            await loadMarkdown(folder, fileName);
        } else {
            markdownContent.innerHTML = "<p>Please select a file from the sidebar.</p>";
        }
    }

    await loadSidebar(); // Dynamically load sidebar
    await loadMarkdownFromQuery(); // Load file if specified in query
});