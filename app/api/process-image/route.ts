import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import { processImageLocally } from "@/lib/local-advanced-processing";

// Get API key from environment variable
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

// Validate that API key is configured
if (!STABILITY_API_KEY) {
  console.error(
    "❌ STABILITY_API_KEY is not configured in environment variables"
  );
}

interface ProcessImageRequest {
  imageData?: string; // base64 encoded image (deprecated, use imageUrl)
  imageUrl?: string; // URL to image
  maskData?: string; // base64 encoded mask (for selection editing)
  editInstructions?: Array<{
    type:
      | "remove"
      | "add"
      | "modify"
      | "enhance"
      | "style"
      | "crop"
      | "lighting";
    target: string;
    description: string;
    confidence: number;
    parameters?: Record<string, any>;
  }>;
  imageMetadata?: {
    name: string;
    type: string;
    size: number;
    dimensions?: { width: number; height: number };
  };
  prompt?: string; // Direct prompt for editing
}

interface ProcessImageResponse {
  success: boolean;
  processedImageUrl?: string; // data URL or blob URL
  processedImageData?: string; // base64 encoded processed image (legacy)
  processingTime: number;
  appliedEdits: string[];
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let imageUrl: string | undefined;
    let maskData: string | undefined;
    let prompt: string | undefined;
    let imageData: string | undefined;
    let editInstructions: any[] | undefined;
    let imageMetadata: any | undefined;

    if (contentType.includes("application/json")) {
      // JSON request
      const body: ProcessImageRequest = await request.json();
      imageUrl = body.imageUrl;
      maskData = body.maskData;
      prompt = body.prompt;
      imageData = body.imageData;
      editInstructions = body.editInstructions;
      imageMetadata = body.imageMetadata;
    } else if (contentType.includes("multipart/form-data")) {
      // FormData request (for selection editing with mask)
      const formData = await request.formData();
      imageUrl = formData.get("imageUrl") as string;
      imageData = formData.get("imageData") as string; // Get imageData if provided
      prompt = formData.get("prompt") as string;

      // Get mask as Blob/File
      const maskBlob = formData.get("maskData") as Blob | null;
      if (maskBlob) {
        const maskBuffer = await maskBlob.arrayBuffer();
        maskData = Buffer.from(maskBuffer).toString("base64");
        console.log("[v0] Mask received as blob, converted to base64");
      }
    }

    // Validate inputs
    if (!imageUrl && !imageData) {
      return NextResponse.json({
        success: false,
        error: "Image data or URL is required",
        processingTime: 0,
        appliedEdits: [],
      } as ProcessImageResponse);
    }

    const startTime = Date.now();

    console.log("[v0] Processing image with selection mask:", {
      hasUrl: !!imageUrl,
      hasMask: !!maskData,
      hasPrompt: !!prompt,
    });

    try {
      // Get image data
      let imageBase64: string;

      if (imageData) {
        // Use provided base64/data URL (prioritize this - comes from selection editing)
        // Clean it: remove data URL prefix if present
        imageBase64 = imageData.includes(",")
          ? imageData.split(",")[1]
          : imageData;
        console.log("[v0] Using imageData from FormData:", {
          dataLength: imageBase64.length,
          hasPrefix: imageData.includes(","),
        });
      } else if (imageUrl) {
        // Only try to fetch URL if it's not a blob URL
        if (imageUrl.startsWith("blob:")) {
          throw new Error(
            "Cannot fetch blob URLs on server. Use imageData parameter instead."
          );
        }
        // Fetch image from URL
        const response = await axios.get(imageUrl, {
          responseType: "arraybuffer",
        });
        imageBase64 = Buffer.from(response.data).toString("base64");
        console.log("[v0] Fetched image from URL");
      } else {
        throw new Error("No image data available");
      }

      // Prepare editing prompt
      const editingPrompt = prompt
        ? prompt
        : editInstructions
            ?.map((instruction) => instruction.description)
            .join(". ") || "Enhance the image";

      console.log("[v0] 📝 Using prompt:", {
        prompt: editingPrompt,
        isCustom: !!prompt,
        promptLength: editingPrompt.length,
      });

      // Use Stability AI's inpaint API with optional mask
      const formDataApi = new FormData();

      // IMPORTANT: Stability AI requires proper image buffer with PNG/JPEG format
      // imageBase64 is clean base64 (no data URL prefix)
      const imageBuffer = Buffer.from(imageBase64, "base64");
      console.log("[v0] Image buffer created:", {
        bufferLength: imageBuffer.length,
        isBase64Encoded: true,
      });

      // Append image as PNG buffer (Stability AI expects proper image format)
      formDataApi.append("image", imageBuffer, "image.png");
      formDataApi.append("prompt", editingPrompt);
      formDataApi.append("output_format", "webp");

      // If mask is provided, append it (for selection-based editing)
      if (maskData) {
        try {
          // maskData is already base64 from arrayBuffer conversion
          const maskBuffer = Buffer.from(maskData, "base64");
          formDataApi.append("mask", maskBuffer, "mask.png");
          console.log("[v0] ✅ Using mask for selection-specific editing", {
            maskDataLength: maskData.length,
            maskBufferLength: maskBuffer.length,
            hasMask: true,
          });
        } catch (maskErr) {
          console.error("[v0] ❌ Failed to process mask:", maskErr);
          console.log("[v0] Falling back to full image edit (no mask)");
        }
      } else {
        // No mask: For inpainting without mask, Stability AI requires explicit mask
        // Create a white mask (edit entire image)
        console.log(
          "[v0] No mask provided, creating white mask for full image edit"
        );
        try {
          // Create a simple white PNG mask
          // This is a minimal valid PNG representing a white image
          const whiteMaskBase64 =
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
          const whiteMaskBuffer = Buffer.from(whiteMaskBase64, "base64");
          formDataApi.append("mask", whiteMaskBuffer, "mask.png");
          console.log("[v0] ✅ Created white mask for full image editing");
        } catch (maskError) {
          console.error("[v0] Failed to create white mask:", maskError);
        }
      }

      console.log("[v0] 🚀 Making API call to Stability AI inpaint", {
        hasImage: !!imageBuffer,
        imageBufferSize: imageBuffer.length,
        hasMask: !!maskData,
        prompt: editingPrompt.substring(0, 50) + "...",
      });

      const apiResponse = await axios.post(
        "https://api.stability.ai/v2beta/stable-image/edit/inpaint",
        formDataApi,
        {
          validateStatus: undefined,
          responseType: "arraybuffer",
          headers: {
            ...formDataApi.getHeaders(),
            Authorization: `Bearer ${STABILITY_API_KEY}`,
            Accept: "image/*",
          },
        }
      );

      const processingTime = Date.now() - startTime;
      const appliedEdits = [
        maskData ? "Selection-based edit applied" : "Full image edit applied",
      ];

      if (apiResponse.status === 200) {
        // Convert buffer to base64
        const buffer = Buffer.from(apiResponse.data);
        const base64Image = buffer.toString("base64");
        const processedImageUrl = `data:image/webp;base64,${base64Image}`;

        console.log("[v0] Successfully edited image with Stability AI");

        return NextResponse.json({
          success: true,
          processedImageUrl,
          processedImageData: base64Image, // Legacy support
          processingTime,
          appliedEdits,
        } as ProcessImageResponse);
      } else {
        const errorMessage = apiResponse.data.toString();
        console.error("[v0] Stability AI editing error:", {
          status: apiResponse.status,
          message: errorMessage,
        });

        // Check if it's a credit/payment error (402) OR bad request (400)
        if (apiResponse.status === 402 || apiResponse.status === 400) {
          console.log(
            `[v0] ⚠️ API Error ${apiResponse.status} - Using LOCAL processing instead`
          );

          try {
            // Fallback to local processing
            const localResult = await processImageLocally({
              imageBuffer,
              maskBuffer: maskData
                ? Buffer.from(maskData, "base64")
                : undefined,
              command: editingPrompt,
              width: 2000, // default, can be improved
              height: 1333,
            });

            const base64Image = localResult.imageBuffer.toString("base64");
            const processedImageUrl = `data:${localResult.mimeType};base64,${base64Image}`;

            console.log(
              `[v0] ✅ Local processing completed (API error ${apiResponse.status})`
            );

            return NextResponse.json({
              success: true,
              processedImageUrl,
              processedImageData: base64Image,
              processingTime,
              appliedEdits: [
                "Local processing applied (AI unavailable - using manual adjustments)",
              ],
            } as ProcessImageResponse);
          } catch (localError) {
            console.error("[v0] Local processing also failed:", localError);
            // Even local processing failed, return original with modifications
            return NextResponse.json({
              success: false,
              error:
                "AI unavailable and local processing failed. Using manual tools instead.",
              processingTime,
              appliedEdits: [],
            } as ProcessImageResponse);
          }
        }

        // For other errors, return original image
        return NextResponse.json({
          success: true,
          processedImageUrl: imageUrl || imageData,
          processingTime,
          appliedEdits: ["Fallback to original image (API error)"],
        } as ProcessImageResponse);
      }
    } catch (apiError) {
      console.error("[v0] Image editing API error:", apiError);

      const processingTime = Date.now() - startTime;

      // Fallback: return original image
      return NextResponse.json({
        success: true,
        processedImageUrl: imageUrl || imageData,
        processingTime,
        appliedEdits: ["API error - using original image"],
      } as ProcessImageResponse);
    }
  } catch (error) {
    console.error("[v0] Image processing error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process image. Please try again.",
        processingTime: 0,
        appliedEdits: [],
      } as ProcessImageResponse,
      { status: 500 }
    );
  }
}
