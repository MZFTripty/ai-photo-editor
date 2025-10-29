"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileImage, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onImageUpload: (files: File[]) => void
  compact?: boolean
  maxFiles?: number
  maxSize?: number // in MB
}

export function ImageUpload({ onImageUpload, compact = false, maxFiles = 10, maxSize = 10 }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = []
    const errors: string[] = []

    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`)
      return { valid, errors }
    }

    files.forEach((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name} is not an image file`)
        return
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} is larger than ${maxSize}MB`)
        return
      }

      valid.push(file)
    })

    return { valid, errors }
  }

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const fileArray = Array.from(files)
      const { valid, errors } = validateFiles(fileArray)

      if (errors.length > 0) {
        setError(errors[0])
        setTimeout(() => setError(null), 5000)
        return
      }

      if (valid.length > 0) {
        setError(null)
        onImageUpload(valid)
      }
    },
    [onImageUpload, maxFiles, maxSize],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
      // Reset input value to allow uploading the same file again
      e.target.value = ""
    },
    [handleFiles],
  )

  if (compact) {
    return (
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-transparent"
          onClick={() => document.getElementById("file-upload-compact")?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Add More Images
        </Button>
        <input
          id="file-upload-compact"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="border-dashed border-2 transition-colors">
      <CardContent className="p-8">
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center space-y-4 transition-colors rounded-lg p-8",
            isDragOver && "bg-accent/10 border-accent",
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
              isDragOver ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            <FileImage className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">
              {isDragOver ? "Drop your images here" : "Upload Images"}
            </h3>
            <p className="text-sm text-muted-foreground">Drag and drop your images here, or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, WebP up to {maxSize}MB each (max {maxFiles} files)
            </p>
          </div>

          <Button onClick={() => document.getElementById("file-upload")?.click()} className="mt-4">
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>

          <input id="file-upload" type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" />
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
