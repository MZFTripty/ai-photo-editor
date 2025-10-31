import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI with the provided API key
const genAI = new GoogleGenAI({
  apiKey:
    process.env.GEMINI_API_KEY || "AIzaSyC4jboRZDHJ6a_TasizT-ilz3c2-1QpGcw",
});

interface AnalyzeCommandRequest {
  command: string;
  imageData?: string; // base64 encoded image
  imageMetadata?: {
    name: string;
    type: string;
    size: number;
    dimensions?: { width: number; height: number };
  };
}

interface EditInstruction {
  type: "remove" | "add" | "modify" | "enhance" | "style" | "crop" | "lighting";
  target: string;
  description: string;
  confidence: number;
  parameters?: Record<string, any>;
}

interface AnalyzeCommandResponse {
  success: boolean;
  editInstructions: EditInstruction[];
  clarifyingQuestions?: string[];
  confidence: number;
  estimatedProcessingTime: number;
  safetyFlags?: string[];
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeCommandRequest = await request.json();
    const { command, imageData, imageMetadata } = body;

    if (!command?.trim()) {
      return NextResponse.json({
        success: false,
        error: "Command is required",
        editInstructions: [],
        confidence: 0,
        estimatedProcessingTime: 0,
      } as AnalyzeCommandResponse);
    }

    const isImageAnalysis =
      command.includes("Analyze this image and provide") ||
      command.includes("editing suggestions") ||
      command.includes("You are an expert photo editor");

    const model = isImageAnalysis ? "gemini-2.5-flash" : "gemini-1.5-flash";

    console.log(
      "[v0] Using model:",
      model,
      "for image analysis:",
      isImageAnalysis
    );

    if (isImageAnalysis) {
      // For image analysis, we want to return the raw response, not structured edit instructions
      const analysisPrompt = command;

      let result;
      if (
        imageData &&
        imageMetadata &&
        !imageMetadata.name.startsWith("Generated:")
      ) {
        try {
          // Validate image data
          if (
            !imageData.includes("data:image/") ||
            !imageData.includes("base64,")
          ) {
            throw new Error("Invalid image data format");
          }

          const base64Data = imageData.split(",")[1];
          if (!base64Data || base64Data.length < 100) {
            throw new Error("Invalid or empty base64 data");
          }

          const supportedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ];
          if (!supportedTypes.includes(imageMetadata.type)) {
            throw new Error("Unsupported image type");
          }

          const contents = [
            {
              role: "user" as const,
              parts: [
                { text: analysisPrompt },
                {
                  inlineData: {
                    data: base64Data,
                    mimeType: imageMetadata.type,
                  },
                },
              ],
            },
          ];

          console.log("[v0] Making Gemini API call for image analysis");
          const response = await genAI.models.generateContent({
            model,
            contents,
          });

          const responseText =
            response.candidates?.[0]?.content?.parts?.[0]?.text || "";
          console.log("[v0] Gemini response length:", responseText.length);
          console.log(
            "[v0] Gemini response preview:",
            responseText.substring(0, 200)
          );

          return NextResponse.json({
            success: true,
            response: responseText,
            editInstructions: [],
            confidence: 0.9,
            estimatedProcessingTime: 10,
          });
        } catch (imageError: any) {
          console.error("[v0] Image processing error:", imageError);
          return NextResponse.json({
            success: false,
            error: `Image processing failed: ${imageError.message}`,
            editInstructions: [],
            confidence: 0,
            estimatedProcessingTime: 0,
          });
        }
      } else {
        return NextResponse.json({
          success: false,
          error: "Valid image data is required for image analysis",
          editInstructions: [],
          confidence: 0,
          estimatedProcessingTime: 0,
        });
      }
    }

    const systemPrompt = `You are LumenFrame, an AI-powered photo editor that interprets natural language commands for image editing.

Your task is to analyze the user's command and return structured edit instructions in JSON format.

IMPORTANT: You must respond with valid JSON only, no additional text or formatting.

Response format:
{
  "success": true,
  "editInstructions": [
    {
      "type": "remove|add|modify|enhance|style|crop|lighting",
      "target": "specific object or area to edit",
      "description": "detailed description of the edit",
      "confidence": 0.0-1.0,
      "parameters": {
        "intensity": 0.0-1.0,
        "region": "background|foreground|face|object|sky|etc",
        "style": "specific style if applicable"
      }
    }
  ],
  "clarifyingQuestions": ["question1", "question2"],
  "confidence": 0.0-1.0,
  "estimatedProcessingTime": seconds,
  "safetyFlags": ["flag1", "flag2"]
}

Safety considerations:
- Flag any requests involving people's faces for identity preservation
- Flag potentially harmful or inappropriate edits
- Flag requests that might violate privacy or consent

Command to analyze: "${command}"
${
  imageMetadata
    ? `Image info: ${imageMetadata.name} (${imageMetadata.type}, ${imageMetadata.dimensions?.width}x${imageMetadata.dimensions?.height})`
    : ""
}`;

    let result;
    if (
      imageData &&
      imageMetadata &&
      !imageMetadata.name.startsWith("Generated:")
    ) {
      try {
        // Validate that the image data is properly formatted
        if (
          !imageData.includes("data:image/") ||
          !imageData.includes("base64,")
        ) {
          throw new Error("Invalid image data format");
        }

        // Extract base64 data and validate it's not empty
        const base64Data = imageData.split(",")[1];
        if (!base64Data || base64Data.length < 100) {
          throw new Error("Invalid or empty base64 data");
        }

        // Validate mime type is supported
        const supportedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (!supportedTypes.includes(imageMetadata.type)) {
          throw new Error("Unsupported image type");
        }

        const contents = [
          {
            role: "user" as const,
            parts: [
              { text: systemPrompt },
              {
                inlineData: {
                  data: base64Data,
                  mimeType: imageMetadata.type,
                },
              },
            ],
          },
        ];

        const response = await genAI.models.generateContent({
          model,
          contents,
        });
        result = {
          response: {
            text: () =>
              response.candidates?.[0]?.content?.parts?.[0]?.text || "",
          },
        };
      } catch (imageError) {
        console.error("[v0] Image processing error:", imageError);
        // Fall back to text-only analysis if image processing fails
        const contents = [
          {
            role: "user" as const,
            parts: [{ text: systemPrompt }],
          },
        ];
        const response = await genAI.models.generateContent({
          model,
          contents,
        });
        result = {
          response: {
            text: () =>
              response.candidates?.[0]?.content?.parts?.[0]?.text || "",
          },
        };
      }
    } else {
      // Text-only analysis for generated images or when no valid image data
      const contents = [
        {
          role: "user" as const,
          parts: [{ text: systemPrompt }],
        },
      ];
      const response = await genAI.models.generateContent({
        model,
        contents,
      });
      result = {
        response: {
          text: () => response.candidates?.[0]?.content?.parts?.[0]?.text || "",
        },
      };
    }

    const responseText = result.response.text();

    let parsedResponse: AnalyzeCommandResponse;
    try {
      // Extract JSON from markdown code blocks if present
      let jsonText = responseText.trim();

      // Check if response is wrapped in markdown code blocks
      if (jsonText.startsWith("```json") && jsonText.endsWith("```")) {
        // Extract content between \`\`\`json and \`\`\`
        const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonText = jsonMatch[1].trim();
        }
      } else if (jsonText.startsWith("```") && jsonText.endsWith("```")) {
        // Handle generic code blocks
        const codeMatch = jsonText.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch && codeMatch[1]) {
          jsonText = codeMatch[1].trim();
        }
      }

      parsedResponse = JSON.parse(jsonText);
    } catch (parseError) {
      // If JSON parsing fails, create a fallback response
      console.error("[v0] Failed to parse Gemini response:", responseText);
      parsedResponse = {
        success: true,
        editInstructions: [
          {
            type: "enhance",
            target: "image",
            description: command,
            confidence: 0.7,
            parameters: { intensity: 0.5 },
          },
        ],
        confidence: 0.7,
        estimatedProcessingTime: 15,
        clarifyingQuestions: [
          "Could you be more specific about the desired changes?",
        ],
      };
    }

    // Add some realistic processing time estimates based on edit type
    if (parsedResponse.editInstructions) {
      const complexityScore = parsedResponse.editInstructions.reduce(
        (score, instruction) => {
          const typeComplexity = {
            enhance: 1,
            lighting: 1,
            style: 2,
            crop: 1,
            modify: 3,
            remove: 4,
            add: 5,
          };
          return score + (typeComplexity[instruction.type] || 2);
        },
        0
      );

      parsedResponse.estimatedProcessingTime = Math.min(
        Math.max(complexityScore * 10, 15),
        90
      );
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("[v0] Gemini API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze command. Please try again.",
        editInstructions: [],
        confidence: 0,
        estimatedProcessingTime: 0,
      } as AnalyzeCommandResponse,
      { status: 500 }
    );
  }
}
