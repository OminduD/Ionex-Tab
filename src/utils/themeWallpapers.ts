// Theme-based wallpaper bundles
// Each theme has multiple high-quality wallpapers that rotate randomly

export const themeWallpapers: Record<string, string[]> = {
  aurora: [
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515705576963-95cad62945b6?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
  ],
  
  sunset: [
    'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?q=80&w=2070&auto=format&fit=crop',
  ],
  
  forest: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2232&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2141&auto=format&fit=crop',
  ],
  
  ocean: [
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2026&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?q=80&w=2053&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=2070&auto=format&fit=crop',
  ],
  
  midnight: [
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=2078&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=2072&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?q=80&w=2081&auto=format&fit=crop',
  ],
  
  neon: [
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2187&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514378866530-46a7e77bb8c6?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2070&auto=format&fit=crop',
  ],
  
  cherry: [
    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2076&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516410529446-2c777cb7366d?q=80&w=2062&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2070&auto=format&fit=crop',
  ],
  
  mint: [
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2074&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop',
  ],
};

/**
 * Get a random wallpaper from a theme's bundle
 */
export const getRandomWallpaper = (theme: string): string => {
  const wallpapers = themeWallpapers[theme] || themeWallpapers.aurora;
  const randomIndex = Math.floor(Math.random() * wallpapers.length);
  return wallpapers[randomIndex];
};

/**
 * Get all wallpapers for a theme
 */
export const getThemeWallpapers = (theme: string): string[] => {
  return themeWallpapers[theme] || themeWallpapers.aurora;
};
