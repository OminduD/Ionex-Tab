#!/bin/bash
# Icon Generator Script for Ionex Tab Extension
# This script will create different sizes of your logo for the extension

echo "🎨 Ionex Tab - Icon Generator"
echo "=============================="
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is not installed!"
    echo ""
    echo "📦 To install ImageMagick:"
    echo "  Ubuntu/Debian: sudo apt install imagemagick"
    echo "  Mac: brew install imagemagick"
    echo "  Fedora: sudo dnf install imagemagick"
    echo ""
    echo "Or use the online tools mentioned in LOGO_SETUP.md"
    exit 1
fi

# Check if source logo exists
if [ ! -f "Ionex.png" ]; then
    echo "❌ Ionex.png not found in current directory!"
    echo "Please make sure you're in the Ionex-Tab directory and Ionex.png exists."
    exit 1
fi

echo "✅ ImageMagick found!"
echo "✅ Ionex.png found!"
echo ""

# Create icons directory if it doesn't exist
mkdir -p icons

echo "🔄 Generating icons..."
echo ""

# Generate different sizes
echo "  → Creating icon16.png (16x16)..."
convert Ionex.png -resize 16x16 -background none -gravity center -extent 16x16 icons/icon16.png

echo "  → Creating icon48.png (48x48)..."
convert Ionex.png -resize 48x48 -background none -gravity center -extent 48x48 icons/icon48.png

echo "  → Creating icon128.png (128x128)..."
convert Ionex.png -resize 128x128 -background none -gravity center -extent 128x128 icons/icon128.png

echo "  → Creating icon512.png (512x512) for promo..."
convert Ionex.png -resize 512x512 -background none -gravity center -extent 512x512 icons/icon512.png

echo ""
echo "✅ All icons generated successfully!"
echo ""
echo "📁 Generated files:"
ls -lh icons/
echo ""
echo "🚀 Next steps:"
echo "  1. Check the icons/ directory"
echo "  2. Reload your extension in Chrome"
echo "  3. Your Ionex logo will now appear everywhere!"
echo ""
echo "✨ Done!"
