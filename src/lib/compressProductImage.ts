export const PRODUCT_IMAGE_PREFIX = 'data:image/webp;base64,';
export const MAX_PRODUCT_IMAGE_CHARS = 32_768;

export function productImageJpeg(value: string | undefined) {
  if (!value) return undefined;
  if (
    (!value.startsWith(PRODUCT_IMAGE_PREFIX) && !value.startsWith('data:image/jpeg;base64,')) ||
    value.length > MAX_PRODUCT_IMAGE_CHARS
  ) {
    throw new Error('Product photo is too large. Choose a smaller image.');
  }
  return value;
}

export async function compressProductImage(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Choose a JPEG or PNG photo.');
  }
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  try {
    // Inspect a bounded preview, then crop from the original, not the preview.
    const previewScale = Math.min(1024 / bitmap.width, 1024 / bitmap.height, 1);
    canvas.width = Math.max(1, Math.round(bitmap.width * previewScale));
    canvas.height = Math.max(1, Math.round(bitmap.height * previewScale));
    const preview = canvas.getContext('2d');
    if (!preview) throw new Error('Could not prepare the product photo.');
    preview.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const pixels = preview.getImageData(0, 0, canvas.width, canvas.height).data;
    let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
    let transparent = false;
    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        const alpha = pixels[(y * canvas.width + x) * 4 + 3];
        if (alpha === 0) transparent = true;
        // Ignore near-invisible extraction noise; leave a safety margin below.
        if (alpha > 8) {
          left = Math.min(left, x); top = Math.min(top, y);
          right = Math.max(right, x); bottom = Math.max(bottom, y);
        }
      }
    }
    if (right < left) throw new Error('That photo has no visible product.');
    const sx = transparent ? Math.max(0, left - 1) * bitmap.width / canvas.width : 0;
    const sy = transparent ? Math.max(0, top - 1) * bitmap.height / canvas.height : 0;
    const sw = transparent
      ? Math.min(canvas.width, right + 2) * bitmap.width / canvas.width - sx
      : bitmap.width;
    const sh = transparent
      ? Math.min(canvas.height, bottom + 2) * bitmap.height / canvas.height - sy
      : bitmap.height;
    // A consistent square and 4% margin makes visible subjects comparable.
    const frameWidth = transparent ? Math.max(sw, sh) / 0.92 : sw;
    const frameHeight = transparent ? frameWidth : sh;
    for (const limit of [480, 384, 320, 256, 192, 128, 96]) {
      const scale = Math.min(limit / frameWidth, limit / frameHeight, 1);
      canvas.width = Math.max(1, Math.round(frameWidth * scale));
      canvas.height = Math.max(1, Math.round(frameHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not prepare the product photo.');
      // Resizing clears the canvas; preserve the source image's transparency.
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(bitmap, sx, sy, sw, sh,
        (canvas.width - sw * scale) / 2, (canvas.height - sh * scale) / 2,
        sw * scale, sh * scale);
      for (const quality of [0.94, 0.90]) {
        const dataUrl = canvas.toDataURL('image/webp', quality);
        if (dataUrl.startsWith(PRODUCT_IMAGE_PREFIX)
            && dataUrl.length <= MAX_PRODUCT_IMAGE_CHARS) return dataUrl;
      }
    }
    throw new Error('That photo is still too large after compressing.');
  } finally {
    bitmap.close();
  }
}
