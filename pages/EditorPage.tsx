"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Download, Save } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/image-upload";
import { ImageGenerator } from "@/components/image-generator";
import EditingToolsPanel from "@/components/editing-tools-panel";
import SelectionCanvas from "@/components/selection-canvas";
import type { AnalyzeCommandResponse } from "@/lib/gemini-service";
import type { ProcessedImage } from "@/lib/image-processing-service";
import CommandInterface from "@/components/command-interface";
import ProcessingModal from "@/components/processing-modal";

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  type: string;
  dimensions?: { width: number; height: number };
  isGenerated?: boolean;
  generationMetadata?: any;
  isProcessed?: boolean;
  originalProcessedImage?: ProcessedImage;
}

export default function EditorPage() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(
    null
  );
  const [currentAnalysis, setCurrentAnalysis] =
    useState<AnalyzeCommandResponse | null>(null);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [processingRequest, setProcessingRequest] = useState<any>(null);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isGenerationMode, setIsGenerationMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionMode, setSelectionMode] = useState<
    "pen" | "rectangle" | "circle"
  >("pen");
  const [currentSelection, setCurrentSelection] = useState<any>(null);

  const handleImageUpload = (files: File[]) => {
    if (!files || !Array.isArray(files) || files.length === 0) {
      return;
    }

    const newImages: UploadedImage[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);

    if (!selectedImage && newImages.length > 0) {
      setSelectedImage(newImages[0]);
    }
  };

  const handleImageSelect = (image: UploadedImage) => {
    setSelectedImage(image);
  };

  const handleImageRemove = (imageId: string) => {
    setUploadedImages((prev) => {
      const filtered = prev.filter((img) => img.id !== imageId);
      if (selectedImage?.id === imageId) {
        setSelectedImage(filtered.length > 0 ? filtered[0] : null);
      }
      return filtered;
    });
  };

  const handleCommandSubmit = async (
    command: string,
    analysis: AnalyzeCommandResponse
  ) => {
    setCurrentAnalysis(analysis);

    if (
      analysis.success &&
      analysis.editInstructions &&
      analysis.editInstructions.length > 0 &&
      selectedImage
    ) {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedImage.file);
      });

      const request = {
        imageData,
        editInstructions: analysis.editInstructions,
        imageMetadata: {
          name: selectedImage.name,
          type: selectedImage.type,
          size: selectedImage.size,
          dimensions: selectedImage.dimensions,
        },
      };

      setProcessingRequest(request);
      setIsProcessingModalOpen(true);
    }
  };

  const handleProcessingComplete = (result: ProcessedImage) => {
    setProcessedImages((prev) => [result, ...prev]);
    setIsProcessingModalOpen(false);
  };

  const handleProcessingModalClose = () => {
    setIsProcessingModalOpen(false);
    setProcessingRequest(null);
  };

  const handleImageGenerated = async (imageData: string, metadata: any) => {
    setIsGenerating(true);

    try {
      if (!imageData || typeof imageData !== "string") {
        throw new Error("Invalid image data provided");
      }

      if (!metadata) {
        metadata = {};
      }

      let blob: Blob;

      if (imageData.startsWith("data:")) {
        const response = await fetch(imageData);
        blob = await response.blob();
      } else if (imageData.startsWith("blob:")) {
        const response = await fetch(imageData);
        blob = await response.blob();
      } else {
        try {
          const response = await fetch(imageData);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
          }
          blob = await response.blob();
        } catch (fetchError) {
          console.error("Failed to fetch image data:", fetchError);
          throw new Error("Unable to process image data");
        }
      }

      const file = new File([blob], `generated-${Date.now()}.png`, {
        type: "image/png",
      });

      const promptText =
        metadata.prompt && typeof metadata.prompt === "string"
          ? metadata.prompt
          : "Generated Image";
      const safeName =
        promptText.length > 30
          ? `Generated: ${promptText.substring(0, 30)}...`
          : `Generated: ${promptText}`;

      const generatedImage: UploadedImage = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        url: URL.createObjectURL(blob),
        name: safeName,
        size: blob.size,
        type: "image/png",
        isGenerated: true,
        generationMetadata: metadata,
      };

      setUploadedImages((prev) => [generatedImage, ...prev]);
      setSelectedImage(generatedImage);
      setIsGenerationMode(false);
    } catch (error) {
      console.error("Error processing generated image:", error);
      alert(
        `Failed to process generated image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProcessedImageSelect = async (processed: ProcessedImage) => {
    try {
      const response = await fetch(processed.processedImageUrl);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `processed-${processed.originalImageName}`,
        { type: "image/png" }
      );

      const processedAsUploadedImage: UploadedImage = {
        id: `processed-${processed.id}`,
        file,
        url: processed.processedImageUrl,
        name: `Processed: ${processed.originalImageName}`,
        size: blob.size,
        type: "image/png",
        isProcessed: true,
        originalProcessedImage: processed,
      };

      setSelectedImage(processedAsUploadedImage);
    } catch (error) {
      console.error("Error selecting processed image:", error);
    }
  };

  const handleManualTransform = async (transformedImageUrl: string) => {
    if (!selectedImage) return;

    try {
      // Convert the transformed image URL to a blob and file
      const response = await fetch(transformedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], `transformed-${selectedImage.name}`, {
        type: "image/png",
      });

      // Create a new uploaded image with the transformed data
      const transformedImage: UploadedImage = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        url: transformedImageUrl,
        name: `Transformed: ${selectedImage.name}`,
        size: blob.size,
        type: "image/png",
        isProcessed: true,
      };

      // Add to uploaded images and set as selected
      setUploadedImages((prev) => [transformedImage, ...prev]);
      setSelectedImage(transformedImage);

      console.log("[v0] Manual transformation completed successfully");
    } catch (error) {
      console.error("Failed to process transformed image:", error);
      alert("Failed to apply transformation. Please try again.");
    }
  };

  const handleApplyEdit = async (editType: string, params: any) => {
    if (!selectedImage) return;

    let command = "";

    switch (editType) {
      case "crop":
        command = `Crop the image to ${params.width}% width and ${params.height}% height`;
        break;
      case "resize":
        command = `Resize the image to ${params.width}% of original size`;
        break;
      case "rotate":
        command = `Rotate the image ${params.degrees} degrees`;
        break;
      case "flip":
        command = `Flip the image ${params.direction}ly`;
        break;
      case "basic-adjustments":
        const adjustments = [];
        if (params.brightness !== 0)
          adjustments.push(
            `brightness ${
              params.brightness > 0 ? "increased" : "decreased"
            } by ${Math.abs(params.brightness)}`
          );
        if (params.contrast !== 0)
          adjustments.push(
            `contrast ${
              params.contrast > 0 ? "increased" : "decreased"
            } by ${Math.abs(params.contrast)}`
          );
        if (params.exposure !== 0)
          adjustments.push(
            `exposure ${
              params.exposure > 0 ? "increased" : "decreased"
            } by ${Math.abs(params.exposure)}`
          );
        if (params.highlights !== 0)
          adjustments.push(
            `highlights ${
              params.highlights > 0 ? "increased" : "decreased"
            } by ${Math.abs(params.highlights)}`
          );
        if (params.shadows !== 0)
          adjustments.push(
            `shadows ${
              params.shadows > 0 ? "increased" : "decreased"
            } by ${Math.abs(params.shadows)}`
          );
        command = `Adjust the image with ${adjustments.join(", ")}`;
        break;
      case "color-adjustments":
        const colorAdjustments = [];
        if (params.saturation !== 0)
          colorAdjustments.push(
            `saturation ${
              params.saturation > 0 ? "increased" : "decreased"
            } by ${Math.abs(params.saturation)}`
          );
        if (params.vibrance !== 0)
          colorAdjustments.push(
            `vibrance ${
              params.vibrance > 0 ? "increased" : "decreased"
            } by ${Math.abs(params.vibrance)}`
          );
        if (params.hue !== 0)
          colorAdjustments.push(`hue shifted by ${params.hue} degrees`);
        if (params.temperature !== 0)
          colorAdjustments.push(
            `temperature ${
              params.temperature > 0 ? "warmer" : "cooler"
            } by ${Math.abs(params.temperature)}`
          );
        if (params.tint !== 0)
          colorAdjustments.push(
            `tint ${
              params.tint > 0 ? "more magenta" : "more green"
            } by ${Math.abs(params.tint)}`
          );
        command = `Adjust the colors with ${colorAdjustments.join(", ")}`;
        break;
      case "add-text":
        command = `Add the text "${params.text}" with font size ${params.fontSize}px to the image`;
        break;
      case "3d-transform":
        const transforms = [];
        if (params.warp !== 0) transforms.push(`warp intensity ${params.warp}`);
        if (params.skewX !== 0)
          transforms.push(`skew horizontally by ${params.skewX} degrees`);
        if (params.skewY !== 0)
          transforms.push(`skew vertically by ${params.skewY} degrees`);
        if (params.perspectiveX !== 0)
          transforms.push(
            `perspective X transformation ${params.perspectiveX}`
          );
        if (params.perspectiveY !== 0)
          transforms.push(
            `perspective Y transformation ${params.perspectiveY}`
          );
        command =
          transforms.length > 0
            ? `Apply 3D transformation with ${transforms.join(", ")}`
            : "Apply 3D transformation to the image";
        break;
      case "add-shape":
        command = `Add a ${params.type} shape to the image`;
        break;
      case "add-frame":
        command = `Add a ${params.type} frame around the image`;
        break;
      case "add-emoji":
        command = `Add the ${params.emoji} emoji to the image`;
        break;
      case "start-selection":
        setSelectionMode(params.mode);
        setIsSelecting(true);
        return;
      case "apply-to-selection":
        if (!currentSelection) {
          alert("Please make a selection first");
          return;
        }
        command = `Apply the following edit to the selected area (${currentSelection.type} selection at coordinates ${currentSelection.bounds.x},${currentSelection.bounds.y} with size ${currentSelection.bounds.width}x${currentSelection.bounds.height}): ${params.command}`;
        break;
      default:
        return;
    }

    try {
      const response = await fetch("/api/analyze-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, hasImage: true }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const analysis = await response.json();
      if (analysis.success) {
        await handleCommandSubmit(command, analysis);
      }
    } catch (error) {
      console.error("Edit application failed:", error);
    }
  };

  const handleStartSelection = (mode: "pen" | "rectangle" | "circle") => {
    setSelectionMode(mode);
    setIsSelecting(true);
    setCurrentSelection(null);
  };

  const handleSelectionComplete = (selectionData: any) => {
    setCurrentSelection(selectionData);
    setIsSelecting(false);
  };

  const handleSelectionCancel = () => {
    setIsSelecting(false);
    setCurrentSelection(null);
  };

  const handleApplyToSelection = async (
    command: string,
    selectionData: any
  ) => {
    if (!selectedImage || !selectionData) {
      alert("Please make a selection first");
      return;
    }

    const fullCommand = `Apply the following edit to the selected area (${selectionData.type} selection at coordinates ${selectionData.bounds.x},${selectionData.bounds.y} with size ${selectionData.bounds.width}x${selectionData.bounds.height}): ${command}`;

    try {
      const response = await fetch("/api/analyze-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: fullCommand, hasImage: true }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const analysis = await response.json();
      if (analysis.success) {
        await handleCommandSubmit(fullCommand, analysis);
        setCurrentSelection(null); // Clear selection after applying
      }
    } catch (error) {
      console.error("Selection edit failed:", error);
    }
  };

  const handleSaveProject = () => {
    try {
      const projectData = {
        id: Date.now().toString(),
        name: `LumenFrame Project ${new Date().toLocaleDateString()}`,
        createdAt: new Date().toISOString(),
        uploadedImages: uploadedImages?.map((img) => ({
          id: img.id,
          name: img.name,
          size: img.size,
          type: img.type,
          isGenerated: img.isGenerated,
          generationMetadata: img.generationMetadata,
          isProcessed: img.isProcessed,
        })),
        processedImages: processedImages?.map((img) => ({
          id: img.id,
          originalImageName: img.originalImageName,
          editType: img.editType,
        })),
        selectedImageId: selectedImage?.id || null,
        currentAnalysis,
      };

      // Save to localStorage for anonymous users
      const savedProjects = JSON.parse(
        localStorage.getItem("lumenframe_projects") || "[]"
      );
      savedProjects.unshift(projectData);

      // Keep only last 10 projects to avoid storage issues
      if (savedProjects.length > 10) {
        savedProjects.splice(10);
      }

      localStorage.setItem(
        "lumenframe_projects",
        JSON.stringify(savedProjects)
      );

      // Show success feedback
      alert("Project saved successfully! Your work has been saved locally.");
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save project. Please try again.");
    }
  };

  const handleExport = async () => {
    if (!selectedImage) {
      alert("Please select an image to export.");
      return;
    }

    try {
      // Create a download link
      const link = document.createElement("a");
      link.href = selectedImage.url;
      link.download = selectedImage.name || "lumenframe-export.png";

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("[v0] Image exported successfully:", selectedImage.name);
    } catch (error) {
      console.error("Failed to export image:", error);
      alert("Failed to export image. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  LumenFrame
                </h1>
                <Badge variant="secondary" className="ml-2">
                  Editor
                </Badge>
                {currentAnalysis && (
                  <Badge variant="outline" className="ml-2">
                    Analysis Ready
                  </Badge>
                )}
                {processedImages.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {processedImages.length} Processed
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/demo">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSaveProject}>
                <Save className="w-4 h-4 mr-2" />
                Save Project
              </Button>
              <Button
                size="sm"
                onClick={handleExport}
                disabled={!selectedImage}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        <div className="w-80 border-r border-border bg-card/30 flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground mb-2">
              Image Library
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload and manage your images
            </p>

            <div className="flex gap-2 mt-3">
              <Button
                variant={!isGenerationMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsGenerationMode(false)}
                className="flex-1"
              >
                Upload
              </Button>
              <Button
                variant={isGenerationMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsGenerationMode(true)}
                className="flex-1"
              >
                Generate
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {isGenerationMode ? (
              <ImageGenerator
                onImageGenerated={handleImageGenerated}
                isGenerating={isGenerating}
              />
            ) : uploadedImages.length === 0 ? (
              <ImageUpload onImageUpload={handleImageUpload} />
            ) : (
              <div className="space-y-4">
                <ImageUpload onImageUpload={handleImageUpload} compact />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground">
                    Uploaded Images ({uploadedImages.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {uploadedImages?.map((image) => (
                      <div
                        key={image.id}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage?.id === image.id
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-accent"
                        }`}
                        onClick={() => handleImageSelect(image)}
                      >
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {image.isGenerated && (
                          <div className="absolute top-1 left-1">
                            <Badge variant="secondary" className="text-xs">
                              AI
                            </Badge>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageRemove(image.id);
                          }}
                          className="absolute top-1 right-1 w-6 h-6 bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          type="button"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-xs text-white truncate">
                            {image.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {processedImages.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground">
                      Processed Images ({processedImages.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {processedImages?.map((processed) => (
                        <div
                          key={processed.id}
                          className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage?.id === `processed-${processed.id}`
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-accent hover:border-primary/50"
                          }`}
                          onClick={() => handleProcessedImageSelect(processed)}
                        >
                          <div className="aspect-square bg-muted flex items-center justify-center">
                            <img
                              src={
                                processed.processedImageUrl ||
                                "/placeholder.svg"
                              }
                              alt={`Processed: ${processed.originalImageName}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="text-xs text-white truncate">
                              {processed.originalImageName}
                            </p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {processed.editType}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedImage ? (
            <>
              <div className="flex-1 bg-muted/30 flex items-center justify-center p-8">
                <div className="max-w-4xl max-h-full flex items-center justify-center">
                  <SelectionCanvas
                    imageUrl={selectedImage.url}
                    selectionMode={selectionMode}
                    isSelecting={isSelecting}
                    onSelectionComplete={handleSelectionComplete}
                    onSelectionCancel={handleSelectionCancel}
                  />
                </div>
              </div>

              <div className="h-80 border-t border-border bg-card/50">
                <CommandInterface
                  selectedImage={selectedImage}
                  onCommandSubmit={handleCommandSubmit}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {isGenerationMode
                    ? "Generate New Images"
                    : "Select an Image to Edit"}
                </h3>
                <p className="text-muted-foreground">
                  {isGenerationMode
                    ? "Use the AI generator in the sidebar to create new images from text descriptions"
                    : "Upload an image from the sidebar to start editing with natural language commands"}
                </p>
              </div>
            </div>
          )}
        </div>

        <EditingToolsPanel
          selectedImage={selectedImage}
          onApplyEdit={handleApplyEdit}
          onStartSelection={handleStartSelection}
          onApplyToSelection={handleApplyToSelection}
          currentSelection={currentSelection}
          onManualTransform={handleManualTransform}
        />
      </div>

      {isProcessingModalOpen && processingRequest && (
        <ProcessingModal
          isOpen={isProcessingModalOpen}
          onClose={handleProcessingModalClose}
          processingRequest={processingRequest}
          onComplete={handleProcessingComplete}
        />
      )}
    </div>
  );
}
