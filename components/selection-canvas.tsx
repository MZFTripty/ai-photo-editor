"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface SelectionCanvasProps {
  imageUrl: string;
  selectionMode: "pen" | "rectangle" | "circle";
  isSelecting: boolean;
  onSelectionComplete: (selection: SelectionData) => void;
  onSelectionCancel: () => void;
  transforms?: {
    css3d?: {
      transform?: string;
    };
    rotate?: number;
    flip?: {
      horizontal?: boolean;
      vertical?: boolean;
    };
  };
  imageWidth?: number;
  imageHeight?: number;
}

interface SelectionData {
  type: "pen" | "rectangle" | "circle";
  coordinates: number[][];
  bounds: { x: number; y: number; width: number; height: number };
  area?: number;
  perimeter?: number;
}

// Selection statistics calculator
const calculateSelectionStats = (bounds: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  const area = bounds.width * bounds.height;
  const perimeter = 2 * (bounds.width + bounds.height);
  return { area, perimeter };
};

export default function SelectionCanvas({
  imageUrl,
  selectionMode,
  isSelecting,
  onSelectionComplete,
  onSelectionCancel,
  transforms,
  imageWidth = 800,
  imageHeight = 600,
}: SelectionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[][]>([]);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  // Debug: Log when transforms change
  useEffect(() => {
    if (transforms?.css3d?.transform && transforms.css3d.transform !== "none") {
      console.log("📐 SelectionCanvas: Transforms received:", {
        transform: transforms.css3d.transform,
        rotate: transforms.rotate,
      });
    }
  }, [transforms]);

  const getCanvasCoordinates = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  }, []);

  const drawSelection = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isSelecting) return;

    // Draw semi-transparent overlay on entire canvas (darkening unselected areas)
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Selection color (blue for active, red for complete)
    ctx.strokeStyle = "#3b82f6";
    ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (selectionMode === "pen" && currentPath.length > 1) {
      // Draw pen path with smooth curves
      ctx.beginPath();
      ctx.moveTo(currentPath[0][0], currentPath[0][1]);

      // Use quadratic curves for smooth lines
      for (let i = 1; i < currentPath.length; i++) {
        const xc = (currentPath[i][0] + currentPath[i - 1][0]) / 2;
        const yc = (currentPath[i][1] + currentPath[i - 1][1]) / 2;
        ctx.quadraticCurveTo(
          currentPath[i - 1][0],
          currentPath[i - 1][1],
          xc,
          yc
        );
      }
      ctx.stroke();

      // Draw points along the path
      currentPath.forEach((point, i) => {
        ctx.fillStyle = i === currentPath.length - 1 ? "#ef4444" : "#3b82f6";
        ctx.beginPath();
        ctx.arc(point[0], point[1], 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw point number for every 10th point
        if (i % 10 === 0 && i !== 0) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "10px Arial";
          ctx.fillText(i.toString(), point[0] + 8, point[1] - 8);
        }
      });

      // Draw guide text for pen mode
      ctx.fillStyle = "#3b82f6";
      ctx.font = "bold 12px Arial";
      ctx.fillText(
        `✏️ Pen Mode - Points: ${currentPath.length} | Double-click to finish | Press Enter to confirm`,
        10,
        canvas.height - 15
      );
    } else if (
      selectionMode === "rectangle" &&
      startPoint &&
      currentPath.length > 0
    ) {
      const currentPoint = currentPath[currentPath.length - 1];
      const width = currentPoint[0] - startPoint.x;
      const height = currentPoint[1] - startPoint.y;

      ctx.fillRect(startPoint.x, startPoint.y, width, height);
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);

      // Draw corner handles
      const corners = [
        [startPoint.x, startPoint.y],
        [startPoint.x + width, startPoint.y],
        [startPoint.x, startPoint.y + height],
        [startPoint.x + width, startPoint.y + height],
      ];

      corners.forEach((corner) => {
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(corner[0] - 3, corner[1] - 3, 6, 6);
      });

      // Draw dimensions
      const absWidth = Math.abs(width);
      const absHeight = Math.abs(height);
      ctx.fillStyle = "#3b82f6";
      ctx.font = "bold 12px Arial";
      ctx.fillText(
        `⬜ Rectangle - ${Math.round(absWidth)}×${Math.round(absHeight)}px`,
        10,
        canvas.height - 15
      );
    } else if (
      selectionMode === "circle" &&
      startPoint &&
      currentPath.length > 0
    ) {
      const currentPoint = currentPath[currentPath.length - 1];
      const radius = Math.sqrt(
        Math.pow(currentPoint[0] - startPoint.x, 2) +
          Math.pow(currentPoint[1] - startPoint.y, 2)
      );

      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw center point
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Draw radius guide line
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(currentPoint[0], currentPoint[1]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw dimensions
      ctx.fillStyle = "#3b82f6";
      ctx.font = "bold 12px Arial";
      ctx.fillText(
        `⭕ Circle - R: ${Math.round(radius)}px | D: ${Math.round(
          radius * 2
        )}px`,
        10,
        canvas.height - 15
      );
    }
  }, [isSelecting, selectionMode, currentPath, startPoint]);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting) return;

      e.preventDefault();
      const coords = getCanvasCoordinates(e);
      setIsDrawing(true);
      setStartPoint(coords);
      setCurrentPath([[coords.x, coords.y]]);
    },
    [isSelecting, getCanvasCoordinates]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting || !isDrawing) return;

      e.preventDefault();
      const coords = getCanvasCoordinates(e);

      if (selectionMode === "pen") {
        setCurrentPath((prev) => [...prev, [coords.x, coords.y]]);
      } else {
        setCurrentPath([[coords.x, coords.y]]);
      }
    },
    [isSelecting, isDrawing, selectionMode, getCanvasCoordinates]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting || !isDrawing) return;

      e.preventDefault();
      setIsDrawing(false);

      // Calculate bounds
      let minX = Number.POSITIVE_INFINITY,
        minY = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY;

      if (selectionMode === "pen") {
        currentPath.forEach(([x, y]) => {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        });
      } else if (startPoint && currentPath.length > 0) {
        const currentPoint = currentPath[currentPath.length - 1];
        if (selectionMode === "rectangle") {
          minX = Math.min(startPoint.x, currentPoint[0]);
          minY = Math.min(startPoint.y, currentPoint[1]);
          maxX = Math.max(startPoint.x, currentPoint[0]);
          maxY = Math.max(startPoint.y, currentPoint[1]);
        } else if (selectionMode === "circle") {
          const radius = Math.sqrt(
            Math.pow(currentPoint[0] - startPoint.x, 2) +
              Math.pow(currentPoint[1] - startPoint.y, 2)
          );
          minX = startPoint.x - radius;
          minY = startPoint.y - radius;
          maxX = startPoint.x + radius;
          maxY = startPoint.y + radius;
        }
      }

      const selectionData: SelectionData = {
        type: selectionMode,
        coordinates: currentPath,
        bounds: {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
        },
      };

      onSelectionComplete(selectionData);
    },
    [
      isSelecting,
      isDrawing,
      selectionMode,
      currentPath,
      startPoint,
      onSelectionComplete,
    ]
  );

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      handleMouseDown(e as any);
    },
    [handleMouseDown]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      handleMouseMove(e as any);
    },
    [handleMouseMove]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      handleMouseUp(e as any);
    },
    [handleMouseUp]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ]);

  useEffect(() => {
    drawSelection();
  }, [drawSelection]);

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;

    const updateCanvasSize = () => {
      canvas.width = image.offsetWidth;
      canvas.height = image.offsetHeight;
    };

    image.onload = updateCanvasSize;
    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [imageUrl]);

  // Reset selection when mode changes or selection is cancelled
  useEffect(() => {
    if (!isSelecting) {
      setCurrentPath([]);
      setStartPoint(null);
      setIsDrawing(false);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [isSelecting]);

  return (
    <div
      className="relative w-full bg-black rounded-lg overflow-hidden"
      style={{
        aspectRatio: imageWidth / imageHeight,
        cursor: isSelecting ? "crosshair" : "default",
      }}
    >
      <img
        ref={imageRef}
        src={imageUrl || "/placeholder.svg"}
        alt="Image for selection"
        className="w-full h-full object-cover"
        draggable={false}
        style={{
          transform:
            transforms?.css3d?.transform &&
            transforms.css3d.transform !== "none"
              ? transforms.css3d.transform
              : transforms?.rotate
              ? `rotate(${transforms.rotate}deg)`
              : "none",
          transformStyle: "preserve-3d" as const,
          perspective: "1200px",
          transition: "transform 0.3s ease-out",
          WebkitTransform:
            transforms?.css3d?.transform &&
            transforms.css3d.transform !== "none"
              ? transforms.css3d.transform
              : transforms?.rotate
              ? `rotate(${transforms.rotate}deg)`
              : "none",
          WebkitTransformStyle: "preserve-3d" as const,
          WebkitPerspective: "1200px" as const,
        }}
        onLoad={() => {
          const transformValue =
            transforms?.css3d?.transform &&
            transforms.css3d.transform !== "none"
              ? transforms.css3d.transform
              : transforms?.rotate
              ? `rotate(${transforms.rotate}deg)`
              : "none";

          console.log("📸 Image loaded - Transform details:", {
            transformValue,
            hasCSS3D: !!transforms?.css3d?.transform,
            css3dValue: transforms?.css3d?.transform,
            hasRotate: !!transforms?.rotate,
            rotateValue: transforms?.rotate,
            finalTransform: transformValue,
            styleApplied: imageRef.current?.style.transform,
          });
        }}
      />
      <canvas
        ref={canvasRef}
        className={
          isSelecting
            ? "absolute top-0 left-0 pointer-events-auto"
            : "absolute top-0 left-0 pointer-events-none"
        }
        style={{
          cursor: isSelecting
            ? selectionMode === "pen"
              ? "crosshair"
              : "crosshair"
            : "default",
        }}
      />
      {isSelecting && (
        <div className="absolute top-2 right-2 space-x-2">
          <button
            onClick={onSelectionCancel}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
