# Manifest Files Guide 📋

## Overview

Ionex Tab supports both **Chrome/Edge** (Manifest V3) and **Firefox** (Manifest V2) with optimized manifest files for each browser.

## Files

- `manifest.json` - **Chrome/Edge/Brave** (Manifest V3)
- `manifest-firefox.json` - **Firefox** (Manifest V2)

## Key Differences

### Chrome (Manifest V3)
- Uses `manifest_version: 3`
- Separate `host_permissions` array
- Structured `content_security_policy` object
- Supports `wasm-unsafe-eval` for modern APIs

### Firefox (Manifest V2)
- Uses `manifest_version: 2`
- Permissions include both features and URLs in single array
- String-based `content_security_policy`
- Requires `browser_specific_settings` for add-on ID
- Uses `unsafe-eval` (required for React/Vite in MV2)

## Permissions Explained

### ✅ Included Permissions

1. **`storage`** - Save user settings, themes, and API keys locally
2. **`geolocation`** - Get user location for weather widget (with user consent)

### 🌐 API Access (Host Permissions)

1. **`api.open-meteo.com`** - Free weather data (no API key needed)
2. **`api.groq.com`** - AI assistant (Groq LLaMA API)
3. **`nominatim.openstreetmap.org`** - Reverse geocoding (location name from coordinates)
4. **`api.quotable.io`** - Random inspirational quotes
5. **`api.ipify.org`** - Get user's public IP address
6. **`images.unsplash.com`** - Theme wallpaper images

### 🔒 Content Security Policy (CSP)

Allows connections to approved APIs while maintaining security:
- ✅ Self-hosted scripts only
- ✅ Approved external API endpoints
- ❌ No inline scripts (except necessary for Vite/React)
- ❌ No eval() in production (except where required by framework)

## Build Commands

### For Chrome/Edge/Brave
```bash
npm run build
# or explicitly
npm run build:chrome
```
Output: `dist/` folder with `manifest.json`

### For Firefox
```bash
npm run build:firefox
```
Output: `dist/` folder with Firefox-compatible `manifest.json`

### Build Both Versions
```bash
npm run build:all
```
Output: 
- `dist/` - Chrome version
- `dist-firefox/` - Firefox version

## Installation

### Chrome/Edge/Brave
1. Build: `npm run build:chrome`
2. Open: `chrome://extensions/`
3. Enable: "Developer mode"
4. Click: "Load unpacked"
5. Select: `dist/` folder

### Firefox
1. Build: `npm run build:firefox`
2. Open: `about:debugging#/runtime/this-firefox`
3. Click: "Load Temporary Add-on"
4. Select: `dist/manifest.json`

**Note**: Firefox temporary add-ons are removed on browser restart. For permanent installation, you need to sign it through AMO (addons.mozilla.org).

## Version Management

Current version: **1.0.0**

When updating version:
1. Update in both `manifest.json` AND `manifest-firefox.json`
2. Keep version numbers synchronized
3. Update `package.json` version as well

## Firefox Add-on ID

Current ID: `ionex-tab@omindu.dev`

**Important**: 
- Required for Firefox add-on submission
- Must be unique across all Firefox add-ons
- Format: `name@domain` or `{uuid}`
- Cannot be changed after first AMO submission

## Icon Requirements

### Chrome
- 16x16 - Favicon, extensions page
- 48x48 - Extensions management page
- 128x128 - Chrome Web Store, installation

### Firefox
- 48x48 - Recommended minimum
- 96x96 - Recommended for HiDPI displays
- SVG - Recommended for best quality

All icons are in the `icons/` folder.

## Publishing Checklist

### Chrome Web Store
- ✅ Manifest V3 compliant
- ✅ All required icons present
- ✅ Privacy policy (if collecting data)
- ✅ Screenshots (1280x800 or 640x400)
- ✅ Detailed description
- ✅ Store icon (128x128)

### Firefox Add-ons (AMO)
- ✅ Manifest V2 compatible (V3 supported but V2 still recommended)
- ✅ Add-on ID configured
- ✅ Source code (if using minification)
- ✅ Privacy policy
- ✅ Screenshots
- ✅ Detailed description

## Security Notes

### What We Access
- ✅ **Weather data** - Using free Open-Meteo API
- ✅ **AI responses** - Only if user provides Groq API key
- ✅ **User location** - Only for weather, requires explicit permission
- ✅ **Local storage** - Save settings locally only

### What We DON'T Access
- ❌ Browsing history
- ❌ Cookies from other sites
- ❌ Personal files
- ❌ Passwords
- ❌ Payment information

## Troubleshooting

### Chrome: "Manifest version 2 is deprecated"
✅ Fixed - Using Manifest V3

### Firefox: "Content Security Policy violation"
✅ Fixed - Added proper CSP with necessary unsafe-eval for React

### Weather not working
✅ Check geolocation permission is granted
✅ Check Open-Meteo API is accessible

### AI Assistant error
✅ Verify Groq API key in settings
✅ Check api.groq.com in host_permissions

## Future Updates

When adding new features that require:
- **New API endpoints** → Add to `host_permissions` (Chrome) or `permissions` (Firefox)
- **New browser features** → Add to `permissions` array
- **New icons** → Add to `icons` object with appropriate sizes

## Resources

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Firefox Extension Manifest](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json)
- [Chrome Web Store Publishing](https://developer.chrome.com/docs/webstore/publish/)
- [Firefox AMO Publishing](https://extensionworkshop.com/documentation/publish/)

---

**Last Updated**: November 2, 2025
**Ionex Tab Version**: 1.0.0
