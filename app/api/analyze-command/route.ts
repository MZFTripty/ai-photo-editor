import { type NextRequest, NextResponse } from "next/server";

interface AnalyzeCommandRequest {
  command: string;
  imageData?: string;
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

    const editInstructions: EditInstruction[] = [];
    let baseConfidence = 0.5;

    if (command.toLowerCase().includes("bright")) {
      editInstructions.push({
        type: "enhance",
        target: "brightness",
        description: "Increase brightness",
        confidence: 0.9,
        parameters: { intensity: 0.4 },
      });
      baseConfidence = 0.9;
    }

    if (command.toLowerCase().includes("dark")) {
      editInstructions.push({
        type: "modify",
        target: "brightness",
        description: "Decrease brightness",
        confidence: 0.9,
        parameters: { intensity: 0.3 },
      });
      baseConfidence = 0.9;
    }

    if (
      command.toLowerCase().includes("vibrant") ||
      command.toLowerCase().includes("saturation")
    ) {
      editInstructions.push({
        type: "enhance",
        target: "colors",
        description: "Enhance saturation",
        confidence: 0.85,
        parameters: { intensity: 0.5 },
      });
      baseConfidence = Math.max(baseConfidence, 0.85);
    }

    if (command.toLowerCase().includes("warm")) {
      editInstructions.push({
        type: "style",
        target: "tone",
        description: "Apply warm tone",
        confidence: 0.8,
        parameters: { intensity: 0.4 },
      });
      baseConfidence = Math.max(baseConfidence, 0.8);
    }

    if (command.toLowerCase().includes("cool")) {
      editInstructions.push({
        type: "style",
        target: "tone",
        description: "Apply cool tone",
        confidence: 0.8,
        parameters: { intensity: 0.4 },
      });
      baseConfidence = Math.max(baseConfidence, 0.8);
    }

    if (editInstructions.length === 0) {
      editInstructions.push({
        type: "enhance",
        target: "image",
        description: command,
        confidence: 0.5,
        parameters: { intensity: 0.3 },
      });
    }

    const response: AnalyzeCommandResponse = {
      success: true,
      editInstructions,
      clarifyingQuestions:
        baseConfidence < 0.7 ? ["Could you provide more details?"] : [],
      confidence: baseConfidence,
      estimatedProcessingTime: 15,
      safetyFlags: [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[v0] Command analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze command.",
        editInstructions: [],
        confidence: 0,
        estimatedProcessingTime: 0,
      } as AnalyzeCommandResponse,
      { status: 500 }
    );
  }
}
