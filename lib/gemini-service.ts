export interface EditInstruction {
  type: "remove" | "add" | "modify" | "enhance" | "style" | "crop" | "lighting"
  target: string
  description: string
  confidence: number
  parameters?: Record<string, any>
}

export interface AnalyzeCommandResponse {
  success: boolean
  editInstructions: EditInstruction[]
  clarifyingQuestions?: string[]
  confidence: number
  estimatedProcessingTime: number
  safetyFlags?: string[]
  error?: string
}

export interface ImageMetadata {
  name: string
  type: string
  size: number
  dimensions?: { width: number; height: number }
}

export class GeminiService {
  static async analyzeCommand(
    command: string,
    imageFile?: File,
    imageMetadata?: ImageMetadata,
  ): Promise<AnalyzeCommandResponse> {
    try {
      let imageData: string | undefined

      // Convert image to base64 if provided
      if (imageFile) {
        imageData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(imageFile)
        })
      }

      const response = await fetch("/api/analyze-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command,
          imageData,
          imageMetadata,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: AnalyzeCommandResponse = await response.json()
      return result
    } catch (error) {
      console.error("[v0] GeminiService error:", error)
      return {
        success: false,
        error: "Failed to analyze command. Please check your connection and try again.",
        editInstructions: [],
        confidence: 0,
        estimatedProcessingTime: 0,
      }
    }
  }

  static getEditTypeIcon(type: EditInstruction["type"]): string {
    const icons = {
      remove: "🗑️",
      add: "➕",
      modify: "✏️",
      enhance: "✨",
      style: "🎨",
      crop: "✂️",
      lighting: "💡",
    }
    return icons[type] || "🔧"
  }

  static getEditTypeColor(type: EditInstruction["type"]): string {
    const colors = {
      remove: "text-destructive",
      add: "text-primary",
      modify: "text-accent",
      enhance: "text-primary",
      style: "text-accent",
      crop: "text-muted-foreground",
      lighting: "text-accent",
    }
    return colors[type] || "text-foreground"
  }

  static formatProcessingTime(seconds: number): string {
    if (seconds < 60) {
      return `~${seconds}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0 ? `~${minutes}m ${remainingSeconds}s` : `~${minutes}m`
  }
}
