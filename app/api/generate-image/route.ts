import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

// Get API key from environment variable
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

// Validate that API key is configured
if (!STABILITY_API_KEY) {
  console.error(
    "❌ STABILITY_API_KEY is not configured in environment variables"
  );
}

interface GenerateImageRequest {
  prompt: string;
  style?: string;
  aspectRatio?: string;
}

interface GenerateImageResponse {
  success: boolean;
  imageData?: string; // base64 encoded image
  prompt: string;
  style?: string;
  aspectRatio?: string;
  generatedAt: string;
  error?: string;
}

// Map aspect ratio to Stability AI format
// Stability AI supports: 1:1, 16:9, 9:16, 4:3, 3:4, 21:9, 9:21
function mapAspectRatio(aspectRatio: string): string {
  const ratioMap: Record<string, string> = {
    // Direct support
    "1:1": "1:1",
    "16:9": "16:9",
    "9:16": "9:16",
    "4:3": "4:3",
    "3:4": "3:4",
    "21:9": "21:9",
    "9:21": "9:21",

    // Map unsupported ratios to closest supported equivalent
    "3:2": "16:9", // Photo -> Landscape (close enough)
    "2:3": "9:16", // Panoramic -> Portrait
    "5:4": "4:3", // Classic -> Standard
    custom: "1:1", // Custom -> Square (default)
    original: "1:1", // Original -> Square (default)
  };
  return ratioMap[aspectRatio] || "1:1";
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateImageRequest = await request.json();
    const { prompt, style = "default", aspectRatio = "1:1" } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: "Prompt is required for image generation",
        prompt,
        generatedAt: new Date().toISOString(),
      } as GenerateImageResponse);
    }

    console.log("[v0] Starting image generation with prompt:", prompt);

    try {
      // Build full prompt with style
      let fullPrompt = prompt;

      if (style && style !== "default") {
        fullPrompt += `. Style: ${style}`;
      }

      fullPrompt += ". High quality, detailed, professional image.";

      console.log("[v0] Generating image with full prompt:", fullPrompt);
      console.log("[v0] Aspect ratio:", aspectRatio);

      // Map aspect ratio for Stability AI
      const stableRatio = mapAspectRatio(aspectRatio);

      // Create FormData for Stability AI
      const formData = new FormData();
      formData.append("prompt", fullPrompt);
      formData.append("output_format", "webp");
      formData.append("aspect_ratio", stableRatio);

      console.log("[v0] Making API call to Stability AI");

      const response = await axios.post(
        "https://api.stability.ai/v2beta/stable-image/generate/ultra",
        formData,
        {
          validateStatus: undefined,
          responseType: "arraybuffer",
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${STABILITY_API_KEY}`,
            Accept: "image/*",
          },
        }
      );

      console.log(
        "[v0] Received response from Stability AI, status:",
        response.status
      );

      if (response.status === 200) {
        // Convert buffer to base64
        const buffer = Buffer.from(response.data);
        const base64Image = buffer.toString("base64");
        const imageData = `data:image/webp;base64,${base64Image}`;

        console.log("[v0] Successfully generated image with Stability AI");

        return NextResponse.json({
          success: true,
          imageData,
          prompt,
          style,
          aspectRatio,
          generatedAt: new Date().toISOString(),
        } as GenerateImageResponse);
      } else {
        // Handle error response
        const errorMessage = response.data.toString();
        console.error("[v0] Stability AI error:", {
          status: response.status,
          message: errorMessage,
        });

        return NextResponse.json({
          success: false,
          error: `Stability AI API error (${response.status}): Failed to generate image`,
          prompt,
          generatedAt: new Date().toISOString(),
        } as GenerateImageResponse);
      }
    } catch (apiError) {
      console.error("[v0] Image generation API error:", apiError);
      console.error("[v0] Error details:", {
        name: apiError instanceof Error ? apiError.name : "Unknown",
        message:
          apiError instanceof Error ? apiError.message : String(apiError),
      });

      return NextResponse.json({
        success: false,
        error: `API error: ${
          apiError instanceof Error ? apiError.message : "Unknown error"
        }`,
        prompt,
        generatedAt: new Date().toISOString(),
      } as GenerateImageResponse);
    }
  } catch (error) {
    console.error("[v0] Image generation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate image. Please try again.",
        prompt: "",
        generatedAt: new Date().toISOString(),
      } as GenerateImageResponse,
      { status: 500 }
    );
  }
}
