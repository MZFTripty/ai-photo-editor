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
  const [perspectiveX, setPerspectiveX] = useState<number[]>([0]);
  const [perspectiveY, setPerspectiveY] = useState<number[]>([0]);

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
    setBrightness([0]);
    setContrast([0]);
    setHighlights([0]);
    setShadows([0]);
    setExposure([0]);
  };

  const resetColorControls = () => {
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
    setPerspectiveX([0]);
    setPerspectiveY([0]);
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
        <Collapsible
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
        </Collapsible>

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
                  resetBasicAdjustments();
                  onResetBasic?.();
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
                  resetColorControls();
                  onResetColor?.();
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
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() =>
                  handleApplyEdit("3d-transform", {
                    warp: warpIntensity[0],
                    skewX: skewX[0],
                    skewY: skewY[0],
                    perspectiveX: perspectiveX[0],
                    perspectiveY: perspectiveY[0],
                  })
                }
              >
                Apply Transform
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  reset3DTransform();
                  onResetTransform?.();
                }}
              >
                Reset
              </Button>
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
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleApplyEdit("add-shape", { type: "circle" })}
              >
                ⭕ Circle
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleApplyEdit("add-shape", { type: "square" })}
              >
                ⬜ Square
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleApplyEdit("add-shape", { type: "triangle" })
                }
              >
                🔺 Triangle
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleApplyEdit("add-shape", { type: "arrow" })}
              >
                ➡️ Arrow
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleApplyEdit("add-shape", { type: "star" })}
              >
                ⭐ Star
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleApplyEdit("add-shape", { type: "heart" })}
              >
                ❤️ Heart
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Frames</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleApplyEdit("add-frame", { type: "border" })
                  }
                >
                  Border Frame
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleApplyEdit("add-frame", { type: "vintage" })
                  }
                >
                  Vintage Frame
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Popular Emojis</Label>
              <div className="grid grid-cols-4 gap-1">
                {["😀", "😍", "🔥", "💯", "👍", "❤️", "🎉", "✨"].map(
                  (emoji) => (
                    <Button
                      key={emoji}
                      size="sm"
                      variant="outline"
                      className="p-1 h-8 bg-transparent"
                      onClick={() => handleApplyEdit("add-emoji", { emoji })}
                    >
                      {emoji}
                    </Button>
                  )
                )}
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
              <span className="font-medium">Selection Tools</span>
            </div>
            {openSections.includes("selection") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3 pt-3">
            <div className="space-y-2">
              <Label className="text-xs">Selection Mode</Label>
              <div className="grid grid-cols-3 gap-1">
                <Button
                  size="sm"
                  variant={selectionMode === "pen" ? "default" : "outline"}
                  onClick={() => setSelectionMode("pen")}
                  className="p-1"
                >
                  <Pen className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant={
                    selectionMode === "rectangle" ? "default" : "outline"
                  }
                  onClick={() => setSelectionMode("rectangle")}
                  className="p-1"
                >
                  ⬜
                </Button>
                <Button
                  size="sm"
                  variant={selectionMode === "circle" ? "default" : "outline"}
                  onClick={() => setSelectionMode("circle")}
                  className="p-1"
                >
                  ⭕
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs">Command for Selected Area</Label>
              <Input
                value={selectionCommand}
                onChange={(e) => setSelectionCommand(e.target.value)}
                placeholder="e.g., remove spot, change to blue sky..."
                className="mt-1"
              />
            </div>

            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => onStartSelection?.(selectionMode)}
              >
                Start Selection ({selectionMode})
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="w-full bg-transparent"
                disabled={!selectionCommand.trim() || !currentSelection}
                onClick={() =>
                  onApplyToSelection?.(selectionCommand, currentSelection)
                }
              >
                Apply to Selection
              </Button>
            </div>

            <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
              <p>1. Choose selection mode</p>
              <p>2. Click "Start Selection" and draw on image</p>
              <p>3. Enter command and apply</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
