import { SafetyService, type SafetyResult } from "./safety-service"
import { ProvenanceService, type ImageProvenance } from "./provenance-service"
import type { ProcessedImage } from "./image-processing-service"

export interface BatchJob {
  id: string
  name: string
  command: string
  images: BatchImage[]
  status: "pending" | "running" | "completed" | "failed" | "cancelled"
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  progress: {
    total: number
    completed: number
    failed: number
    skipped: number
  }
  settings: BatchSettings
}

export interface BatchImage {
  id: string
  file: File
  url: string
  name: string
  status: "pending" | "processing" | "completed" | "failed" | "skipped"
  result?: ProcessedImage
  error?: string
  safetyResult?: SafetyResult
  provenance?: ImageProvenance
  processingTime?: number
}

export interface BatchSettings {
  continueOnError: boolean
  maxConcurrent: number
  priority: "low" | "normal" | "high"
  applyWatermark: boolean
  exportFormat: "original" | "png" | "jpg"
  quality: number
}

export interface BatchProgress {
  jobId: string
  currentImage: string
  progress: number
  eta: number
  throughput: number
}

export class BatchProcessingService {
  private static jobs: Map<string, BatchJob> = new Map()
  private static activeJobs: Set<string> = new Set()
  private static progressCallbacks: Map<string, (progress: BatchProgress) => void> = new Map()

  static createBatchJob(
    name: string,
    command: string,
    images: File[],
    settings: Partial<BatchSettings> = {},
  ): BatchJob {
    const jobId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const batchImages: BatchImage[] = images.map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      status: "pending",
    }))

    const defaultSettings: BatchSettings = {
      continueOnError: true,
      maxConcurrent: 3,
      priority: "normal",
      applyWatermark: false,
      exportFormat: "original",
      quality: 90,
    }

    const job: BatchJob = {
      id: jobId,
      name,
      command,
      images: batchImages,
      status: "pending",
      createdAt: new Date(),
      progress: {
        total: batchImages.length,
        completed: 0,
        failed: 0,
        skipped: 0,
      },
      settings: { ...defaultSettings, ...settings },
    }

    this.jobs.set(jobId, job)
    return job
  }

  static async startBatchJob(jobId: string, progressCallback?: (progress: BatchProgress) => void): Promise<void> {
    const job = this.jobs.get(jobId)
    if (!job || this.activeJobs.has(jobId)) {
      throw new Error("Job not found or already running")
    }

    if (progressCallback) {
      this.progressCallbacks.set(jobId, progressCallback)
    }

    this.activeJobs.add(jobId)
    job.status = "running"
    job.startedAt = new Date()

    try {
      await this.processBatchJob(job)
      job.status = "completed"
      job.completedAt = new Date()
    } catch (error) {
      job.status = "failed"
      console.error("[v0] Batch job failed:", error)
    } finally {
      this.activeJobs.delete(jobId)
      this.progressCallbacks.delete(jobId)
    }
  }

  private static async processBatchJob(job: BatchJob): Promise<void> {
    const { maxConcurrent } = job.settings
    const startTime = Date.now()
    let processedCount = 0

    // Process images in batches with concurrency control
    for (let i = 0; i < job.images.length; i += maxConcurrent) {
      const batch = job.images.slice(i, i + maxConcurrent)
      const promises = batch.map((image) => this.processImage(job, image))

      await Promise.allSettled(promises)

      // Update progress
      processedCount += batch.length
      const elapsed = Date.now() - startTime
      const throughput = processedCount / (elapsed / 1000)
      const remaining = job.images.length - processedCount
      const eta = remaining / throughput

      const progress: BatchProgress = {
        jobId: job.id,
        currentImage: batch[batch.length - 1]?.name || "",
        progress: (processedCount / job.images.length) * 100,
        eta: eta * 1000,
        throughput,
      }

      const callback = this.progressCallbacks.get(job.id)
      if (callback) {
        callback(progress)
      }

      // Update job progress
      job.progress.completed = job.images.filter((img) => img.status === "completed").length
      job.progress.failed = job.images.filter((img) => img.status === "failed").length
      job.progress.skipped = job.images.filter((img) => img.status === "skipped").length
    }
  }

  private static async processImage(job: BatchJob, image: BatchImage): Promise<void> {
    const startTime = Date.now()
    image.status = "processing"

    try {
      // Convert image to base64
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(image.file)
      })

      // Safety check
      const safetyResult = await SafetyService.validateCommand(job.command, imageData)
      image.safetyResult = safetyResult

      if (!safetyResult.passed) {
        image.status = "skipped"
        image.error = "Failed safety check"
        return
      }

      // Create provenance
      const provenance = ProvenanceService.createImageProvenance(image.file, {
        width: 1000,
        height: 1000,
      }) // Mock dimensions
      image.provenance = provenance

      // Process image (mock implementation)
      const processedImage = await this.mockProcessImage(image, job.command)
      image.result = processedImage
      image.status = "completed"
      image.processingTime = Date.now() - startTime
    } catch (error) {
      image.status = "failed"
      image.error = error instanceof Error ? error.message : "Processing failed"

      if (!job.settings.continueOnError) {
        throw error
      }
    }
  }

  private static async mockProcessImage(image: BatchImage, command: string): Promise<ProcessedImage> {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    return {
      id: `processed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      originalImageName: image.name,
      processedImageUrl: image.url, // In reality, this would be the processed image
      editType: "batch-edit",
      appliedEdits: [
        {
          type: "batch-edit",
          description: command,
          confidence: 0.9,
          parameters: {},
        },
      ],
      processingTime: 2000,
      timestamp: new Date(),
      metadata: {
        batchProcessed: true,
        originalSize: image.file.size,
        processedSize: image.file.size,
      },
    }
  }

  static getBatchJob(jobId: string): BatchJob | undefined {
    return this.jobs.get(jobId)
  }

  static getAllBatchJobs(): BatchJob[] {
    return Array.from(this.jobs.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  static cancelBatchJob(jobId: string): boolean {
    const job = this.jobs.get(jobId)
    if (!job || !this.activeJobs.has(jobId)) {
      return false
    }

    job.status = "cancelled"
    this.activeJobs.delete(jobId)
    this.progressCallbacks.delete(jobId)
    return true
  }

  static deleteBatchJob(jobId: string): boolean {
    if (this.activeJobs.has(jobId)) {
      return false // Cannot delete running job
    }

    return this.jobs.delete(jobId)
  }

  static exportBatchResults(jobId: string): string {
    const job = this.jobs.get(jobId)
    if (!job) {
      throw new Error("Job not found")
    }

    const results = {
      job: {
        id: job.id,
        name: job.name,
        command: job.command,
        status: job.status,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        progress: job.progress,
      },
      results: job.images.map((image) => ({
        name: image.name,
        status: image.status,
        processingTime: image.processingTime,
        error: image.error,
        result: image.result
          ? {
              editType: image.result.editType,
              appliedEdits: image.result.appliedEdits,
              processingTime: image.result.processingTime,
            }
          : null,
      })),
      exportedAt: new Date().toISOString(),
    }

    return JSON.stringify(results, null, 2)
  }

  static getJobStats(jobId: string) {
    const job = this.jobs.get(jobId)
    if (!job) return null

    const totalTime = job.completedAt && job.startedAt ? job.completedAt.getTime() - job.startedAt.getTime() : 0

    const avgProcessingTime =
      job.images.filter((img) => img.processingTime).reduce((sum, img) => sum + (img.processingTime || 0), 0) /
        job.progress.completed || 0

    return {
      totalImages: job.progress.total,
      completed: job.progress.completed,
      failed: job.progress.failed,
      skipped: job.progress.skipped,
      successRate: job.progress.total > 0 ? (job.progress.completed / job.progress.total) * 100 : 0,
      totalTime,
      avgProcessingTime,
    }
  }
}
