function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const button = document.querySelector(".moon-button, .sun-button");
    const buttonIcon = button.querySelector("img");

    if (document.body.classList.contains("dark-mode")) {
        buttonIcon.src = document.body.classList.contains("dark-mode") ? "assets/template/images/navigation_bar/sun.svg" : "assets/template/images/navigation_bar/moon.svg";
        buttonIcon.style.filter = "brightness(0.8)";
        buttonIcon.alt = "Sun Icon";
        button.classList.remove("moon-button");
        button.classList.add("sun-button");
    } else {
        buttonIcon.src = document.body.classList.contains("dark-mode") ? "assets/template/images/navigation_bar/sun.svg" : "assets/template/images/navigation_bar/moon.svg";
        buttonIcon.style.filter = "brightness(0.8)";
        buttonIcon.alt = "Moon Icon";
        button.classList.remove("sun-button");
        button.classList.add("moon-button");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("year").textContent = new Date().getFullYear();
});