"use client";

import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({
  isVisible,
  message = "Processing...",
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto">
      <div className="bg-card/95 rounded-xl p-8 shadow-2xl flex flex-col items-center gap-4 animate-in fade-in duration-300">
        <div className="relative w-12 h-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">{message}</p>
          <p className="text-sm text-muted-foreground mt-2">
            take some time for processing...
          </p>
        </div>
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-pulse rounded-full w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
