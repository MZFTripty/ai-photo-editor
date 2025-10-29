import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

const genAI = new GoogleGenAI({
  apiKey: "AIzaSyC4jboRZDHJ6a_TasizT-ilz3c2-1QpGcw",
})

interface GenerateImageRequest {
  prompt: string
  style?: string
  aspectRatio?: string
}

interface GenerateImageResponse {
  success: boolean
  imageData?: string // base64 encoded image
  prompt: string
  style?: string
  aspectRatio?: string
  generatedAt: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateImageRequest = await request.json()
    const { prompt, style = "default", aspectRatio = "1:1" } = body

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: "Prompt is required for image generation",
        prompt,
        generatedAt: new Date().toISOString(),
      } as GenerateImageResponse)
    }

    console.log("[v0] Starting image generation with prompt:", prompt)

    try {
      const config = {
        responseModalities: ["IMAGE", "TEXT"],
      }
      const model = "gemini-2.5-flash-image-preview"

      // Create a detailed prompt based on the user input and style preferences
      let fullPrompt = prompt

      if (style && style !== "default") {
        fullPrompt += `. Style: ${style}`
      }

      if (aspectRatio && aspectRatio !== "1:1") {
        fullPrompt += `. Aspect ratio: ${aspectRatio}`
      }

      fullPrompt += ". High quality, detailed, professional image."

      console.log("[v0] Generating image with full prompt:", fullPrompt)

      const contents = [
        {
          role: "user" as const,
          parts: [
            {
              text: fullPrompt,
            },
          ],
        },
      ]

      console.log("[v0] Making API call to Gemini with config:", { model, config  })

      const response = await genAI.models.generateContentStream({
        model,
        config,
        contents,
      })

      console.log("[v0] Received response from Gemini, processing chunks...")

      for await (const chunk of response) {
        console.log("[v0] Processing chunk:", {
          hasCandidates: !!chunk.candidates,
          candidatesLength: chunk.candidates?.length,
          hasContent: !!chunk.candidates?.[0]?.content,
          hasParts: !!chunk.candidates?.[0]?.content?.parts,
          partsLength: chunk.candidates?.[0]?.content?.parts?.length,
        })

        if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
          console.log("[v0] Skipping chunk - missing required structure")
          continue
        }

        const part = chunk.candidates[0].content.parts[0]
        console.log("[v0] Part structure:", {
          hasInlineData: !!part.inlineData,
          hasText: !!part.text,
          partKeys: Object.keys(part),
        })

        if (part.inlineData) {
          const inlineData = part.inlineData
          console.log("[v0] Found inline data:", {
            mimeType: inlineData.mimeType,
            hasData: !!inlineData.data,
            dataLength: inlineData.data?.length,
          })

          const imageData = `data:${inlineData.mimeType};base64,${inlineData.data}`

          console.log("[v0] Successfully generated image with Gemini")

          return NextResponse.json({
            success: true,
            imageData,
            prompt,
            style,
            aspectRatio,
            generatedAt: new Date().toISOString(),
          } as GenerateImageResponse)
        } else if (part.text) {
          console.log("[v0] Received text response:", part.text)
        }
      }

      // If no image was generated, return an error
      console.log("[v0] No image data returned from Gemini")
      return NextResponse.json({
        success: false,
        error: "Failed to generate image. The model did not return image data.",
        prompt,
        generatedAt: new Date().toISOString(),
      } as GenerateImageResponse)
    } catch (geminiError) {
      console.error("[v0] Gemini generation error:", geminiError)
      console.error("[v0] Error details:", {
        name: geminiError instanceof Error ? geminiError.name : "Unknown",
        message: geminiError instanceof Error ? geminiError.message : String(geminiError),
        stack: geminiError instanceof Error ? geminiError.stack : undefined,
      })

      return NextResponse.json({
        success: false,
        error: `Gemini API error: ${geminiError instanceof Error ? geminiError.message : "Unknown error"}`,
        prompt,
        generatedAt: new Date().toISOString(),
      } as GenerateImageResponse)
    }
  } catch (error) {
    console.error("[v0] Image generation error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate image. Please try again.",
        prompt: "",
        generatedAt: new Date().toISOString(),
      } as GenerateImageResponse,
      { status: 500 },
    )
  }
}
