/**
 * Local Image Processing Service
 * Handles image editing operations without external API calls
 */

export interface ImageAdjustments {
  brightness?: number; // -100 to 100
  contrast?: number; // -100 to 100
  exposure?: number; // -100 to 100
  highlights?: number; // -100 to 100
  shadows?: number; // -100 to 100
  saturation?: number; // -100 to 100
  vibrance?: number; // -100 to 100
  hue?: number; // -180 to 180
  temperature?: number; // -100 to 100
  tint?: number; // -100 to 100
}

export interface TextLayer {
  id: string;
  text: string;
  x: number; // pixel position
  y: number; // pixel position
  fontSize: number;
  color: string;
  fontFamily: string;
  bold: boolean;
}

/**
 * Apply color adjustments to an image using Canvas API
 */
export async function applyColorAdjustments(
  imageUrl: string,
  adjustments: ImageAdjustments
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Apply adjustments to each pixel
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];
          const a = data[i + 3];

          // Brightness
          if (adjustments.brightness) {
            const factor = 1 + adjustments.brightness / 100;
            r = Math.min(255, r * factor);
            g = Math.min(255, g * factor);
            b = Math.min(255, b * factor);
          }

          // Contrast
          if (adjustments.contrast) {
            const factor = 1 + adjustments.contrast / 100;
            const centerPoint = 128;
            r = Math.min(
              255,
              Math.max(0, centerPoint + (r - centerPoint) * factor)
            );
            g = Math.min(
              255,
              Math.max(0, centerPoint + (g - centerPoint) * factor)
            );
            b = Math.min(
              255,
              Math.max(0, centerPoint + (b - centerPoint) * factor)
            );
          }

          // Exposure (similar to brightness but with better curve)
          if (adjustments.exposure) {
            const factor = Math.pow(2, adjustments.exposure / 100);
            r = Math.min(255, r * factor);
            g = Math.min(255, g * factor);
            b = Math.min(255, b * factor);
          }

          // Saturation - use proper RGB to HSL conversion
          if (adjustments.saturation) {
            // Convert RGB to HSL
            const r_norm = r / 255;
            const g_norm = g / 255;
            const b_norm = b / 255;

            const max = Math.max(r_norm, g_norm, b_norm);
            const min = Math.min(r_norm, g_norm, b_norm);
            let h = 0,
              s = 0;
            const l = (max + min) / 2;

            if (max !== min) {
              const d = max - min;
              s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

              if (max === r_norm) {
                h = (g_norm - b_norm) / d + (g_norm < b_norm ? 6 : 0);
              } else if (max === g_norm) {
                h = (b_norm - r_norm) / d + 2;
              } else {
                h = (r_norm - g_norm) / d + 4;
              }
              h /= 6;
            }

            // Adjust saturation with normalized factor (-1 to 1)
            const satFactor = Math.max(
              -1,
              Math.min(1, adjustments.saturation / 100)
            );
            s = Math.max(0, Math.min(1, s + s * satFactor * 0.5));

            // Convert back to RGB
            const hslToRgb = (p: number, q: number, t: number) => {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1 / 6) return p + (q - p) * 6 * t;
              if (t < 1 / 2) return q;
              if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
              return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = Math.round(hslToRgb(p, q, h + 1 / 3) * 255);
            g = Math.round(hslToRgb(p, q, h) * 255);
            b = Math.round(hslToRgb(p, q, h - 1 / 3) * 255);
          }

          // Vibrance - boost saturation of less saturated colors (like saturation but subtler)
          if (adjustments.vibrance) {
            const r_norm = r / 255;
            const g_norm = g / 255;
            const b_norm = b / 255;

            const max = Math.max(r_norm, g_norm, b_norm);
            const min = Math.min(r_norm, g_norm, b_norm);
            let h = 0,
              s = 0;
            const l = (max + min) / 2;

            if (max !== min) {
              const d = max - min;
              s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

              if (max === r_norm) {
                h = (g_norm - b_norm) / d + (g_norm < b_norm ? 6 : 0);
              } else if (max === g_norm) {
                h = (b_norm - r_norm) / d + 2;
              } else {
                h = (r_norm - g_norm) / d + 4;
              }
              h /= 6;
            }

            // Vibrance affects less saturated colors more
            const vibFactor = adjustments.vibrance / 100;
            const satBoost = (1 - s) * vibFactor * 0.3; // Subtler than saturation
            s = Math.max(0, Math.min(1, s + satBoost));

            const hslToRgb = (p: number, q: number, t: number) => {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1 / 6) return p + (q - p) * 6 * t;
              if (t < 1 / 2) return q;
              if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
              return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = Math.round(hslToRgb(p, q, h + 1 / 3) * 255);
            g = Math.round(hslToRgb(p, q, h) * 255);
            b = Math.round(hslToRgb(p, q, h - 1 / 3) * 255);
          }

          // Hue shift
          if (adjustments.hue) {
            const r_norm = r / 255;
            const g_norm = g / 255;
            const b_norm = b / 255;

            const max = Math.max(r_norm, g_norm, b_norm);
            const min = Math.min(r_norm, g_norm, b_norm);
            let h = 0,
              s = 0;
            const l = (max + min) / 2;

            if (max !== min) {
              const d = max - min;
              s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

              if (max === r_norm) {
                h = (g_norm - b_norm) / d + (g_norm < b_norm ? 6 : 0);
              } else if (max === g_norm) {
                h = (b_norm - r_norm) / d + 2;
              } else {
                h = (r_norm - g_norm) / d + 4;
              }
              h /= 6;
            }

            // Shift hue (-180 to 180 degrees)
            h = (h + adjustments.hue / 360) % 1;
            if (h < 0) h += 1;

            const hslToRgb = (p: number, q: number, t: number) => {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1 / 6) return p + (q - p) * 6 * t;
              if (t < 1 / 2) return q;
              if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
              return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = Math.round(hslToRgb(p, q, h + 1 / 3) * 255);
            g = Math.round(hslToRgb(p, q, h) * 255);
            b = Math.round(hslToRgb(p, q, h - 1 / 3) * 255);
          }

          // Temperature (blue-yellow shift: negative = cooler/bluer, positive = warmer/yellower)
          if (adjustments.temperature) {
            const tempFactor = adjustments.temperature / 100;
            if (tempFactor > 0) {
              // Warmer: increase red and green, decrease blue
              r = Math.min(255, r + tempFactor * 40);
              g = Math.min(255, g + tempFactor * 20);
              b = Math.max(0, b - tempFactor * 60);
            } else {
              // Cooler: increase blue, decrease red
              r = Math.max(0, r + tempFactor * 40);
              g = Math.max(0, g + tempFactor * 20);
              b = Math.min(255, b - tempFactor * 60);
            }
          }

          // Tint (cyan-magenta shift: negative = greener/cyan, positive = pinker/magenta)
          if (adjustments.tint) {
            const tintFactor = adjustments.tint / 100;
            if (tintFactor > 0) {
              // Pinker: increase red and magenta
              r = Math.min(255, r + tintFactor * 40);
              b = Math.min(255, b + tintFactor * 20);
              g = Math.max(0, g - tintFactor * 30);
            } else {
              // Greener: increase green/cyan
              g = Math.min(255, g - tintFactor * 30);
              b = Math.min(255, b - tintFactor * 20);
              r = Math.max(0, r + tintFactor * 40);
            }
          }

          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
          data[i + 3] = a;
        }

        ctx.putImageData(imageData, 0, 0);
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
 * Rotate image
 */
export async function rotateImage(
  imageUrl: string,
  degrees: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        const rad = (degrees * Math.PI) / 180;
        const cos = Math.abs(Math.cos(rad));
        const sin = Math.abs(Math.sin(rad));
        canvas.width = img.height * sin + img.width * cos;
        canvas.height = img.height * cos + img.width * sin;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

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
 * Flip image horizontally or vertically
 */
export async function flipImage(
  imageUrl: string,
  direction: "horizontal" | "vertical"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.save();

        if (direction === "horizontal") {
          ctx.scale(-1, 1);
          ctx.drawImage(img, -img.width, 0);
        } else {
          ctx.scale(1, -1);
          ctx.drawImage(img, 0, -img.height);
        }

        ctx.restore();
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
 * Resize image
 */
export async function resizeImage(
  imageUrl: string,
  width: number,
  height: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
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
 * Add text to image
 */
export async function addTextToImage(
  imageUrl: string,
  text: string,
  fontSize: number = 24,
  options?: {
    bold?: boolean;
    color?: string;
    fontFamily?: string;
    x?: number; // percentage 0-100
    y?: number; // percentage 0-100
  }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);

        // Get options
        const bold = options?.bold || false;
        const color = options?.color || "white";
        const fontFamily = options?.fontFamily || "Arial";
        const xPercent = options?.x ?? 50; // Default center
        const yPercent = options?.y ?? 50; // Default center

        // Calculate actual coordinates from percentages
        const x = (xPercent / 100) * img.width;
        const y = (yPercent / 100) * img.height;

        // Build font string
        const fontWeight = bold ? "bold" : "normal";
        const fontString = `${fontWeight} ${fontSize}px ${fontFamily}`;

        // Add text with shadow for better visibility
        ctx.font = fontString;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw text with outline/shadow
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.lineWidth = 3;
        ctx.strokeText(text, x, y);

        // Draw main text
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);

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
 * Crop image
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
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, -x, -y);
        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}
