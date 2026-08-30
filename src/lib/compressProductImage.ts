export const PRODUCT_IMAGE_PREFIX = 'data:image/jpeg;base64,';
export const MAX_PRODUCT_IMAGE_CHARS = 16_384;

export function productImageJpeg(value: string | undefined) {
  if (!value) return undefined;
  if (
    !value.startsWith(PRODUCT_IMAGE_PREFIX) ||
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
  const limit = 96;
  const scale = Math.min(limit / bitmap.width, limit / bitmap.height, 1);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('Could not prepare the product photo.');
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  for (const quality of [0.62, 0.45, 0.32]) {
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    if (
      dataUrl.startsWith(PRODUCT_IMAGE_PREFIX) &&
      dataUrl.length <= MAX_PRODUCT_IMAGE_CHARS
    ) {
      return dataUrl;
    }
  }
  throw new Error('That photo is still too large after compressing.');
}
