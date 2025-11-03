"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  bold: boolean;
}

interface TextOverlayProps {
  imageUrl?: string;
  textLayers: TextLayer[];
  selectedTextLayerId: string | null;
  onTextLayerUpdate: (layer: TextLayer) => void;
  onTextLayerDelete: (id: string) => void;
  onTextLayerSelect: (id: string) => void;
  imageWidth?: number;
  imageHeight?: number;
}

export default function TextOverlay({
  imageUrl,
  textLayers,
  selectedTextLayerId,
  onTextLayerUpdate,
  onTextLayerDelete,
  onTextLayerSelect,
  imageWidth = 800,
  imageHeight = 600,
}: TextOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, textId: string) => {
      if (e.button !== 0) return;
      e.preventDefault();

      onTextLayerSelect(textId);
      setDraggingId(textId);

      // Store current position and mouse position
      const layer = textLayers.find((t) => t.id === textId);
      if (layer) {
        setDragStart({
          x: layer.x,
          y: layer.y,
          startX: e.clientX,
          startY: e.clientY,
        });
      }
    },
    [textLayers, onTextLayerSelect]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!draggingId || !containerRef.current) return;
      e.preventDefault();

      const rect = containerRef.current.getBoundingClientRect();

      // Calculate delta from drag start
      const deltaX = e.clientX - dragStart.startX;
      const deltaY = e.clientY - dragStart.startY;

      // New position = original position + delta
      const newX = Math.max(0, Math.min(dragStart.x + deltaX, imageWidth));
      const newY = Math.max(0, Math.min(dragStart.y + deltaY, imageHeight));

      const layer = textLayers.find((t) => t.id === draggingId);
      if (layer) {
        onTextLayerUpdate({
          ...layer,
          x: newX,
          y: newY,
        });
      }
    },
    [
      draggingId,
      textLayers,
      dragStart,
      imageWidth,
      imageHeight,
      onTextLayerUpdate,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setDraggingId(null);
  }, []);

  // Document-level handlers for smooth dragging
  React.useEffect(() => {
    if (draggingId) {
      document.addEventListener("mousemove", handleMouseMove as any);
      document.addEventListener("mouseup", handleMouseUp as any);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove as any);
        document.removeEventListener("mouseup", handleMouseUp as any);
      };
    }
  }, [draggingId, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-lg"
      style={{
        aspectRatio: imageWidth / imageHeight,
        cursor: draggingId ? "grabbing" : "default",
        backgroundColor: "transparent",
        pointerEvents: "none",
      }}
    >
      {/* No image - just text layers */}

      {/* Text Layers */}
      {textLayers.map((layer) => {
        const isSelected = layer.id === selectedTextLayerId;
        return (
          <div
            key={layer.id}
            className="absolute"
            style={{
              left: `${layer.x}px`,
              top: `${layer.y}px`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "auto",
              userSelect: "none",
            }}
            onMouseDown={(e) => handleMouseDown(e, layer.id)}
            onClick={(e) => {
              e.stopPropagation();
              onTextLayerSelect(layer.id);
            }}
          >
            {/* Text content wrapper */}
            <div
              className={`relative inline-block cursor-grab active:cursor-grabbing transition-all ${
                isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""
              }`}
              style={{ pointerEvents: "auto" }}
            >
              <div
                style={{
                  fontSize: `${layer.fontSize}px`,
                  color: layer.color,
                  fontFamily: layer.fontFamily,
                  fontWeight: layer.bold ? "bold" : "normal",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}
              >
                {layer.text}
              </div>

              {/* Delete button */}
              {isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTextLayerDelete(layer.id);
                  }}
                  className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors shadow-lg"
                  title="Delete text"
                  style={{ pointerEvents: "auto" }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
