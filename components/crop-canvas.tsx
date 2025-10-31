"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface CropCanvasProps {
  imageUrl: string;
  onCropComplete: (x: number, y: number, width: number, height: number) => void;
  onCancel: () => void;
}

export default function CropCanvas({
  imageUrl,
  onCropComplete,
  onCancel,
}: CropCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cropBox, setCropBox] = useState({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragEdge, setDragEdge] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImage(img);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image aspect ratio
    const maxWidth = 600;
    const maxHeight = 400;
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;

    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw semi-transparent overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate crop box in pixels
    const x = (cropBox.x / 100) * canvas.width;
    const y = (cropBox.y / 100) * canvas.height;
    const width = (cropBox.width / 100) * canvas.width;
    const height = (cropBox.height / 100) * canvas.height;

    // Clear cropped area
    ctx.clearRect(x, y, width, height);
    ctx.drawImage(
      image,
      (cropBox.x / 100) * image.width,
      (cropBox.y / 100) * image.height,
      (cropBox.width / 100) * image.width,
      (cropBox.height / 100) * image.height,
      x,
      y,
      width,
      height
    );

    // Draw border
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Draw resize handles
    const handleSize = 10;
    ctx.fillStyle = "#00ff00";
    const handles = [
      [x - handleSize / 2, y - handleSize / 2], // top-left
      [x + width - handleSize / 2, y - handleSize / 2], // top-right
      [x - handleSize / 2, y + height - handleSize / 2], // bottom-left
      [x + width - handleSize / 2, y + height - handleSize / 2], // bottom-right
      [x + width / 2 - handleSize / 2, y - handleSize / 2], // top-center
      [x + width / 2 - handleSize / 2, y + height - handleSize / 2], // bottom-center
      [x - handleSize / 2, y + height / 2 - handleSize / 2], // left-center
      [x + width - handleSize / 2, y + height / 2 - handleSize / 2], // right-center
    ];

    handles.forEach((handle) => {
      ctx.fillRect(handle[0], handle[1], handleSize, handleSize);
    });
  }, [image, cropBox]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if clicking on edges
    const threshold = 5;
    if (mouseX >= cropBox.x - threshold && mouseX <= cropBox.x + threshold) {
      setDragEdge("left");
      setIsDragging(true);
    } else if (
      mouseX >= cropBox.x + cropBox.width - threshold &&
      mouseX <= cropBox.x + cropBox.width + threshold
    ) {
      setDragEdge("right");
      setIsDragging(true);
    } else if (
      mouseY >= cropBox.y - threshold &&
      mouseY <= cropBox.y + threshold
    ) {
      setDragEdge("top");
      setIsDragging(true);
    } else if (
      mouseY >= cropBox.y + cropBox.height - threshold &&
      mouseY <= cropBox.y + cropBox.height + threshold
    ) {
      setDragEdge("bottom");
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragEdge) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    const minSize = 10;
    let newBox = { ...cropBox };

    if (dragEdge === "left") {
      const newWidth = cropBox.width + (cropBox.x - mouseX);
      if (newWidth > minSize) {
        newBox.x = mouseX;
        newBox.width = newWidth;
      }
    } else if (dragEdge === "right") {
      const newWidth = mouseX - cropBox.x;
      if (newWidth > minSize && cropBox.x + newWidth <= 100) {
        newBox.width = newWidth;
      }
    } else if (dragEdge === "top") {
      const newHeight = cropBox.height + (cropBox.y - mouseY);
      if (newHeight > minSize) {
        newBox.y = mouseY;
        newBox.height = newHeight;
      }
    } else if (dragEdge === "bottom") {
      const newHeight = mouseY - cropBox.y;
      if (newHeight > minSize && cropBox.y + newHeight <= 100) {
        newBox.height = newHeight;
      }
    }

    // Keep within bounds
    newBox.x = Math.max(0, Math.min(newBox.x, 100));
    newBox.y = Math.max(0, Math.min(newBox.y, 100));
    newBox.width = Math.max(minSize, Math.min(newBox.width, 100 - newBox.x));
    newBox.height = Math.max(minSize, Math.min(newBox.height, 100 - newBox.y));

    setCropBox(newBox);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragEdge(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Crop Image</h3>

        {/* Instructions */}
        <p className="text-sm text-muted-foreground mb-4">
          Drag the green borders and handles to adjust the crop area. The area
          inside the green box will be kept.
        </p>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full border-2 border-border rounded-lg mb-4 cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Crop info */}
        <div className="bg-muted p-2 rounded mb-4 text-sm">
          <p>
            Position: {cropBox.x.toFixed(1)}%, {cropBox.y.toFixed(1)}% | Size:{" "}
            {cropBox.width.toFixed(1)}% × {cropBox.height.toFixed(1)}%
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onCropComplete(
                cropBox.x,
                cropBox.y,
                cropBox.width,
                cropBox.height
              )
            }
          >
            Apply Crop
          </Button>
        </div>
      </div>
    </div>
  );
}
