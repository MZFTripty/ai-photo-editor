export interface ImageTransformResult {
  dataUrl: string
  width: number
  height: number
}

export class ImageTransformUtils {
  static async cropImage(imageUrl: string, widthPercent: number, heightPercent: number): Promise<ImageTransformResult> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Calculate crop dimensions
        const cropWidth = (img.width * widthPercent) / 100
        const cropHeight = (img.height * heightPercent) / 100
        const startX = (img.width - cropWidth) / 2
        const startY = (img.height - cropHeight) / 2

        canvas.width = cropWidth
        canvas.height = cropHeight

        // Draw cropped image
        ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: cropWidth,
          height: cropHeight,
        })
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = imageUrl
    })
  }

  static async resizeImage(
    imageUrl: string,
    widthPercent: number,
    heightPercent: number,
  ): Promise<ImageTransformResult> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Calculate new dimensions
        const newWidth = (img.width * widthPercent) / 100
        const newHeight = (img.height * heightPercent) / 100

        canvas.width = newWidth
        canvas.height = newHeight

        // Draw resized image
        ctx.drawImage(img, 0, 0, newWidth, newHeight)

        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: newWidth,
          height: newHeight,
        })
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = imageUrl
    })
  }

  static async rotateImage(imageUrl: string, degrees: number): Promise<ImageTransformResult> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Calculate canvas size for rotation
        const radians = (degrees * Math.PI) / 180
        const cos = Math.abs(Math.cos(radians))
        const sin = Math.abs(Math.sin(radians))
        const newWidth = img.width * cos + img.height * sin
        const newHeight = img.width * sin + img.height * cos

        canvas.width = newWidth
        canvas.height = newHeight

        // Move to center and rotate
        ctx.translate(newWidth / 2, newHeight / 2)
        ctx.rotate(radians)
        ctx.drawImage(img, -img.width / 2, -img.height / 2)

        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: newWidth,
          height: newHeight,
        })
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = imageUrl
    })
  }

  static async flipImage(imageUrl: string, direction: "horizontal" | "vertical"): Promise<ImageTransformResult> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        canvas.width = img.width
        canvas.height = img.height

        // Apply flip transformation
        if (direction === "horizontal") {
          ctx.scale(-1, 1)
          ctx.drawImage(img, -img.width, 0)
        } else {
          ctx.scale(1, -1)
          ctx.drawImage(img, 0, -img.height)
        }

        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: img.width,
          height: img.height,
        })
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = imageUrl
    })
  }
}








// // image-transform-utils.ts
// export const ImageTransformUtils = {
//   loadImage: (src: string): Promise<HTMLImageElement> =>
//     new Promise((resolve, reject) => {
//       const img = new Image();
//       img.crossOrigin = "anonymous"; // allow CORS
//       img.onload = () => resolve(img);
//       img.onerror = reject;
//       img.src = src;
//     }),

//   toDataUrl: (canvas: HTMLCanvasElement): string =>
//     canvas.toDataURL("image/png"),

//   cropImage: async (src: string, width: number, height: number) => {
//     const img = await ImageTransformUtils.loadImage(src);
//     const canvas = document.createElement("canvas");
//     canvas.width = width;
//     canvas.height = height;
//     const ctx = canvas.getContext("2d")!;
//     ctx.drawImage(img, 0, 0, width, height);
//     return { dataUrl: ImageTransformUtils.toDataUrl(canvas) };
//   },

//   resizeImage: async (src: string, width: number, height: number) => {
//     const img = await ImageTransformUtils.loadImage(src);
//     const canvas = document.createElement("canvas");
//     canvas.width = width;
//     canvas.height = height;
//     const ctx = canvas.getContext("2d")!;
//     ctx.drawImage(img, 0, 0, width, height);
//     return { dataUrl: ImageTransformUtils.toDataUrl(canvas) };
//   },

//   rotateImage: async (src: string, degrees: number) => {
//     const img = await ImageTransformUtils.loadImage(src);
//     const canvas = document.createElement("canvas");
//     const radians = (degrees * Math.PI) / 180;

//     // Set canvas size to fit rotated image
//     const sin = Math.abs(Math.sin(radians));
//     const cos = Math.abs(Math.cos(radians));
//     canvas.width = img.width * cos + img.height * sin;
//     canvas.height = img.width * sin + img.height * cos;

//     const ctx = canvas.getContext("2d")!;
//     ctx.translate(canvas.width / 2, canvas.height / 2);
//     ctx.rotate(radians);
//     ctx.drawImage(img, -img.width / 2, -img.height / 2);
//     return { dataUrl: ImageTransformUtils.toDataUrl(canvas) };
//   },

//   flipImage: async (src: string, direction: "horizontal" | "vertical") => {
//     const img = await ImageTransformUtils.loadImage(src);
//     const canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//     const ctx = canvas.getContext("2d")!;
//     ctx.translate(
//       direction === "horizontal" ? img.width : 0,
//       direction === "vertical" ? img.height : 0
//     );
//     ctx.scale(
//       direction === "horizontal" ? -1 : 1,
//       direction === "vertical" ? -1 : 1
//     );
//     ctx.drawImage(img, 0, 0);
//     return { dataUrl: ImageTransformUtils.toDataUrl(canvas) };
//   },

//   applyBasicAdjustments: async (
//     src: string,
//     brightness = 0,
//     contrast = 0,
//     exposure = 0,
//     highlights = 0,
//     shadows = 0
//   ) => {
//     const img = await ImageTransformUtils.loadImage(src);
//     const canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//     const ctx = canvas.getContext("2d")!;
//     ctx.drawImage(img, 0, 0);

//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;

//     for (let i = 0; i < data.length; i += 4) {
//       // Brightness
//       data[i] += brightness; // R
//       data[i + 1] += brightness; // G
//       data[i + 2] += brightness; // B

//       // Contrast
//       const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
//       data[i] = factor * (data[i] - 128) + 128;
//       data[i + 1] = factor * (data[i + 1] - 128) + 128;
//       data[i + 2] = factor * (data[i + 2] - 128) + 128;

//       // TODO: exposure, highlights, shadows (advanced, can add later)
//     }

//     ctx.putImageData(imageData, 0, 0);
//     return { dataUrl: ImageTransformUtils.toDataUrl(canvas) };
//   },

//   applyColorAdjustments: async (
//     src: string,
//     saturation = 0,
//     vibrance = 0,
//     hue = 0,
//     temperature = 0,
//     tint = 0
//   ) => {
//     const img = await ImageTransformUtils.loadImage(src);
//     const canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//     const ctx = canvas.getContext("2d")!;
//     ctx.filter = `
//       saturate(${100 + saturation}%)
//       hue-rotate(${hue}deg)
//     `;
//     ctx.drawImage(img, 0, 0);
//     return { dataUrl: ImageTransformUtils.toDataUrl(canvas) };
//   },

//   addText: async (src: string, text: string, fontSize = 24) => {
//     const img = await ImageTransformUtils.loadImage(src);
//     const canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//     const ctx = canvas.getContext("2d")!;
//     ctx.drawImage(img, 0, 0);
//     ctx.font = `${fontSize}px Arial`;
//     ctx.fillStyle = "white";
//     ctx.fillText(text, 20, fontSize + 20);
//     return { dataUrl: ImageTransformUtils.toDataUrl(canvas) };
//   },

//   addShape: async (src: string, shape: string) => {
//     const img = await ImageTransformUtils.loadImage(src);
//     const canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//     const ctx = canvas.getContext("2d")!;
//     ctx.drawImage(img, 0, 0);
//     ctx.strokeStyle = "red";
//     ctx.fillStyle = "rgba(255,0,0,0.3)";
//     ctx.lineWidth = 4;

//     const w = canvas.width / 4;
//     const h = canvas.height / 4;
//     const x = canvas.width / 2 - w / 2;
//     const y = canvas.height / 2 - h / 2;

//     switch (shape) {
//       case "circle":
//         ctx.beginPath();
//         ctx.arc(canvas.width / 2, canvas.height / 2, w / 2, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.stroke();
//         break;
//       case "square":
//         ctx.fillRect(x, y, w, h);
//         ctx.strokeRect(x, y, w, h);
//         break;
//       case "triangle":
//         ctx.beginPath();
//         ctx.moveTo(canvas.width / 2, y);
//         ctx.lineTo(x, y + h);
//         ctx.lineTo(x + w, y + h);
//         ctx.closePath();
//         ctx.fill();
//         ctx.stroke();
//         break;
//       case "arrow":
//         ctx.beginPath();
//         ctx.moveTo(x, y + h / 2);
//         ctx.lineTo(x + w, y + h / 2);
//         ctx.lineTo(x + w - 10, y + h / 2 - 10);
//         ctx.moveTo(x + w, y + h / 2);
//         ctx.lineTo(x + w - 10, y + h / 2 + 10);
//         ctx.stroke();
//         break;
//       case "star":
//         // Simple star approximation
//         ctx.beginPath();
//         ctx.moveTo(canvas.width / 2, y);
//         for (let i = 1; i <= 5; i++) {
//           const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
//           ctx.lineTo(
//             canvas.width / 2 + (w / 2) * Math.cos(angle),
//             canvas.height / 2 + (h / 2) * Math.sin(angle)
//           );
//         }
//         ctx.closePath();
//         ctx.fill();
//         ctx.stroke();
//         break;
//       case "heart":
//         ctx.beginPath();
//         ctx.moveTo(canvas.width / 2, y + h / 4);
//         ctx.bezierCurveTo(
//           canvas.width / 2 + w / 2,
//           y - h / 4,
//           canvas.width / 2 + w,
//           y + h / 2,
//           canvas.width / 2,
//           y + h
//         );
//         ctx.bezierCurveTo(
//           canvas.width / 2 - w,
//           y + h / 2,
//           canvas.width / 2 - w / 2,
//           y - h / 4,
//           canvas.width / 2,
//           y + h / 4
//         );
//         ctx.fill();
//         ctx.stroke();
//         break;
//     }

//     return { dataUrl: ImageTransformUtils.toDataUrl(canvas) };
//   },
// };
