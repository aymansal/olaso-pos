const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

execFileSync(process.execPath, ['generate.cjs'], { cwd: __dirname });
execFileSync(process.execPath, ['generate-logo-test.cjs'], { cwd: __dirname });
execFileSync(process.execPath, ['generate-nv-logo.cjs'], { cwd: __dirname });

const out = path.join(__dirname, 'out');
const fixtures = path.join(__dirname, 'fixtures');
const raw = fs.readFileSync(path.join(out, 'receipt.bin'));
const source = fs.readFileSync(path.join(__dirname, 'receipt.receipt'), 'utf8');
const contains = bytes => raw.indexOf(Buffer.from(bytes)) !== -1;
const rasterCommand = Buffer.from([0x1d, 0x76, 0x30, 0x00]);
const logoRaster = raw.indexOf(rasterCommand);

assert.deepEqual([...raw.subarray(0, 9)], [0x1b, 0x40, 0x1b, 0x61, 0x01, 0x1c, 0x70, 0x01, 0x00], 'receipt must start with centered NV logo recall');
assert.ok(contains([0x1b, 0x74, 0x13]), 'missing WD8260 CP858 page 19');
assert.equal(logoRaster, -1, 'receipt must recall the stored logo instead of retransmitting raster pixels');
assert.ok(!contains([0x1d, 0x38, 0x4c]), 'unsupported Epson GS 8 L must not be emitted');
assert.ok(!contains([0x1c, 0x28, 0x41]), 'unsupported Epson FS ( A must not be emitted');
assert.ok(contains([0x1d, 0x56, 0x42, 0x00]), 'missing partial cut');
assert.notDeepEqual([...raw.subarray(-3)], [0x1d, 0x72, 0x31], 'status query must be stripped');
assert.match(fs.readFileSync(path.join(out, 'receipt.svg'), 'utf8'), /<image\b/, 'SVG preview must still show the logo');
const receiptText = fs.readFileSync(path.join(out, 'receipt.txt'), 'utf8');
assert.equal((receiptText.match(/^-{48}$/gm) || []).length, 4, 'receipt must contain four full-width separators');
assert.equal((receiptText.match(/\bMAD\b/g) || []).length, 1, 'currency must appear exactly once');
assert.doesNotMatch(source, /example\.com/i, 'receipt must not contain an example URL');
assert.ok(!contains([0x1d, 0x28, 0x6b]), 'receipt must not contain a QR command');

const logoTest = fs.readFileSync(path.join(out, 'logo-size-test.bin'));
let rasterCount = 0;
let offset = 0;
while ((offset = logoTest.indexOf(rasterCommand, offset)) !== -1) {
  rasterCount += 1;
  offset += rasterCommand.length;
}

assert.equal(rasterCount, 3, 'logo test must contain three raster images');
assert.ok(logoTest.indexOf(Buffer.from([0x1d, 0x56, 0x42, 0x00])) !== -1, 'logo test is missing partial cut');
assert.notDeepEqual([...logoTest.subarray(-3)], [0x1d, 0x72, 0x31], 'logo test status query must be stripped');
assert.match(fs.readFileSync(path.join(out, 'logo-size-test.svg'), 'utf8'), /<svg\b/);

const nvWrite = fs.readFileSync(path.join(out, 'nv-logo-write.bin'));
const nvRecall = fs.readFileSync(path.join(out, 'nv-logo-recall.bin'));
assert.deepEqual([...nvWrite.subarray(0, 5)], [0x1b, 0x40, 0x1c, 0x71, 0x01], 'NV write must initialize and define exactly one image');
assert.equal(nvWrite[5], 38, 'pre-rotated NV header must put the 304-dot padded height first');
assert.equal(nvWrite[7], 8, 'pre-rotated NV header must put the 64-dot padded width second');
assert.equal(nvWrite.length, 9 + nvWrite[5] * nvWrite[7] * 8, 'NV image byte count must match its encoded dimensions');
assert.ok(nvWrite.subarray(9).some(byte => byte !== 0), 'NV logo image must not be blank');
assert.ok(nvWrite.subarray(-32).every(byte => byte === 0), 'NV logo must end with four blank padded raster rows');
assert.deepEqual([...nvRecall.subarray(0, 9)], [0x1b, 0x40, 0x1b, 0x61, 0x01, 0x1c, 0x70, 0x01, 0x00], 'NV recall must center and print image 1 at normal size');
assert.deepEqual([...nvRecall.subarray(-4)], [0x1d, 0x56, 0x42, 0x00], 'NV recall is missing partial cut');

for (const name of ['receipt.bin', 'receipt.txt', 'logo-size-test.bin', 'nv-logo-write.bin', 'nv-logo-recall.bin']) {
  assert.deepEqual(
    fs.readFileSync(path.join(out, name)),
    fs.readFileSync(path.join(fixtures, name)),
    `${name} differs from the accepted golden fixture`,
  );
}

console.log('WD8260 receipt, raster-logo, NV-logo, and golden-byte checks passed');
