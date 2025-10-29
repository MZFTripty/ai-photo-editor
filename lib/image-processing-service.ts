export interface ProcessingProgress {
  stage: string
  progress: number // 0-100
  message: string
}

export interface ProcessedImage {
  id: string
  originalImageData: string
  processedImageUrl: string // Changed from processedImageData to processedImageUrl to match editor expectations
  originalImageName: string // Added to match editor expectations
  editType: string // Added to match editor expectations
  appliedEdits: string[]
  processingTime: number
  metadata: {
    originalSize: number
    processedSize: number
    dimensions: { width: number; height: number }
  }
}

export interface ProcessImageRequest {
  imageData: string
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

export class ImageProcessingService {
  static async processImage(
    request: ProcessImageRequest,
    onProgress?: (progress: ProcessingProgress) => void,
  ): Promise<ProcessedImage> {
    const { imageData, editInstructions, imageMetadata } = request

    try {
      // Stage 1: Initialize processing
      onProgress?.({
        stage: "initializing",
        progress: 10,
        message: "Preparing image for processing...",
      })

      // Stage 2: Analyze edit instructions
      onProgress?.({
        stage: "analyzing",
        progress: 20,
        message: "Analyzing edit instructions...",
      })

      onProgress?.({
        stage: "processing",
        progress: 50,
        message: "Processing image with AI...",
      })

      const response = await fetch("/api/process-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Processing failed: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Processing failed")
      }

      // Stage 4: Finalize
      onProgress?.({
        stage: "finalizing",
        progress: 90,
        message: "Finalizing processed image...",
      })

      await new Promise((resolve) => setTimeout(resolve, 500))

      onProgress?.({
        stage: "complete",
        progress: 100,
        message: "Processing complete!",
      })

      let processedImageUrl = result.processedImageData
      if (result.processedImageData && result.processedImageData !== imageData) {
        // Convert data URL to blob URL for better memory management
        try {
          const response = await fetch(result.processedImageData)
          const blob = await response.blob()
          processedImageUrl = URL.createObjectURL(blob)
        } catch (error) {
          console.warn("[v0] Failed to create blob URL, using data URL:", error)
          processedImageUrl = result.processedImageData
        }
      }

      const editType = editInstructions.length > 0 ? editInstructions[0].type : "unknown"

      return {
        id: Math.random().toString(36).substr(2, 9),
        originalImageData: imageData,
        processedImageUrl,
        originalImageName: imageMetadata.name,
        editType,
        appliedEdits: result.appliedEdits || [],
        processingTime: result.processingTime || Date.now(),
        metadata: {
          originalSize: imageMetadata.size,
          processedSize: imageMetadata.size, // Would be different in real processing
          dimensions: imageMetadata.dimensions || { width: 800, height: 600 },
        },
      }
    } catch (error) {
      console.error("[v0] Image processing error:", error)
      throw new Error(`Failed to process image: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  static getProcessingStageIcon(stage: string): string {
    const icons = {
      initializing: "🔄",
      analyzing: "🔍",
      processing: "⚡",
      finalizing: "✨",
      complete: "✅",
    }
    return icons[stage] || "🔧"
  }

  static getProcessingStageColor(stage: string): string {
    const colors = {
      initializing: "text-muted-foreground",
      analyzing: "text-accent",
      processing: "text-primary",
      finalizing: "text-accent",
      complete: "text-primary",
    }
    return colors[stage] || "text-foreground"
  }
}
