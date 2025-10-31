/**
 * Command Parser - Converts natural language commands to image adjustments
 */

export interface ParsedCommand {
  type: string;
  params: Record<string, any>;
  confidence: number;
}

/**
 * Parse natural language commands to image edit operations
 */
export function parseCommand(command: string): ParsedCommand | null {
  const lowerCommand = command.toLowerCase().trim();

  // Brightness adjustments
  if (
    lowerCommand.includes("brighten") ||
    lowerCommand.includes("make it brighter") ||
    lowerCommand.includes("increase brightness")
  ) {
    return {
      type: "basic-adjustments",
      params: {
        brightness: 30,
        contrast: 0,
        exposure: 0,
        highlights: 0,
        shadows: 0,
      },
      confidence: 0.95,
    };
  }

  if (
    lowerCommand.includes("darken") ||
    lowerCommand.includes("make it darker") ||
    lowerCommand.includes("decrease brightness")
  ) {
    return {
      type: "basic-adjustments",
      params: {
        brightness: -30,
        contrast: 0,
        exposure: 0,
        highlights: 0,
        shadows: 0,
      },
      confidence: 0.95,
    };
  }

  // Sky adjustments
  if (
    lowerCommand.includes("sunny") ||
    lowerCommand.includes("make the sky sunny")
  ) {
    return {
      type: "basic-adjustments",
      params: {
        brightness: 15,
        contrast: 20,
        exposure: 10,
        highlights: 15,
        shadows: 5,
        saturation: 25,
        vibrance: 15,
      },
      confidence: 0.85,
    };
  }

  // Contrast adjustments
  if (
    lowerCommand.includes("increase contrast") ||
    lowerCommand.includes("more contrast")
  ) {
    return {
      type: "basic-adjustments",
      params: {
        brightness: 0,
        contrast: 30,
        exposure: 0,
        highlights: 0,
        shadows: 0,
      },
      confidence: 0.9,
    };
  }

  if (
    lowerCommand.includes("decrease contrast") ||
    lowerCommand.includes("less contrast") ||
    lowerCommand.includes("soft")
  ) {
    return {
      type: "basic-adjustments",
      params: {
        brightness: 0,
        contrast: -20,
        exposure: 0,
        highlights: 0,
        shadows: 0,
      },
      confidence: 0.9,
    };
  }

  // Exposure adjustments
  if (
    lowerCommand.includes("increase exposure") ||
    lowerCommand.includes("overexposed") ||
    lowerCommand.includes("more exposure")
  ) {
    return {
      type: "basic-adjustments",
      params: {
        brightness: 0,
        contrast: 0,
        exposure: 25,
        highlights: 15,
        shadows: 0,
      },
      confidence: 0.9,
    };
  }

  if (
    lowerCommand.includes("decrease exposure") ||
    lowerCommand.includes("underexposed") ||
    lowerCommand.includes("less exposure")
  ) {
    return {
      type: "basic-adjustments",
      params: {
        brightness: 0,
        contrast: 0,
        exposure: -25,
        highlights: 0,
        shadows: -15,
      },
      confidence: 0.9,
    };
  }

  // Highlights and Shadows
  if (
    lowerCommand.includes("boost highlights") ||
    lowerCommand.includes("enhance highlights")
  ) {
    return {
      type: "basic-adjustments",
      params: {
        brightness: 0,
        contrast: 0,
        exposure: 0,
        highlights: 30,
        shadows: 0,
      },
      confidence: 0.85,
    };
  }

  if (
    lowerCommand.includes("darken shadows") ||
    lowerCommand.includes("boost shadows")
  ) {
    return {
      type: "basic-adjustments",
      params: {
        brightness: 0,
        contrast: 0,
        exposure: 0,
        highlights: 0,
        shadows: 30,
      },
      confidence: 0.85,
    };
  }

  // Color adjustments
  if (
    lowerCommand.includes("vibrant") ||
    lowerCommand.includes("more vibrant") ||
    lowerCommand.includes("increase saturation")
  ) {
    return {
      type: "color-adjustments",
      params: { saturation: 40, vibrance: 30, hue: 0, temperature: 0, tint: 0 },
      confidence: 0.9,
    };
  }

  if (
    lowerCommand.includes("less saturated") ||
    lowerCommand.includes("muted") ||
    lowerCommand.includes("desaturate")
  ) {
    return {
      type: "color-adjustments",
      params: {
        saturation: -40,
        vibrance: -20,
        hue: 0,
        temperature: 0,
        tint: 0,
      },
      confidence: 0.9,
    };
  }

  // Warm/Cool tones
  if (
    lowerCommand.includes("warm") ||
    lowerCommand.includes("warmer") ||
    lowerCommand.includes("golden hour") ||
    lowerCommand.includes("increase temperature")
  ) {
    return {
      type: "color-adjustments",
      params: { saturation: 0, vibrance: 0, hue: 0, temperature: 40, tint: 10 },
      confidence: 0.9,
    };
  }

  if (
    lowerCommand.includes("cool") ||
    lowerCommand.includes("cooler") ||
    lowerCommand.includes("blue hour") ||
    lowerCommand.includes("decrease temperature")
  ) {
    return {
      type: "color-adjustments",
      params: {
        saturation: 0,
        vibrance: 0,
        hue: 0,
        temperature: -40,
        tint: -10,
      },
      confidence: 0.9,
    };
  }

  // Hue shift
  if (
    lowerCommand.includes("shift hue") ||
    lowerCommand.includes("change color tone")
  ) {
    return {
      type: "color-adjustments",
      params: { saturation: 0, vibrance: 0, hue: 45, temperature: 0, tint: 0 },
      confidence: 0.75,
    };
  }

  // Rotation
  if (lowerCommand.includes("rotate") || lowerCommand.includes("turn")) {
    let degrees = 90;
    if (lowerCommand.includes("left")) degrees = -90;
    if (lowerCommand.includes("right")) degrees = 90;
    if (lowerCommand.includes("180")) degrees = 180;
    if (lowerCommand.includes("45")) degrees = 45;

    return {
      type: "rotate",
      params: { degrees },
      confidence: 0.85,
    };
  }

  // Flip
  if (
    lowerCommand.includes("flip horizontal") ||
    lowerCommand.includes("mirror")
  ) {
    return {
      type: "flip",
      params: { direction: "horizontal" },
      confidence: 0.9,
    };
  }

  if (lowerCommand.includes("flip vertical")) {
    return {
      type: "flip",
      params: { direction: "vertical" },
      confidence: 0.9,
    };
  }

  // Text addition
  if (lowerCommand.includes("add text") || lowerCommand.includes("write")) {
    const textMatch = command.match(/["']([^"']+)["']/);
    const text = textMatch ? textMatch[1] : "Sample Text";

    return {
      type: "add-text",
      params: { text, fontSize: 24 },
      confidence: 0.8,
    };
  }

  // Sharp/Blur effects
  if (lowerCommand.includes("sharp") || lowerCommand.includes("sharper")) {
    return {
      type: "basic-adjustments",
      params: {
        brightness: 0,
        contrast: 40,
        exposure: 0,
        highlights: 10,
        shadows: 10,
      },
      confidence: 0.8,
    };
  }

  // Vintage effects
  if (
    lowerCommand.includes("vintage") ||
    lowerCommand.includes("retro") ||
    lowerCommand.includes("film")
  ) {
    return {
      type: "color-adjustments",
      params: {
        saturation: -15,
        vibrance: -10,
        hue: -30,
        temperature: 15,
        tint: 5,
      },
      confidence: 0.75,
    };
  }

  // Black and white
  if (
    lowerCommand.includes("black and white") ||
    lowerCommand.includes("grayscale") ||
    lowerCommand.includes("monochrome")
  ) {
    return {
      type: "color-adjustments",
      params: {
        saturation: -100,
        vibrance: 0,
        hue: 0,
        temperature: 0,
        tint: 0,
      },
      confidence: 0.95,
    };
  }

  // Default fallback - increase brightness slightly
  return {
    type: "basic-adjustments",
    params: {
      brightness: 10,
      contrast: 5,
      exposure: 0,
      highlights: 0,
      shadows: 0,
    },
    confidence: 0.3,
  };
}
