document.addEventListener('DOMContentLoaded', function () {
    const sidebarMenu = document.getElementById('sidebar-menu');
    const markdownContent = document.getElementById('markdownContent');
    const headersMenu = document.getElementById('headers-menu');

    function capitalizeAndFormat(str) {
        return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }

    function createSidebar() {
        const fileStructure = {
            'introduction': [
                'overview.md',
                'getting_started.md',
                'format.md'
            ],
            'datapack_guides': [
                'define_origin.md',
                'define_power.md',
                'origin_conditions_in_layers.md'
            ],
            'json_format': [
                'badge.md',
                'global_power_set.md',
                'origin.md',
                'origin_layer.md',
                'power.md'
            ],
            'general_types': [
                'badge_types.md',
                'data_types.md',
                'power_types.md'
            ],
            'action_types': [
                'bientity_action_types.md',
                'block_action_types.md',
                'entity_action_types.md',
                'item_action_types.md',
                'meta_action_types.md'
            ],
            'condition_types': [
                'bientity_condition_types.md',
                'biome_condition_types.md',
                'block_condition_types.md',
                'damage_condition_types.md',
                'entity_condition_types.md',
                'fluid_condition_types.md',
                'item_condition_types.md',
                'meta_condition_types.md'
            ],
            'miscellaneous': [
                'advancement_triggers.md',
                'base_contents.md',
                'commands.md',
                'item_modifiers.md',
                'items.md',
                'predicates.md'
            ],
            'extras': [
                'biome_categories.md',
                'damage_source_names.md',
                'feature_renderers.md',
                'keybindings.md',
                'positioned_item_stack_slots.md',
                'sprites.md',
                'value_modifying_power_classes.md'
            ]
        };

        for (const folder in fileStructure) {
            const folderItem = document.createElement('li');
            folderItem.textContent = capitalizeAndFormat(folder);
            folderItem.classList.add('folder');
            sidebarMenu.appendChild(folderItem);

            const sublist = document.createElement('ul');
            fileStructure[folder].forEach(file => {
                const fileItem = document.createElement('li');
                fileItem.textContent = capitalizeAndFormat(file.replace('.md', ''));
                fileItem.classList.add('file-item');
                fileItem.onclick = () => loadMarkdown(folder, file);
                sublist.appendChild(fileItem);
            });
            sidebarMenu.appendChild(sublist);
        }
    }

    async function loadMarkdown(folder, fileName) {
        try {
            const response = await fetch(`docs/${folder}/${fileName}`);
            if (!response.ok) {
                throw new Error('Failed to load markdown file');
            }
            let markdownText = await response.text();

            // Use a refined regex to ensure metadata is removed
            const metadataRegex = /^---[\s\S]*?---\s*/;
            if (metadataRegex.test(markdownText)) {
                markdownText = markdownText.replace(metadataRegex, '');
            }

            markdownContent.innerHTML = marked.parse(markdownText);
            addCopyButtonsToCodeBlocks();
            populateHeaders(markdownText);
            handleLinksWithinViewer();
            highlightActiveFile(folder, fileName);
        } catch (error) {
            console.error('Error loading markdown:', error);
            markdownContent.innerHTML = '<p>Failed to load content. Please try again later.</p>';
        }
    }

    function addCopyButtonsToCodeBlocks() {
        const codeBlocks = markdownContent.querySelectorAll('pre');
        codeBlocks.forEach((block) => {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = '<img src="https://img.icons8.com/material-outlined/24/000000/copy.png" alt="Copy Icon">';
            block.appendChild(copyButton);

            copyButton.onclick = () => {
                const code = block.querySelector('code').innerText;
                navigator.clipboard.writeText(code).then(() => {
                    copyButton.innerHTML = '<img src="https://img.icons8.com/material-outlined/24/000000/checkmark.png" alt="Copied Icon">';
                    setTimeout(() => copyButton.innerHTML = '<img src="https://img.icons8.com/material-outlined/24/000000/copy.png" alt="Copy Icon">', 2000);
                }).catch(err => console.error('Failed to copy: ', err));
            };
        });
    }

    function populateHeaders(markdownText) {
        headersMenu.innerHTML = '';
        const lines = markdownText.split('\n');
        lines.forEach(line => {
            if (line.startsWith('#')) {
                const headerItem = document.createElement('li');
                headerItem.textContent = line.replace(/^#+\s*/, '');
                headersMenu.appendChild(headerItem);
            }
        });
    }

    function handleLinksWithinViewer() {
        const links = markdownContent.querySelectorAll('a');
        links.forEach(link => {
            link.onclick = function (event) {
                event.preventDefault();
                const href = link.getAttribute('href');
                if (href.endsWith('.md')) {
                    const [folder, fileName] = href.split('/').slice(-2);
                    loadMarkdown(folder, fileName);
                } else {
                    window.open(href, '_blank');
                }
            };
        });
    }

    function highlightActiveFile(folder, fileName) {
        const fileItems = document.querySelectorAll('.file-item');
        fileItems.forEach(item => item.classList.remove('active'));

        const activeFileItem = Array.from(fileItems).find(item =>
            item.textContent === capitalizeAndFormat(fileName.replace('.md', ''))
        );
        if (activeFileItem) {
            activeFileItem.classList.add('active');
        }
    }

    // Parse query parameters
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Load markdown file from query parameter
    async function loadMarkdownFromQuery() {
        const filePath = getQueryParameter('file');
        if (filePath) {
            const [folder, fileName] = filePath.split('/').slice(-2);
            await loadMarkdown(folder, fileName);
        }
    }

    createSidebar();
    loadMarkdownFromQuery(); // Load the markdown file if specified in the query
});