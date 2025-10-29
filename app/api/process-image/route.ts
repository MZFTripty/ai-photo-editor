import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

// Initialize Gemini AI with the provided API key
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyC4jboRZDHJ6a_TasizT-ilz3c2-1QpGcw",
})

interface ProcessImageRequest {
  imageData: string // base64 encoded image
  editInstructions: Array<{
    type: "remove" | "add" | "modify" | "enhance" | "style" | "crop" | "lighting"
    target: string
    description: string
    confidence: number
    parameters?: Record<string, any>
  }>
  imageMetadata: {
    name: string
    type: string
    size: number
    dimensions?: { width: number; height: number }
  }
}

interface ProcessImageResponse {
  success: boolean
  processedImageData?: string // base64 encoded processed image
  processingTime: number
  appliedEdits: string[]
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ProcessImageRequest = await request.json()
    const { imageData, editInstructions, imageMetadata } = body

    if (!imageData || !editInstructions || editInstructions.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Image data and edit instructions are required",
        processingTime: 0,
        appliedEdits: [],
      } as ProcessImageResponse)
    }

    const startTime = Date.now()

    console.log("[v0] Processing image:", imageMetadata.name)
    console.log("[v0] Edit instructions:", editInstructions)

    try {
    const config = {
      responseModalities: ["IMAGE", "TEXT"] as string[],
    }
    const model = "gemini-2.5-flash-image-preview"

      const editPrompt = editInstructions.map((instruction) => `${instruction.description}`).join(". ")
      const fullPrompt = `Please edit the provided image by applying these changes: ${editPrompt}. Keep all other elements of the original image intact and only apply the requested modifications. Maintain the same composition, style, and quality as the original image.`

      console.log("[v0] Editing original image with prompt:", fullPrompt)

      const imageBase64 = imageData.split(",")[1] // Remove data:image/jpeg;base64, prefix
      const mimeType = imageData.split(";")[0].split(":")[1] // Extract mime type

      const contents = [
        {
          role: "user" as const,
          parts: [
            {
              text: fullPrompt,
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: imageBase64,
              },
            },
          ],
        },
      ]

      const response = await genAI.models.generateContentStream({
        model,
        config,
        contents,
      })

      for await (const chunk of response) {
        if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
          continue
        }

        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
          const inlineData = chunk.candidates[0].content.parts[0].inlineData
          const processedImageData = `data:${inlineData.mimeType};base64,${inlineData.data}`
          const processingTime = Date.now() - startTime
          const appliedEdits = editInstructions.map((instruction) => `${instruction.type}: ${instruction.description}`)

          console.log("[v0] Successfully edited original image")

          return NextResponse.json({
            success: true,
            processedImageData,
            processingTime,
            appliedEdits,
          } as ProcessImageResponse)
        }
      }

      console.log("[v0] No edited image returned from Gemini, using original")
      const processingTime = Date.now() - startTime
      const appliedEdits = editInstructions.map(
        (instruction) => `${instruction.type}: ${instruction.description} (unable to process)`,
      )

      return NextResponse.json({
        success: true,
        processedImageData: imageData, // Return original as fallback
        processingTime,
        appliedEdits,
      } as ProcessImageResponse)
    } catch (geminiError) {
      console.error("[v0] Gemini processing error:", geminiError)

      const processingTime = Date.now() - startTime
      const appliedEdits = editInstructions.map(
        (instruction) => `${instruction.type}: ${instruction.description} (Gemini unavailable)`,
      )

      return NextResponse.json({
        success: true,
        processedImageData: imageData, // Return original as fallback
        processingTime,
        appliedEdits,
      } as ProcessImageResponse)
    }
  } catch (error) {
    console.error("[v0] Image processing error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process image. Please try again.",
        processingTime: 0,
        appliedEdits: [],
      } as ProcessImageResponse,
      { status: 500 },
    )
  }
}
