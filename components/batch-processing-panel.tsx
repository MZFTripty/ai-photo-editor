"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Square, Download, Trash2, Clock, CheckCircle, XCircle, AlertCircle, Layers } from "lucide-react"
import {
  BatchProcessingService,
  type BatchJob,
  type BatchSettings,
  type BatchProgress,
} from "@/lib/batch-processing-service"

interface BatchProcessingPanelProps {
  images: File[]
  onCreateJob?: (job: BatchJob) => void
  className?: string
}

export default function BatchProcessingPanel({ images, onCreateJob, className }: BatchProcessingPanelProps) {
  const [jobs, setJobs] = useState<BatchJob[]>([])
  const [activeJob, setActiveJob] = useState<BatchJob | null>(null)
  const [progress, setProgress] = useState<BatchProgress | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newJobName, setNewJobName] = useState("")
  const [newJobCommand, setNewJobCommand] = useState("")
  const [newJobSettings, setNewJobSettings] = useState<Partial<BatchSettings>>({
    continueOnError: true,
    maxConcurrent: 3,
    priority: "normal",
    applyWatermark: false,
    exportFormat: "original",
    quality: 90,
  })

  useEffect(() => {
    // Load existing jobs
    setJobs(BatchProcessingService.getAllBatchJobs())
  }, [])

  const handleCreateJob = () => {
    if (!newJobName.trim() || !newJobCommand.trim() || images.length === 0) {
      return
    }

    const job = BatchProcessingService.createBatchJob(newJobName.trim(), newJobCommand.trim(), images, newJobSettings)

    setJobs(BatchProcessingService.getAllBatchJobs())
    setIsCreateDialogOpen(false)
    setNewJobName("")
    setNewJobCommand("")

    if (onCreateJob) {
      onCreateJob(job)
    }
  }

  const handleStartJob = async (jobId: string) => {
    const job = BatchProcessingService.getBatchJob(jobId)
    if (!job) return

    setActiveJob(job)

    try {
      await BatchProcessingService.startBatchJob(jobId, (progressUpdate) => {
        setProgress(progressUpdate)
      })
    } catch (error) {
      console.error("[v0] Failed to start batch job:", error)
    } finally {
      setActiveJob(null)
      setProgress(null)
      setJobs(BatchProcessingService.getAllBatchJobs())
    }
  }

  const handleCancelJob = (jobId: string) => {
    BatchProcessingService.cancelBatchJob(jobId)
    setActiveJob(null)
    setProgress(null)
    setJobs(BatchProcessingService.getAllBatchJobs())
  }

  const handleDeleteJob = (jobId: string) => {
    BatchProcessingService.deleteBatchJob(jobId)
    setJobs(BatchProcessingService.getAllBatchJobs())
  }

  const handleExportResults = (jobId: string) => {
    try {
      const results = BatchProcessingService.exportBatchResults(jobId)
      const blob = new Blob([results], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `batch-results-${jobId}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Failed to export results:", error)
    }
  }

  const getStatusIcon = (status: BatchJob["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-muted-foreground" />
      case "running":
        return <Play className="w-4 h-4 text-blue-600 animate-pulse" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "cancelled":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: BatchJob["status"]) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "running":
        return "default"
      case "completed":
        return "default"
      case "failed":
        return "destructive"
      case "cancelled":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Batch Processing
          <Badge variant="outline" className="ml-auto">
            {jobs.length} Jobs
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No batch jobs created yet</p>
                <p className="text-sm text-muted-foreground">Create a job to process multiple images at once</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs?.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isActive={activeJob?.id === job.id}
                    progress={progress}
                    onStart={() => handleStartJob(job.id)}
                    onCancel={() => handleCancelJob(job.id)}
                    onDelete={() => handleDeleteJob(job.id)}
                    onExport={() => handleExportResults(job.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-name">Job Name</Label>
                <Input
                  id="job-name"
                  placeholder="e.g., Remove backgrounds from product photos"
                  value={newJobName}
                  onChange={(e) => setNewJobName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-command">Edit Command</Label>
                <Input
                  id="job-command"
                  placeholder="e.g., Remove the background and make it transparent"
                  value={newJobCommand}
                  onChange={(e) => setNewJobCommand(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Concurrent</Label>
                  <Select
                    value={newJobSettings.maxConcurrent?.toString()}
                    onValueChange={(value) =>
                      setNewJobSettings({ ...newJobSettings, maxConcurrent: Number.parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 image</SelectItem>
                      <SelectItem value="2">2 images</SelectItem>
                      <SelectItem value="3">3 images</SelectItem>
                      <SelectItem value="5">5 images</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newJobSettings.priority}
                    onValueChange={(value: "low" | "normal" | "high") =>
                      setNewJobSettings({ ...newJobSettings, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="continue-on-error"
                  checked={newJobSettings.continueOnError}
                  onCheckedChange={(checked : any) => setNewJobSettings({ ...newJobSettings, continueOnError: checked })}
                />
                <Label htmlFor="continue-on-error">Continue processing if an image fails</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="apply-watermark"
                  checked={newJobSettings.applyWatermark}
                  onCheckedChange={(checked : any) => setNewJobSettings({ ...newJobSettings, applyWatermark: checked })}
                />
                <Label htmlFor="apply-watermark">Apply watermark to processed images</Label>
              </div>

              <Button
                onClick={handleCreateJob}
                disabled={!newJobName.trim() || !newJobCommand.trim() || images.length === 0}
                className="w-full"
              >
                Create Batch Job ({images.length} images)
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function JobCard({
  job,
  isActive,
  progress,
  onStart,
  onCancel,
  onDelete,
  onExport,
}: {
  job: BatchJob
  isActive: boolean
  progress: BatchProgress | null
  onStart: () => void
  onCancel: () => void
  onDelete: () => void
  onExport: () => void
}) {
  const stats = BatchProcessingService.getJobStats(job.id)

  return (
    <Card className={`${isActive ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getStatusIcon(job.status)}
              <h4 className="font-medium text-sm">{job.name}</h4>
              <Badge variant={getStatusColor(job.status) as any} className="text-xs">
                {job.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{job.command}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{job.images.length} images</span>
              <span>Created {job.createdAt.toLocaleDateString()}</span>
              {stats && <span>{Math.round(stats.successRate)}% success rate</span>}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {(job.status === "running" || job.status === "completed") && (
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>
                {job.progress.completed + job.progress.failed + job.progress.skipped} / {job.progress.total}
              </span>
            </div>
            <Progress
              value={((job.progress.completed + job.progress.failed + job.progress.skipped) / job.progress.total) * 100}
              className="h-2"
            />
            {isActive && progress && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Processing: {progress.currentImage}</span>
                <span>ETA: {Math.round(progress.eta / 1000)}s</span>
              </div>
            )}
          </div>
        )}

        {/* Status Breakdown */}
        {job.status !== "pending" && (
          <div className="flex gap-2 mb-3">
            {job.progress.completed > 0 && (
              <Badge variant="outline" className="text-xs text-green-600">
                ✓ {job.progress.completed}
              </Badge>
            )}
            {job.progress.failed > 0 && (
              <Badge variant="outline" className="text-xs text-red-600">
                ✗ {job.progress.failed}
              </Badge>
            )}
            {job.progress.skipped > 0 && (
              <Badge variant="outline" className="text-xs text-yellow-600">
                ⊘ {job.progress.skipped}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {job.status === "pending" && (
            <Button size="sm" onClick={onStart} className="flex-1">
              <Play className="w-3 h-3 mr-1" />
              Start
            </Button>
          )}
          {job.status === "running" && (
            <Button size="sm" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              <Square className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          )}
          {job.status === "completed" && (
            <Button size="sm" variant="outline" onClick={onExport} className="flex-1 bg-transparent">
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          )}
          {(job.status === "completed" || job.status === "failed" || job.status === "cancelled") && (
            <Button size="sm" variant="outline" onClick={onDelete}>
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function getStatusIcon(status: BatchJob["status"]) {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4 text-muted-foreground" />
    case "running":
      return <Play className="w-4 h-4 text-blue-600 animate-pulse" />
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case "failed":
      return <XCircle className="w-4 h-4 text-red-600" />
    case "cancelled":
      return <AlertCircle className="w-4 h-4 text-yellow-600" />
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />
  }
}

function getStatusColor(status: BatchJob["status"]) {
  switch (status) {
    case "pending":
      return "secondary"
    case "running":
      return "default"
    case "completed":
      return "default"
    case "failed":
      return "destructive"
    case "cancelled":
      return "outline"
    default:
      return "secondary"
  }
}
