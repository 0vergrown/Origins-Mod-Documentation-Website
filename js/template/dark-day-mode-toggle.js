function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const button = document.querySelector(".moon-button, .sun-button");
    if (document.body.classList.contains("dark-mode")) {
        button.innerHTML = "☀";
        button.classList.remove("moon-button");
        button.classList.add("sun-button");
    } else {
        button.innerHTML = "☾";
        button.classList.remove("sun-button");
        button.classList.add("moon-button");
    }
}
document.getElementById("year").textContent = new Date().getFullYear();