import { compressImageBlob } from "../helpers/compressImage";

export async function fetchAndSaveEmployeeImage(fileName?: string | null) {
  if (!fileName) return null;
  try {
    // 1. API-dən şəkli binary (Blob) olaraq çəkirik
    const response = await fetch(`/api/images/${fileName}`);

    if (!response.ok) {
      console.warn(
        `[fetchAndSaveEmployeeImage] image API returned ${response.status} for "${fileName}"`,
      );
      return null;
    }

    const originalBlob = await response.blob();

    // 2. Çəkilən şəkli sıxışdırırıq (Məsələn: max 400px enində, 70% keyfiyyətlə)
    return await compressImageBlob(originalBlob, 400, 0.7);
  } catch (error) {
    console.error(
      `[fetchAndSaveEmployeeImage] failed to fetch/compress image for "${fileName}":`,
      error,
    );
    return null;
  }
}
