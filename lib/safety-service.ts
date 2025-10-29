export interface SafetyCheck {
  id: string
  type: "content" | "policy" | "technical"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  details?: string
  blocked: boolean
  timestamp: Date
}

export interface ContentAnalysis {
  isAppropriate: boolean
  confidence: number
  flags: string[]
  categories: {
    adult: number
    violence: number
    medical: number
    racy: number
    spoof: number
  }
}

export interface SafetyResult {
  passed: boolean
  checks: SafetyCheck[]
  contentAnalysis?: ContentAnalysis
  recommendations: string[]
}

export class SafetyService {
  private static readonly BLOCKED_KEYWORDS = ["violence", "weapon", "drug", "explicit", "inappropriate"]

  private static readonly POLICY_VIOLATIONS = ["deepfake", "impersonation", "misleading", "harmful"]

  static async validateCommand(command: string, imageData?: string): Promise<SafetyResult> {
    const checks: SafetyCheck[] = []
    const recommendations: string[] = []

    // Content policy check
    const contentCheck = this.checkContentPolicy(command)
    if (contentCheck) checks.push(contentCheck)

    // Technical safety check
    const technicalCheck = this.checkTechnicalSafety(command)
    if (technicalCheck) checks.push(technicalCheck)

    // Image content analysis (if image provided)
    let contentAnalysis: ContentAnalysis | undefined
    if (imageData) {
      contentAnalysis = await this.analyzeImageContent(imageData)
      if (!contentAnalysis.isAppropriate) {
        checks.push({
          id: `content-${Date.now()}`,
          type: "content",
          severity: "high",
          message: "Image content may violate safety policies",
          details: `Detected flags: ${contentAnalysis.flags.join(", ")}`,
          blocked: true,
          timestamp: new Date(),
        })
      }
    }

    // Generate recommendations
    if (checks.some((c) => c.severity === "high" || c.severity === "critical")) {
      recommendations.push("Consider rephrasing your request to avoid policy violations")
    }
    if (checks.some((c) => c.type === "technical")) {
      recommendations.push("Ensure your edit request is technically feasible")
    }

    const passed = !checks.some((c) => c.blocked)

    return {
      passed,
      checks,
      contentAnalysis,
      recommendations,
    }
  }

  private static checkContentPolicy(command: string): SafetyCheck | null {
    const lowerCommand = command.toLowerCase()

    for (const keyword of this.BLOCKED_KEYWORDS) {
      if (lowerCommand.includes(keyword)) {
        return {
          id: `policy-${Date.now()}`,
          type: "policy",
          severity: "high",
          message: `Command contains potentially inappropriate content: "${keyword}"`,
          details: "This type of edit may violate our content policy",
          blocked: true,
          timestamp: new Date(),
        }
      }
    }

    for (const violation of this.POLICY_VIOLATIONS) {
      if (lowerCommand.includes(violation)) {
        return {
          id: `policy-${Date.now()}`,
          type: "policy",
          severity: "critical",
          message: `Command may create ${violation} content`,
          details: "This edit type is not permitted under our safety guidelines",
          blocked: true,
          timestamp: new Date(),
        }
      }
    }

    return null
  }

  private static checkTechnicalSafety(command: string): SafetyCheck | null {
    const lowerCommand = command.toLowerCase()

    // Check for potentially destructive operations
    if (lowerCommand.includes("delete all") || lowerCommand.includes("remove everything")) {
      return {
        id: `technical-${Date.now()}`,
        type: "technical",
        severity: "medium",
        message: "Command requests destructive operation",
        details: "This operation cannot be easily undone",
        blocked: false,
        timestamp: new Date(),
      }
    }

    return null
  }

  private static async analyzeImageContent(imageData: string): Promise<ContentAnalysis> {
    // Simulate content analysis - in production, this would use actual ML models
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock analysis based on image characteristics
    const mockAnalysis: ContentAnalysis = {
      isAppropriate: true,
      confidence: 0.95,
      flags: [],
      categories: {
        adult: 0.1,
        violence: 0.05,
        medical: 0.2,
        racy: 0.1,
        spoof: 0.05,
      },
    }

    // Simulate some basic checks
    if (Math.random() < 0.1) {
      // 10% chance of flagging for demo
      mockAnalysis.isAppropriate = false
      mockAnalysis.flags = ["potentially-inappropriate"]
      mockAnalysis.categories.adult = 0.8
    }

    return mockAnalysis
  }

  static getSeverityColor(severity: SafetyCheck["severity"]): string {
    switch (severity) {
      case "low":
        return "text-blue-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-orange-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  static getSeverityIcon(severity: SafetyCheck["severity"]): string {
    switch (severity) {
      case "low":
        return "ℹ️"
      case "medium":
        return "⚠️"
      case "high":
        return "🚨"
      case "critical":
        return "🛑"
      default:
        return "❓"
    }
  }
}
