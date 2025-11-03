"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, AlertCircle, CheckCircle, X } from "lucide-react";

interface ImageGeneratorProps {
  onImageGenerated: (imageData: string, metadata: any) => void;
  isGenerating?: boolean;
}

export function ImageGenerator({
  onImageGenerated,
  isGenerating = false,
}: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [style, setStyle] = useState("default");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [lighting, setLighting] = useState("default");
  const [cameraAngle, setCameraAngle] = useState("default");
  const [texture, setTexture] = useState("default");
  const [animationFrames, setAnimationFrames] = useState("default");
  const [pose, setPose] = useState("default");
  const [expression, setExpression] = useState("default");
  const [clothing, setClothing] = useState("default");
  const [consistency, setConsistency] = useState("default");
  const [scene, setScene] = useState("default");
  const [depthOfField, setDepthOfField] = useState("default");
  const [weather, setWeather] = useState("default");
  const [logoMaker, setLogoMaker] = useState("default");

  // console.log("[v0] ImageGenerator rendering, isGenerating:", isGenerating)

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setError("");
    setSuccess("");
    console.log("[v0] Starting image generation with prompt:", prompt);

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
      });

      const result = await response.json();

      if (result.success) {
        const successMsg = `✨ Image generated successfully!`;
        setSuccess(successMsg);
        setShowSuccessModal(true);

        setTimeout(() => {
          onImageGenerated(result.imageData, {
            prompt: result.prompt,
            style: result.style,
            aspectRatio: result.aspectRatio,
            generatedAt: result.generatedAt,
          });
          setPrompt("");
          setShowSuccessModal(false);
        }, 1500);
      } else {
        const errorMessage = result.error || "Unknown error occurred";
        let displayError = errorMessage;

        if (
          errorMessage.includes("429") ||
          errorMessage.includes("quota") ||
          errorMessage.includes("RESOURCE_EXHAUSTED")
        ) {
          displayError =
            "⚠️ API Quota Exceeded\n\nImage generation feature has reached its limit. Please try again later.";
        } else if (errorMessage.includes("401")) {
          displayError =
            "🔐 Authentication Error\n\nAPI key is invalid or expired. Please check configuration.";
        } else if (
          errorMessage.includes("Network") ||
          errorMessage.includes("ECONNREFUSED")
        ) {
          displayError =
            "🌐 Network Error\n\nUnable to connect to image generation service. Check your connection.";
        } else if (errorMessage.includes("timeout")) {
          displayError =
            "⏱️ Request Timeout\n\nImage generation took too long. Please try again.";
        } else {
          displayError = `❌ Generation Failed\n\n${errorMessage}`;
        }

        setError(displayError);
        setShowErrorModal(true);
        console.error("Generation failed:", result.error);
      }
    } catch (error) {
      let displayError = "❌ Generation Error";
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          displayError =
            "🌐 Network Error\n\nCannot reach image generation service. Check your internet connection.";
        } else if (error.message.includes("timeout")) {
          displayError =
            "⏱️ Request Timeout\n\nThe request took too long to complete.";
        } else {
          displayError = `❌ Error\n\n${error.message}`;
        }
      }
      setError(displayError);
      setShowErrorModal(true);
      console.error("Generation error:", error);
    }
  };

  const styleOptions = [
    { value: "default", label: "Default" },
    { value: "photorealistic", label: "Photorealistic" },
    { value: "artistic", label: "Artistic" },
    { value: "cartoon", label: "Cartoon" },
    { value: "minimalist", label: "Minimalist" },
    { value: "vintage", label: "Vintage" },
    { value: "modern", label: "Modern" },
  ];

  const aspectRatioOptions = [
    { value: "1:1", label: "Square (1:1)" },
    { value: "16:9", label: "Landscape (16:9)" },
    { value: "9:16", label: "Portrait (9:16)" },
    { value: "4:3", label: "Standard (4:3)" },
    { value: "3:2", label: "Photo (3:2)" },
    { value: "21:9", label: "Cinematic (21:9)" },
    { value: "9:21", label: "Tall (9:21)" },
    { value: "custom", label: "Custom" },
    { value: "original", label: "Original" },
    { value: "5:4", label: "Classic (5:4)" },
    { value: "2:3", label: "Panoramic (2:3)" },
  ];

  const lightingOptions = [
    { value: "default", label: "Default" },
    { value: "cinematic", label: "Cinematic" },
    { value: "neon", label: "Neon" },
    { value: "soft-daylight", label: "Soft Daylight" },
    { value: "moody", label: "Moody" },
    { value: "golden-hour", label: "Golden Hour" },
    { value: "dramatic", label: "Dramatic" },
    { value: "studio", label: "Studio" },
  ];

  const cameraAngleOptions = [
    { value: "default", label: "Default" },
    { value: "top-view", label: "Top View" },
    { value: "isometric", label: "Isometric" },
    { value: "wide-shot", label: "Wide Shot" },
    { value: "close-up", label: "Close-up" },
    { value: "bird-eye", label: "Bird's Eye" },
    { value: "low-angle", label: "Low Angle" },
    { value: "high-angle", label: "High Angle" },
  ];

  const textureOptions = [
    { value: "default", label: "Default" },
    { value: "glossy", label: "Glossy" },
    { value: "matte", label: "Matte" },
    { value: "watercolor", label: "Watercolor" },
    { value: "pixel-art", label: "Pixel Art" },
    { value: "oil-painting", label: "Oil Painting" },
    { value: "sketch", label: "Sketch" },
    { value: "metallic", label: "Metallic" },
  ];

  const animationFramesOptions = [
    { value: "default", label: "Default" },
    { value: "static", label: "Static Image" },
    { value: "gif-frames", label: "GIF Frames" },
    { value: "sequence", label: "Image Sequence" },
    { value: "motion-blur", label: "Motion Blur" },
  ];

  const poseOptions = [
    { value: "default", label: "Default" },
    { value: "standing", label: "Standing" },
    { value: "sitting", label: "Sitting" },
    { value: "action-pose", label: "Action Pose" },
    { value: "walking", label: "Walking" },
    { value: "running", label: "Running" },
    { value: "dancing", label: "Dancing" },
    { value: "relaxed", label: "Relaxed" },
  ];

  const expressionOptions = [
    { value: "default", label: "Default" },
    { value: "happy", label: "Happy" },
    { value: "serious", label: "Serious" },
    { value: "shocked", label: "Shocked" },
    { value: "calm", label: "Calm" },
    { value: "excited", label: "Excited" },
    { value: "thoughtful", label: "Thoughtful" },
    { value: "confident", label: "Confident" },
  ];

  const clothingOptions = [
    { value: "default", label: "Default" },
    { value: "fantasy-armor", label: "Fantasy Armor" },
    { value: "business-suit", label: "Business Suit" },
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
    { value: "sportswear", label: "Sportswear" },
    { value: "vintage", label: "Vintage" },
    { value: "futuristic", label: "Futuristic" },
  ];

  const consistencyOptions = [
    { value: "default", label: "Default" },
    { value: "same-character", label: "Same Character" },
    { value: "character-series", label: "Character Series" },
    { value: "style-consistent", label: "Style Consistent" },
    { value: "brand-consistent", label: "Brand Consistent" },
  ];

  const sceneOptions = [
    { value: "default", label: "Default" },
    { value: "futuristic-city", label: "Futuristic City" },
    { value: "forest", label: "Forest" },
    { value: "underwater", label: "Underwater" },
    { value: "space", label: "Space" },
    { value: "desert", label: "Desert" },
    { value: "mountain", label: "Mountain" },
    { value: "beach", label: "Beach" },
  ];

  const depthOfFieldOptions = [
    { value: "default", label: "Default" },
    { value: "blur-background", label: "Blur Background" },
    { value: "sharp-focus", label: "Sharp Focus" },
    { value: "bokeh", label: "Bokeh Effect" },
    { value: "deep-focus", label: "Deep Focus" },
    { value: "shallow-focus", label: "Shallow Focus" },
  ];

  const weatherOptions = [
    { value: "default", label: "Default" },
    { value: "rain", label: "Rain" },
    { value: "snow", label: "Snow" },
    { value: "sunny", label: "Sunny" },
    { value: "storm", label: "Storm" },
    { value: "fog", label: "Fog" },
    { value: "cloudy", label: "Cloudy" },
    { value: "sunset", label: "Sunset" },
  ];

  const logoMakerOptions = [
    { value: "default", label: "Default" },
    { value: "modern-logo", label: "Modern Logo" },
    { value: "vintage-logo", label: "Vintage Logo" },
    { value: "minimalist-logo", label: "Minimalist Logo" },
    { value: "tech-logo", label: "Tech Logo" },
    { value: "creative-logo", label: "Creative Logo" },
    { value: "corporate-logo", label: "Corporate Logo" },
  ];

  return (
    <div className="space-y-4 bg-background min-h-full">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">AI Image Generator</h3>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full border border-border shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-destructive/10 rounded-full p-3 shrink-0">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  Generation Failed
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {error}
                </p>
              </div>
              <button
                onClick={() => setShowErrorModal(false)}
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowErrorModal(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full border border-border shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-green-500/10 rounded-full p-3 shrink-0">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">Success!</h3>
                <p className="text-sm text-muted-foreground">{success}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Adding image to library...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Templates Section */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Quick Templates
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              icon: "🏔️",
              label: "Mountain",
              prompt:
                "A majestic snow-capped mountain landscape at sunrise with mist in the valley",
            },
            {
              icon: "🌆",
              label: "City",
              prompt:
                "Modern futuristic city skyline at night with neon lights and flying cars",
            },
            {
              icon: "🌊",
              label: "Ocean",
              prompt:
                "Serene tropical beach with crystal clear turquoise water and palm trees",
            },
            {
              icon: "🌲",
              label: "Forest",
              prompt:
                "Dense ancient forest with sunlight filtering through tall trees and misty air",
            },
            {
              icon: "🎨",
              label: "Abstract",
              prompt:
                "Colorful abstract digital art with geometric shapes and vibrant gradients",
            },
            {
              icon: "🚀",
              label: "Sci-Fi",
              prompt:
                "Futuristic space station orbiting an alien planet with nebula in background",
            },
            {
              icon: "🦁",
              label: "Wildlife",
              prompt:
                "Majestic lion in African savanna during golden hour with dramatic lighting",
            },
            {
              icon: "🎭",
              label: "Portrait",
              prompt:
                "Beautiful cinematic portrait with perfect lighting and professional photography quality",
            },
          ].map((template) => (
            <button
              key={template.label}
              onClick={() => {
                setPrompt(template.prompt);
              }}
              disabled={isGenerating}
              className="p-2 text-left rounded-lg border border-border hover:border-primary/50 bg-card/50 hover:bg-card transition-all text-sm group disabled:opacity-50"
            >
              <div className="text-lg mb-1">{template.icon}</div>
              <div className="font-medium text-foreground group-hover:text-primary text-xs">
                {template.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Describe the image you want to create
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A serene mountain landscape at sunset with a lake reflecting the sky..."
            className="min-h-20 resize-none"
            disabled={isGenerating}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Style
            </label>
            <Select
              value={style}
              onValueChange={setStyle}
              disabled={isGenerating}
            >
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
            <label className="text-sm font-medium text-foreground mb-2 block">
              Aspect Ratio
            </label>
            <Select
              value={aspectRatio}
              onValueChange={setAspectRatio}
              disabled={isGenerating}
            >
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
            <label className="text-sm font-medium text-foreground mb-2 block">
              Lighting & Mood
            </label>
            <Select
              value={lighting}
              onValueChange={setLighting}
              disabled={isGenerating}
            >
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
            <label className="text-sm font-medium text-foreground mb-2 block">
              Camera Angle
            </label>
            <Select
              value={cameraAngle}
              onValueChange={setCameraAngle}
              disabled={isGenerating}
            >
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
            <label className="text-sm font-medium text-foreground mb-2 block">
              Texture Control
            </label>
            <Select
              value={texture}
              onValueChange={setTexture}
              disabled={isGenerating}
            >
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
            <label className="text-sm font-medium text-foreground mb-2 block">
              Animation Frames
            </label>
            <Select
              value={animationFrames}
              onValueChange={setAnimationFrames}
              disabled={isGenerating}
            >
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
            <label className="text-sm font-medium text-foreground mb-2 block">
              Pose Selector
            </label>
            <Select
              value={pose}
              onValueChange={setPose}
              disabled={isGenerating}
            >
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
            <label className="text-sm font-medium text-foreground mb-2 block">
              Expression Control
            </label>
            <Select
              value={expression}
              onValueChange={setExpression}
              disabled={isGenerating}
            >
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
            <label className="text-sm font-medium text-foreground mb-2 block">
              Clothing/Outfit Style
            </label>
            <Select
              value={clothing}
              onValueChange={setClothing}
              disabled={isGenerating}
            >
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
            <label className="text-sm font-medium text-foreground mb-2 block">
              Consistency Mode
            </label>
            <Select
              value={consistency}
              onValueChange={setConsistency}
              disabled={isGenerating}
            >
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
            <label className="text-sm font-medium text-foreground mb-2 block">
              Scene Generator
            </label>
            <Select
              value={scene}
              onValueChange={setScene}
              disabled={isGenerating}
            >
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
            <label className="text-sm font-medium text-foreground mb-2 block">
              Depth of Field
            </label>
            <Select
              value={depthOfField}
              onValueChange={setDepthOfField}
              disabled={isGenerating}
            >
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
            <label className="text-sm font-medium text-foreground mb-2 block">
              Weather Control
            </label>
            <Select
              value={weather}
              onValueChange={setWeather}
              disabled={isGenerating}
            >
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
            <label className="text-sm font-medium text-foreground mb-2 block">
              Logo Maker
            </label>
            <Select
              value={logoMaker}
              onValueChange={setLogoMaker}
              disabled={isGenerating}
            >
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

        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full"
        >
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
  );
}
