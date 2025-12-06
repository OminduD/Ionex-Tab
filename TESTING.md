# 🧪 Testing Guide for Ionex Tab

This guide outlines the testing procedures for Ionex Tab. Since this is a browser extension, testing involves a mix of standard web development testing and extension-specific validation.

## 🛠️ Development Environment

### Prerequisites
- Node.js (v16+)
- npm (v8+)
- Chrome/Brave/Edge (for Chromium testing)
- Firefox (for Gecko testing)

### Running Locally (Vite Dev Server)

For rapid UI development, you can run the app as a standard web page.

```bash
npm run dev
```

- **URL**: `http://localhost:5173`
- **Limitations**: Browser extension APIs (like `chrome.storage`, `chrome.topSites`) will not work. We use mocks or fallbacks for these in development mode where possible, but some features may be disabled.

## 🧪 Manual Testing Checklist

Before releasing a new version, verify the following features in **both** Chrome and Firefox.

### 1. Core Functionality
- [ ] **New Tab Load**: Does the page load instantly when opening a new tab?
- [ ] **Theme Switching**: Try all 8 themes. Do colors and animations update?
- [ ] **Persistence**: Reload the page. Do your settings (theme, name, widgets) persist?

### 2. Widgets
- [ ] **Weather**: Does it detect location? Does it show data?
- [ ] **Search**: Try searching with Google and DuckDuckGo. Does it redirect correctly?
- [ ] **Focus Mode**: Start a timer. Does the music play? Does the pet hide (if enabled)?
- [ ] **Pet**: Does the pet appear? Can you interact with it (click)? Does it sleep after inactivity?
- [ ] **AI Chat**: (If key configured) Send a message. Does it reply? Open/close the sidebar.

### 3. Settings
- [ ] **API Keys**: Enter a dummy key, save, reload. Is it still there?
- [ ] **Toggles**: Hide the Weather widget. Does it disappear? Show it again.

## 📦 Extension Testing

To test the actual extension capabilities (permissions, new tab override), you must build and load it into the browser.

### Chrome / Chromium (Edge, Brave)

1.  **Build**:
    ```bash
    npm run build:chrome
    ```
2.  **Load**:
    - Go to `chrome://extensions/`
    - Enable **Developer mode** (top right).
    - Click **Load unpacked**.
    - Select the `dist` folder.
3.  **Verify**: Open a new tab.

### Firefox

1.  **Build**:
    ```bash
    npm run build:firefox
    ```
2.  **Load**:
    - Go to `about:debugging#/runtime/this-firefox`
    - Click **Load Temporary Add-on...**
    - Select `dist/manifest.json`.
3.  **Verify**: Open a new tab.

## 🐛 Troubleshooting Common Issues

### "Content Security Policy" Errors
- **Symptom**: An API call fails (e.g., Weather or AI), and you see a red error in the console about CSP.
- **Fix**: Check `manifest.json`. Is the API domain listed in `connect-src`?

### "chrome is not defined"
- **Symptom**: App crashes in `npm run dev` mode.
- **Fix**: Ensure code using `chrome.*` APIs is wrapped in a check or has a fallback for non-extension environments.
  ```typescript
  if (typeof chrome !== 'undefined' && chrome.storage) {
      // Extension code
  } else {
      // Fallback / LocalStorage
  }
  ```

### Styles not loading
- **Symptom**: Page looks unstyled in the extension but fine in dev.
- **Fix**: Check `index.html` in `dist`. Ensure CSS paths are relative (`./assets/...`) and not absolute (`/assets/...`). Vite handles this, but manual edits can break it.

## 🔍 Type Checking

Run TypeScript validation to catch type errors before building.

```bash
npm run type-check
```
