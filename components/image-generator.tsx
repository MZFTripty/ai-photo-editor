"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Wand2, AlertCircle } from "lucide-react"

interface ImageGeneratorProps {
  onImageGenerated: (imageData: string, metadata: any) => void
  isGenerating?: boolean
}

export function ImageGenerator({ onImageGenerated, isGenerating = false }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [error, setError] = useState("")
  const [style, setStyle] = useState("default")
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [lighting, setLighting] = useState("default")
  const [cameraAngle, setCameraAngle] = useState("default")
  const [texture, setTexture] = useState("default")
  const [animationFrames, setAnimationFrames] = useState("default")
  const [pose, setPose] = useState("default")
  const [expression, setExpression] = useState("default")
  const [clothing, setClothing] = useState("default")
  const [consistency, setConsistency] = useState("default")
  const [scene, setScene] = useState("default")
  const [depthOfField, setDepthOfField] = useState("default")
  const [weather, setWeather] = useState("default")
  const [logoMaker, setLogoMaker] = useState("default")

  console.log("[v0] ImageGenerator rendering, isGenerating:", isGenerating)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setError("")
    console.log("[v0] Starting image generation with prompt:", prompt)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
          aspectRatio,
          lighting,
          cameraAngle,
          texture,
          animationFrames,
          pose,
          expression,
          clothing,
          consistency,
          scene,
          depthOfField,
          weather,
          logoMaker,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onImageGenerated(result.imageData, {
          prompt: result.prompt,
          style: result.style,
          aspectRatio: result.aspectRatio,
          generatedAt: result.generatedAt,
        })
        setPrompt("")
      } else {
        const errorMessage = result.error || "Unknown error"
        if (
          errorMessage.includes("429") ||
          errorMessage.includes("quota") ||
          errorMessage.includes("RESOURCE_EXHAUSTED")
        ) {
          setError("LumenFrame's image generation feature via API has been disabled by Google. Please try again later.")
        } else {
          setError("Generation failed. Please try again.")
        }
        console.error("Generation failed:", result.error)
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.")
      console.error("Generation error:", error)
    }
  }

  const styleOptions = [
    { value: "default", label: "Default" },
    { value: "photorealistic", label: "Photorealistic" },
    { value: "artistic", label: "Artistic" },
    { value: "cartoon", label: "Cartoon" },
    { value: "minimalist", label: "Minimalist" },
    { value: "vintage", label: "Vintage" },
    { value: "modern", label: "Modern" },
  ]

  const aspectRatioOptions = [
    { value: "1:1", label: "Square (1:1)" },
    { value: "16:9", label: "Landscape (16:9)" },
    { value: "9:16", label: "Portrait (9:16)" },
    { value: "4:3", label: "Standard (4:3)" },
    { value: "3:2", label: "Photo (3:2)" },
  ]

  const lightingOptions = [
    { value: "default", label: "Default" },
    { value: "cinematic", label: "Cinematic" },
    { value: "neon", label: "Neon" },
    { value: "soft-daylight", label: "Soft Daylight" },
    { value: "moody", label: "Moody" },
    { value: "golden-hour", label: "Golden Hour" },
    { value: "dramatic", label: "Dramatic" },
    { value: "studio", label: "Studio" },
  ]

  const cameraAngleOptions = [
    { value: "default", label: "Default" },
    { value: "top-view", label: "Top View" },
    { value: "isometric", label: "Isometric" },
    { value: "wide-shot", label: "Wide Shot" },
    { value: "close-up", label: "Close-up" },
    { value: "bird-eye", label: "Bird's Eye" },
    { value: "low-angle", label: "Low Angle" },
    { value: "high-angle", label: "High Angle" },
  ]

  const textureOptions = [
    { value: "default", label: "Default" },
    { value: "glossy", label: "Glossy" },
    { value: "matte", label: "Matte" },
    { value: "watercolor", label: "Watercolor" },
    { value: "pixel-art", label: "Pixel Art" },
    { value: "oil-painting", label: "Oil Painting" },
    { value: "sketch", label: "Sketch" },
    { value: "metallic", label: "Metallic" },
  ]

  const animationFramesOptions = [
    { value: "default", label: "Default" },
    { value: "static", label: "Static Image" },
    { value: "gif-frames", label: "GIF Frames" },
    { value: "sequence", label: "Image Sequence" },
    { value: "motion-blur", label: "Motion Blur" },
  ]

  const poseOptions = [
    { value: "default", label: "Default" },
    { value: "standing", label: "Standing" },
    { value: "sitting", label: "Sitting" },
    { value: "action-pose", label: "Action Pose" },
    { value: "walking", label: "Walking" },
    { value: "running", label: "Running" },
    { value: "dancing", label: "Dancing" },
    { value: "relaxed", label: "Relaxed" },
  ]

  const expressionOptions = [
    { value: "default", label: "Default" },
    { value: "happy", label: "Happy" },
    { value: "serious", label: "Serious" },
    { value: "shocked", label: "Shocked" },
    { value: "calm", label: "Calm" },
    { value: "excited", label: "Excited" },
    { value: "thoughtful", label: "Thoughtful" },
    { value: "confident", label: "Confident" },
  ]

  const clothingOptions = [
    { value: "default", label: "Default" },
    { value: "fantasy-armor", label: "Fantasy Armor" },
    { value: "business-suit", label: "Business Suit" },
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
    { value: "sportswear", label: "Sportswear" },
    { value: "vintage", label: "Vintage" },
    { value: "futuristic", label: "Futuristic" },
  ]

  const consistencyOptions = [
    { value: "default", label: "Default" },
    { value: "same-character", label: "Same Character" },
    { value: "character-series", label: "Character Series" },
    { value: "style-consistent", label: "Style Consistent" },
    { value: "brand-consistent", label: "Brand Consistent" },
  ]

  const sceneOptions = [
    { value: "default", label: "Default" },
    { value: "futuristic-city", label: "Futuristic City" },
    { value: "forest", label: "Forest" },
    { value: "underwater", label: "Underwater" },
    { value: "space", label: "Space" },
    { value: "desert", label: "Desert" },
    { value: "mountain", label: "Mountain" },
    { value: "beach", label: "Beach" },
  ]

  const depthOfFieldOptions = [
    { value: "default", label: "Default" },
    { value: "blur-background", label: "Blur Background" },
    { value: "sharp-focus", label: "Sharp Focus" },
    { value: "bokeh", label: "Bokeh Effect" },
    { value: "deep-focus", label: "Deep Focus" },
    { value: "shallow-focus", label: "Shallow Focus" },
  ]

  const weatherOptions = [
    { value: "default", label: "Default" },
    { value: "rain", label: "Rain" },
    { value: "snow", label: "Snow" },
    { value: "sunny", label: "Sunny" },
    { value: "storm", label: "Storm" },
    { value: "fog", label: "Fog" },
    { value: "cloudy", label: "Cloudy" },
    { value: "sunset", label: "Sunset" },
  ]

  const logoMakerOptions = [
    { value: "default", label: "Default" },
    { value: "modern-logo", label: "Modern Logo" },
    { value: "vintage-logo", label: "Vintage Logo" },
    { value: "minimalist-logo", label: "Minimalist Logo" },
    { value: "tech-logo", label: "Tech Logo" },
    { value: "creative-logo", label: "Creative Logo" },
    { value: "corporate-logo", label: "Corporate Logo" },
  ]

  return (
    <div className="space-y-4 bg-background min-h-full">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">AI Image Generator</h3>
        <Badge variant="secondary" className="text-xs">
          Powered by Gemini
        </Badge>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Describe the image you want to create
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A serene mountain landscape at sunset with a lake reflecting the sky..."
            className="min-h-[80px] resize-none"
            disabled={isGenerating}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Style</label>
            <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Choose style" />
              </SelectTrigger>
              <SelectContent>
                {styleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Aspect Ratio</label>
            <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aspectRatioOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Lighting & Mood</label>
            <Select value={lighting} onValueChange={setLighting} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {lightingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Camera Angle</label>
            <Select value={cameraAngle} onValueChange={setCameraAngle} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cameraAngleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Texture Control</label>
            <Select value={texture} onValueChange={setTexture} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {textureOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Animation Frames</label>
            <Select value={animationFrames} onValueChange={setAnimationFrames} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {animationFramesOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Pose Selector</label>
            <Select value={pose} onValueChange={setPose} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {poseOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Expression Control</label>
            <Select value={expression} onValueChange={setExpression} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {expressionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Clothing/Outfit Style</label>
            <Select value={clothing} onValueChange={setClothing} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {clothingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Consistency Mode</label>
            <Select value={consistency} onValueChange={setConsistency} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {consistencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Scene Generator</label>
            <Select value={scene} onValueChange={setScene} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sceneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Depth of Field</label>
            <Select value={depthOfField} onValueChange={setDepthOfField} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {depthOfFieldOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Weather Control</label>
            <Select value={weather} onValueChange={setWeather} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weatherOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Logo Maker</label>
            <Select value={logoMaker} onValueChange={setLogoMaker} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {logoMakerOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Generating Image...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
