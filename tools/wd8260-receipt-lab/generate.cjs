const fs = require('node:fs');
const path = require('node:path');
const receiptline = require('receiptline');
const sharp = require('sharp');

const root = __dirname;
const sourceTemplate = fs.readFileSync(path.join(root, 'receipt.receipt'), 'utf8');
const out = path.join(root, 'out');
const profile = { cpl: 48, encoding: 'cp858', spacing: true };

async function main() {
  const logo = await sharp(path.join(root, 'assets', 'olaso-wordmark-black.svg'))
    .resize({ width: 300 })
    .flatten({ background: '#ffffff' })
    .png()
    .toBuffer();
  const rawSource = sourceTemplate.replace('{{OLASO_LOGO}}\n\n', '');
  const previewSource = sourceTemplate.replace('{{OLASO_LOGO}}', `{image:${logo.toString('base64')}}`);

  fs.mkdirSync(out, { recursive: true });

  const rawString = receiptline.transform(rawSource, {
    ...profile,
    command: 'generic',
    cutting: true,
    gradient: false,
  });
  const nvLogoRecall = Buffer.from([
    0x1b, 0x40,               // ESC @: initialize
    0x1b, 0x61, 0x01,         // ESC a 1: center
    0x1c, 0x70, 0x01, 0x00,   // FS p 1 0: print stored logo
    0x0a,                     // preserve the approved gap below the logo
  ]);
  let raw = Buffer.concat([nvLogoRecall, Buffer.from(rawString, 'binary')]);

  // The Windows RAW queue cannot return the trailing printer-status response.
  const statusQuery = Buffer.from([0x1d, 0x72, 0x31]);
  if (raw.subarray(-statusQuery.length).equals(statusQuery)) {
    raw = raw.subarray(0, -statusQuery.length);
  }

  fs.writeFileSync(path.join(out, 'receipt.bin'), raw);
  fs.writeFileSync(
    path.join(out, 'receipt.svg'),
    receiptline.transform(previewSource, { ...profile, command: 'svg' }),
  );
  fs.writeFileSync(
    path.join(out, 'receipt.txt'),
    receiptline.transform(rawSource, { ...profile, command: 'text' }),
  );

  console.log(`Generated ${raw.length} ESC/POS bytes in ${out}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
