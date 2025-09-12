document.addEventListener("DOMContentLoaded", async function() {
    const sidebarMenu = document.getElementById("sidebar-menu");
    const markdownContent = document.getElementById("markdownContent");
    const headersMenu = document.getElementById("headers-menu");

    const viewerType = window.location.pathname.includes("data_pack") ?
        "data_pack" :
        "addon";

    function capitalizeAndFormat(str) {
        return str
            .replace(/^\d+_/, "")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    async function loadSidebar() {
        try {
            const response = await fetch("assets/data/documentation_file_structure.json");
            if (!response.ok) throw new Error("Failed to fetch file structure");

            const fileStructure = (await response.json())[viewerType];

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

            // Remove metadata block if present
            const metadataRegex = /^---[\s\S]*?---\s*/;
            markdownText = markdownText.replace(metadataRegex, "");

            // Use marked.js to parse markdown
            markdownContent.innerHTML = marked.parse(markdownText);

            addCopyButtonsToCodeBlocks();
            populateHeaders(markdownText);
            highlightActiveFile(folder, fileName);
        } catch (error) {
            console.error("Error loading markdown:", error);
            markdownContent.innerHTML = `<p>Error loading: ${error.message}. Please check the console for details.</p>`;
        }
    }

    function addCopyButtonsToCodeBlocks() {
        const codeBlocks = markdownContent.querySelectorAll("pre");
        codeBlocks.forEach((block) => {
            const copyButton = document.createElement("button");
            copyButton.className = "copy-button";
            copyButton.innerHTML = '<img src="https://img.icons8.com/material-outlined/24/000000/copy.png" alt="Copy Icon">';
            block.appendChild(copyButton);

            copyButton.onclick = () => {
                const code = block.querySelector("code").innerText;
                navigator.clipboard.writeText(code).then(() => {
                    copyButton.innerHTML = '<img src="https://img.icons8.com/material-outlined/24/000000/checkmark.png" alt="Copied Icon">';
                    setTimeout(
                        () => copyButton.innerHTML = '<img src="https://img.icons8.com/material-outlined/24/000000/copy.png" alt="Copy Icon">',
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
            const pathParts = filePath.split("/");
            const folder = pathParts[pathParts.length - 2];
            const fileName = pathParts[pathParts.length - 1];
            await loadMarkdown(folder, fileName);
        } else {
            markdownContent.innerHTML = "<p>Please select a file from the sidebar.</p>";
        }
    }

    await loadSidebar();
    await loadMarkdownFromQuery();
});