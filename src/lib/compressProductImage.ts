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
    for (const limit of [480, 384, 320, 256, 192, 128, 96]) {
      const scale = Math.min(limit / bitmap.width, limit / bitmap.height, 1);
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not prepare the product photo.');
      // Resizing clears the canvas; preserve the source image's transparency.
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
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
