// List of image names to be used in the gallery
const images = [
  "anchor.jpg",
  "banzai.jpg",
  "bells.jpg",
  "boilers.jpg",
  "cangu.jpg",
  "chickens.jpg",
  "jaws.jpg",
  "jeffreys.jpg",
  "lacanau.jpg",
  "main-point.jpg",
  "midigama.jpg",
  "nazare.jpg",
  "padang.jpg",
  "peniche.jpg",
  "puerto.jpg",
  "santa.jpg",
  "skeleton.jpg",
  "snapper.jpg",
  "teahupoo.jpg",
  "waikiki.jpg",
];

// Keeps track of the current image index
let currentImage = -1;
let myInterval;

// Function to switch to the next image in the array
function nextImage() {
  currentImage++;

  // If we've gone past the end, start over
  if (currentImage >= images.length) {
    currentImage = 0;
  }

  const img = document.querySelector("#gallery img");
  img.src = `images/${images[currentImage]}`;
}

// Function to switch to the previous image in the array
function prevImage() {
  currentImage--;

  // If we've gone past the beginning, loop to the end
  if (currentImage < 0) {
    currentImage = images.length - 1;
  }

  // Get the image and set its source to the current image
  const img = document.querySelector("#gallery img");
  img.src = `images/${images[currentImage]}`;
}

window.addEventListener("keydown", (ev) => {
  if (ev.key == "ArrowRight") {
    prevImage();
  } else if (ev.key == "ArrowLeft") {
    nextImage();
  }
});

// Function to start the auto slideshow
function startAuto() {
  // Stop any existing slideshow to avoid duplicates
  stopAuto();
  myInterval = setInterval(nextImage, 5 * 1000);
}

function stopAuto() {
  clearInterval(myInterval);
}

// Function to open the modal
function openModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "block";

  // Add the 'show' class to animate the modal entrance
  setTimeout(() => modal.classList.add("show"), 10);

  // Update the modal with the current image's description
  document.getElementById("desc").innerText = descriptions[currentImage];
  stopAuto();
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("show");

  // After the animation finishes, hide the modal
  setTimeout(() => (modal.style.display = "none"), 300);

  // Restart the auto slideshow when modal closes
  startAuto();
}

// Start with the next image and auto slideshow when the script loads
nextImage();
startAuto();
