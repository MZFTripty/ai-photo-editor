export interface EditRecord {
  id: string
  timestamp: Date
  command: string
  editType: string
  description: string
  parameters: Record<string, any>
  confidence: number
  userId?: string
  sessionId: string
}

export interface ImageProvenance {
  id: string
  originalImageHash: string
  originalImageName: string
  originalImageSize: number
  originalImageDimensions: { width: number; height: number }
  createdAt: Date
  editHistory: EditRecord[]
  currentVersion: number
  watermarkApplied: boolean
  verificationHash: string
}

export interface ProvenanceMetadata {
  source: "upload" | "generated" | "edited"
  tool: string
  version: string
  editCount: number
  lastModified: Date
  integrity: "verified" | "modified" | "unknown"
}

export class ProvenanceService {
  private static readonly SESSION_ID = Math.random().toString(36).substr(2, 9)

  static createImageProvenance(imageFile: File, imageDimensions: { width: number; height: number }): ImageProvenance {
    const imageHash = this.generateImageHash(imageFile)

    return {
      id: `prov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      originalImageHash: imageHash,
      originalImageName: imageFile.name,
      originalImageSize: imageFile.size,
      originalImageDimensions: imageDimensions,
      createdAt: new Date(),
      editHistory: [],
      currentVersion: 1,
      watermarkApplied: false,
      verificationHash: this.generateVerificationHash(imageHash, []),
    }
  }

  static addEditRecord(provenance: ImageProvenance, command: string, editInstructions: any[]): ImageProvenance {
    const editRecord: EditRecord = {
      id: `edit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      command,
      editType: editInstructions[0]?.type || "unknown",
      description: editInstructions.map((e) => e.description).join("; "),
      parameters: {
        instructions: editInstructions,
        confidence: editInstructions[0]?.confidence || 0,
      },
      confidence: editInstructions[0]?.confidence || 0,
      sessionId: this.SESSION_ID,
    }

    const updatedHistory = [...provenance.editHistory, editRecord]

    return {
      ...provenance,
      editHistory: updatedHistory,
      currentVersion: provenance.currentVersion + 1,
      verificationHash: this.generateVerificationHash(provenance.originalImageHash, updatedHistory),
    }
  }

  static generateWatermark(provenance: ImageProvenance): string {
    const watermarkData = {
      id: provenance.id,
      version: provenance.currentVersion,
      editCount: provenance.editHistory.length,
      hash: provenance.verificationHash.substr(0, 8),
    }

    return `LumenFrame-${watermarkData.hash}-v${watermarkData.version}`
  }

  static verifyIntegrity(provenance: ImageProvenance): boolean {
    const expectedHash = this.generateVerificationHash(provenance.originalImageHash, provenance.editHistory)

    return expectedHash === provenance.verificationHash
  }

  static getProvenanceMetadata(provenance: ImageProvenance): ProvenanceMetadata {
    return {
      source: provenance.editHistory.length === 0 ? "upload" : "edited",
      tool: "LumenFrame",
      version: "1.0.0",
      editCount: provenance.editHistory.length,
      lastModified:
        provenance.editHistory.length > 0
          ? provenance.editHistory[provenance.editHistory.length - 1].timestamp
          : provenance.createdAt,
      integrity: this.verifyIntegrity(provenance) ? "verified" : "modified",
    }
  }

  private static generateImageHash(file: File): string {
    // Simple hash based on file properties - in production, use actual image hashing
    const hashInput = `${file.name}-${file.size}-${file.lastModified}`
    return btoa(hashInput).substr(0, 16)
  }

  private static generateVerificationHash(imageHash: string, editHistory: EditRecord[]): string {
    const historyString = editHistory.map((edit) => `${edit.id}-${edit.timestamp.getTime()}-${edit.command}`).join("|")

    const combinedInput = `${imageHash}-${historyString}`
    return btoa(combinedInput).substr(0, 24)
  }

  static exportProvenance(provenance: ImageProvenance): string {
    return JSON.stringify(
      {
        ...provenance,
        exportedAt: new Date().toISOString(),
        tool: "LumenFrame v1.0.0",
      },
      null,
      2,
    )
  }

  static importProvenance(provenanceData: string): ImageProvenance | null {
    try {
      const parsed = JSON.parse(provenanceData)
      // Validate required fields
      if (!parsed.id || !parsed.originalImageHash || !parsed.editHistory) {
        return null
      }
      return parsed as ImageProvenance
    } catch {
      return null
    }
  }
}
