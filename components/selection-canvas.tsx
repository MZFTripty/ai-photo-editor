"use client"

import { useRef, useEffect, useState, useCallback } from "react"

interface SelectionCanvasProps {
  imageUrl: string
  selectionMode: "pen" | "rectangle" | "circle"
  isSelecting: boolean
  onSelectionComplete: (selection: SelectionData) => void
  onSelectionCancel: () => void
}

interface SelectionData {
  type: "pen" | "rectangle" | "circle"
  coordinates: number[][]
  bounds: { x: number; y: number; width: number; height: number }
}

export default function SelectionCanvas({
  imageUrl,
  selectionMode,
  isSelecting,
  onSelectionComplete,
  onSelectionCancel,
}: SelectionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<number[][]>([])
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)

  const getCanvasCoordinates = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    }
  }, [])

  const drawSelection = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!isSelecting) return

    ctx.strokeStyle = "#ff0066"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])

    if (selectionMode === "pen" && currentPath.length > 1) {
      ctx.beginPath()
      ctx.moveTo(currentPath[0][0], currentPath[0][1])
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i][0], currentPath[i][1])
      }
      ctx.stroke()
    } else if (selectionMode === "rectangle" && startPoint && currentPath.length > 0) {
      const currentPoint = currentPath[currentPath.length - 1]
      const width = currentPoint[0] - startPoint.x
      const height = currentPoint[1] - startPoint.y
      ctx.strokeRect(startPoint.x, startPoint.y, width, height)
    } else if (selectionMode === "circle" && startPoint && currentPath.length > 0) {
      const currentPoint = currentPath[currentPath.length - 1]
      const radius = Math.sqrt(
        Math.pow(currentPoint[0] - startPoint.x, 2) + Math.pow(currentPoint[1] - startPoint.y, 2),
      )
      ctx.beginPath()
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI)
      ctx.stroke()
    }
  }, [isSelecting, selectionMode, currentPath, startPoint])

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting) return

      e.preventDefault()
      const coords = getCanvasCoordinates(e)
      setIsDrawing(true)
      setStartPoint(coords)
      setCurrentPath([[coords.x, coords.y]])
    },
    [isSelecting, getCanvasCoordinates],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting || !isDrawing) return

      e.preventDefault()
      const coords = getCanvasCoordinates(e)

      if (selectionMode === "pen") {
        setCurrentPath((prev) => [...prev, [coords.x, coords.y]])
      } else {
        setCurrentPath([[coords.x, coords.y]])
      }
    },
    [isSelecting, isDrawing, selectionMode, getCanvasCoordinates],
  )

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting || !isDrawing) return

      e.preventDefault()
      setIsDrawing(false)

      // Calculate bounds
      let minX = Number.POSITIVE_INFINITY,
        minY = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY

      if (selectionMode === "pen") {
        currentPath.forEach(([x, y]) => {
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        })
      } else if (startPoint && currentPath.length > 0) {
        const currentPoint = currentPath[currentPath.length - 1]
        if (selectionMode === "rectangle") {
          minX = Math.min(startPoint.x, currentPoint[0])
          minY = Math.min(startPoint.y, currentPoint[1])
          maxX = Math.max(startPoint.x, currentPoint[0])
          maxY = Math.max(startPoint.y, currentPoint[1])
        } else if (selectionMode === "circle") {
          const radius = Math.sqrt(
            Math.pow(currentPoint[0] - startPoint.x, 2) + Math.pow(currentPoint[1] - startPoint.y, 2),
          )
          minX = startPoint.x - radius
          minY = startPoint.y - radius
          maxX = startPoint.x + radius
          maxY = startPoint.y + radius
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
      }

      onSelectionComplete(selectionData)
    },
    [isSelecting, isDrawing, selectionMode, currentPath, startPoint, onSelectionComplete],
  )

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      handleMouseDown(e as any)
    },
    [handleMouseDown],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      handleMouseMove(e as any)
    },
    [handleMouseMove],
  )

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      handleMouseUp(e as any)
    },
    [handleMouseUp],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchmove", handleTouchMove)
    canvas.addEventListener("touchend", handleTouchEnd)

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd])

  useEffect(() => {
    drawSelection()
  }, [drawSelection])

  useEffect(() => {
    const image = imageRef.current
    const canvas = canvasRef.current
    if (!image || !canvas) return

    const updateCanvasSize = () => {
      canvas.width = image.offsetWidth
      canvas.height = image.offsetHeight
    }

    image.onload = updateCanvasSize
    window.addEventListener("resize", updateCanvasSize)
    updateCanvasSize()

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [imageUrl])

  // Reset selection when mode changes or selection is cancelled
  useEffect(() => {
    if (!isSelecting) {
      setCurrentPath([])
      setStartPoint(null)
      setIsDrawing(false)
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [isSelecting])

  return (
    <div className="relative inline-block">
      <img
        ref={imageRef}
        src={imageUrl || "/placeholder.svg"}
        alt="Image for selection"
        className="max-w-full max-h-full object-contain"
        draggable={false}
      />
      <canvas
        ref={canvasRef}
        className={`absolute top-0 left-0 pointer-events-${isSelecting ? "auto" : "none"}`}
        style={{
          cursor: isSelecting ? (selectionMode === "pen" ? "crosshair" : "crosshair") : "default",
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
  )
}
