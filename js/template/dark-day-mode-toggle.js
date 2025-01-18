// Function to toggle dark mode
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    const button = document.querySelector(".moon-button, .sun-button");
    const buttonIcon = button.querySelector("img");

    // Save the dark mode preference in localStorage
    localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");

    // Update the button icon and alt text
    if (isDarkMode) {
        buttonIcon.src = "assets/template/images/navigation_bar/sun.svg";
        buttonIcon.alt = "Sun Icon";
        button.classList.remove("moon-button");
        button.classList.add("sun-button");
    } else {
        buttonIcon.src = "assets/template/images/navigation_bar/moon.svg";
        buttonIcon.alt = "Moon Icon";
        button.classList.remove("sun-button");
        button.classList.add("moon-button");
    }
}

// Function to apply dark mode on page load based on localStorage
function applyDarkModePreference() {
    const darkModePreference = localStorage.getItem("darkMode");

    if (darkModePreference === "enabled") {
        document.body.classList.add("dark-mode");

        // Update the button icon and alt text
        const button = document.querySelector(".moon-button, .sun-button");
        const buttonIcon = button.querySelector("img");
        buttonIcon.src = "assets/template/images/navigation_bar/sun.svg";
        buttonIcon.alt = "Sun Icon";
        button.classList.remove("moon-button");
        button.classList.add("sun-button");
    }
}

// Apply dark mode preference on page load
document.addEventListener("DOMContentLoaded", function () {
    applyDarkModePreference();
    document.getElementById("year").textContent = new Date().getFullYear();
});
