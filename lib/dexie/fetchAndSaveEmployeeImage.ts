import { compressImageBlob } from "../helpers/compressImage";

export async function fetchAndSaveEmployeeImage(fileName?: string | null) {
  if (!fileName) return null;
  try {
    // 1. API-dən şəkli binary (Blob) olaraq çəkirik
    const response = await fetch(`/api/images/${fileName}`);

    console.log({ response });

    const originalBlob = await response.blob();

    // 2. Çəkilən şəkli sıxışdırırıq (Məsələn: max 400px enində, 70% keyfiyyətlə)
    const compressedBlob = await compressImageBlob(originalBlob, 400, 0.7);

    // 3. Sıxışdırılmış şəkli işçinin digər məlumatları ilə birlikdə Dexie-yə yazırıq
    // await db.employees.update(cardId, { imageBlob: compressedBlob });

    return compressedBlob;
  } catch (error) {
    console.error("Şəkli yükləyərkən və ya sıxışdırarkən xəta:", error);
    return null;
  }
}
