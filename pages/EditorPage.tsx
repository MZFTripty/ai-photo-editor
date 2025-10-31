"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Sparkles, ArrowLeft, Download, Save, Sun } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/image-upload";
import { ImageGenerator } from "@/components/image-generator";
import EditingToolsPanel from "@/components/editing-tools-panel";
import SelectionCanvas from "@/components/selection-canvas";
import TextOverlay from "@/components/text-overlay";
import CropCanvas from "@/components/crop-canvas";
import type { AnalyzeCommandResponse } from "@/lib/gemini-service";
import type { ProcessedImage } from "@/lib/image-processing-service";
import CommandInterface from "@/components/command-interface";
import ProcessingModal from "@/components/processing-modal";
import { parseCommand } from "@/lib/command-parser";
import {
  applyColorAdjustments,
  rotateImage,
  flipImage,
  addTextToImage,
} from "@/lib/local-image-processing";
import { cropImage, resizeImageDimensions, scaleImage } from "@/lib/crop-utils";

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  originalUrl?: string; // Store original URL for reset
  originalFile?: File; // Store original File for blob URL recreation
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

  // Edit mode: manual (sliders) or ai (text commands)
  const [editMode, setEditMode] = useState<"manual" | "ai">("manual");

  // Text layers management
  const [textLayers, setTextLayers] = useState<
    Array<{
      id: string;
      text: string;
      x: number;
      y: number;
      fontSize: number;
      color: string;
      fontFamily: string;
      bold: boolean;
    }>
  >([]);
  const [selectedTextLayerId, setSelectedTextLayerId] = useState<string | null>(
    null
  );
  const [showTextOverlay, setShowTextOverlay] = useState(true);

  // Crop and Resize states
  const [showCropCanvas, setShowCropCanvas] = useState(false);
  const [showResizeModal, setShowResizeModal] = useState(false);
  const [resizeWidth, setResizeWidth] = useState<number>(0);
  const [resizeHeight, setResizeHeight] = useState<number>(0);
  const [resizeScale, setResizeScale] = useState<number>(100);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  // Load images from IndexedDB on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadFromDB = async () => {
      try {
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open("LumenFrameDB", 1);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve(request.result);
          request.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains("images")) {
              db.createObjectStore("images", { keyPath: "id" });
            }
          };
        });

        const transaction = db.transaction(["images"], "readonly");
        const store = transaction.objectStore("images");
        const request = store.getAll();

        request.onsuccess = () => {
          const images = request.result;
          if (images.length > 0) {
            setUploadedImages(images);
            setSelectedImage(images[0]);
          }
        };
      } catch (e) {
        console.error("Failed to load images from IndexedDB:", e);
      }
    };

    loadFromDB();
  }, []);

  // Save images to IndexedDB whenever they change
  useEffect(() => {
    if (typeof window === "undefined" || uploadedImages.length === 0) return;

    const saveToDB = async () => {
      try {
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open("LumenFrameDB", 1);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve(request.result);
          request.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains("images")) {
              db.createObjectStore("images", { keyPath: "id" });
            }
          };
        });

        const transaction = db.transaction(["images"], "readwrite");
        const store = transaction.objectStore("images");

        // Clear existing and save new
        await new Promise<void>((resolve, reject) => {
          const clearReq = store.clear();
          clearReq.onsuccess = () => resolve();
          clearReq.onerror = () => reject(clearReq.error);
        });

        // Save each image
        for (const img of uploadedImages) {
          await new Promise<void>((resolve, reject) => {
            const saveReq = store.add({
              id: img.id,
              url: img.url,
              originalUrl: img.originalUrl,
              name: img.name,
              size: img.size,
              type: img.type,
              dimensions: img.dimensions,
              isGenerated: img.isGenerated,
              isProcessed: img.isProcessed,
            });
            saveReq.onsuccess = () => resolve();
            saveReq.onerror = () => reject(saveReq.error);
          });
        }
      } catch (e) {
        console.error("Failed to save images to IndexedDB:", e);
      }
    };

    saveToDB();
  }, [uploadedImages]);
  const handleImageUpload = (files: File[]) => {
    if (!files || !Array.isArray(files) || files.length === 0) {
      return;
    }

    const newImages: UploadedImage[] = files.map((file) => {
      const url = URL.createObjectURL(file);
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        url,
        originalUrl: url, // Store original URL for reset
        originalFile: file, // Store original File for blob URL recreation
        name: file.name,
        size: file.size,
        type: file.type,
      };
    });

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
    // First, try local command parsing
    const parsed = parseCommand(command);
    if (parsed && parsed.confidence > 0.5) {
      // Use local processing for high-confidence commands
      await handleApplyEdit(parsed.type, parsed.params);
      return;
    }

    // Fallback to API-based processing if local parsing confidence is low
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

    try {
      let processedUrl: string | null = null;

      // Handle local image processing
      switch (editType) {
        case "basic-adjustments":
          // Apply brightness, contrast, exposure, highlights, shadows
          processedUrl = await applyColorAdjustments(selectedImage.url, {
            brightness: params.brightness,
            contrast: params.contrast,
            exposure: params.exposure,
            highlights: params.highlights,
            shadows: params.shadows,
          });
          break;

        case "color-adjustments":
          // Apply color adjustments
          processedUrl = await applyColorAdjustments(selectedImage.url, {
            saturation: params.saturation,
            vibrance: params.vibrance,
            hue: params.hue,
            temperature: params.temperature,
            tint: params.tint,
          });
          break;

        case "rotate":
          processedUrl = await rotateImage(selectedImage.url, params.degrees);
          break;

        case "flip":
          processedUrl = await flipImage(
            selectedImage.url,
            params.direction as "horizontal" | "vertical"
          );
          break;

        case "add-text": {
          // Check if updating existing text or creating new one
          let textId = params.id;

          // If no ID is provided, create new one (new text)
          if (!textId) {
            textId = `text-${Date.now()}`;
          }

          const newTextLayer = {
            id: textId,
            text: params.text,
            x: params.x,
            y: params.y,
            fontSize: params.fontSize,
            color: params.color,
            fontFamily: params.fontFamily,
            bold: params.bold,
          };

          // Update or add text layer
          let updatedLayers = textLayers.filter((t) => t.id !== textId);
          updatedLayers.push(newTextLayer);
          setTextLayers(updatedLayers);
          setSelectedTextLayerId(textId);

          // Don't apply directly to image - layers are rendered as overlay
          return;
        }

        default:
          console.log("Edit type not yet implemented locally:", editType);
          return;
      }

      if (processedUrl) {
        // Update the selected image with the processed URL
        const updatedImage: UploadedImage = {
          ...selectedImage,
          url: processedUrl,
          isProcessed: true,
        };

        // Update in the images list
        setUploadedImages((prev) =>
          prev.map((img) => (img.id === selectedImage.id ? updatedImage : img))
        );

        // Update selected image
        setSelectedImage(updatedImage);

        console.log("Image processing completed successfully");
      }
    } catch (error) {
      console.error("Edit application failed:", error);
      alert(
        `Failed to apply edit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleResetBasicAdjustments = () => {
    console.log("Reset Basic - selectedImage:", selectedImage);
    if (!selectedImage) {
      console.warn("No selectedImage!");
      return;
    }

    // Create fresh blob URL from original file if available
    let resetUrl = selectedImage.originalUrl;
    if (selectedImage.originalFile) {
      resetUrl = URL.createObjectURL(selectedImage.originalFile);
      console.log("Created fresh blob URL from original file:", resetUrl);
    }

    if (!resetUrl) {
      console.warn("No original URL or file found!");
      return;
    }

    const resetImage = { ...selectedImage, url: resetUrl };
    console.log("Reset Basic - resetting to:", resetImage);
    setSelectedImage(resetImage);

    // Update in database
    setUploadedImages((prev) =>
      prev.map((img) => (img.id === selectedImage.id ? resetImage : img))
    );
  };

  const handleResetColorControls = () => {
    if (!selectedImage) return;

    // Create fresh blob URL from original file if available
    let resetUrl = selectedImage.originalUrl;
    if (selectedImage.originalFile) {
      resetUrl = URL.createObjectURL(selectedImage.originalFile);
    }

    if (!resetUrl) return;

    const resetImage = { ...selectedImage, url: resetUrl };
    setSelectedImage(resetImage);
    setUploadedImages((prev) =>
      prev.map((img) => (img.id === selectedImage.id ? resetImage : img))
    );
  };

  const handleReset3DTransform = () => {
    if (!selectedImage) return;

    // Create fresh blob URL from original file if available
    let resetUrl = selectedImage.originalUrl;
    if (selectedImage.originalFile) {
      resetUrl = URL.createObjectURL(selectedImage.originalFile);
    }

    if (!resetUrl) return;

    const resetImage = { ...selectedImage, url: resetUrl };
    setSelectedImage(resetImage);
    setUploadedImages((prev) =>
      prev.map((img) => (img.id === selectedImage.id ? resetImage : img))
    );
  };

  const handleCropComplete = async (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    if (!selectedImage) return;

    try {
      const croppedUrl = await cropImage(
        selectedImage.url,
        x,
        y,
        width,
        height
      );

      const updatedImage: UploadedImage = {
        ...selectedImage,
        url: croppedUrl,
        isProcessed: true,
      };

      setUploadedImages((prev) =>
        prev.map((img) => (img.id === selectedImage.id ? updatedImage : img))
      );
      setSelectedImage(updatedImage);
      setShowCropCanvas(false);
    } catch (error) {
      console.error("Crop failed:", error);
      alert("Failed to crop image");
    }
  };

  const handleResizeApply = async () => {
    if (!selectedImage) return;

    try {
      let resizedUrl: string;

      if (resizeScale !== 100) {
        // Use scale
        resizedUrl = await scaleImage(selectedImage.url, resizeScale);
      } else {
        // Use specific dimensions
        resizedUrl = await resizeImageDimensions(
          selectedImage.url,
          resizeWidth,
          resizeHeight
        );
      }

      const updatedImage: UploadedImage = {
        ...selectedImage,
        url: resizedUrl,
        isProcessed: true,
      };

      setUploadedImages((prev) =>
        prev.map((img) => (img.id === selectedImage.id ? updatedImage : img))
      );
      setSelectedImage(updatedImage);
      setShowResizeModal(false);
    } catch (error) {
      console.error("Resize failed:", error);
      alert("Failed to resize image");
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
    <>
      {/* Crop Canvas Modal */}
      {showCropCanvas && selectedImage && (
        <CropCanvas
          imageUrl={selectedImage.url}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropCanvas(false)}
        />
      )}

      {/* Resize Modal */}
      {showResizeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Resize Image</h3>

            <div className="space-y-4">
              <div>
                <Label>Scale (%)</Label>
                <Slider
                  value={[resizeScale]}
                  onValueChange={(value: number[]) => {
                    setResizeScale(value[0]);
                  }}
                  min={10}
                  max={200}
                  step={5}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {resizeScale}% of original size
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Width (px)</Label>
                  <Input
                    type="number"
                    value={resizeWidth}
                    onChange={(e) =>
                      setResizeWidth(parseInt(e.target.value) || 0)
                    }
                    min={50}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Height (px)</Label>
                  <Input
                    type="number"
                    value={resizeHeight}
                    onChange={(e) =>
                      setResizeHeight(parseInt(e.target.value) || 0)
                    }
                    min={50}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="aspect-ratio"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="aspect-ratio" className="text-sm">
                  Maintain aspect ratio
                </Label>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => setShowResizeModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleResizeApply}>Apply Resize</Button>
            </div>
          </div>
        </div>
      )}
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
                {/* Edit Mode Toggle */}
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                  <Button
                    size="sm"
                    variant={editMode === "manual" ? "default" : "ghost"}
                    onClick={() => setEditMode("manual")}
                    className="gap-2"
                  >
                    <Sun className="w-4 h-4" />
                    Manual
                  </Button>
                  <Button
                    size="sm"
                    variant={editMode === "ai" ? "default" : "ghost"}
                    onClick={() => setEditMode("ai")}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI
                  </Button>
                </div>

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
                          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-2">
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
                            onClick={() =>
                              handleProcessedImageSelect(processed)
                            }
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
                            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-2">
                              <p className="text-xs text-white truncate">
                                {processed.originalImageName}
                              </p>
                              <Badge
                                variant="secondary"
                                className="text-xs mt-1"
                              >
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
                    {showTextOverlay && textLayers.length > 0 ? (
                      <TextOverlay
                        imageUrl={selectedImage.url}
                        textLayers={textLayers}
                        selectedTextLayerId={selectedTextLayerId}
                        onTextLayerUpdate={(layer) => {
                          setTextLayers((prev) =>
                            prev.map((t) => (t.id === layer.id ? layer : t))
                          );
                        }}
                        onTextLayerDelete={(id) => {
                          setTextLayers((prev) =>
                            prev.filter((t) => t.id !== id)
                          );
                          if (selectedTextLayerId === id)
                            setSelectedTextLayerId(null);
                        }}
                        onTextLayerSelect={setSelectedTextLayerId}
                        imageWidth={selectedImage.dimensions?.width || 800}
                        imageHeight={selectedImage.dimensions?.height || 600}
                      />
                    ) : (
                      <SelectionCanvas
                        imageUrl={selectedImage.url}
                        selectionMode={selectionMode}
                        isSelecting={isSelecting}
                        onSelectionComplete={handleSelectionComplete}
                        onSelectionCancel={handleSelectionCancel}
                      />
                    )}
                  </div>
                </div>

                <div className="h-80 border-t border-border bg-card/50">
                  {editMode === "manual" ? (
                    <EditingToolsPanel
                      selectedImage={selectedImage}
                      onApplyEdit={handleApplyEdit}
                      onStartSelection={handleStartSelection}
                      onApplyToSelection={handleApplyToSelection}
                      currentSelection={currentSelection}
                      onManualTransform={handleManualTransform}
                      selectedTextLayer={
                        selectedTextLayerId
                          ? textLayers.find((t) => t.id === selectedTextLayerId)
                          : null
                      }
                      onResetBasic={handleResetBasicAdjustments}
                      onResetColor={handleResetColorControls}
                      onResetTransform={handleReset3DTransform}
                      onCropClick={() => setShowCropCanvas(true)}
                      onResizeClick={() => {
                        if (selectedImage) {
                          setResizeWidth(
                            Math.round(selectedImage.dimensions?.width || 800)
                          );
                          setResizeHeight(
                            Math.round(selectedImage.dimensions?.height || 600)
                          );
                        }
                        setShowResizeModal(true);
                      }}
                    />
                  ) : (
                    <CommandInterface
                      selectedImage={selectedImage}
                      onCommandSubmit={handleCommandSubmit}
                    />
                  )}
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
    </>
  );
}
