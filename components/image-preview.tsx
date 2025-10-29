"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ZoomIn, ZoomOut, RotateCw, Download, Info, Maximize2 } from "lucide-react"

interface UploadedImage {
  id: string
  file: File
  url: string
  name: string
  size: number
  type: string
  dimensions?: { width: number; height: number }
}

interface ImagePreviewProps {
  image: UploadedImage
}

export function ImagePreview({ image }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.src = image.url
  }, [image.url])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 5))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.1))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-border bg-card/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground truncate max-w-xs">{image.name}</h3>
            <Badge variant="secondary">{image.type.split("/")[1].toUpperCase()}</Badge>
            {dimensions && (
              <Badge variant="outline">
                {dimensions.width} × {dimensions.height}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowInfo(!showInfo)}>
              <Info className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-16 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Image Display */}
        <div className="flex-1 bg-muted/20 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              className="transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.name}
                className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
                style={{
                  maxWidth: "calc(100vw - 400px)",
                  maxHeight: "calc(100vh - 200px)",
                }}
              />
            </div>
          </div>

          {/* Zoom indicator */}
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {Math.round(zoom * 100)}%
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="w-80 border-l border-border bg-card/30">
            <Card className="h-full rounded-none border-0">
              <CardHeader>
                <CardTitle className="text-lg">Image Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">File Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="text-foreground truncate ml-2">{image.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="text-foreground">{formatFileSize(image.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="text-foreground">{image.type}</span>
                    </div>
                    {dimensions && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dimensions:</span>
                        <span className="text-foreground">
                          {dimensions.width} × {dimensions.height}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-foreground mb-2">Edit History</h4>
                  <p className="text-sm text-muted-foreground">No edits applied yet</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-foreground mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <Maximize2 className="w-4 h-4 mr-2" />
                      View Full Size
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Download Original
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
