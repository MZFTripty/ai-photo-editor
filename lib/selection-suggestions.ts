/**
 * Selection Command Suggestions
 * Provides smart command suggestions based on selection type and common editing tasks
 */

export interface SelectionCommandSuggestion {
  label: string;
  command: string;
  icon: string;
  category: "quick" | "smart" | "advanced";
  description: string;
  keywords: string[];
}

export interface SelectionContext {
  selectionType: "pen" | "rectangle" | "circle";
  area?: number;
  selectionCategory?: string;
}

// Quick suggestions for all selections
const quickSuggestions: SelectionCommandSuggestion[] = [
  {
    label: "Remove",
    command: "remove this area",
    icon: "🗑️",
    category: "quick",
    description: "Delete or remove the selected area",
    keywords: ["delete", "remove", "erase"],
  },
  {
    label: "Brighten",
    command: "brighten this area",
    icon: "☀️",
    category: "quick",
    description: "Increase brightness in the selection",
    keywords: ["bright", "lighten", "light"],
  },
  {
    label: "Darken",
    command: "darken this area",
    icon: "🌙",
    category: "quick",
    description: "Decrease brightness in the selection",
    keywords: ["dark", "shadow", "darken"],
  },
  {
    label: "Blur",
    command: "apply blur to this area",
    icon: "💨",
    category: "quick",
    description: "Apply blur effect to hide details",
    keywords: ["blur", "blurry", "smooth"],
  },
  {
    label: "Enhance",
    command: "enhance and sharpen this area",
    icon: "✨",
    category: "quick",
    description: "Increase sharpness and clarity",
    keywords: ["enhance", "sharpen", "clear"],
  },
  {
    label: "Smooth",
    command: "smooth and soften this area",
    icon: "🧴",
    category: "quick",
    description: "Soften edges and reduce harshness",
    keywords: ["smooth", "soft", "soften"],
  },
  {
    label: "Color Pop",
    command: "increase saturation in this area",
    icon: "🎨",
    category: "quick",
    description: "Make colors more vibrant",
    keywords: ["vibrant", "saturate", "color"],
  },
  {
    label: "B&W",
    command: "convert this area to black and white",
    icon: "⚪",
    category: "quick",
    description: "Remove color from selection",
    keywords: ["grayscale", "bw", "black"],
  },
];

// Smart suggestions based on selection type
const smartSuggestions: Record<string, SelectionCommandSuggestion[]> = {
  face: [
    {
      label: "Beautify",
      command: "smooth skin and reduce wrinkles in this face",
      icon: "💄",
      category: "smart",
      description: "Professional face enhancement",
      keywords: ["face", "skin", "beautify"],
    },
    {
      label: "Brighten Eyes",
      command: "brighten and enhance the eyes",
      icon: "👀",
      category: "smart",
      description: "Make eyes pop",
      keywords: ["eyes", "bright"],
    },
    {
      label: "Enhance Smile",
      command: "brighten and enhance the smile area",
      icon: "😊",
      category: "smart",
      description: "Make smile more visible",
      keywords: ["smile", "mouth"],
    },
  ],
  sky: [
    {
      label: "Dramatic Sky",
      command: "make the sky more dramatic with vibrant colors",
      icon: "🌅",
      category: "smart",
      description: "Enhanced sky with better colors",
      keywords: ["sky", "cloud"],
    },
    {
      label: "Sunset",
      command: "apply warm sunset colors to the sky",
      icon: "🌄",
      category: "smart",
      description: "Warm sunset effect",
      keywords: ["sunset", "warm"],
    },
    {
      label: "Clear Sky",
      command: "make the sky clearer and more blue",
      icon: "☁️",
      category: "smart",
      description: "Clear, bright sky",
      keywords: ["clear", "blue"],
    },
  ],
  water: [
    {
      label: "Enhance Water",
      command: "enhance water clarity and color",
      icon: "💧",
      category: "smart",
      description: "More vivid water appearance",
      keywords: ["water", "ocean", "sea"],
    },
    {
      label: "Ripple Effect",
      command: "add subtle ripple effect to the water",
      icon: "🌊",
      category: "smart",
      description: "Add water ripples",
      keywords: ["ripple", "wave"],
    },
  ],
  background: [
    {
      label: "Blur Background",
      command: "apply strong blur to soften the background",
      icon: "🎬",
      category: "smart",
      description: "Professional bokeh effect",
      keywords: ["background", "blur"],
    },
    {
      label: "Fade Background",
      command: "fade and desaturate the background",
      icon: "👻",
      category: "smart",
      description: "Push background back",
      keywords: ["fade", "background"],
    },
  ],
  text: [
    {
      label: "Remove Text",
      command: "remove text while preserving background",
      icon: "🅰️",
      category: "smart",
      description: "Clean text removal",
      keywords: ["text", "remove"],
    },
    {
      label: "Enhance Text",
      command: "enhance text sharpness and contrast",
      icon: "🔤",
      category: "smart",
      description: "Make text more readable",
      keywords: ["text", "sharp"],
    },
  ],
  object: [
    {
      label: "Isolate Object",
      command: "enhance the object and blur surroundings",
      icon: "🎯",
      category: "smart",
      description: "Make object stand out",
      keywords: ["object", "isolate"],
    },
    {
      label: "Color Correct",
      command: "correct color balance of the object",
      icon: "🎨",
      category: "smart",
      description: "Better color accuracy",
      keywords: ["color", "object"],
    },
  ],
};

// Advanced suggestions for fine control
const advancedSuggestions: SelectionCommandSuggestion[] = [
  {
    label: "Custom Blend",
    command: "apply custom blend mode to this area",
    icon: "🔀",
    category: "advanced",
    description: "Blend mode control",
    keywords: ["blend", "mode"],
  },
  {
    label: "Tone Mapping",
    command: "apply tone mapping to enhance details",
    icon: "📊",
    category: "advanced",
    description: "HDR-like effect",
    keywords: ["tone", "mapping"],
  },
  {
    label: "Local Contrast",
    command: "increase local contrast in this area",
    icon: "📈",
    category: "advanced",
    description: "Clarity and micro-contrast",
    keywords: ["contrast", "clarity"],
  },
  {
    label: "Frequency Separation",
    command: "apply frequency separation to separate color and texture",
    icon: "🔊",
    category: "advanced",
    description: "Advanced texture editing",
    keywords: ["frequency", "texture"],
  },
];

/**
 * Get smart command suggestions based on detected object in selection
 */
export function getSmartSuggestions(
  detectedObject: string
): SelectionCommandSuggestion[] {
  const normalized = detectedObject.toLowerCase();

  for (const [key, suggestions] of Object.entries(smartSuggestions)) {
    if (normalized.includes(key) || normalized.includes(key)) {
      return suggestions;
    }
  }

  return [];
}

/**
 * Get all available suggestions for current selection context
 */
export function getAllSuggestions(
  context: SelectionContext
): SelectionCommandSuggestion[] {
  const suggestions: SelectionCommandSuggestion[] = [...quickSuggestions];

  // Add smart suggestions based on category
  if (context.selectionCategory) {
    suggestions.push(...getSmartSuggestions(context.selectionCategory));
  }

  // Add advanced suggestions for larger selections
  if (context.area && context.area > 10000) {
    suggestions.push(...advancedSuggestions.slice(0, 2));
  }

  return suggestions;
}

/**
 * Format command suggestion for display
 */
export function formatSuggestion(
  suggestion: SelectionCommandSuggestion
): string {
  return `${suggestion.icon} ${suggestion.label}`;
}

/**
 * Get suggestion command text
 */
export function getSuggestionCommand(
  suggestion: SelectionCommandSuggestion
): string {
  return suggestion.command;
}

/**
 * Categorize selection by detected objects
 */
export function categorizeSelection(description: string): string {
  const keywords: Record<string, string> = {
    "face|person|portrait|head|eyes|smile": "face",
    "sky|cloud|sunset|sunrise": "sky",
    "water|ocean|sea|lake|river": "water",
    "background|background": "background",
    "text|sign|label|word": "text",
    "object|item|thing": "object",
  };

  const desc = description.toLowerCase();

  for (const [pattern, category] of Object.entries(keywords)) {
    if (new RegExp(pattern).test(desc)) {
      return category;
    }
  }

  return "object";
}

/**
 * Calculate selection statistics
 */
export function calculateSelectionStats(bounds: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return {
    area: bounds.width * bounds.height,
    perimeter: 2 * (bounds.width + bounds.height),
    width: bounds.width,
    height: bounds.height,
    aspectRatio: bounds.width / bounds.height,
  };
}

/**
 * Get selection tips based on selection type and size
 */
export function getSelectionTips(
  mode: "pen" | "rectangle" | "circle",
  area?: number
): string[] {
  const tips: string[] = [];

  if (mode === "pen") {
    tips.push("✏️ Draw carefully for precise selections");
    tips.push("Double-click to finish your path");
    tips.push("Press Enter to confirm selection");
  } else if (mode === "rectangle") {
    tips.push("⬜ Drag to create rectangular selection");
    tips.push("Adjust corners for precise framing");
  } else if (mode === "circle") {
    tips.push("⭕ Drag from center to create circular selection");
    tips.push("Perfect for round objects like faces");
  }

  if (area && area < 1000) {
    tips.push("💡 Selection is very small - may have limited effect");
  } else if (area && area > 100000) {
    tips.push("💡 Large selection selected - may take longer to process");
  }

  return tips;
}

/**
 * Common editing workflows
 */
export const commonWorkflows = [
  {
    name: "Portrait Enhancement",
    steps: [
      "1. Select face with Circle mode",
      "2. Use 'Beautify' or custom command",
      "3. Select eyes separately for enhancement",
    ],
  },
  {
    name: "Background Blur",
    steps: [
      "1. Select subject with Pen mode",
      "2. Use 'Blur Background' or invert selection",
      "3. Apply blur to background",
    ],
  },
  {
    name: "Object Removal",
    steps: [
      "1. Select unwanted object with Pen/Rectangle",
      "2. Use 'Remove' command",
      "3. AI fills in background naturally",
    ],
  },
  {
    name: "Sky Enhancement",
    steps: [
      "1. Select sky area with Rectangle/Pen",
      "2. Choose 'Dramatic Sky' or 'Sunset'",
      "3. Adjust colors if needed",
    ],
  },
];
