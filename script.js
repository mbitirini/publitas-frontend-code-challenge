const canvas = document.getElementById('sliderCanvas');
const ctx = canvas.getContext('2d');

// Canvas size
const canvasWidth = 640;
const canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Images to load
const imagePaths = ['images/0.jpg', 'images/1.jpg', 'images/2.jpg', 'images/3.jpg'];
const images = [];
let offsetX = 0;
let isDragging = false;
let startX = 0;

// Preload images
let loadedCount = 0;
imagePaths.forEach((path, index) => {
  const img = new Image();
  img.src = path;
  img.onload = () => {
    images[index] = img;   
    loadedCount++;
    // Draw when all images loaded
    if (loadedCount === imagePaths.length) {
      draw(); 
    }
  };
});

// Adjust image size to fit canvas while keeping aspect ratio
function getImageSize(img) {
  const ratio = img.width / img.height;
  let w = img.width;
  let h = img.height;

  if (w > canvasWidth || h > canvasHeight) {
    if (ratio > canvasWidth / canvasHeight) {
      w = canvasWidth;
      h = w / ratio;
    } else {
      h = canvasHeight;
      w = h * ratio;
    }
  }
  return { w, h };
}

// Draw all images on the canvas based on current offset
function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = '#f2f2f2';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  images.forEach((img, i) => {
    const x = i * canvasWidth + offsetX; 

    // Skip drawing if completely off canvas
    if (x + canvasWidth < 0 || x > canvasWidth) return;

    const { w, h } = getImageSize(img);
    const y = (canvasHeight - h) / 2;
    const drawX = (canvasWidth - w) / 2 + x;
    ctx.drawImage(img, drawX, y, w, h);
  });
}

// Mouse events for drag-to-slide
canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  canvas.classList.add('dragging');
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  offsetX += dx;

  // Clamp offsetX to prevent scrolling past first/last image
  const maxOffset = 0;
  const minOffset = -((images.length - 1) * canvasWidth);
  if (offsetX > maxOffset) offsetX = maxOffset;
  if (offsetX < minOffset) offsetX = minOffset;

  startX = e.clientX;
  draw();
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.classList.remove('dragging');
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
  canvas.classList.remove('dragging');
});
