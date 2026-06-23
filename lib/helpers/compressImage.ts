// lib/compressImage.ts

export function compressImageBlob(
  blob: Blob,
  maxWidth = 400,
  quality = 0.7,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Blob-u müvəqqəti URL-ə çeviririk ki, Image obyekti oxuya bilsin
    const blobUrl = URL.createObjectURL(blob);
    img.src = blobUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Proporsiyanı qoruyaraq ölçünü nizamlayırıq
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxWidth) {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(blobUrl); // Yaddaşı təmizləyirik
        return reject(new Error("Canvas context tapılmadı"));
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (compressedBlob) => {
          URL.revokeObjectURL(blobUrl); // İşimiz bitdi, müvəqqəti URL-i silirik
          if (compressedBlob) {
            resolve(compressedBlob);
          } else {
            reject(new Error("Sıxışdırma zamanı xəta baş verdi"));
          }
        },
        "image/jpeg",
        quality,
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(blobUrl);
      reject(err);
    };
  });
}
