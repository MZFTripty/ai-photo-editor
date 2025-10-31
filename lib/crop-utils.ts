/**
 * Crop utilities for image editing
 */

/**
 * Crop image based on coordinates
 * @param imageUrl - Source image URL
 * @param x - Left position (0-100 percentage)
 * @param y - Top position (0-100 percentage)
 * @param width - Width percentage (0-100)
 * @param height - Height percentage (0-100)
 */
export async function cropImage(
  imageUrl: string,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        // Convert percentages to pixels
        const startX = (x / 100) * img.width;
        const startY = (y / 100) * img.height;
        const cropWidth = (width / 100) * img.width;
        const cropHeight = (height / 100) * img.height;

        const canvas = document.createElement("canvas");
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Draw cropped portion
        ctx.drawImage(
          img,
          startX,
          startY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );

        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}

/**
 * Resize image to specific dimensions
 * @param imageUrl - Source image URL
 * @param targetWidth - Target width in pixels
 * @param targetHeight - Target height in pixels
 */
export async function resizeImageDimensions(
  imageUrl: string,
  targetWidth: number,
  targetHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Draw resized image
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}

/**
 * Scale image by percentage
 * @param imageUrl - Source image URL
 * @param scale - Scale percentage (50-200, where 100 = original)
 */
export async function scaleImage(
  imageUrl: string,
  scale: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const newWidth = (img.width * scale) / 100;
        const newHeight = (img.height * scale) / 100;

        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}
