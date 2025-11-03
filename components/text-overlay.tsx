"use client";

import React, { useState, useRef } from "react";
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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    textId: string
  ) => {
    if (e.button !== 0) return; // Only left mouse button

    onTextLayerSelect(textId);
    setDraggingId(textId);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(e.clientX - rect.left - dragOffset.x, imageWidth)
    );
    const y = Math.max(
      0,
      Math.min(e.clientY - rect.top - dragOffset.y, imageHeight)
    );

    const layer = textLayers.find((t) => t.id === draggingId);
    if (layer) {
      onTextLayerUpdate({
        ...layer,
        x,
        y,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-lg"
      style={{
        aspectRatio: imageWidth / imageHeight,
        cursor: draggingId ? "grabbing" : "default",
        backgroundColor: "transparent",
        pointerEvents: "auto",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* No image - just text layers (image comes from SelectionCanvas below) */}

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
            }}
          >
            {/* Text content wrapper with fixed positioning context */}
            <div
              className={`relative inline-block cursor-grab active:cursor-grabbing transition-all ${
                isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""
              }`}
              onMouseDown={(e) => handleMouseDown(e, layer.id)}
              onClick={(e) => {
                e.stopPropagation();
                onTextLayerSelect(layer.id);
              }}
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

              {/* Delete button - now positioned relative to text content container */}
              {isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTextLayerDelete(layer.id);
                  }}
                  className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors shadow-lg"
                  title="Delete text"
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
