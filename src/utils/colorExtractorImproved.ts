// src/utils/colorExtractorImproved.ts
// Extract and generate color system following MaterialYou pattern

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ColorShades {
  bgColor: string;
  accentLightTint: string;
  darkerColor: string;
  darkColor: string;
  textColorDark: string;
  whitishColor: string;
}

interface DominantColors {
  primary: string;
  secondary: string;
  accent: string;
  bgGradientStart: string;
  bgGradientEnd: string;
}

/**
 * Convert RGB to Hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Convert Hex to RGB
 */
function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

/**
 * Calculate color brightness (luminance)
 */
function getBrightness(r: number, g: number, b: number): number {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * Adjust hex color brightness - MaterialYou pattern
 * @param hex - Hex color code
 * @param factor - Adjustment factor (0.0 to 1.0)
 * @param isLighten - True to lighten, false to darken
 */
function adjustHexColor(hex: string, factor: number, isLighten: boolean = true): string {
  const rgb = hexToRgb(hex);
  
  let r: number, g: number, b: number;
  
  if (isLighten) {
    // Lighten by moving towards white
    r = rgb.r + (255 - rgb.r) * factor;
    g = rgb.g + (255 - rgb.g) * factor;
    b = rgb.b + (255 - rgb.b) * factor;
  } else {
    // Darken by moving towards black
    r = rgb.r * (1 - factor);
    g = rgb.g * (1 - factor);
    b = rgb.b * (1 - factor);
  }
  
  return rgbToHex(
    Math.min(255, Math.max(0, r)),
    Math.min(255, Math.max(0, g)),
    Math.min(255, Math.max(0, b))
  );
}

/**
 * Check if color is near white
 */
function isNearWhite(hex: string, threshold: number = 240): boolean {
  const rgb = hexToRgb(hex);
  return rgb.r > threshold && rgb.g > threshold && rgb.b > threshold;
}

/**
 * Generate complete color shade system from base color - MaterialYou pattern
 */
export function generateColorShades(baseColor: string): ColorShades {
  // If color is near white, use a neutral gray instead
  let adjustedColor = isNearWhite(baseColor) ? '#696969' : baseColor;
  
  return {
    bgColor: adjustHexColor(adjustedColor, 0.7, true),        // Lighter background
    accentLightTint: adjustHexColor(adjustedColor, 0.9, true), // Very light tint
    darkerColor: adjustHexColor(adjustedColor, 0.3, false),    // Darker version
    darkColor: adjustedColor,                                   // Base color
    textColorDark: adjustHexColor(adjustedColor, 0.8, false),  // Very dark for text
    whitishColor: '#FFFFFF'                                     // Pure white
  };
}

/**
 * Apply MaterialYou style theme to document
 */
export function applyMaterialYouTheme(baseColor: string): void {
  const shades = generateColorShades(baseColor);
  const root = document.documentElement;
  
  // Apply all shade variables
  root.style.setProperty('--bg-color', shades.bgColor);
  root.style.setProperty('--accent-light-tint', shades.accentLightTint);
  root.style.setProperty('--darker-color', shades.darkerColor);
  root.style.setProperty('--dark-color', shades.darkColor);
  root.style.setProperty('--text-color-dark', shades.textColorDark);
  root.style.setProperty('--whitish-color', shades.whitishColor);
  
  // Also set the simpler primary/secondary/accent for backwards compatibility
  root.style.setProperty('--primary-color', shades.darkColor);
  root.style.setProperty('--secondary-color', shades.darkerColor);
  root.style.setProperty('--accent-color', adjustHexColor(shades.darkColor, 0.2, true));
  
  // Set background gradient
  root.style.setProperty('--bg-gradient-start', shades.textColorDark);
  root.style.setProperty('--bg-gradient-end', shades.darkerColor);
}

/**
 * Extract dominant colors from image URL using canvas
 */
export async function extractColorsFromImage(imageUrl: string): Promise<DominantColors> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Resize for faster processing
        const scale = 0.1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Collect color data
        const colorMap: { [key: string]: number } = {};
        
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          
          // Skip transparent and very dark/bright pixels
          if (a < 128) continue;
          const brightness = getBrightness(r, g, b);
          if (brightness < 30 || brightness > 240) continue;
          
          // Increase saturation for more vibrant colors
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          
          // Prefer more saturated colors
          if (saturation < 0.2) continue;
          
          // Round colors to reduce variations
          const roundedR = Math.round(r / 10) * 10;
          const roundedG = Math.round(g / 10) * 10;
          const roundedB = Math.round(b / 10) * 10;
          
          const key = `${roundedR},${roundedG},${roundedB}`;
          // Weight by saturation - prefer vibrant colors
          colorMap[key] = (colorMap[key] || 0) + saturation;
        }
        
        // Sort by frequency and get top colors
        const sortedColors = Object.entries(colorMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([color]) => {
            const [r, g, b] = color.split(',').map(Number);
            return { r, g, b };
          });
        
        if (sortedColors.length < 3) {
          // Fallback to default aurora theme
          resolve({
            primary: '#a78bfa',
            secondary: '#818cf8',
            accent: '#c084fc',
            bgGradientStart: '#1e1b4b',
            bgGradientEnd: '#312e81'
          });
          return;
        }
        
        // Use most dominant colors
        const primary = sortedColors[0];
        const secondary = sortedColors[1];
        const accent = sortedColors[2];
        
        // Create darker versions for background gradients
        const bgStart = {
          r: Math.round(primary.r * 0.3),
          g: Math.round(primary.g * 0.3),
          b: Math.round(primary.b * 0.3)
        };
        const bgEnd = {
          r: Math.round(secondary.r * 0.4),
          g: Math.round(secondary.g * 0.4),
          b: Math.round(secondary.b * 0.4)
        };
        
        resolve({
          primary: rgbToHex(primary.r, primary.g, primary.b),
          secondary: rgbToHex(secondary.r, secondary.g, secondary.b),
          accent: rgbToHex(accent.r, accent.g, accent.b),
          bgGradientStart: rgbToHex(bgStart.r, bgStart.g, bgStart.b),
          bgGradientEnd: rgbToHex(bgEnd.r, bgEnd.g, bgEnd.b)
        });
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Apply custom colors to document root with MaterialYou shading
 */
export function applyCustomColors(colors: DominantColors): void {
  // Apply the primary color with full MaterialYou shading system
  applyMaterialYouTheme(colors.primary);
  
  // Also keep the gradient colors
  const root = document.documentElement;
  root.style.setProperty('--bg-gradient-start', colors.bgGradientStart);
  root.style.setProperty('--bg-gradient-end', colors.bgGradientEnd);
  
  console.log('Applied MaterialYou theme:', colors);
}

/**
 * Get current theme colors
 */
export function getCurrentThemeColors(): ColorShades {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  
  return {
    bgColor: style.getPropertyValue('--bg-color').trim() || '#BBD6FD',
    accentLightTint: style.getPropertyValue('--accent-light-tint').trim() || '#E2EEFF',
    darkerColor: style.getPropertyValue('--darker-color').trim() || '#3569B2',
    darkColor: style.getPropertyValue('--dark-color').trim() || '#4382EC',
    textColorDark: style.getPropertyValue('--text-color-dark').trim() || '#1B3041',
    whitishColor: style.getPropertyValue('--whitish-color').trim() || '#FFFFFF'
  };
}
