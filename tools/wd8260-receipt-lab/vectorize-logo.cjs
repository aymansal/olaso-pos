const fs = require('node:fs');
const path = require('node:path');
const ImageTracer = require('imagetracerjs');
const { PNG } = require('pngjs');

const input = path.join(__dirname, 'assets', 'olaso-wordmark-black-transparent.png');
const output = path.join(__dirname, 'assets', 'olaso-wordmark-black.svg');
const source = PNG.sync.read(fs.readFileSync(input));

let left = source.width;
let top = source.height;
let right = -1;
let bottom = -1;

for (let y = 0; y < source.height; y += 1) {
  for (let x = 0; x < source.width; x += 1) {
    if (source.data[(y * source.width + x) * 4 + 3] >= 128) {
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
}

if (right < left || bottom < top) throw new Error('The logo has no visible pixels.');

const padding = 24;
left = Math.max(0, left - padding);
top = Math.max(0, top - padding);
right = Math.min(source.width - 1, right + padding);
bottom = Math.min(source.height - 1, bottom + padding);

const width = right - left + 1;
const height = bottom - top + 1;
const data = Buffer.alloc(width * height * 4);

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const sourceIndex = ((top + y) * source.width + left + x) * 4;
    const targetIndex = (y * width + x) * 4;
    data[targetIndex + 3] = source.data[sourceIndex + 3] >= 128 ? 255 : 0;
  }
}

const svg = ImageTracer.imagedataToSVG(
  { width, height, data },
  {
    ltres: 0.35,
    qtres: 0.35,
    pathomit: 4,
    rightangleenhance: false,
    colorsampling: 0,
    colorquantcycles: 1,
    layering: 0,
    strokewidth: 0,
    roundcoords: 2,
    viewbox: true,
    pal: [
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 0, b: 0, a: 255 },
    ],
  },
);

fs.writeFileSync(output, svg);
console.log(`Generated path-based SVG: ${output}`);
