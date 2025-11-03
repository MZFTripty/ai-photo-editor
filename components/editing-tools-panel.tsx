"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Sun,
  Palette,
  Type,
  ChevronDown,
  ChevronRight,
  Box,
  Sticker,
  MousePointer,
  Pen,
  Sparkles,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ImageTransformUtils } from "./image-transform-utils";

interface EditingToolsPanelProps {
  selectedImage?: { url?: string } | string | null;
  onApplyEdit?: (editType: string, params: any) => void;
  onStartSelection?: (mode: "pen" | "rectangle" | "circle") => void;
  onApplyToSelection?: (command: string, selectionData: any) => void;
  currentSelection?: any;
  onManualTransform?: (transformedImageUrl: string) => void;
  selectedTextLayer?: {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontFamily: string;
    bold: boolean;
  } | null;
  onResetBasic?: () => void;
  onResetColor?: () => void;
  onResetTransform?: () => void;
  onCropClick?: () => void;
  onResizeClick?: () => void;
  onAddSticker?: (emoji: string, type: "emoji" | "shape") => void;
  onResetFullImage?: () => void;
  onResetStickers?: () => void;
  onResetTextLayers?: () => void;
  onClearSelection?: () => void;
}

export default function EditingToolsPanel({
  selectedImage,
  onApplyEdit,
  onStartSelection,
  onApplyToSelection,
  currentSelection,
  onManualTransform,
  selectedTextLayer,
  onResetBasic,
  onResetColor,
  onResetTransform,
  onCropClick,
  onResizeClick,
  onAddSticker,
  onResetFullImage,
  onResetStickers,
  onResetTextLayers,
  onClearSelection,
}: EditingToolsPanelProps) {
  const [openSections, setOpenSections] = useState<string[]>(["basic"]);

  // Basic adjustments
  const [brightness, setBrightness] = useState<number[]>([0]);
  const [contrast, setContrast] = useState<number[]>([0]);
  const [highlights, setHighlights] = useState<number[]>([0]);
  const [shadows, setShadows] = useState<number[]>([0]);
  const [exposure, setExposure] = useState<number[]>([0]);

  // Color controls
  const [saturation, setSaturation] = useState<number[]>([0]);
  const [vibrance, setVibrance] = useState<number[]>([0]);
  const [hue, setHue] = useState<number[]>([0]);
  const [temperature, setTemperature] = useState<number[]>([0]);
  const [tint, setTint] = useState<number[]>([0]);

  // Text state
  const [textContent, setTextContent] = useState<string>("");
  const [fontSize, setFontSize] = useState<number[]>([24]);
  const [textX, setTextX] = useState<number[]>([50]);
  const [textY, setTextY] = useState<number[]>([50]);
  const [textBold, setTextBold] = useState<boolean>(false);
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [fontFamily, setFontFamily] = useState<string>("Arial");

  // Crop state
  const [cropWidth, setCropWidth] = useState<number[]>([100]);
  const [cropHeight, setCropHeight] = useState<number[]>([100]);

  // 3D Transform
  const [warpIntensity, setWarpIntensity] = useState<number[]>([0]);
  const [skewX, setSkewX] = useState<number[]>([0]);
  const [skewY, setSkewY] = useState<number[]>([0]);
  const [skewZ, setSkewZ] = useState<number[]>([0]);
  const [perspectiveX, setPerspectiveX] = useState<number[]>([0]);
  const [perspectiveY, setPerspectiveY] = useState<number[]>([0]);
  const [perspectiveZ, setPerspectiveZ] = useState<number[]>([0]);

  // Selection
  const [selectionMode, setSelectionMode] = useState<
    "pen" | "rectangle" | "circle"
  >("pen");
  const [selectionCommand, setSelectionCommand] = useState<string>("");

  const [isTransforming, setIsTransforming] = useState<boolean>(false);

  // Load selected text layer data into form
  useEffect(() => {
    if (selectedTextLayer) {
      setTextContent(selectedTextLayer.text);
      setFontSize([selectedTextLayer.fontSize]);
      setTextBold(selectedTextLayer.bold);
      setTextColor(selectedTextLayer.color);
      setFontFamily(selectedTextLayer.fontFamily);
      setTextX([selectedTextLayer.x]);
      setTextY([selectedTextLayer.y]);
    } else {
      // Reset form when no text is selected
      setTextContent("");
      setFontSize([24]);
      setTextBold(false);
      setTextColor("#ffffff");
      setFontFamily("Arial");
      setTextX([50]);
      setTextY([50]);
    }
  }, [selectedTextLayer]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  // Helper to get URL string from selectedImage prop
  const getSelectedImageUrl = (): string | null => {
    if (!selectedImage) return null;
    if (typeof selectedImage === "string") return selectedImage;
    return (selectedImage as any).url ?? null;
  };

  // Apply edit via parent callback
  const handleApplyEdit = (editType: string, params: any) => {
    onApplyEdit?.(editType, params);
  };

  // Reset helpers
  const resetBasicAdjustments = () => {
    console.log("✅ COMPONENT: Resetting Basic Adjustments - clearing sliders");
    setBrightness([0]);
    setContrast([0]);
    setHighlights([0]);
    setShadows([0]);
    setExposure([0]);
  };

  const resetColorControls = () => {
    console.log("✅ COMPONENT: Resetting Color Controls - clearing sliders");
    setSaturation([0]);
    setVibrance([0]);
    setHue([0]);
    setTemperature([0]);
    setTint([0]);
  };

  const reset3DTransform = () => {
    setWarpIntensity([0]);
    setSkewX([0]);
    setSkewY([0]);
    setSkewZ([0]);
    setPerspectiveX([0]);
    setPerspectiveY([0]);
    setPerspectiveZ([0]);
  };

  // Manual transforms
  const handleManualCrop = async () => {
    const url = getSelectedImageUrl();
    if (!url || !onManualTransform) return;
    setIsTransforming(true);
    try {
      const w = cropWidth[0];
      const h = cropHeight[0];
      const result = await ImageTransformUtils.cropImage(url, w, h);
      onManualTransform(result.dataUrl);
    } catch (err) {
      console.error("Crop failed:", err);
    } finally {
      setIsTransforming(false);
    }
  };

  const handleManualResize = async () => {
    const url = getSelectedImageUrl();
    if (!url || !onManualTransform) return;
    setIsTransforming(true);
    try {
      const w = cropWidth[0];
      const h = cropHeight[0];
      const result = await ImageTransformUtils.resizeImage(url, w, h);
      onManualTransform(result.dataUrl);
    } catch (err) {
      console.error("Resize failed:", err);
    } finally {
      setIsTransforming(false);
    }
  };

  const handleManualRotate = async (degrees: number) => {
    const url = getSelectedImageUrl();
    if (!url || !onManualTransform) return;
    setIsTransforming(true);
    try {
      const result = await ImageTransformUtils.rotateImage(url, degrees);
      onManualTransform(result.dataUrl);
    } catch (err) {
      console.error("Rotate failed:", err);
    } finally {
      setIsTransforming(false);
    }
  };

  const handleManualFlip = async (direction: "horizontal" | "vertical") => {
    const url = getSelectedImageUrl();
    if (!url || !onManualTransform) return;
    setIsTransforming(true);
    try {
      const result = await ImageTransformUtils.flipImage(url, direction);
      onManualTransform(result.dataUrl);
    } catch (err) {
      console.error("Flip failed:", err);
    } finally {
      setIsTransforming(false);
    }
  };

  // Render check
  if (!selectedImage) {
    return (
      <div className="w-80 border-l border-border bg-card/30 flex items-center justify-center p-4">
        <div className="text-center">
          <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Select an image to access editing tools
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border bg-card/30 flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground mb-1">Editing Tools</h2>
        <p className="text-xs text-muted-foreground">
          Adjust and enhance your image
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Crop & Resize */}
        {/* <Collapsible
          open={openSections.includes("crop")}
          onOpenChange={() => toggleSection("crop")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg">
            <div className="flex items-center gap-2">
              <Crop className="w-4 h-4" />
              <span className="font-medium">Crop & Resize</span>
            </div>
            {openSections.includes("crop") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3 pt-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Width</Label>
                <Slider
                  value={cropWidth}
                  onValueChange={setCropWidth}
                  max={2000}
                  min={10}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-muted-foreground">
                  {cropWidth[0]}
                </span>
              </div>

              <div>
                <Label className="text-xs">Height</Label>
                <Slider
                  value={cropHeight}
                  onValueChange={setCropHeight}
                  max={2000}
                  min={10}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-muted-foreground">
                  {cropHeight[0]}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={handleManualCrop}
                disabled={isTransforming}
              >
                {isTransforming ? "Processing..." : "Apply Crop"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleManualResize}
                disabled={isTransforming}
              >
                {isTransforming ? "Processing..." : "Resize"}
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible> */}

        <Separator />

        {/* Rotate & Flip */}
        <Collapsible
          open={openSections.includes("rotate")}
          onOpenChange={() => toggleSection("rotate")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4" />
              <span className="font-medium">Rotate & Flip</span>
            </div>
            {openSections.includes("rotate") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3 pt-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleManualRotate(90)}
                disabled={isTransforming}
              >
                <RotateCw className="w-4 h-4 mr-1" /> 90°
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleManualRotate(-90)}
                disabled={isTransforming}
              >
                <RotateCcw className="w-4 h-4 mr-1" /> -90°
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleManualFlip("horizontal")}
                disabled={isTransforming}
              >
                <FlipHorizontal className="w-4 h-4 mr-1" /> H-Flip
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleManualFlip("vertical")}
                disabled={isTransforming}
              >
                <FlipVertical className="w-4 h-4 mr-1" /> V-Flip
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Basic Adjustments */}
        <Collapsible
          open={openSections.includes("basic")}
          onOpenChange={() => toggleSection("basic")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              <span className="font-medium">Basic Adjustments</span>
            </div>
            {openSections.includes("basic") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 pt-3">
            <div className="space-y-3">
              {/* Brightness */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Brightness</Label>
                  <span className="text-xs text-muted-foreground">
                    {brightness[0]}
                  </span>
                </div>
                <Slider
                  value={brightness}
                  onValueChange={setBrightness}
                  max={100}
                  min={-100}
                  step={1}
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Contrast</Label>
                  <span className="text-xs text-muted-foreground">
                    {contrast[0]}
                  </span>
                </div>
                <Slider
                  value={contrast}
                  onValueChange={setContrast}
                  max={100}
                  min={-100}
                  step={1}
                />
              </div>

              {/* Exposure */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Exposure</Label>
                  <span className="text-xs text-muted-foreground">
                    {exposure[0]}
                  </span>
                </div>
                <Slider
                  value={exposure}
                  onValueChange={setExposure}
                  max={100}
                  min={-100}
                  step={1}
                />
              </div>

              {/* Highlights */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Highlights</Label>
                  <span className="text-xs text-muted-foreground">
                    {highlights[0]}
                  </span>
                </div>
                <Slider
                  value={highlights}
                  onValueChange={setHighlights}
                  max={100}
                  min={-100}
                  step={1}
                />
              </div>

              {/* Shadows */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Shadows</Label>
                  <span className="text-xs text-muted-foreground">
                    {shadows[0]}
                  </span>
                </div>
                <Slider
                  value={shadows}
                  onValueChange={setShadows}
                  max={100}
                  min={-100}
                  step={1}
                />
              </div>
            </div>

            {/* Apply & Reset Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  onApplyEdit?.("basic-adjustments", {
                    brightness: brightness[0],
                    contrast: contrast[0],
                    exposure: exposure[0],
                    highlights: highlights[0],
                    shadows: shadows[0],
                  });
                }}
              >
                Apply
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  console.log(
                    "🔄 COMPONENT: Reset Button Clicked - Basic Adjustments"
                  );
                  resetBasicAdjustments();
                  console.log(
                    "🔄 COMPONENT: Calling parent onResetBasic callback"
                  );
                  onResetBasic?.();
                  console.log("🔄 COMPONENT: Reset complete");
                }}
              >
                Reset
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Color Controls */}
        <Collapsible
          open={openSections.includes("color")}
          onOpenChange={() => toggleSection("color")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="font-medium">Color Controls</span>
            </div>
            {openSections.includes("color") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 pt-3">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Saturation</Label>
                  <span className="text-xs text-muted-foreground">
                    {saturation[0]}
                  </span>
                </div>
                <Slider
                  value={saturation}
                  onValueChange={setSaturation}
                  max={100}
                  min={-100}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Vibrance</Label>
                  <span className="text-xs text-muted-foreground">
                    {vibrance[0]}
                  </span>
                </div>
                <Slider
                  value={vibrance}
                  onValueChange={setVibrance}
                  max={100}
                  min={-100}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Hue</Label>
                  <span className="text-xs text-muted-foreground">
                    {hue[0]}°
                  </span>
                </div>
                <Slider
                  value={hue}
                  onValueChange={setHue}
                  max={180}
                  min={-180}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Temperature</Label>
                  <span className="text-xs text-muted-foreground">
                    {temperature[0]}
                  </span>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={100}
                  min={-100}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Tint</Label>
                  <span className="text-xs text-muted-foreground">
                    {tint[0]}
                  </span>
                </div>
                <Slider
                  value={tint}
                  onValueChange={setTint}
                  max={100}
                  min={-100}
                  step={1}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  handleApplyEdit("color-adjustments", {
                    saturation: saturation[0],
                    vibrance: vibrance[0],
                    hue: hue[0],
                    temperature: temperature[0],
                    tint: tint[0],
                  });
                }}
              >
                Apply
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  console.log(
                    "🔄 COMPONENT: Reset Button Clicked - Color Controls"
                  );
                  resetColorControls();
                  console.log(
                    "🔄 COMPONENT: Calling parent onResetColor callback"
                  );
                  onResetColor?.();
                  console.log("🔄 COMPONENT: Reset complete");
                }}
              >
                Reset
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Text & Typography */}
        <Collapsible
          open={openSections.includes("text")}
          onOpenChange={() => toggleSection("text")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <span className="font-medium">Text & Typography</span>
            </div>
            {openSections.includes("text") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3 pt-3">
            {/* Text Content Input */}
            <div>
              <Label className="text-xs">Text Content</Label>
              <Input
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter text to add..."
                className="mt-1"
              />
            </div>

            {/* Font Family */}
            <div>
              <Label className="text-xs">Font Family</Label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full mt-1 px-2 py-1.5 rounded-md border border-input bg-background text-sm"
              >
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
              </select>
            </div>

            {/* Font Size */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label className="text-xs">Font Size</Label>
                <span className="text-xs text-muted-foreground">
                  {fontSize[0]}px
                </span>
              </div>
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                max={72}
                min={8}
                step={1}
              />
            </div>

            {/* Bold Toggle */}
            <div className="flex items-center justify-between p-2 rounded-md border border-input bg-muted/30">
              <Label className="text-xs cursor-pointer">Bold Text</Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={textBold}
                  onChange={(e) => setTextBold(e.target.checked)}
                  className="w-4 h-4 rounded border-input"
                />
              </div>
            </div>

            {/* Text Color */}
            <div>
              <Label className="text-xs mb-1 block">Text Color</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer border border-input"
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {textColor}
                </span>
              </div>
            </div>

            {/* Position X */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label className="text-xs">Position X</Label>
                <span className="text-xs text-muted-foreground">
                  {textX[0]}%
                </span>
              </div>
              <Slider
                value={textX}
                onValueChange={setTextX}
                max={100}
                min={0}
                step={1}
              />
            </div>

            {/* Position Y */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label className="text-xs">Position Y</Label>
                <span className="text-xs text-muted-foreground">
                  {textY[0]}%
                </span>
              </div>
              <Slider
                value={textY}
                onValueChange={setTextY}
                max={100}
                min={0}
                step={1}
              />
            </div>

            {/* Apply Button */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                disabled={!textContent.trim()}
                onClick={() => {
                  handleApplyEdit("add-text", {
                    text: textContent,
                    fontSize: fontSize[0],
                    bold: textBold,
                    color: textColor,
                    fontFamily: fontFamily,
                    x: 50, // Center by default
                    y: 50,
                  });
                  // Clear form after adding new text
                  setTextContent("");
                  setFontSize([24]);
                  setTextBold(false);
                  setTextColor("#ffffff");
                  setFontFamily("Arial");
                  setTextX([50]);
                  setTextY([50]);
                }}
              >
                Add New Text
              </Button>
              <Button
                size="sm"
                variant="default"
                className="flex-1"
                disabled={!textContent.trim() || !selectedTextLayer}
                onClick={() => {
                  if (!selectedTextLayer) return;

                  handleApplyEdit("add-text", {
                    id: selectedTextLayer.id, // Update existing text
                    text: textContent,
                    fontSize: fontSize[0],
                    bold: textBold,
                    color: textColor,
                    fontFamily: fontFamily,
                    x: textX[0], // Preserve current position
                    y: textY[0],
                  });
                }}
              >
                Apply Changes
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* 3D & Perspective Transform */}
        <Collapsible
          open={openSections.includes("3d")}
          onOpenChange={() => toggleSection("3d")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              <span className="font-medium">3D & Perspective Transform</span>
            </div>
            {openSections.includes("3d") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 pt-3">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Warp Intensity</Label>
                  <span className="text-xs text-muted-foreground">
                    {warpIntensity[0]}
                  </span>
                </div>
                <Slider
                  value={warpIntensity}
                  onValueChange={setWarpIntensity}
                  max={100}
                  min={-100}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Skew X</Label>
                  <span className="text-xs text-muted-foreground">
                    {skewX[0]}°
                  </span>
                </div>
                <Slider
                  value={skewX}
                  onValueChange={setSkewX}
                  max={45}
                  min={-45}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Skew Y</Label>
                  <span className="text-xs text-muted-foreground">
                    {skewY[0]}°
                  </span>
                </div>
                <Slider
                  value={skewY}
                  onValueChange={setSkewY}
                  max={45}
                  min={-45}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Skew Z</Label>
                  <span className="text-xs text-muted-foreground">
                    {skewZ[0]}°
                  </span>
                </div>
                <Slider
                  value={skewZ}
                  onValueChange={setSkewZ}
                  max={45}
                  min={-45}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Perspective X</Label>
                  <span className="text-xs text-muted-foreground">
                    {perspectiveX[0]}
                  </span>
                </div>
                <Slider
                  value={perspectiveX}
                  onValueChange={setPerspectiveX}
                  max={100}
                  min={-100}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Perspective Y</Label>
                  <span className="text-xs text-muted-foreground">
                    {perspectiveY[0]}
                  </span>
                </div>
                <Slider
                  value={perspectiveY}
                  onValueChange={setPerspectiveY}
                  max={100}
                  min={-100}
                  step={1}
                />
              </div>

              {/*  */}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Perspective Z</Label>
                  <span className="text-xs text-muted-foreground">
                    {perspectiveZ[0]}°
                  </span>
                </div>
                <Slider
                  value={perspectiveZ}
                  onValueChange={setPerspectiveZ}
                  max={180}
                  min={-180}
                  step={1}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                disabled={
                  warpIntensity[0] === 0 &&
                  skewX[0] === 0 &&
                  skewY[0] === 0 &&
                  skewZ[0] === 0 &&
                  perspectiveX[0] === 0 &&
                  perspectiveY[0] === 0 &&
                  perspectiveZ[0] === 0
                }
                onClick={() => {
                  console.log("✨ Applying 3D Transform with parameters:", {
                    warp: warpIntensity[0],
                    skewX: skewX[0],
                    skewY: skewY[0],
                    skewZ: skewZ[0],
                    perspectiveX: perspectiveX[0],
                    perspectiveY: perspectiveY[0],
                    perspectiveZ: perspectiveZ[0],
                  });

                  const transformParams = {
                    warp: warpIntensity[0],
                    skewX: skewX[0],
                    skewY: skewY[0],
                    skewZ: skewZ[0],
                    perspectiveX: perspectiveX[0],
                    perspectiveY: perspectiveY[0],
                    perspectiveZ: perspectiveZ[0],
                  };

                  console.log(
                    "📤 Sending transform params to handleApplyEdit:",
                    transformParams
                  );

                  if (handleApplyEdit) {
                    console.log("✅ handleApplyEdit is defined, calling it...");
                    handleApplyEdit("3d-transform", transformParams);
                  } else {
                    console.error("❌ ERROR: handleApplyEdit is NOT defined!");
                  }
                }}
              >
                {warpIntensity[0] === 0 &&
                skewX[0] === 0 &&
                skewY[0] === 0 &&
                skewZ[0] === 0 &&
                perspectiveX[0] === 0 &&
                perspectiveY[0] === 0 &&
                perspectiveZ[0] === 0
                  ? "Apply Transform (No Changes)"
                  : "✨ Apply Transform"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  console.log("🔄 Resetting 3D Transform");
                  reset3DTransform();
                  if (onResetTransform) {
                    onResetTransform();
                  } else {
                    console.warn("⚠️ onResetTransform callback not provided");
                  }
                }}
              >
                Reset
              </Button>
            </div>

            {/* Status Display */}
            <div className="p-2 bg-muted/50 rounded-lg border border-border text-xs space-y-1">
              <div>
                <span className="text-muted-foreground">Warp:</span>{" "}
                <span className="font-semibold">{warpIntensity[0]}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Skew X:</span>{" "}
                <span className="font-semibold">{skewX[0]}°</span>
              </div>
              <div>
                <span className="text-muted-foreground">Skew Y:</span>{" "}
                <span className="font-semibold">{skewY[0]}°</span>
              </div>
              <div>
                <span className="text-muted-foreground">Skew Z:</span>{" "}
                <span className="font-semibold">{skewZ[0]}°</span>
              </div>
              <div>
                <span className="text-muted-foreground">Perspective X:</span>{" "}
                <span className="font-semibold">{perspectiveX[0]}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Perspective Y:</span>{" "}
                <span className="font-semibold">{perspectiveY[0]}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Perspective Z:</span>{" "}
                <span className="font-semibold">{perspectiveZ[0]}°</span>
              </div>
              {warpIntensity[0] !== 0 ||
              skewX[0] !== 0 ||
              skewY[0] !== 0 ||
              skewZ[0] !== 0 ||
              perspectiveX[0] !== 0 ||
              perspectiveY[0] !== 0 ||
              perspectiveZ[0] !== 0 ? (
                <div className="text-primary font-semibold pt-1 border-t border-border">
                  ✓ Transform active
                </div>
              ) : (
                <div className="text-muted-foreground pt-1 border-t border-border">
                  No transform applied
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />
        {/* Crop & Resize */}
        <Collapsible
          open={openSections.includes("crop-resize")}
          onOpenChange={() => toggleSection("crop-resize")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg">
            <div className="flex items-center gap-2">
              <Crop className="w-4 h-4" />
              <span className="font-medium">Crop & Resize</span>
            </div>
            {openSections.includes("crop-resize") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 py-4 space-y-3">
            <div className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={onCropClick}
              >
                Crop Image
              </Button>
              <p className="text-xs text-muted-foreground">
                Select and adjust the area you want to keep
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={onResizeClick}
              >
                Resize Image
              </Button>
              <p className="text-xs text-muted-foreground">
                Change image dimensions or scale
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Stickers & Shapes */}
        <Collapsible
          open={openSections.includes("stickers")}
          onOpenChange={() => toggleSection("stickers")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg">
            <div className="flex items-center gap-2">
              <Sticker className="w-4 h-4" />
              <span className="font-medium">Stickers & Shapes</span>
            </div>
            {openSections.includes("stickers") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3 pt-3">
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold">Shapes</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("⭕", "shape")}
                  >
                    ⭕ Circle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("⬜", "shape")}
                  >
                    ⬜ Square
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("🔺", "shape")}
                  >
                    🔺 Triangle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("⬛", "shape")}
                  >
                    ⬛ Filled
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("◯", "shape")}
                  >
                    ◯ Circle O
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("◆", "shape")}
                  >
                    ◆ Diamond
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("⬟", "shape")}
                  >
                    ⬟ Hexagon
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("🔹", "shape")}
                  >
                    🔹 Dot
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("▶️", "shape")}
                  >
                    ▶️ Play
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold">Arrows & Lines</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("➡️", "shape")}
                  >
                    ➡️ Right
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("⬅️", "shape")}
                  >
                    ⬅️ Left
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("⬆️", "shape")}
                  >
                    ⬆️ Up
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("⬇️", "shape")}
                  >
                    ⬇️ Down
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("↩️", "shape")}
                  >
                    ↩️ Back
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("↪️", "shape")}
                  >
                    ↪️ Forward
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold">Decorative</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("⭐", "shape")}
                  >
                    ⭐ Star
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("✨", "shape")}
                  >
                    ✨ Sparkle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("❤️", "shape")}
                  >
                    ❤️ Heart
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("💫", "shape")}
                  >
                    💫 Dizzy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("🌟", "shape")}
                  >
                    🌟 Gold
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSticker?.("💥", "shape")}
                  >
                    💥 Boom
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold">Emojis - Faces</Label>
                <div className="grid grid-cols-4 gap-1">
                  {["😀", "😍", "😂", "🤣", "😘", "😜", "🤩", "😎"].map(
                    (emoji) => (
                      <Button
                        key={emoji}
                        size="sm"
                        variant="outline"
                        className="p-1 h-8 bg-transparent"
                        onClick={() => onAddSticker?.(emoji, "emoji")}
                      >
                        {emoji}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold">
                  Emojis - Popular
                </Label>
                <div className="grid grid-cols-4 gap-1">
                  {["�", "�", "�", "🎉", "🎊", "�", "💎", "👏"].map((emoji) => (
                    <Button
                      key={emoji}
                      size="sm"
                      variant="outline"
                      className="p-1 h-8 bg-transparent"
                      onClick={() => onAddSticker?.(emoji, "emoji")}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold">Emojis - Nature</Label>
                <div className="grid grid-cols-4 gap-1">
                  {["🌺", "🌸", "🌼", "🌻", "🌷", "🌹", "🍀", "🌿"].map(
                    (emoji) => (
                      <Button
                        key={emoji}
                        size="sm"
                        variant="outline"
                        className="p-1 h-8 bg-transparent"
                        onClick={() => onAddSticker?.(emoji, "emoji")}
                      >
                        {emoji}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold">
                  Emojis - Objects
                </Label>
                <div className="grid grid-cols-4 gap-1">
                  {["🎁", "🎀", "🎈", "🎂", "�", "🎵", "�", "🎺"].map(
                    (emoji) => (
                      <Button
                        key={emoji}
                        size="sm"
                        variant="outline"
                        className="p-1 h-8 bg-transparent"
                        onClick={() => onAddSticker?.(emoji, "emoji")}
                      >
                        {emoji}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Selection Tools */}
        <Collapsible
          open={openSections.includes("selection")}
          onOpenChange={() => toggleSection("selection")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg">
            <div className="flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              <span className="font-medium">Selection & Editing</span>
            </div>
            {openSections.includes("selection") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 pt-3">
            {/* Selection Mode */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Selection Mode</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Choose how to select area on your image
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant={selectionMode === "pen" ? "default" : "outline"}
                  onClick={() => setSelectionMode("pen")}
                  className="flex flex-col items-center gap-1 h-auto py-2"
                  title="Draw freehand selection"
                >
                  <Pen className="w-4 h-4" />
                  <span className="text-xs">Pen</span>
                </Button>
                <Button
                  size="sm"
                  variant={
                    selectionMode === "rectangle" ? "default" : "outline"
                  }
                  onClick={() => setSelectionMode("rectangle")}
                  className="flex flex-col items-center gap-1 h-auto py-2"
                  title="Draw rectangular selection"
                >
                  <span className="text-lg">⬜</span>
                  <span className="text-xs">Rectangle</span>
                </Button>
                <Button
                  size="sm"
                  variant={selectionMode === "circle" ? "default" : "outline"}
                  onClick={() => setSelectionMode("circle")}
                  className="flex flex-col items-center gap-1 h-auto py-2"
                  title="Draw circular selection"
                >
                  <span className="text-lg">⭕</span>
                  <span className="text-xs">Circle</span>
                </Button>
              </div>
            </div>

            <Separator />

            {/* Quick Selection Commands */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Quick Commands</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Pre-made editing commands for selections
              </p>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { label: "Remove", icon: "🗑️", cmd: "remove this area" },
                  { label: "Brighten", icon: "☀️", cmd: "brighten this area" },
                  { label: "Darken", icon: "🌙", cmd: "darken this area" },
                  {
                    label: "Blur",
                    icon: "💨",
                    cmd: "apply blur to this area",
                  },
                  {
                    label: "Enhance",
                    icon: "✨",
                    cmd: "enhance and sharpen this area",
                  },
                  {
                    label: "Smooth",
                    icon: "🧴",
                    cmd: "smooth and soften this area",
                  },
                  {
                    label: "Color Pop",
                    icon: "🎨",
                    cmd: "increase saturation in this area",
                  },
                  {
                    label: "B&W",
                    icon: "⚪",
                    cmd: "convert this area to black and white",
                  },
                ].map(({ label, icon, cmd }) => (
                  <Button
                    key={label}
                    size="sm"
                    variant={selectionCommand === cmd ? "default" : "outline"}
                    className="text-xs h-auto py-1.5 flex items-center gap-1"
                    onClick={() => {
                      console.log("📌 Quick command selected:", { label, cmd });
                      setSelectionCommand(cmd);
                    }}
                    title={`Set command: ${cmd}`}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Custom Command */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Custom Command</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Describe what you want to do with the selected area
              </p>
              <Input
                value={selectionCommand}
                onChange={(e) => setSelectionCommand(e.target.value)}
                placeholder="e.g., remove the person, replace with blue sky..."
                className="mt-1 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                💡 Examples: "remove spots", "change color to red", "smooth
                skin", "add glow effect"
              </p>
            </div>

            <Separator />

            {/* Selection Instructions */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold">How to Use</Label>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex gap-2">
                  <span className="font-bold text-primary">1</span>
                  <span>Select mode (Pen, Rectangle, or Circle)</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-primary">2</span>
                  <span>Click "Start Selection" button</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-primary">3</span>
                  <span>Draw on image (click & drag, or draw freehand)</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-primary">4</span>
                  <span>Choose quick command OR type custom command</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-primary">5</span>
                  <span>Click "Apply to Selection" button</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                size="sm"
                variant="default"
                className="w-full"
                onClick={() => onStartSelection?.(selectionMode)}
                disabled={!selectionMode}
              >
                <MousePointer className="w-4 h-4 mr-2" />
                Start Selection ({selectionMode})
              </Button>

              {/* Apply Custom Command or Adjustments to Selection */}
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                disabled={
                  !currentSelection ||
                  (!selectionCommand.trim() &&
                    brightness[0] === 0 &&
                    contrast[0] === 0 &&
                    saturation[0] === 0 &&
                    exposure[0] === 0)
                }
                onClick={() => {
                  // Build command from either custom command or adjustments
                  let finalCommand = selectionCommand;

                  console.log("🔍 Button clicked - initial state:", {
                    selectionCommand,
                    hasCurrentSelection: !!currentSelection,
                    currentSelectionType: currentSelection?.type,
                  });

                  // If no custom command, build from adjustments
                  if (
                    !finalCommand.trim() &&
                    (brightness[0] !== 0 ||
                      contrast[0] !== 0 ||
                      saturation[0] !== 0 ||
                      exposure[0] !== 0)
                  ) {
                    const adjustments: string[] = [];
                    if (brightness[0] > 0)
                      adjustments.push(
                        `increase brightness by ${brightness[0]}%`
                      );
                    if (brightness[0] < 0)
                      adjustments.push(
                        `decrease brightness by ${Math.abs(brightness[0])}%`
                      );
                    if (contrast[0] > 0)
                      adjustments.push(`increase contrast by ${contrast[0]}%`);
                    if (contrast[0] < 0)
                      adjustments.push(
                        `decrease contrast by ${Math.abs(contrast[0])}%`
                      );
                    if (saturation[0] > 0)
                      adjustments.push(
                        `increase saturation by ${saturation[0]}%`
                      );
                    if (saturation[0] < 0)
                      adjustments.push(
                        `decrease saturation by ${Math.abs(saturation[0])}%`
                      );
                    if (exposure[0] > 0)
                      adjustments.push(`increase exposure by ${exposure[0]}%`);
                    if (exposure[0] < 0)
                      adjustments.push(
                        `decrease exposure by ${Math.abs(exposure[0])}%`
                      );
                    finalCommand = adjustments.join(", ");
                  }

                  console.log("✨ Applying to selection:", {
                    finalCommand,
                    hasSelection: !!currentSelection,
                    selectionType: currentSelection?.type,
                    selectionBounds: currentSelection?.bounds,
                  });
                  onApplyToSelection?.(finalCommand, currentSelection);
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Apply to Selection
              </Button>

              {/* DEBUG: Show current state */}
              <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                <div>✓ Command: {selectionCommand ? "Set" : "Empty"}</div>
                <div>
                  ✓ Selection:{" "}
                  {currentSelection ? `${currentSelection.type}` : "None"}
                </div>
              </div>

              {currentSelection && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-xs"
                  onClick={() => {
                    setSelectionCommand("");
                  }}
                >
                  Clear Command
                </Button>
              )}

              <Separator className="my-2" />

              {/* Reset Options Panel */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">🔄 Reset & Undo</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  সমস্যা হলে ধাপে ধাপে রিসেট করুন
                </p>

                {/* Full Reset */}
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    console.log("🔴 Full Reset clicked");
                    onResetFullImage?.();
                  }}
                >
                  <span className="mr-2">🔴</span>
                  সম্পূর্ণ ছবি রিসেট
                </Button>

                {/* Partial Resets */}
                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-auto py-1.5"
                    onClick={() => {
                      console.log("🗑️ Reset Stickers clicked");
                      onResetStickers?.();
                    }}
                  >
                    <span className="mr-1">🗑️</span>
                    স্টিকার
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-auto py-1.5"
                    onClick={() => {
                      console.log("📝 Reset Text clicked");
                      onResetTextLayers?.();
                    }}
                  >
                    <span className="mr-1">📝</span>
                    টেক্সট
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-auto py-1.5 col-span-2"
                    onClick={() => {
                      console.log("❌ Clear Selection clicked");
                      onClearSelection?.();
                    }}
                    disabled={!currentSelection}
                  >
                    <span className="mr-1">❌</span>
                    সিলেকশন ক্লিয়ার
                  </Button>
                </div>

                <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
                  💡 কোন সমস্যা হলে উপরের বাটন দিয়ে রিসেট করুন
                </div>
              </div>
            </div>

            {/* Status */}
            {currentSelection && (
              <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs font-medium text-primary">
                  ✓ Selection active - Ready to apply command
                </p>
              </div>
            )}

            {!currentSelection && (
              <div className="p-2 bg-muted rounded-lg border border-border">
                <p className="text-xs text-muted-foreground">
                  No selection active yet. Click "Start Selection" to begin.
                </p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
