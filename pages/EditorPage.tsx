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
import { LoadingOverlay } from "@/components/loading-overlay";
import { StickerLayer, type Sticker } from "@/components/sticker-layer";

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
  transforms?: {
    css3d?: {
      transform?: string;
      warp?: number;
      skewX?: number;
      skewY?: number;
      skewZ?: number;
      perspectiveX?: number;
      perspectiveY?: number;
      perspectiveZ?: number;
    };
    rotate?: number;
    flip?: {
      horizontal?: boolean;
      vertical?: boolean;
    };
  };
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
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(
    null
  );

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

    const processFiles = async () => {
      const newImages: UploadedImage[] = [];

      for (const file of files) {
        const url = URL.createObjectURL(file);

        // Get image dimensions
        const dimensions = await new Promise<{
          width: number;
          height: number;
        }>((resolve) => {
          const img = new Image();
          img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
          };
          img.onerror = () => {
            // Fallback to default dimensions
            resolve({ width: 800, height: 600 });
          };
          img.src = url;
        });

        newImages.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          url,
          originalUrl: url, // Store original URL for reset
          originalFile: file, // Store original File for blob URL recreation
          name: file.name,
          size: file.size,
          type: file.type,
          dimensions, // Store actual image dimensions
          // Initialize transforms with default values
          transforms: {
            css3d: {
              transform: "none",
              warp: 0,
              skewX: 0,
              skewY: 0,
              skewZ: 0,
              perspectiveX: 0,
              perspectiveY: 0,
              perspectiveZ: 0,
            },
            rotate: 0,
            flip: {
              horizontal: false,
              vertical: false,
            },
          },
        });
      }

      setUploadedImages((prev) => [...prev, ...newImages]);

      if (!selectedImage && newImages.length > 0) {
        setSelectedImage(newImages[0]);
      }
    };

    processFiles();
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
      setLoadingMessage("🤖 Processing AI command...");
      await handleApplyEdit(parsed.type, parsed.params);
      return;
    }

    // Fallback to API-based processing if local parsing confidence is low
    setCurrentAnalysis(analysis);
    setLoadingMessage("🤖 Analyzing command...");

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
      setLoadingMessage("🔄 Processing image...");
    }
  };

  const handleProcessingComplete = (result: ProcessedImage) => {
    setProcessedImages((prev) => [result, ...prev]);
    setIsProcessingModalOpen(false);
    setLoadingMessage("");
  };

  const handleProcessingModalClose = () => {
    setIsProcessingModalOpen(false);
    setProcessingRequest(null);
    setLoadingMessage("");
  };

  const handleImageGenerated = async (imageData: string, metadata: any) => {
    setIsGenerating(true);
    setLoadingMessage("🎨 Image generating...");

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
      setLoadingMessage("");
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
    console.log("🎬 handleApplyEdit called with:", { editType, params });

    if (!selectedImage) {
      console.error("❌ No selectedImage!");
      return;
    }

    console.log(
      "✅ selectedImage exists, proceeding with edit:",
      selectedImage.id
    );

    setLoadingMessage("⚡ Applying edit...");

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

        case "3d-transform": {
          // Apply 3D CSS transforms using Canvas
          console.log("🎬 Applying 3D Transform - RAW PARAMS:", {
            warp: params.warp,
            skewX: params.skewX,
            skewY: params.skewY,
            skewZ: params.skewZ,
            perspectiveX: params.perspectiveX,
            perspectiveY: params.perspectiveY,
            perspectiveZ: params.perspectiveZ,
          });
          console.log("🔍 Params types:", {
            warpType: typeof params.warp,
            skewZType: typeof params.skewZ,
            perspectiveZType: typeof params.perspectiveZ,
          });

          // Build CSS transform string
          const transforms: string[] = [];

          // Start with perspective context
          const perspectiveValue = 1200;
          transforms.push(`perspective(${perspectiveValue}px)`);

          // 1. Add Perspective X/Y (rotations around X and Y axes)
          if (params.perspectiveX !== 0 || params.perspectiveY !== 0) {
            const rotX = params.perspectiveX * 0.5;
            const rotY = params.perspectiveY * 0.5;
            transforms.push(`rotateX(${rotX}deg)`);
            transforms.push(`rotateY(${rotY}deg)`);
            console.log("✅ Added Perspective X/Y:", { rotX, rotY });
          }

          // 2. Add Perspective Z (Z-axis rotation)
          if (params.perspectiveZ !== 0) {
            transforms.push(`rotateZ(${params.perspectiveZ}deg)`);
            console.log("✅ Added Perspective Z:", params.perspectiveZ);
          }

          // 3. Add standard skew (X, Y)
          if (params.skewX !== 0 || params.skewY !== 0) {
            transforms.push(`skew(${params.skewX}deg, ${params.skewY}deg)`);
            console.log("✅ Added Skew X/Y:", {
              skewX: params.skewX,
              skewY: params.skewY,
            });
          }

          // 4. Add Skew Z (3D skew - using rotate transformation on different axis)
          // Since skewZ() is not standard, we use a combination approach
          if (params.skewZ !== 0) {
            // Create 3D skew effect using transform matrices
            // This creates a Z-axis skew by combining rotations and perspective
            const skewAngle = params.skewZ;
            // Apply skew by using matrix3d or combining transforms
            transforms.push(`rotateX(${skewAngle * 0.3}deg)`);
            transforms.push(`rotateY(${skewAngle * 0.3}deg)`);
            console.log("✅ Added Skew Z (via matrix):", skewAngle);
          }

          // 5. Add warp (scale)
          if (params.warp !== 0) {
            const scaleAmount = 1 + params.warp * 0.01;
            transforms.push(`scale(${scaleAmount})`);
            console.log("✅ Added Warp/Scale:", scaleAmount);
          }

          // Combine all transforms
          const transformString = transforms.join(" ");

          console.log(
            "🎨 Final CSS Transform string:",
            transformString || "none"
          );
          console.log("🎨 Transform array:", transforms);

          // Create temporary canvas to apply transform
          // Note: This is a visual CSS transform, stored as metadata
          const updatedImage: UploadedImage = {
            ...selectedImage,
            // Store transform metadata for rendering
            transforms: {
              ...((selectedImage as any).transforms || {}),
              css3d: {
                transform: transformString || "none",
                warp: params.warp,
                skewX: params.skewX,
                skewY: params.skewY,
                skewZ: params.skewZ,
                perspectiveX: params.perspectiveX,
                perspectiveY: params.perspectiveY,
                perspectiveZ: params.perspectiveZ,
              },
            },
          };

          // Update in the images list
          // Update in the images list
          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === selectedImage.id ? updatedImage : img
            )
          );

          // Update selected image
          setSelectedImage(updatedImage);

          console.log("✅ 3D Transform applied successfully to image:", {
            imageId: selectedImage.id,
            transforms: updatedImage.transforms?.css3d,
            transformMetadataExists: !!updatedImage.transforms?.css3d,
            updatedImageData: updatedImage,
          });
          console.log("🎨 Transform string being applied:", transformString);
          console.log("📊 Updated image object saved to state");
          setLoadingMessage("");
          return;
        }

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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("❌ Edit application failed:", {
        editType,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : "No stack trace",
        selectedImageExists: !!selectedImage,
        selectedImageId: selectedImage?.id,
      });

      // Log the full error object for debugging
      console.error("Full error object:", error);

      alert(`Failed to apply edit (${editType}): ${errorMessage}`);
    } finally {
      setLoadingMessage("");
    }
  };

  const handleResetBasicAdjustments = () => {
    console.log(
      "🎬 PARENT: handleResetBasicAdjustments called - selectedImage:",
      selectedImage?.id
    );
    if (!selectedImage) {
      console.warn("❌ PARENT: No selectedImage!");
      return;
    }

    // Step 1: Create fresh blob URL from original file
    let resetUrl = selectedImage.originalUrl;
    if (selectedImage.originalFile) {
      // Revoke old URL to free memory
      if (
        selectedImage.url &&
        selectedImage.url !== selectedImage.originalUrl
      ) {
        console.log(
          "🗑️ PARENT: Revoking old URL:",
          selectedImage.url.substring(0, 50)
        );
        URL.revokeObjectURL(selectedImage.url);
      }
      // Create fresh blob URL
      resetUrl = URL.createObjectURL(selectedImage.originalFile);
      console.log(
        "📌 PARENT: Created fresh blob URL from originalFile:",
        resetUrl.substring(0, 50)
      );
    } else {
      console.log(
        "⚠️ PARENT: No originalFile, using originalUrl:",
        selectedImage.originalUrl?.substring(0, 50)
      );
    }

    if (!resetUrl) {
      console.warn("❌ PARENT: No original URL or file found!");
      return;
    }

    // Step 2: Reset all adjustments and transforms
    const resetImage: UploadedImage = {
      ...selectedImage,
      url: resetUrl,
      originalUrl: resetUrl,
      transforms: {
        css3d: {
          transform: "none",
          warp: 0,
          skewX: 0,
          skewY: 0,
          skewZ: 0,
          perspectiveX: 0,
          perspectiveY: 0,
          perspectiveZ: 0,
        },
        rotate: 0,
        flip: {
          horizontal: false,
          vertical: false,
        },
      },
    };

    console.log("✅ PARENT: Reset image object created:", resetImage.id);
    console.log("📌 PARENT: New URL will be:", resetUrl.substring(0, 50));

    // Step 3: Update state - This SHOULD trigger SelectionCanvas re-render
    setSelectedImage(resetImage);
    console.log("✅ PARENT: setSelectedImage called - state should update");

    // Step 4: Update in uploaded images array
    setUploadedImages((prev) => {
      const updated = prev.map((img) =>
        img.id === selectedImage.id ? resetImage : img
      );
      console.log("✅ PARENT: setUploadedImages called - array updated");
      return updated;
    });

    console.log("✅ PARENT: Basic adjustments reset COMPLETE!");
  };

  const handleResetColorControls = () => {
    console.log(
      "🎬 PARENT: handleResetColorControls called - selectedImage:",
      selectedImage?.id
    );
    if (!selectedImage) {
      console.warn("❌ PARENT: No selectedImage!");
      return;
    }

    // Step 1: Create fresh blob URL from original file
    let resetUrl = selectedImage.originalUrl;
    if (selectedImage.originalFile) {
      // Revoke old URL to free memory
      if (
        selectedImage.url &&
        selectedImage.url !== selectedImage.originalUrl
      ) {
        console.log(
          "🗑️ PARENT: Revoking old URL:",
          selectedImage.url.substring(0, 50)
        );
        URL.revokeObjectURL(selectedImage.url);
      }
      // Create fresh blob URL
      resetUrl = URL.createObjectURL(selectedImage.originalFile);
      console.log(
        "📌 PARENT: Created fresh blob URL from originalFile:",
        resetUrl.substring(0, 50)
      );
    } else {
      console.log(
        "⚠️ PARENT: No originalFile, using originalUrl:",
        selectedImage.originalUrl?.substring(0, 50)
      );
    }

    if (!resetUrl) {
      console.warn("❌ PARENT: No original URL or file found!");
      return;
    }

    // Step 2: Reset all color adjustments and transforms
    const resetImage: UploadedImage = {
      ...selectedImage,
      url: resetUrl,
      originalUrl: resetUrl,
      transforms: {
        css3d: {
          transform: "none",
          warp: 0,
          skewX: 0,
          skewY: 0,
          skewZ: 0,
          perspectiveX: 0,
          perspectiveY: 0,
          perspectiveZ: 0,
        },
        rotate: 0,
        flip: {
          horizontal: false,
          vertical: false,
        },
      },
    };

    console.log("✅ PARENT: Reset image object created:", resetImage.id);
    console.log("📌 PARENT: New URL will be:", resetUrl.substring(0, 50));

    // Step 3: Update state
    setSelectedImage(resetImage);
    console.log("✅ PARENT: setSelectedImage called - state should update");

    // Step 4: Update in uploaded images array
    setUploadedImages((prev) => {
      const updated = prev.map((img) =>
        img.id === selectedImage.id ? resetImage : img
      );
      console.log("✅ PARENT: setUploadedImages called - array updated");
      return updated;
    });

    console.log("✅ PARENT: Color controls reset COMPLETE!");
  };

  const handleReset3DTransform = () => {
    console.log(
      "🔄 Resetting 3D Transform - selectedImage:",
      selectedImage?.id
    );
    if (!selectedImage) {
      console.warn("❌ No selectedImage!");
      return;
    }

    // Step 1: Create fresh blob URL from original file
    let resetUrl = selectedImage.originalUrl;
    if (selectedImage.originalFile) {
      // Revoke old URL to free memory
      if (
        selectedImage.url &&
        selectedImage.url !== selectedImage.originalUrl
      ) {
        URL.revokeObjectURL(selectedImage.url);
      }
      // Create fresh blob URL
      resetUrl = URL.createObjectURL(selectedImage.originalFile);
      console.log("✅ Created fresh blob URL from original file");
    }

    if (!resetUrl) {
      console.warn("❌ No original URL or file found!");
      return;
    }

    // Step 2: Clear transforms metadata completely
    const resetImage: UploadedImage = {
      ...selectedImage,
      url: resetUrl,
      originalUrl: resetUrl,
      transforms: {
        css3d: {
          transform: "none",
          warp: 0,
          skewX: 0,
          skewY: 0,
          skewZ: 0,
          perspectiveX: 0,
          perspectiveY: 0,
          perspectiveZ: 0,
        },
        rotate: 0,
        flip: {
          horizontal: false,
          vertical: false,
        },
      },
    };

    console.log("✅ Reset image object created with cleared transforms");

    // Step 3: Update state
    setSelectedImage(resetImage);

    // Step 4: Update in uploaded images array
    setUploadedImages((prev) =>
      prev.map((img) => (img.id === selectedImage.id ? resetImage : img))
    );

    console.log("✅ 3D Transform reset complete!");
  };

  // Sticker Handlers
  const handleAddSticker = (
    emoji: string,
    type: "emoji" | "shape" = "emoji"
  ) => {
    const newSticker: Sticker = {
      id: `sticker-${Date.now()}`,
      emoji,
      x: 50,
      y: 50,
      size: 60,
      rotation: 0,
      zIndex: stickers.length + 1,
      type,
    };
    setStickers([...stickers, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const handleUpdateSticker = (id: string, updates: Partial<Sticker>) => {
    setStickers((prev) =>
      prev.map((sticker) =>
        sticker.id === id ? { ...sticker, ...updates } : sticker
      )
    );
  };

  const handleDeleteSticker = (id: string) => {
    setStickers((prev) => prev.filter((sticker) => sticker.id !== id));
    if (selectedStickerId === id) {
      setSelectedStickerId(null);
    }
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
    console.log("🎯 handleApplyToSelection called with:", {
      command,
      commandLength: command.length,
      commandTrimmed: command.trim(),
      selectionDataType: selectionData?.type,
      selectionDataBounds: selectionData?.bounds,
      selectedImage: selectedImage?.id || selectedImage,
    });

    if (!selectedImage || !selectionData) {
      console.error("❌ Missing selectedImage or selectionData");
      alert("Please make a selection first");
      return;
    }

    // Validate command
    if (!command || command.trim().length === 0) {
      console.error("❌ Empty command provided");
      alert("Please enter a command or select a quick option");
      return;
    }

    setLoadingMessage(
      `🎯 Applying edit to selected area... Applying edits to selected area...`
    );

    try {
      const imageUrl =
        typeof selectedImage === "string"
          ? selectedImage
          : (selectedImage as any)?.url;

      console.log("📸 Image URL:", imageUrl);

      if (!imageUrl) {
        console.error("❌ Invalid imageUrl");
        alert("Invalid image");
        setLoadingMessage("");
        return;
      }

      // Create mask from selection data
      console.log("🎨 Creating mask from selection...");
      const maskCanvas = await createMaskFromSelection(selectionData);
      console.log("✅ Mask created:", maskCanvas);

      if (!maskCanvas) {
        console.error("❌ Failed to create mask");
        alert("Failed to create selection mask");
        setLoadingMessage("");
        return;
      }

      // Convert mask canvas to blob - use Promise to make it awaitable
      const maskBlob = await new Promise<Blob | null>((resolve) => {
        maskCanvas.toBlob((b) => resolve(b), "image/png");
      });

      if (!maskBlob) {
        console.error("❌ Failed to convert mask to blob");
        setLoadingMessage("");
        alert("Failed to convert mask");
        return;
      }

      // Convert image URL to base64 or blob if it's a blob URL
      console.log("🖼️ Converting image URL to base64...");
      let imageBase64: string;

      try {
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove data URL prefix if present (e.g., "data:image/png;base64,")
            const base64Only = result.includes(",")
              ? result.split(",")[1]
              : result;
            resolve(base64Only);
          };
          reader.onerror = reject;
          reader.readAsDataURL(imageBlob);
        });
        console.log("✅ Image converted to base64:", {
          base64Length: imageBase64.length,
          isClean: !imageBase64.includes(","),
        });
      } catch (error) {
        console.error("❌ Failed to convert image to base64:", error);
        alert("Failed to process image");
        setLoadingMessage("");
        return;
      }

      // Send to inpaint API with the mask
      const formData = new FormData();
      formData.append("imageData", imageBase64); // Send clean base64 (no prefix)
      formData.append("maskData", maskBlob, "mask.png");
      formData.append("prompt", command);
      formData.append("selectionBounds", JSON.stringify(selectionData.bounds));

      console.log("📤 Sending to API with FormData (Blob mask)...");
      console.log("📦 FormData contents:", {
        hasImageData: formData.has("imageData"),
        hasMask: formData.has("maskData"),
        hasPrompt: formData.has("prompt"),
        promptValue: command,
        promptLength: command.length,
        maskBlobSize: maskBlob.size,
      });

      if (maskBlob.size === 0) {
        console.warn(
          "⚠️ WARNING: Mask blob is empty! Selection may not be valid"
        );
      }

      try {
        const response = await fetch("/api/process-image", {
          method: "POST",
          body: formData,
        });

        console.log("📥 API Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ API Error:", errorText);
          throw new Error(`API failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ API Response data:", data);

        if (data.success) {
          console.log("📝 Processing image update...", {
            selectedImageType: typeof selectedImage,
            selectedImageId:
              typeof selectedImage === "object" ? selectedImage?.id : "N/A",
            appliedEdits: data.appliedEdits,
            isLocalProcessing: data.appliedEdits?.[0]?.includes("Local"),
          });

          // Check if this was local processing (due to credit exhaustion)
          const isLocalProcessing = data.appliedEdits
            ?.join(" ")
            .includes("Local");
          if (isLocalProcessing) {
            console.warn(
              "⚠️  Using LOCAL processing - AI credits exhausted, applying manual filters"
            );
            setLoadingMessage("Using local filters (credits exhausted)");
          }

          // Update the selected image with processed result
          setUploadedImages((prev) => {
            const updated = prev.map((img) => {
              const shouldUpdate =
                typeof selectedImage === "object"
                  ? img.id === selectedImage.id
                  : false;

              if (shouldUpdate) {
                console.log("🔄 Updating image in array:", img.id);
                return {
                  ...img,
                  url: data.processedImageUrl,
                  isProcessed: true,
                  originalUrl:
                    img.originalUrl ||
                    (typeof selectedImage === "string"
                      ? selectedImage
                      : (selectedImage as any)?.url),
                };
              }
              return img;
            });
            console.log("📊 Updated images array:", updated.length, "items");
            return updated;
          });

          // Also update selectedImage directly so UI updates immediately
          if (typeof selectedImage === "object") {
            const updatedSelectedImage: UploadedImage = {
              ...selectedImage,
              url: data.processedImageUrl,
              isProcessed: true,
              originalUrl: selectedImage.originalUrl || selectedImage.url,
            };
            setSelectedImage(updatedSelectedImage);
            console.log(
              "✅ Selected image updated with new URL:",
              data.processedImageUrl
            );
          }

          setCurrentSelection(null);
          console.log("✅ Selection edit applied successfully", {
            method: isLocalProcessing ? "Local processing" : "AI",
          });
        } else {
          console.error("❌ API returned success: false", data);
          throw new Error(data.error || "API processing failed");
        }
      } catch (error) {
        console.error("❌ Selection edit failed:", error);
        alert("Failed to apply edit to selection: " + (error as Error).message);
      } finally {
        setLoadingMessage("");
      }
    } catch (error) {
      console.error("Selection edit failed:", error);
      alert("Failed to apply edit to selection: " + (error as Error).message);
    } finally {
      setLoadingMessage("");
    }
  };

  // Reset handlers for step-by-step image reset
  const handleResetFullImage = () => {
    console.log("🔄 handleResetFullImage called", { selectedImage });

    if (!selectedImage) {
      console.error("❌ No selected image");
      alert("No image selected / No image selected");
      return;
    }

    const confirmed = window.confirm(
      "Reset entire image?\n\nAll edit history will be deleted and the original image will be restored.\n\nThis action cannot be undone.\n\nReset entire image?\n\nAll edits will be lost and original image will be restored."
    );

    if (confirmed) {
      console.log("✅ Resetting image...");
      const originalUrl =
        (selectedImage as any).originalUrl || (selectedImage as any).url;

      console.log("📸 Original URL:", originalUrl);

      setUploadedImages((prev) => {
        const updated = prev.map((img) =>
          img.id === selectedImage.id
            ? { ...img, url: originalUrl, isProcessed: false }
            : img
        );
        console.log("📝 Updated images:", updated);
        return updated;
      });

      setTextLayers([]);
      setStickers([]);
      setCurrentSelection(null);
      setSelectedTextLayerId(null);
      setSelectedStickerId(null);
      alert("✅ Image reset successfully! / ছবি সফলভাবে রিসেট করা হয়েছে!");
    }
  };

  const handleResetStickers = () => {
    if (stickers.length === 0) {
      alert("কোন স্টিকার নেই / No stickers to remove");
      return;
    }

    const confirmed = window.confirm(
      `${stickers.length} টি স্টিকার মুছুন?\n\nসব স্টিকার সরিয়ে দেওয়া হবে কিন্তু অন্যান্য সম্পাদনা বজায় থাকবে।\n\nRemove ${stickers.length} stickers?\n\nAll stickers will be removed but other edits will remain.`
    );

    if (confirmed) {
      setStickers([]);
      setSelectedStickerId(null);
      alert("✅ Stickers removed! / স্টিকার মুছে দেওয়া হয়েছে!");
    }
  };

  const handleResetTextLayers = () => {
    if (textLayers.length === 0) {
      alert("কোন টেক্সট নেই / No text layers to remove");
      return;
    }

    const confirmed = window.confirm(
      `${textLayers.length} টি টেক্সট লেয়ার মুছুন?\n\nসব টেক্সট সরিয়ে দেওয়া হবে কিন্তু অন্যান্য সম্পাদনা বজায় থাকবে।\n\nRemove ${textLayers.length} text layers?\n\nAll text will be removed but other edits will remain.`
    );

    if (confirmed) {
      setTextLayers([]);
      setSelectedTextLayerId(null);
      alert("✅ Text layers removed! / টেক্সট লেয়ার মুছে দেওয়া হয়েছে!");
    }
  };

  const handleClearSelection = () => {
    if (!currentSelection) {
      alert("কোন সিলেকশন নেই / No active selection");
      return;
    }

    setCurrentSelection(null);
    alert("✅ Selection cleared! / সিলেকশন ক্লিয়ার হয়েছে!");
  };

  // Helper function to create mask from selection data
  const createMaskFromSelection = async (
    selectionData: any
  ): Promise<HTMLCanvasElement | null> => {
    const imageUrl =
      typeof selectedImage === "string"
        ? selectedImage
        : (selectedImage as any)?.url;

    console.log("🎨 Creating mask - selectionData:", selectionData);

    if (!imageUrl) {
      console.error("❌ No imageUrl for mask creation");
      return null;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    return new Promise((resolve) => {
      img.onload = () => {
        const actualImageWidth = img.naturalWidth || img.width;
        const actualImageHeight = img.naturalHeight || img.height;

        console.log("✅ Image loaded for mask:", {
          displayWidth: img.width,
          displayHeight: img.height,
          naturalWidth: actualImageWidth,
          naturalHeight: actualImageHeight,
        });

        // Canvas must match the ACTUAL image dimensions, not display size
        const canvas = document.createElement("canvas");
        canvas.width = actualImageWidth;
        canvas.height = actualImageHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.error("❌ Failed to get 2D context");
          resolve(null);
          return;
        }

        // Create black background (do not edit - areas we want to preserve)
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw white mask for selected area (areas we want to edit)
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // CRITICAL: Selection data is in canvas display coordinates
        // We need to find the canvas element to get its actual size vs displayed size
        const selectionCanvas = document.querySelector(
          "canvas[style*='border']"
        ) as HTMLCanvasElement;
        let scaleX = 1;
        let scaleY = 1;

        if (selectionCanvas) {
          // Scale from selection canvas size to actual image size
          scaleX = actualImageWidth / selectionCanvas.width;
          scaleY = actualImageHeight / selectionCanvas.height;
          console.log("📐 Scale factors (canvas → actual image):", {
            selectionCanvasW: selectionCanvas.width,
            selectionCanvasH: selectionCanvas.height,
            actualImageW: actualImageWidth,
            actualImageH: actualImageHeight,
            scaleX,
            scaleY,
          });
        } else {
          console.warn("⚠️ Could not find selection canvas, using 1:1 scaling");
        }

        if (
          selectionData.type === "pen" &&
          selectionData.coordinates &&
          selectionData.coordinates.length > 0
        ) {
          console.log(
            "✏️ Drawing pen path with",
            selectionData.coordinates.length,
            "points"
          );
          // Draw pen path with smooth curves
          ctx.beginPath();
          const firstX = selectionData.coordinates[0][0] * scaleX;
          const firstY = selectionData.coordinates[0][1] * scaleY;
          ctx.moveTo(firstX, firstY);

          // Draw with quadratic curves for smooth lines
          for (let i = 1; i < selectionData.coordinates.length; i++) {
            const currX = selectionData.coordinates[i][0] * scaleX;
            const currY = selectionData.coordinates[i][1] * scaleY;
            const prevX = selectionData.coordinates[i - 1][0] * scaleX;
            const prevY = selectionData.coordinates[i - 1][1] * scaleY;

            const midX = (prevX + currX) / 2;
            const midY = (prevY + currY) / 2;
            ctx.quadraticCurveTo(prevX, prevY, midX, midY);
          }
          // Final line to last point
          const lastX =
            selectionData.coordinates[selectionData.coordinates.length - 1][0] *
            scaleX;
          const lastY =
            selectionData.coordinates[selectionData.coordinates.length - 1][1] *
            scaleY;
          ctx.lineTo(lastX, lastY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (selectionData.type === "rectangle" && selectionData.bounds) {
          console.log("⬜ Drawing rectangle mask:", selectionData.bounds);
          // Draw rectangle mask
          const x = selectionData.bounds.x * scaleX;
          const y = selectionData.bounds.y * scaleY;
          const w = selectionData.bounds.width * scaleX;
          const h = selectionData.bounds.height * scaleY;
          console.log("⬜ Rectangle coords (scaled):", { x, y, w, h });
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
        } else if (selectionData.type === "circle" && selectionData.bounds) {
          console.log("⭕ Drawing circle mask:", selectionData.bounds);
          // Draw circle mask
          const cx =
            (selectionData.bounds.x + selectionData.bounds.width / 2) * scaleX;
          const cy =
            (selectionData.bounds.y + selectionData.bounds.height / 2) * scaleY;
          const radius = (selectionData.bounds.width / 2) * scaleX;
          console.log("⭕ Circle coords (scaled):", { cx, cy, radius });
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        console.log("✅ Mask canvas created:", {
          width: canvas.width,
          height: canvas.height,
          selectionType: selectionData.type,
        });
        resolve(canvas);
      };

      img.onerror = () => {
        console.error("❌ Failed to load image for mask creation");
        resolve(null);
      };
      img.src = imageUrl;
    });
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
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={!!loadingMessage} message={loadingMessage} />

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
          {/* LEFT COLUMN: Image Library */}
          <div className="w-72 border-r border-border bg-card/30 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border shrink-0">
              <h2 className="font-semibold text-foreground mb-2">
                Image Library
              </h2>
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
                    <h3 className="text-xs font-medium text-foreground uppercase">
                      Uploaded ({uploadedImages.length})
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
                            className="absolute top-1 right-1 w-5 h-5 bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                            type="button"
                            aria-label="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {processedImages.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-medium text-foreground uppercase">
                        Processed ({processedImages.length})
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
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN: Image Canvas & Preview */}
          <div className="flex-1 border-r border-border bg-muted/30 flex flex-col overflow-hidden">
            {selectedImage ? (
              <>
                <div className="flex-1 flex items-center justify-center p-4 overflow-auto relative">
                  <div className="max-w-full max-h-full flex items-center justify-center relative overflow-hidden">
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
                        transforms={(selectedImage as any).transforms}
                        imageWidth={selectedImage.dimensions?.width || 800}
                        imageHeight={selectedImage.dimensions?.height || 600}
                      />
                    )}

                    {/* Sticker Layer */}
                    {stickers.length > 0 && (
                      <StickerLayer
                        stickers={stickers}
                        onUpdateSticker={handleUpdateSticker}
                        onDeleteSticker={handleDeleteSticker}
                        selectedStickerId={selectedStickerId || undefined}
                        onSelectSticker={setSelectedStickerId}
                      />
                    )}
                  </div>
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
                      : "Select an Image"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isGenerationMode
                      ? "Create images from text"
                      : "Choose from left panel to edit"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Editing Tools & AI Commands */}
          <div className="w-96 border-l border-border bg-card/50 flex flex-col overflow-hidden">
            {selectedImage ? (
              <>
                {/* <div className="p-4 border-b border-border shrink-0">
                  <h3 className="font-semibold text-foreground">
                    {editMode === "manual" ? "Editing Tools" : "AI Commands"}
                  </h3>
                </div> */}

                <div className="flex-1 overflow-y-auto">
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
                      onAddSticker={handleAddSticker}
                      onResetFullImage={handleResetFullImage}
                      onResetStickers={handleResetStickers}
                      onResetTextLayers={handleResetTextLayers}
                      onClearSelection={handleClearSelection}
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
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Select an image to start editing
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

        {/* Loading Overlay */}
        <LoadingOverlay isVisible={isGenerating} message={loadingMessage} />
      </div>
    </>
  );
}
