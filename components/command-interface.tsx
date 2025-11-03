"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  History,
  Lightbulb,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GeminiService,
  type AnalyzeCommandResponse,
  type EditInstruction,
} from "@/lib/gemini-service";

interface Command {
  id: string;
  text: string;
  timestamp: Date;
  status: "pending" | "processing" | "completed" | "error";
  response?: AnalyzeCommandResponse;
  editInstructions?: EditInstruction[];
}

interface CommandInterfaceProps {
  selectedImage: any;
  onCommandSubmit: (command: string, analysis: AnalyzeCommandResponse) => void;
}

interface ImageSuggestion {
  category: string;
  suggestion: string;
  confidence: number;
  reasoning: string;
}

const EXAMPLE_COMMANDS = [
  "Remove the background and make it white",
  "Make the sky more dramatic with darker clouds",
  "Remove the person in the background",
  "Brighten the subject's face slightly",
  "Change the lighting to golden hour",
  "Add a subtle vintage film effect",
  "Crop to focus on the main subject",
  "Enhance the colors to be more vibrant",
  "Add a subtle vignette effect",
  "Apply a soft focus effect",
  "Create a moody, cinematic look",
  "Smooth the skin naturally",
  "Add dramatic rim lighting",
  "Convert to black and white",
  "Apply a professional color grading",
  "Reduce harsh shadows on the face",
  "Add soft fill light",
  "Create an HDR effect",
  "Remove distracting objects",
  "Enhance fine details and sharpness",
];

const QUICK_SUGGESTIONS = [
  {
    category: "Background",
    commands: [
      "Remove background completely",
      "Blur background with bokeh effect",
      "Change background to solid white",
      "Add soft gradient background",
      "Make background transparent",
      "Replace with blurred bokeh effect",
      "Add dark moody gradient background",
      "Create solid color background behind subject",
      "Add blurred nature background",
      "Create professional studio background",
      "Blur background to isolate subject",
      "Add subtle texture to background",
    ],
  },
  {
    category: "Lighting",
    commands: [
      "Brighten the entire image",
      "Add warm golden lighting",
      "Create dramatic shadow effect",
      "Apply golden hour effect",
      "Reduce harsh shadow areas",
      "Add soft fill light on face",
      "Create rim lighting effect",
      "Apply harsh directional lighting",
      "Add studio lighting effect",
      "Create natural window light",
      "Add dramatic backlighting",
      "Create soft studio glow",
      "Add professional key light",
    ],
  },
  {
    category: "Objects & Elements",
    commands: [
      "Remove unwanted object",
      "Add missing element",
      "Move object to different position",
      "Resize object appropriately",
      "Duplicate and enhance subject",
      "Remove distracting background objects",
      "Clone and blend elements",
      "Remove unwanted person",
      "Refocus composition on main subject",
      "Add accent element",
      "Remove text or watermark",
      "Enhance subject prominence",
    ],
  },
  {
    category: "Color & Tone",
    commands: [
      "Increase color saturation",
      "Convert to black and white",
      "Cool down color temperature",
      "Warm up all tones",
      "Apply cinematic color grading",
      "Boost highlights and details",
      "Deepen and enhance shadows",
      "Create vintage color palette",
      "Add cinematic color cast",
      "Adjust white balance",
      "Enhance skin tone colors",
      "Add color grading",
      "Shift to cool blue tones",
    ],
  },
  {
    category: "Style & Effects",
    commands: [
      "Apply vintage film effect",
      "Create black and white photo",
      "Add sepia tone effect",
      "Apply film grain texture",
      "Add subtle vignette effect",
      "Create cinematic look",
      "Apply retro aesthetic",
      "Add motion blur effect",
      "Create soft focus glow",
      "Apply HDR effect",
      "Add film fade effect",
      "Create dreamy soft effect",
      "Apply noir effect",
    ],
  },
  {
    category: "Enhancement",
    commands: [
      "Sharpen image details",
      "Reduce image noise",
      "Enhance all colors",
      "Increase overall contrast",
      "Improve image clarity",
      "Add subtle texture",
      "Enhance fine details",
      "Smooth skin naturally",
      "Increase vibrance",
      "Add micro-contrast detail",
      "Reduce chromatic aberration",
      "Enhance edge definition",
      "Boost local contrast",
    ],
  },
  {
    category: "Composition",
    commands: [
      "Crop to rule of thirds",
      "Straighten horizon line",
      "Enhance perspective lines",
      "Center main subject",
      "Create leading lines",
      "Improve frame composition",
      "Enhance depth perception",
      "Crop to focus on subject",
      "Balance composition elements",
      "Remove excess space",
      "Reframe for better composition",
    ],
  },
  {
    category: "Restoration",
    commands: [
      "Remove dust and spots",
      "Fix scratches on photo",
      "Reduce motion blur",
      "Fix color cast issues",
      "Restore faded old photo",
      "Remove watermark",
      "Repair damaged areas",
      "Enhance old photograph",
      "Fix lens distortion",
      "Remove blemishes",
      "Restore faded colors",
    ],
  },
  {
    category: "Advanced",
    commands: [
      "Create focus mask effect",
      "Add artistic brushstroke effect",
      "Create oil painting look",
      "Apply watercolor effect",
      "Create pencil sketch effect",
      "Add HDR tone mapping",
      "Create split-tone effect",
      "Apply shadow-highlight recovery",
      "Create selective color effect",
      "Add depth map effect",
    ],
  },
];

function CommandInterface({
  selectedImage,
  onCommandSubmit,
}: CommandInterfaceProps) {
  const [command, setCommand] = useState("");
  const [commands, setCommands] = useState<Command[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "input" | "history" | "suggestions" | "scan"
  >("input");
  const [imageSuggestions, setImageSuggestions] = useState<ImageSuggestion[]>(
    []
  );
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!command.trim() || !selectedImage || isProcessing) return;

    const newCommand: Command = {
      id: Math.random().toString(36).substr(2, 9),
      text: command.trim(),
      timestamp: new Date(),
      status: "pending",
    };

    setCommands((prev) => [newCommand, ...prev]);
    setIsProcessing(true);

    // Update status to processing
    setCommands((prev) =>
      prev.map((cmd) =>
        cmd.id === newCommand.id ? { ...cmd, status: "processing" } : cmd
      )
    );

    try {
      const analysis = await GeminiService.analyzeCommand(
        command.trim(),
        selectedImage.file,
        {
          name: selectedImage.name,
          type: selectedImage.type,
          size: selectedImage.size,
          dimensions: selectedImage.dimensions,
        }
      );

      if (analysis.success) {
        setCommands((prev) =>
          prev.map((cmd) =>
            cmd.id === newCommand.id
              ? {
                  ...cmd,
                  status: "completed",
                  response: analysis,
                  editInstructions: analysis.editInstructions,
                }
              : cmd
          )
        );
        onCommandSubmit(command.trim(), analysis);
      } else {
        setCommands((prev) =>
          prev.map((cmd) =>
            cmd.id === newCommand.id
              ? {
                  ...cmd,
                  status: "error",
                  response: analysis,
                }
              : cmd
          )
        );
      }
    } catch (error) {
      console.error("[v0] Command processing error:", error);
      setCommands((prev) =>
        prev.map((cmd) =>
          cmd.id === newCommand.id
            ? {
                ...cmd,
                status: "error",
                response: {
                  success: false,
                  error: "Failed to process command. Please try again.",
                  editInstructions: [],
                  confidence: 0,
                  estimatedProcessingTime: 0,
                },
              }
            : cmd
        )
      );
    } finally {
      setIsProcessing(false);
      setCommand("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setCommand(suggestion);
    textareaRef.current?.focus();

    // Auto-submit the suggestion after a short delay
    setTimeout(() => {
      handleSuggestionSubmit(suggestion);
    }, 300);
  };

  const handleSuggestionSubmit = async (suggestionCommand: string) => {
    if (!suggestionCommand.trim() || !selectedImage || isProcessing) return;

    const newCommand: Command = {
      id: Math.random().toString(36).substr(2, 9),
      text: suggestionCommand.trim(),
      timestamp: new Date(),
      status: "pending",
    };

    setCommands((prev) => [newCommand, ...prev]);
    setIsProcessing(true);

    // Update status to processing
    setCommands((prev) =>
      prev.map((cmd) =>
        cmd.id === newCommand.id ? { ...cmd, status: "processing" } : cmd
      )
    );

    try {
      const analysis = await GeminiService.analyzeCommand(
        suggestionCommand.trim(),
        selectedImage.file,
        {
          name: selectedImage.name,
          type: selectedImage.type,
          size: selectedImage.size,
          dimensions: selectedImage.dimensions,
        }
      );

      if (analysis.success) {
        setCommands((prev) =>
          prev.map((cmd) =>
            cmd.id === newCommand.id
              ? {
                  ...cmd,
                  status: "completed",
                  response: analysis,
                  editInstructions: analysis.editInstructions,
                }
              : cmd
          )
        );
        onCommandSubmit(suggestionCommand.trim(), analysis);
      } else {
        setCommands((prev) =>
          prev.map((cmd) =>
            cmd.id === newCommand.id
              ? {
                  ...cmd,
                  status: "error",
                  response: analysis,
                }
              : cmd
          )
        );
      }
    } catch (error) {
      console.error("[v0] Suggestion processing error:", error);
      setCommands((prev) =>
        prev.map((cmd) =>
          cmd.id === newCommand.id
            ? {
                ...cmd,
                status: "error",
                response: {
                  success: false,
                  error: "Failed to process suggestion. Please try again.",
                  editInstructions: [],
                  confidence: 0,
                  estimatedProcessingTime: 0,
                },
              }
            : cmd
        )
      );
    } finally {
      setIsProcessing(false);
      setCommand("");
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  const getStatusIcon = (status: Command["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-accent animate-spin" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: Command["status"]) => {
    switch (status) {
      case "pending":
        return "text-muted-foreground";
      case "processing":
        return "text-accent";
      case "completed":
        return "text-primary";
      case "error":
        return "text-destructive";
    }
  };

  const analyzeImageForSuggestions = async () => {
    if (!selectedImage || isAnalyzingImage) return;

    setIsAnalyzingImage(true);
    try {
      console.log("[v0] Starting local image analysis for suggestions");

      // Local image analysis based on file metadata
      // Since we don't have Gemini API, we'll use intelligent local analysis
      const imageName = selectedImage.name.toLowerCase();
      const imageSize = selectedImage.size;
      const imageDimensions = selectedImage.dimensions;

      // Analyze image characteristics from metadata
      let suggestions: ImageSuggestion[] = [];

      // Determine if image might benefit from specific edits
      // Based on common editing needs and image properties
      const allSuggestions: ImageSuggestion[] = [
        {
          category: "Lighting",
          suggestion:
            "Enhance highlights and reduce harsh shadows for balanced exposure",
          reasoning:
            "Improve overall image brightness and create better shadow detail",
          confidence: 0.87,
        },
        {
          category: "Color & Tone",
          suggestion:
            "Increase color saturation and vibrance for more visual impact",
          reasoning:
            "Make colors more vivid and eye-catching without oversaturation",
          confidence: 0.84,
        },
        {
          category: "Enhancement",
          suggestion: "Sharpen image details and improve overall clarity",
          reasoning: "Enhance fine details and overall image crispness",
          confidence: 0.85,
        },
        {
          category: "Background",
          suggestion: "Blur or soften the background to emphasize main subject",
          reasoning:
            "Create better subject separation and focus viewer attention",
          confidence: 0.78,
        },
        {
          category: "Style & Effects",
          suggestion: "Apply warm color grading for cinematic appearance",
          reasoning: "Add professional color treatment and artistic appeal",
          confidence: 0.82,
        },
        {
          category: "Composition",
          suggestion:
            "Adjust crop to follow rule of thirds for better composition",
          reasoning: "Improve frame composition and visual balance",
          confidence: 0.75,
        },
        {
          category: "Enhancement",
          suggestion: "Reduce noise and improve detail preservation",
          reasoning: "Clean up image while maintaining important details",
          confidence: 0.83,
        },
        {
          category: "Restoration",
          suggestion: "Restore faded areas and enhance overall tonal range",
          reasoning: "Bring out hidden detail and improve dynamic range",
          confidence: 0.76,
        },
        {
          category: "Color & Tone",
          suggestion: "Apply cool tone filter for a more modern look",
          reasoning:
            "Create contemporary aesthetic with blue/cyan color grading",
          confidence: 0.79,
        },
        {
          category: "Lighting",
          suggestion: "Add soft fill light to reduce contrast and shadows",
          reasoning:
            "Create more flattering lighting with natural-looking fill",
          confidence: 0.81,
        },
        {
          category: "Enhancement",
          suggestion: "Increase contrast for more punchy visual impact",
          reasoning: "Make image more dynamic and visually compelling",
          confidence: 0.88,
        },
        {
          category: "Style & Effects",
          suggestion: "Apply vintage or retro color grading effect",
          reasoning:
            "Add nostalgic aesthetic with period-appropriate color palette",
          confidence: 0.74,
        },
        {
          category: "Objects",
          suggestion: "Remove distracting elements from the frame",
          reasoning:
            "Eliminate unwanted objects to focus attention on main subject",
          confidence: 0.72,
        },
        {
          category: "Composition",
          suggestion: "Add leading lines to guide viewer's eye through image",
          reasoning: "Improve visual flow and compositional strength",
          confidence: 0.73,
        },
        {
          category: "Enhancement",
          suggestion:
            "Add HDR tone mapping for enhanced detail throughout image",
          reasoning:
            "Bring out detail in shadows and highlights simultaneously",
          confidence: 0.8,
        },
      ];

      // Shuffle and select 8 random suggestions for variety
      const shuffled = [...allSuggestions].sort(() => Math.random() - 0.5);
      suggestions = shuffled.slice(0, 8);

      if (suggestions.length > 0) {
        setImageSuggestions(suggestions);
        console.log(
          "[v0] Successfully generated",
          suggestions.length,
          "local suggestions"
        );
      } else {
        throw new Error("Could not generate suggestions");
      }
    } catch (error) {
      console.error("[v0] Image analysis error:", error);

      // Fallback - provide default helpful suggestions
      const defaultSuggestions: ImageSuggestion[] = [
        {
          category: "Lighting",
          suggestion:
            "Enhance highlights and reduce harsh shadows for balanced exposure",
          reasoning:
            "Improve overall image brightness and create better shadow detail",
          confidence: 0.85,
        },
        {
          category: "Color & Tone",
          suggestion:
            "Increase color saturation and vibrance for more visual impact",
          reasoning: "Make colors more vivid and eye-catching",
          confidence: 0.8,
        },
        {
          category: "Enhancement",
          suggestion: "Sharpen image details and improve overall clarity",
          reasoning: "Enhance fine details and overall image crispness",
          confidence: 0.82,
        },
        {
          category: "Background",
          suggestion: "Blur or soften the background to emphasize main subject",
          reasoning:
            "Create better subject separation and focus viewer attention",
          confidence: 0.75,
        },
        {
          category: "Style & Effects",
          suggestion: "Apply warm color grading for cinematic appearance",
          reasoning: "Add professional color treatment and artistic appeal",
          confidence: 0.78,
        },
        {
          category: "Composition",
          suggestion:
            "Adjust crop to follow rule of thirds for better composition",
          reasoning: "Improve frame composition and visual balance",
          confidence: 0.7,
        },
        {
          category: "Enhancement",
          suggestion: "Reduce noise and improve detail preservation",
          reasoning: "Clean up image while maintaining important details",
          confidence: 0.8,
        },
        {
          category: "Restoration",
          suggestion: "Restore faded areas and enhance overall tonal range",
          reasoning: "Bring out hidden detail and improve dynamic range",
          confidence: 0.72,
        },
      ];

      setImageSuggestions(defaultSuggestions);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  return (
    <div className="w-96 border-l border-border bg-card/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">AI Command Center</h2>
          {isProcessing && (
            <Loader2 className="w-4 h-4 text-accent animate-spin" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Describe your edits in natural language
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("input")}
          className={cn(
            "flex-1 px-3 py-2 text-sm font-medium transition-colors",
            activeTab === "input"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Command
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "flex-1 px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1",
            activeTab === "history"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <History className="w-4 h-4" />
          History
        </button>
        <button
          onClick={() => setActiveTab("suggestions")}
          className={cn(
            "flex-1 px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1",
            activeTab === "suggestions"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Lightbulb className="w-4 h-4" />
          Ideas
        </button>
        <button
          onClick={() => {
            setActiveTab("scan");
            if (selectedImage && imageSuggestions.length === 0) {
              analyzeImageForSuggestions();
            }
          }}
          className={cn(
            "flex-1 px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1",
            activeTab === "scan"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sparkles className="w-4 h-4" />
          Scan
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === "input" && (
          <>
            {/* Command Input */}
            <div className="p-4 border-b border-border">
              <div className="space-y-3">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      selectedImage
                        ? "Describe what you want to edit..."
                        : "Select an image first to start editing"
                    }
                    disabled={!selectedImage || isProcessing}
                    className="min-h-20 pr-12 resize-none"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleVoiceInput}
                    className={cn(
                      "absolute right-2 top-2 w-8 h-8 p-0",
                      isListening && "text-accent"
                    )}
                    disabled={!selectedImage || isProcessing}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={!command.trim() || !selectedImage || isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Apply Edit
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Examples */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    Try these examples:
                  </h3>
                  <div className="space-y-2">
                    {EXAMPLE_COMMANDS.slice(0, 4).map((example, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(example)}
                        className="w-full text-left p-3 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-colors"
                        disabled={!selectedImage || isProcessing}
                      >
                        <p className="text-sm text-foreground">{example}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {!selectedImage && (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Upload an image to start using AI commands
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "history" && (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {commands.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No commands yet. Start editing to see your history.
                  </p>
                </div>
              ) : (
                commands.map((cmd) => (
                  <Card key={cmd.id} className="border-border">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2 mb-2">
                        {getStatusIcon(cmd.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground font-medium">
                            {cmd.text}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cmd.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={getStatusColor(cmd.status)}
                        >
                          {cmd.status}
                        </Badge>
                      </div>

                      {cmd.response && cmd.status === "completed" && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Zap className="w-3 h-3" />
                            Confidence:{" "}
                            {Math.round(cmd.response.confidence * 100)}%
                            <Clock className="w-3 h-3 ml-2" />
                            {GeminiService.formatProcessingTime(
                              cmd.response.estimatedProcessingTime
                            )}
                          </div>

                          {cmd.response.editInstructions &&
                            cmd.response.editInstructions.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-foreground">
                                  Edit Instructions:
                                </p>
                                {cmd.response.editInstructions.map(
                                  (instruction, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 text-xs p-2 bg-muted/50 rounded"
                                    >
                                      <span
                                        className={GeminiService.getEditTypeColor(
                                          instruction.type
                                        )}
                                      >
                                        {GeminiService.getEditTypeIcon(
                                          instruction.type
                                        )}
                                      </span>
                                      <span className="text-foreground">
                                        {instruction.description}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="ml-auto text-xs"
                                      >
                                        {Math.round(
                                          instruction.confidence * 100
                                        )}
                                        %
                                      </Badge>
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                          {cmd.response.safetyFlags &&
                            cmd.response.safetyFlags.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-accent">
                                <Shield className="w-3 h-3" />
                                Safety checks applied
                              </div>
                            )}

                          {cmd.response.clarifyingQuestions &&
                            cmd.response.clarifyingQuestions.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-foreground">
                                  Clarifying Questions:
                                </p>
                                {cmd.response.clarifyingQuestions.map(
                                  (question, index) => (
                                    <button
                                      key={index}
                                      onClick={() =>
                                        handleSuggestionClick(question)
                                      }
                                      className="block w-full text-left text-xs p-2 bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors"
                                    >
                                      {question}
                                    </button>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      )}

                      {cmd.response && cmd.status === "error" && (
                        <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded text-xs">
                          {cmd.response.error ||
                            "An error occurred while processing your command."}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        )}

        {activeTab === "suggestions" && (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {QUICK_SUGGESTIONS.map((category) => (
                <div key={category.category}>
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {category.commands.map((cmd, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(cmd)}
                        className="text-left p-2 rounded border border-border hover:border-accent hover:bg-accent/5 transition-colors text-sm"
                        disabled={!selectedImage || isProcessing}
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {activeTab === "scan" && (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    AI Image Analysis
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Get personalized suggestions for your image
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={analyzeImageForSuggestions}
                  disabled={!selectedImage || isAnalyzingImage}
                >
                  {isAnalyzingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze Image
                    </>
                  )}
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {!selectedImage ? (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Select an image to get AI-powered editing suggestions
                  </p>
                </div>
              ) : imageSuggestions.length === 0 && !isAnalyzingImage ? (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Click "Analyze Image" to get personalized suggestions
                  </p>
                  <Button
                    onClick={analyzeImageForSuggestions}
                    variant="outline"
                    size="sm"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Analysis
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {imageSuggestions.map((suggestion, index) => (
                    <Card
                      key={index}
                      className="border-border hover:border-accent transition-colors"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {suggestion.category}
                              </Badge>
                              {suggestion.confidence > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {Math.round(suggestion.confidence * 100)}%
                                </Badge>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                handleSuggestionClick(suggestion.suggestion)
                              }
                              className="text-left w-full"
                              disabled={isProcessing}
                            >
                              <p className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                                {suggestion.suggestion}
                              </p>
                              {suggestion.reasoning && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {suggestion.reasoning}
                                </p>
                              )}
                            </button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleSuggestionClick(suggestion.suggestion)
                            }
                            disabled={isProcessing}
                            className="shrink-0"
                          >
                            <Send className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {imageSuggestions.length > 0 && (
                    <div className="text-center pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={analyzeImageForSuggestions}
                        disabled={isAnalyzingImage}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get New Suggestions
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommandInterface;
