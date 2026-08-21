const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = __dirname;
const out = path.join(root, 'out');

async function main() {
  const { data, info } = await sharp(path.join(root, 'assets', 'olaso-wordmark-black.svg'))
    .resize({ width: 300 })
    .flatten({ background: '#ffffff' })
    // The WD8260 rotates legacy NV images 90° clockwise when recalling them.
    .rotate(270, { background: '#ffffff' })
    .greyscale()
    .threshold(128)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const widthBytes = Math.ceil(info.width / 8);
  const heightBytes = Math.ceil(info.height / 8);
  const image = Buffer.alloc(widthBytes * heightBytes * 8);
  let offset = 0;

  // The WD8260 consumes FS q image data in the same row-packed form as GS v 0.
  for (let y = 0; y < heightBytes * 8; y += 1) {
    for (let byteX = 0; byteX < widthBytes; byteX += 1) {
      let row = 0;
      for (let bit = 0; bit < 8; bit += 1) {
        const x = byteX * 8 + bit;
        // Flip vertically before storage; the WD8260 transpose makes this horizontal on paper.
        const sourceY = info.height - 1 - y;
        if (x < info.width && y < info.height && data[sourceY * info.width + x] === 0) {
          row |= 0x80 >> bit;
        }
      }
      image[offset] = row;
      offset += 1;
    }
  }

  const write = Buffer.concat([
    Buffer.from([
      0x1b, 0x40,             // ESC @: initialize
      0x1c, 0x71, 0x01,       // FS q: define one NV image
      // WD8260 firmware reads the legacy dimension fields in height/width order.
      heightBytes & 0xff, heightBytes >> 8,
      widthBytes & 0xff, widthBytes >> 8,
    ]),
    image,
  ]);
  const recall = Buffer.from([
    0x1b, 0x40,               // ESC @: initialize
    0x1b, 0x61, 0x01,         // ESC a 1: center
    0x1c, 0x70, 0x01, 0x00,   // FS p 1 0: print NV image 1 at normal size
    0x0a, 0x0a, 0x0a,
    0x1d, 0x56, 0x42, 0x00,   // partial cut
  ]);

  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'nv-logo-write.bin'), write);
  fs.writeFileSync(path.join(out, 'nv-logo-recall.bin'), recall);

  console.log(`Generated ${info.width}x${info.height}-dot pre-rotated WD8260 NV logo (${image.length} image bytes)`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
