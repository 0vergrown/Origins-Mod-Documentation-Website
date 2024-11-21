// JavaScript to handle hero image rotation
const images = document.querySelectorAll('.hero-images img');
let currentImageIndex = 0;
function rotateImages() {
    images[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images[currentImageIndex].classList.add('active');
}
setInterval(rotateImages, 5000); // Rotate every 5 seconds