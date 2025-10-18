// src/utils/colorExtractor.ts
// Extract dominant colors from image for auto-theming

interface RGB {
  r: number;
  g: number;
  b: number;
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
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Calculate color brightness
 */
function getBrightness(r: number, g: number, b: number): number {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * Adjust color brightness
 */
function adjustBrightness(r: number, g: number, b: number, factor: number): RGB {
  return {
    r: Math.min(255, Math.max(0, Math.round(r * factor))),
    g: Math.min(255, Math.max(0, Math.round(g * factor))),
    b: Math.min(255, Math.max(0, Math.round(b * factor)))
  };
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
          
          // Round colors to reduce variations
          const roundedR = Math.round(r / 10) * 10;
          const roundedG = Math.round(g / 10) * 10;
          const roundedB = Math.round(b / 10) * 10;
          
          const key = `${roundedR},${roundedG},${roundedB}`;
          colorMap[key] = (colorMap[key] || 0) + 1;
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
        const bgStart = adjustBrightness(primary.r, primary.g, primary.b, 0.3);
        const bgEnd = adjustBrightness(secondary.r, secondary.g, secondary.b, 0.4);
        
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
 * Apply custom colors to document root
 */
export function applyCustomColors(colors: DominantColors): void {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', colors.primary);
  root.style.setProperty('--secondary-color', colors.secondary);
  root.style.setProperty('--accent-color', colors.accent);
  root.style.setProperty('--bg-gradient-start', colors.bgGradientStart);
  root.style.setProperty('--bg-gradient-end', colors.bgGradientEnd);
}
