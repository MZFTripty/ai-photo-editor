"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Shield, AlertTriangle, CheckCircle, ChevronDown, ChevronRight } from "lucide-react"
import { SafetyService, type SafetyResult, type SafetyCheck } from "@/lib/safety-service"

interface SafetyPanelProps {
  safetyResult: SafetyResult | null
  onRetry?: () => void
  className?: string
}

export default function SafetyPanel({ safetyResult, onRetry, className }: SafetyPanelProps) {
  const [expandedChecks, setExpandedChecks] = useState<Set<string>>(new Set())

  if (!safetyResult) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4" />
            Safety Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No safety analysis available</p>
        </CardContent>
      </Card>
    )
  }

  const toggleCheck = (checkId: string) => {
    const newExpanded = new Set(expandedChecks)
    if (newExpanded.has(checkId)) {
      newExpanded.delete(checkId)
    } else {
      newExpanded.add(checkId)
    }
    setExpandedChecks(newExpanded)
  }

  const criticalChecks = safetyResult.checks.filter((c) => c.severity === "critical")
  const highChecks = safetyResult.checks.filter((c) => c.severity === "high")
  const otherChecks = safetyResult.checks.filter((c) => c.severity !== "critical" && c.severity !== "high")

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {safetyResult.passed ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600" />
          )}
          Safety Analysis
          <Badge variant={safetyResult.passed ? "default" : "destructive"} className="ml-auto">
            {safetyResult.passed ? "Passed" : "Failed"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <Alert variant={safetyResult.passed ? "default" : "destructive"}>
          <AlertDescription>
            {safetyResult.passed
              ? "Your request passed all safety checks and can be processed."
              : "Your request has been flagged by our safety systems and cannot be processed."}
          </AlertDescription>
        </Alert>

        {/* Critical Issues */}
        {criticalChecks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Critical Issues ({criticalChecks.length})
            </h4>
            {criticalChecks.map((check) => (
              <SafetyCheckItem
                key={check.id}
                check={check}
                isExpanded={expandedChecks.has(check.id)}
                onToggle={() => toggleCheck(check.id)}
              />
            ))}
          </div>
        )}

        {/* High Priority Issues */}
        {highChecks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-orange-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              High Priority Issues ({highChecks.length})
            </h4>
            {highChecks.map((check) => (
              <SafetyCheckItem
                key={check.id}
                check={check}
                isExpanded={expandedChecks.has(check.id)}
                onToggle={() => toggleCheck(check.id)}
              />
            ))}
          </div>
        )}

        {/* Other Checks */}
        {otherChecks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Other Checks ({otherChecks.length})</h4>
            {otherChecks.map((check) => (
              <SafetyCheckItem
                key={check.id}
                check={check}
                isExpanded={expandedChecks.has(check.id)}
                onToggle={() => toggleCheck(check.id)}
              />
            ))}
          </div>
        )}

        {/* Content Analysis */}
        {safetyResult.contentAnalysis && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Content Analysis</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(safetyResult.contentAnalysis.categories).map(([category, score]) => (
                <div key={category} className="flex justify-between p-2 bg-muted rounded">
                  <span className="capitalize">{category}</span>
                  <span className={score > 0.5 ? "text-red-600" : "text-green-600"}>{Math.round(score * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {safetyResult.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Recommendations</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {safetyResult.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        {!safetyResult.passed && onRetry && (
          <div className="pt-2">
            <Button onClick={onRetry} variant="outline" size="sm" className="w-full bg-transparent">
              Modify Request
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SafetyCheckItem({
  check,
  isExpanded,
  onToggle,
}: {
  check: SafetyCheck
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded hover:bg-muted transition-colors">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-lg">{SafetyService.getSeverityIcon(check.severity)}</span>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={SafetyService.getSeverityColor(check.severity)}>
                {check.severity}
              </Badge>
              <Badge variant="secondary">{check.type}</Badge>
            </div>
            <p className="text-sm text-foreground mt-1">{check.message}</p>
          </div>
          {check.blocked && (
            <Badge variant="destructive" className="ml-auto">
              Blocked
            </Badge>
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-3 ml-6 bg-card border-l-2 border-muted">
          {check.details && <p className="text-sm text-muted-foreground mb-2">{check.details}</p>}
          <p className="text-xs text-muted-foreground">Detected at {check.timestamp.toLocaleTimeString()}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
