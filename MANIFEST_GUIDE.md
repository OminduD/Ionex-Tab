# 📜 Manifest Guide for Ionex Tab

This guide explains the structure and configuration of the `manifest.json` files used in Ionex Tab. Since we support both Chromium-based browsers (Chrome, Edge, Brave) and Firefox, we maintain two separate manifest files.

## 📂 Manifest Files

- **`manifest.json`**: The primary manifest file for **Chromium** browsers (Manifest V3).
- **`manifest-firefox.json`**: The manifest file for **Firefox** (Manifest V3, with specific adjustments).

## 🧩 Manifest Structure

### Core Fields

| Field | Description | Value |
|-------|-------------|-------|
| `manifest_version` | The version of the manifest file format. | `3` |
| `name` | The name of the extension. | `Ionex Tab - Enhanced New Tab` |
| `version` | Current version of the extension. | `1.0.0` |
| `description` | A brief description shown in the browser store. | *See file* |

### 🚀 New Tab Override

This is the core functionality of Ionex Tab. It tells the browser to replace the default new tab page with our application.

```json
"chrome_url_overrides": {
    "newtab": "index.html"
}
```

### 🔒 Permissions

We request the minimum necessary permissions to function:

| Permission | Purpose |
|------------|---------|
| `storage` | To save your settings, themes, and widget layouts locally. |
| `geolocation` | To automatically detect your location for the Weather widget. |

### 🌐 Host Permissions

These allow the extension to make API calls to external services without CORS issues.

```json
"host_permissions": [
    "https://api.open-meteo.com/*",       // Weather data
    "https://api.groq.com/*",             // AI Assistant (LLaMA)
    "https://nominatim.openstreetmap.org/*", // Location search
    "https://api.quotable.io/*",          // Daily quotes
    "https://api.ipify.org/*"             // IP address display
]
```

### 🛡️ Content Security Policy (CSP)

The CSP defines which scripts and resources are allowed to run. This is critical for security.

```json
"content_security_policy": {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; connect-src 'self' https://api.open-meteo.com https://api.groq.com https://nominatim.openstreetmap.org https://api.quotable.io https://api.ipify.org https://images.unsplash.com;"
}
```

- **`script-src`**: Allows scripts from our own package (`'self'`).
- **`connect-src`**: Whitelists the APIs we need to contact.

## 🦊 Firefox Specifics

Firefox handles Manifest V3 slightly differently than Chrome.

1.  **Background Scripts**: Firefox supports non-persistent background scripts differently (though Ionex Tab is primarily a New Tab page and doesn't rely heavily on background workers).
2.  **Browser Specific Settings**:
    ```json
    "browser_specific_settings": {
        "gecko": {
            "id": "ionex-tab@omindu.dev",
            "strict_min_version": "109.0"
        }
    }
    ```
    - `id`: A unique identifier required for Firefox add-ons.

## 🛠️ Modifying the Manifest

If you add a new feature that requires a new API or permission:

1.  **Identify the need**: Do you need to save data? (Storage) Access a new website? (Host Permission).
2.  **Update `manifest.json`**: Add the permission to the Chromium manifest.
3.  **Update `manifest-firefox.json`**: Add the same permission to the Firefox manifest.
4.  **Update CSP**: If you are calling a new external API, add its domain to the `connect-src` list in the CSP of **both** files.

## 📦 Build Process

When you run the build scripts, the appropriate manifest is copied to the output directory:

- `npm run build:chrome`: Copies `manifest.json` -> `dist/manifest.json`
- `npm run build:firefox`: Copies `manifest-firefox.json` -> `dist/manifest.json`
