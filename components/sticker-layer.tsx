"use client";

import React, { useRef, useState } from "react";
import { X } from "lucide-react";

export interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  zIndex: number;
  type: "emoji" | "shape";
}

interface StickerLayerProps {
  stickers: Sticker[];
  onUpdateSticker: (id: string, updates: Partial<Sticker>) => void;
  onDeleteSticker: (id: string) => void;
  selectedStickerId?: string;
  onSelectSticker?: (id: string) => void;
}

export function StickerLayer({
  stickers,
  onUpdateSticker,
  onDeleteSticker,
  selectedStickerId,
  onSelectSticker,
}: StickerLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [resizeStart, setResizeStart] = useState<{
    x: number;
    y: number;
    size: number;
  } | null>(null);

  const handleMouseDown = (
    e: React.MouseEvent,
    stickerId: string,
    mode: "drag" | "resize"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    onSelectSticker?.(stickerId);

    if (mode === "drag") {
      setDraggingId(stickerId);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (mode === "resize") {
      setResizingId(stickerId);
      const sticker = stickers.find((s) => s.id === stickerId);
      if (sticker) {
        setResizeStart({
          x: e.clientX,
          y: e.clientY,
          size: sticker.size,
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart || !draggingId || !containerRef.current) return;

    const sticker = stickers.find((s) => s.id === draggingId);
    if (!sticker) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const container = containerRef.current.getBoundingClientRect();

    // Calculate new position as percentage
    const newX = Math.max(
      0,
      Math.min(100, sticker.x + (deltaX / container.width) * 100)
    );
    const newY = Math.max(
      0,
      Math.min(100, sticker.y + (deltaY / container.height) * 100)
    );

    onUpdateSticker(draggingId, { x: newX, y: newY });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeMouseMove = (e: React.MouseEvent) => {
    if (!resizeStart || !resizingId || !containerRef.current) return;

    const deltaY = e.clientY - resizeStart.y;
    const newSize = Math.max(
      20,
      Math.min(200, resizeStart.size + deltaY * 0.5)
    );

    onUpdateSticker(resizingId, { size: newSize });

    setResizeStart({ ...resizeStart, y: e.clientY, size: newSize });
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setDragStart(null);
    setResizingId(null);
    setResizeStart(null);
  };

  React.useEffect(() => {
    if (draggingId) {
      window.addEventListener("mousemove", handleMouseMove as any);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove as any);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggingId, dragStart, stickers]);

  React.useEffect(() => {
    if (resizingId) {
      window.addEventListener("mousemove", handleResizeMouseMove as any);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleResizeMouseMove as any);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [resizingId, resizeStart, stickers]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ cursor: draggingId ? "grabbing" : "default" }}
    >
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className={`absolute cursor-grab active:cursor-grabbing transition-all ${
            selectedStickerId === sticker.id ? "ring-2 ring-primary" : ""
          }`}
          style={{
            left: `${sticker.x}%`,
            top: `${sticker.y}%`,
            transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
            zIndex: sticker.zIndex,
            width: `${sticker.size}px`,
            height: `${sticker.size}px`,
          }}
          onMouseDown={(e) => handleMouseDown(e, sticker.id, "drag")}
        >
          {/* Sticker Content */}
          <div
            className="w-full h-full flex items-center justify-center select-none"
            style={{
              fontSize: `${sticker.size * 0.8}px`,
              lineHeight: 1,
            }}
          >
            {sticker.emoji}
          </div>

          {/* Resize Handle */}
          {selectedStickerId === sticker.id && (
            <div
              className="absolute -bottom-2 -right-2 w-5 h-5 bg-primary rounded-full cursor-se-resize shadow-lg flex items-center justify-center text-white text-xs font-bold"
              onMouseDown={(e) => handleMouseDown(e, sticker.id, "resize")}
              title="Drag to resize"
            >
              ⤡
            </div>
          )}

          {/* Delete Button */}
          {selectedStickerId === sticker.id && (
            <button
              className="absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full shadow-lg flex items-center justify-center hover:bg-destructive/80 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSticker(sticker.id);
              }}
              title="Delete sticker"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
