const fs = require('node:fs');
const path = require('node:path');
const receiptline = require('receiptline');
const sharp = require('sharp');

const root = __dirname;
const out = path.join(root, 'out');
const logo = fs.readFileSync(path.join(root, 'assets', 'olaso-wordmark-black.svg'));
const profile = { cpl: 48, encoding: 'cp858', spacing: true };

async function main() {
  const sizes = [240, 300, 360];
  const sections = [];

  for (const width of sizes) {
    const png = await sharp(logo)
      .resize({ width })
      .flatten({ background: '#ffffff' })
      .png()
      .toBuffer();

    sections.push(`^"${width} DOTS"`, `{image:${png.toString('base64')}}`);
  }

  const source = [
    '{width:auto;align:center}',
    '^^^"OLASO LOGO SIZE TEST"',
    ...sections,
  ].join('\n\n');

  fs.mkdirSync(out, { recursive: true });

  const rawString = receiptline.transform(source, {
    ...profile,
    command: 'generic',
    cutting: true,
    gradient: false,
  });
  let raw = Buffer.from(rawString, 'binary');

  // The Windows RAW queue cannot return the trailing printer-status response.
  const statusQuery = Buffer.from([0x1d, 0x72, 0x31]);
  if (raw.subarray(-statusQuery.length).equals(statusQuery)) {
    raw = raw.subarray(0, -statusQuery.length);
  }

  fs.writeFileSync(path.join(out, 'logo-size-test.bin'), raw);
  fs.writeFileSync(
    path.join(out, 'logo-size-test.svg'),
    receiptline.transform(source, { ...profile, command: 'svg' }),
  );

  console.log(`Generated three centered logo sizes in ${out}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
