const videoUrls = [
    "https://www.youtube.com/embed/Te97bhqy0Ds?si=63M9DY87kgvNkdx6",
    "https://www.youtube.com/embed/OIXg6zFmW9c?si=mKTlXKbQmA6Mc_eg",
    "https://www.youtube.com/embed/INc5lFjHHg4?si=uSdB9dg-aG1KJ6eL",
    "https://www.youtube.com/embed/fsJp7FvhGeU?si=36TzKgOWSCUYAmir",
    "https://www.youtube.com/embed/-MkcduFPnjc?si=WLa3NW4-bG12gMn8"
];

function getRandomVideoUrl() {
    const randomIndex = Math.floor(Math.random() * videoUrls.length);
    return videoUrls[randomIndex];
}

document.getElementById("random-video").src = getRandomVideoUrl();