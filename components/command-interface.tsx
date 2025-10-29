"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GeminiService, type AnalyzeCommandResponse, type EditInstruction } from "@/lib/gemini-service"

interface Command {
  id: string
  text: string
  timestamp: Date
  status: "pending" | "processing" | "completed" | "error"
  response?: AnalyzeCommandResponse
  editInstructions?: EditInstruction[]
}

interface CommandInterfaceProps {
  selectedImage: any
  onCommandSubmit: (command: string, analysis: AnalyzeCommandResponse) => void
}

interface ImageSuggestion {
  category: string
  suggestion: string
  confidence: number
  reasoning: string
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
]

const QUICK_SUGGESTIONS = [
  {
    category: "Background",
    commands: ["Remove background", "Blur background", "Change background to white", "Add gradient background"],
  },
  {
    category: "Lighting",
    commands: ["Brighten image", "Add warm lighting", "Create dramatic shadows", "Golden hour effect"],
  },
  { category: "Objects", commands: ["Remove object", "Add object", "Move object", "Resize object"] },
  { category: "Style", commands: ["Vintage effect", "Black and white", "Sepia tone", "Film grain"] },
  { category: "Enhancement", commands: ["Sharpen image", "Reduce noise", "Enhance colors", "Increase contrast"] },
]

function CommandInterface({ selectedImage, onCommandSubmit }: CommandInterfaceProps) {
  const [command, setCommand] = useState("")
  const [commands, setCommands] = useState<Command[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<"input" | "history" | "suggestions" | "scan">("input")
  const [imageSuggestions, setImageSuggestions] = useState<ImageSuggestion[]>([])
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async () => {
    if (!command.trim() || !selectedImage || isProcessing) return

    const newCommand: Command = {
      id: Math.random().toString(36).substr(2, 9),
      text: command.trim(),
      timestamp: new Date(),
      status: "pending",
    }

    setCommands((prev) => [newCommand, ...prev])
    setIsProcessing(true)

    // Update status to processing
    setCommands((prev) => prev.map((cmd) => (cmd.id === newCommand.id ? { ...cmd, status: "processing" } : cmd)))

    try {
      const analysis = await GeminiService.analyzeCommand(command.trim(), selectedImage.file, {
        name: selectedImage.name,
        type: selectedImage.type,
        size: selectedImage.size,
        dimensions: selectedImage.dimensions,
      })

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
              : cmd,
          ),
        )
        onCommandSubmit(command.trim(), analysis)
      } else {
        setCommands((prev) =>
          prev.map((cmd) =>
            cmd.id === newCommand.id
              ? {
                  ...cmd,
                  status: "error",
                  response: analysis,
                }
              : cmd,
          ),
        )
      }
    } catch (error) {
      console.error("[v0] Command processing error:", error)
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
            : cmd,
        ),
      )
    } finally {
      setIsProcessing(false)
      setCommand("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setCommand(suggestion)
    textareaRef.current?.focus()
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice input implementation would go here
  }

  const getStatusIcon = (status: Command["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-muted-foreground" />
      case "processing":
        return <Loader2 className="w-4 h-4 text-accent animate-spin" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-primary" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />
    }
  }

  const getStatusColor = (status: Command["status"]) => {
    switch (status) {
      case "pending":
        return "text-muted-foreground"
      case "processing":
        return "text-accent"
      case "completed":
        return "text-primary"
      case "error":
        return "text-destructive"
    }
  }

  const analyzeImageForSuggestions = async () => {
    if (!selectedImage || isAnalyzingImage) return

    setIsAnalyzingImage(true)
    try {
      const analysisPrompt = `You are an expert photo editor. Analyze this image and provide exactly 6-8 specific, actionable editing suggestions that would improve it.

IMPORTANT: Respond with ONLY a valid JSON array. No other text, no markdown, no explanations.

Format: [
  {
    "category": "Background|Lighting|Color|Objects|Style|Enhancement",
    "suggestion": "specific editing command (e.g., 'Remove the background', 'Brighten the shadows')",
    "reasoning": "brief explanation why this would improve the image",
    "confidence": 0.8
  }
]

Consider:
- Composition and framing improvements
- Lighting and exposure adjustments
- Color balance and saturation
- Background enhancements
- Object removal or enhancement
- Artistic effects suitable for this image
- Technical improvements (sharpness, noise reduction)

Provide practical, achievable edits that would genuinely enhance this specific image.`

      console.log("[v0] Starting image analysis for suggestions")

      const analysis = await GeminiService.analyzeCommand(analysisPrompt, selectedImage.file, {
        name: selectedImage.name,
        type: selectedImage.type,
        size: selectedImage.size,
        dimensions: selectedImage.dimensions,
      })

      console.log("[v0] Analysis response:", analysis)

      if (analysis.success && analysis.response) {
        try {
          let jsonText = analysis.response.trim()

          if (jsonText.includes("```")) {
            const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
            if (jsonMatch && jsonMatch[1]) {
              jsonText = jsonMatch[1].trim()
            }
          }

          const arrayMatch = jsonText.match(/\[[\s\S]*\]/)
          if (arrayMatch) {
            jsonText = arrayMatch[0]
          }

          console.log("[v0] Attempting to parse JSON:", jsonText)
          const suggestions = JSON.parse(jsonText)

          if (Array.isArray(suggestions) && suggestions.length > 0) {
            const validSuggestions = suggestions
              .filter((s) => s.category && s.suggestion && s.reasoning && typeof s.confidence === "number")
              .slice(0, 8)

            if (validSuggestions.length > 0) {
              setImageSuggestions(validSuggestions)
              console.log("[v0] Successfully parsed", validSuggestions.length, "suggestions")
            } else {
              throw new Error("No valid suggestions found in response")
            }
          } else {
            throw new Error("Response is not a valid array")
          }
        } catch (parseError) {
          console.error("[v0] JSON parsing failed:", parseError)
          console.log("[v0] Raw response:", analysis.response)

          const fallbackSuggestions = [
            {
              category: "Enhancement",
              suggestion: "Enhance overall image brightness and contrast",
              reasoning: "Improve overall image quality and visual appeal",
              confidence: 0.8,
            },
            {
              category: "Color",
              suggestion: "Adjust color saturation for more vibrant colors",
              reasoning: "Make colors more vivid and eye-catching",
              confidence: 0.7,
            },
            {
              category: "Lighting",
              suggestion: "Brighten shadows to reveal more detail",
              reasoning: "Improve visibility in darker areas of the image",
              confidence: 0.8,
            },
            {
              category: "Background",
              suggestion: "Blur background to focus on main subject",
              reasoning: "Create better subject separation and focus",
              confidence: 0.6,
            },
          ]
          setImageSuggestions(fallbackSuggestions)
        }
      } else {
        console.error("[v0] Analysis failed:", analysis.error)
        setImageSuggestions([
          {
            category: "Error",
            suggestion: "Unable to analyze image. Please try again.",
            reasoning: analysis.error || "Analysis failed",
            confidence: 0,
          },
        ])
      }
    } catch (error) {
      console.error("[v0] Image analysis error:", error)
      setImageSuggestions([
        {
          category: "Error",
          suggestion: "Unable to analyze image. Please try again.",
          reasoning: "Network or processing error occurred",
          confidence: 0,
        },
      ])
    } finally {
      setIsAnalyzingImage(false)
    }
  }

  return (
    <div className="w-96 border-l border-border bg-card/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">AI Command Center</h2>
          {isProcessing && <Loader2 className="w-4 h-4 text-accent animate-spin" />}
        </div>
        <p className="text-sm text-muted-foreground">Describe your edits in natural language</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("input")}
          className={cn(
            "flex-1 px-3 py-2 text-sm font-medium transition-colors",
            activeTab === "input"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground",
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
              : "text-muted-foreground hover:text-foreground",
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
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Lightbulb className="w-4 h-4" />
          Ideas
        </button>
        <button
          onClick={() => {
            setActiveTab("scan")
            if (selectedImage && imageSuggestions.length === 0) {
              analyzeImageForSuggestions()
            }
          }}
          className={cn(
            "flex-1 px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1",
            activeTab === "scan"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground",
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
                      selectedImage ? "Describe what you want to edit..." : "Select an image first to start editing"
                    }
                    disabled={!selectedImage || isProcessing}
                    className="min-h-20 pr-12 resize-none"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleVoiceInput}
                    className={cn("absolute right-2 top-2 w-8 h-8 p-0", isListening && "text-accent")}
                    disabled={!selectedImage || isProcessing}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
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
                  <h3 className="text-sm font-medium text-foreground mb-2">Try these examples:</h3>
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
                    <p className="text-sm text-muted-foreground">Upload an image to start using AI commands</p>
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
                  <p className="text-sm text-muted-foreground">No commands yet. Start editing to see your history.</p>
                </div>
              ) : (
                commands.map((cmd) => (
                  <Card key={cmd.id} className="border-border">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2 mb-2">
                        {getStatusIcon(cmd.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground font-medium">{cmd.text}</p>
                          <p className="text-xs text-muted-foreground">{cmd.timestamp.toLocaleTimeString()}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(cmd.status)}>
                          {cmd.status}
                        </Badge>
                      </div>

                      {cmd.response && cmd.status === "completed" && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Zap className="w-3 h-3" />
                            Confidence: {Math.round(cmd.response.confidence * 100)}%
                            <Clock className="w-3 h-3 ml-2" />
                            {GeminiService.formatProcessingTime(cmd.response.estimatedProcessingTime)}
                          </div>

                          {cmd.response.editInstructions && cmd.response.editInstructions.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-foreground">Edit Instructions:</p>
                              {cmd.response.editInstructions.map((instruction, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs p-2 bg-muted/50 rounded">
                                  <span className={GeminiService.getEditTypeColor(instruction.type)}>
                                    {GeminiService.getEditTypeIcon(instruction.type)}
                                  </span>
                                  <span className="text-foreground">{instruction.description}</span>
                                  <Badge variant="outline" className="ml-auto text-xs">
                                    {Math.round(instruction.confidence * 100)}%
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}

                          {cmd.response.safetyFlags && cmd.response.safetyFlags.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-accent">
                              <Shield className="w-3 h-3" />
                              Safety checks applied
                            </div>
                          )}

                          {cmd.response.clarifyingQuestions && cmd.response.clarifyingQuestions.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-foreground">Clarifying Questions:</p>
                              {cmd.response.clarifyingQuestions.map((question, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestionClick(question)}
                                  className="block w-full text-left text-xs p-2 bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors"
                                >
                                  {question}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {cmd.response && cmd.status === "error" && (
                        <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded text-xs">
                          {cmd.response.error || "An error occurred while processing your command."}
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
                  <h3 className="text-sm font-medium text-foreground mb-2">{category.category}</h3>
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
                  <h3 className="text-sm font-medium text-foreground">AI Image Analysis</h3>
                  <p className="text-xs text-muted-foreground">Get personalized suggestions for your image</p>
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
                  <p className="text-sm text-muted-foreground">Select an image to get AI-powered editing suggestions</p>
                </div>
              ) : imageSuggestions.length === 0 && !isAnalyzingImage ? (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Click "Analyze Image" to get personalized suggestions
                  </p>
                  <Button onClick={analyzeImageForSuggestions} variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Analysis
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {imageSuggestions.map((suggestion, index) => (
                    <Card key={index} className="border-border hover:border-accent transition-colors">
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
                              onClick={() => handleSuggestionClick(suggestion.suggestion)}
                              className="text-left w-full"
                              disabled={isProcessing}
                            >
                              <p className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                                {suggestion.suggestion}
                              </p>
                              {suggestion.reasoning && (
                                <p className="text-xs text-muted-foreground mt-1">{suggestion.reasoning}</p>
                              )}
                            </button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSuggestionClick(suggestion.suggestion)}
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
  )
}

export default CommandInterface
