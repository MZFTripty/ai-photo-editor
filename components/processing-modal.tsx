"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { ImageProcessingService, type ProcessingProgress, type ProcessedImage } from "@/lib/image-processing-service"

interface ProcessingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (result: ProcessedImage) => void
  processingRequest: any
}

export default function ProcessingModal({ isOpen, onClose, onComplete, processingRequest }: ProcessingModalProps) {
  const [progress, setProgress] = useState<ProcessingProgress>({
    stage: "initializing",
    progress: 0,
    message: "Starting image processing...",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ProcessedImage | null>(null)

  useEffect(() => {
    if (isOpen && processingRequest && !isProcessing) {
      startProcessing()
    }
  }, [isOpen, processingRequest])

  const startProcessing = async () => {
    if (!processingRequest) return

    setIsProcessing(true)
    setError(null)
    setResult(null)

    try {
      const processedImage = await ImageProcessingService.processImage(processingRequest, (progressUpdate) => {
        setProgress(progressUpdate)
      })

      setResult(processedImage)
      onComplete(processedImage)
    } catch (err) {
      console.error("[v0] Processing error:", err)
      setError(err instanceof Error ? err.message : "Processing failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      onClose()
      // Reset state
      setProgress({
        stage: "initializing",
        progress: 0,
        message: "Starting image processing...",
      })
      setError(null)
      setResult(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : error ? (
              <AlertCircle className="w-5 h-5 text-destructive" />
            ) : result ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : null}

            {isProcessing
              ? "Processing Image"
              : error
                ? "Processing Failed"
                : result
                  ? "Processing Complete"
                  : "Processing Image"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">{progress.progress}%</span>
            </div>
            <Progress value={progress.progress} className="h-2" />
          </div>

          {/* Current Stage */}
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <span className="text-lg">{ImageProcessingService.getProcessingStageIcon(progress.stage)}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={ImageProcessingService.getProcessingStageColor(progress.stage)}>
                  {progress.stage}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{progress.message}</p>
            </div>
          </div>

          {/* Edit Instructions */}
          {processingRequest?.editInstructions && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Applying Edits:</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {processingRequest.editInstructions.map((instruction: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-xs p-2 bg-card rounded">
                    <span className="text-muted-foreground">{index + 1}.</span>
                    <span className="text-foreground">{instruction.description}</span>
                    <Badge variant="outline" className="ml-auto">
                      {instruction.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

          {/* Success Message */}
          {result && (
            <div className="p-3 bg-primary/10 text-primary rounded-lg text-sm">
              Image processed successfully! {result.appliedEdits.length} edits applied.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {error && (
              <Button onClick={startProcessing} className="flex-1">
                Try Again
              </Button>
            )}
            <Button
              variant={result ? "default" : "outline"}
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1"
            >
              {result ? "View Result" : isProcessing ? "Processing..." : "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
