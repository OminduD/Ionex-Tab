# Testing Guide for Ionex Tab Extension

## Overview
This guide will walk you through testing the Ionex Tab Chrome extension locally.

## Prerequisites
- Google Chrome or Microsoft Edge browser
- Node.js and npm installed
- Project built successfully (see building section)

## Building the Extension

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Build the Extension**:
   ```bash
   npm run build
   ```
   
   This will:
   - Compile TypeScript files
   - Bundle React application with Vite
   - Generate optimized production files in the `dist/` folder
   - Copy manifest.json to dist folder

## Loading the Extension in Chrome

### Step 1: Open Extension Management Page
1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" toggle in the top-right corner

### Step 2: Load Unpacked Extension
1. Click "Load unpacked" button
2. Navigate to your project directory
3. Select the `dist` folder (NOT the root project folder)
4. Click "Select Folder"

### Step 3: Verify Installation
- The extension should now appear in your extensions list
- You should see "Ionex Tab - Enhanced New Tab" with version 1.0.0
- Open a new tab to see the extension in action!

## Testing Features

### 1. Basic Functionality
- ✅ Open a new tab - should display the custom new tab page
- ✅ Check if the wallpaper/background loads
- ✅ Verify all enabled widgets are visible

### 2. Clock Widget
- ✅ Displays current time (updates every second)
- ✅ Shows current date
- ✅ Time format is correct for your locale

### 3. Weather Widget  
**Without API Key:**
- ✅ Shows error message: "API key not set"

**With API Key:**
1. Click settings icon (gear in top-right)
2. Scroll to "API Keys" section
3. Enter your OpenWeatherMap API key
4. Click "Save & Close"
5. ✅ Weather should load and display:
   - Temperature in Celsius
   - City name
   - Weather condition

**Get API Key:**
- Visit https://openweathermap.org/api
- Sign up for free account
- Get your API key

### 4. Calendar Widget
- ✅ Displays current month
- ✅ Today's date is highlighted
- ✅ Calendar updates at midnight

### 5. Todo List Widget
- ✅ Add new tasks using the input field
- ✅ Press Enter or click + button to add
- ✅ Click checkbox to mark task complete
- ✅ Completed tasks show strikethrough
- ✅ Click trash icon to delete task
- ✅ Tasks persist after closing/reopening tabs

### 6. AI Assistant Widget
**Without API Key:**
- ✅ Shows error message about missing API key

**With API Key:**
1. Get Gemini API key from https://makersuite.google.com/app/apikey
2. Add to settings panel
3. Test by typing a question
4. ✅ Should receive AI-generated response
5. ✅ Loading indicator appears while waiting
6. ✅ Response displays in text area

### 7. App Shortcuts Widget
- ✅ Default shortcuts (Gmail, Drive) are displayed
- ✅ Click shortcut opens URL in new tab
- ✅ Add new shortcut via settings:
  1. Open settings
  2. Scroll to "App Shortcuts"
  3. Enter name and URL
  4. Click + button
  5. ✅ New shortcut appears immediately
- ✅ Delete shortcut using trash icon

### 8. Music Player Widget
- ✅ Displays "coming soon" placeholder
- ✅ Widget is visible when enabled

### 9. Settings Panel

**Opening/Closing:**
- ✅ Click gear icon to open
- ✅ Click X icon to close
- ✅ Click "Save & Close" button
- ✅ Click outside panel to close

**Wallpaper:**
- ✅ Enter new image URL
- ✅ Background changes immediately
- ✅ Custom wallpaper persists

**Theme:**
- ✅ Select different themes (Aurora, Sunset, Ocean, Forest)
- ✅ Theme colors change
- ✅ Icons adapt to theme colors

**Widgets Toggle:**
- ✅ Enable/disable each widget
- ✅ Widgets appear/disappear immediately
- ✅ Settings persist after closing

**API Keys:**
- ✅ Enter weather API key
- ✅ Enter Gemini API key
- ✅ Keys are stored securely
- ✅ Keys persist across sessions

### 10. Drag & Drop Functionality
- ✅ Hover over widget to see drag handle
- ✅ Click and drag widget
- ✅ Drop widget in new position
- ✅ Widgets rearrange accordingly
- ✅ Order persists after refresh

### 11. Responsive Design
- ✅ Resize browser window
- ✅ Widgets adapt to screen size
- ✅ Mobile viewport (400px width) displays correctly
- ✅ Tablet viewport (768px width) works well
- ✅ Desktop viewport (1920px width) looks good

### 12. Data Persistence
1. Configure settings (theme, API keys, shortcuts)
2. Add todo items
3. Rearrange widgets
4. Close browser completely
5. Reopen browser
6. ✅ All settings should be preserved
7. ✅ Todos should still be there
8. ✅ Widget order maintained

## Development Testing

### Running in Development Mode
```bash
npm run dev
```
- Opens dev server at http://localhost:5173
- Hot module replacement enabled
- Changes reflect instantly
- Note: Chrome extension APIs won't work in dev server

### Type Checking
```bash
npm run type-check
```
- Runs TypeScript compiler without emitting files
- Checks for type errors

## Common Issues & Solutions

### Issue: Extension doesn't load
**Solution:** 
- Make sure you selected the `dist` folder, not the root
- Check if build was successful
- Look for errors in Chrome extension page

### Issue: Widgets not displaying
**Solution:**
- Check browser console for errors (F12)
- Verify build completed without errors
- Try disabling and re-enabling in settings

### Issue: API features not working
**Solution:**
- Verify API keys are correct
- Check network tab in DevTools (F12)
- Ensure you're connected to internet
- Check API rate limits

### Issue: Changes not reflecting
**Solution:**
- Rebuild the project: `npm run build`
- Click refresh icon on extension in chrome://extensions/
- Hard refresh the new tab page (Ctrl+Shift+R)

### Issue: TypeScript errors
**Solution:**
- Run `npm run type-check` to see all errors
- Ensure all dependencies are installed
- Check tsconfig.json is correct

## Browser Console Debugging

1. Open new tab with extension
2. Press F12 to open DevTools
3. Check Console tab for errors
4. Check Network tab for failed API calls
5. Check Application tab → Local Storage for saved data

## Performance Testing

- ✅ New tab loads in < 1 second
- ✅ No memory leaks (check in Chrome Task Manager)
- ✅ Smooth animations
- ✅ No janky scrolling

## Security Testing

- ✅ API keys stored in chrome.storage (not visible in code)
- ✅ HTTPS only for API calls
- ✅ No XSS vulnerabilities
- ✅ Content Security Policy compliant

## Reporting Issues

When reporting bugs, include:
1. Chrome version
2. Extension version
3. Steps to reproduce
4. Expected vs actual behavior
5. Console errors (if any)
6. Screenshots

## Next Steps After Testing

1. If everything works: Great! You can use the extension
2. Found bugs: Check this guide's troubleshooting section
3. Want to modify: See README.md for development info
4. Ready to publish: See Chrome Web Store publishing guidelines

## API Key Resources

### OpenWeatherMap (Weather Widget)
- Website: https://openweathermap.org/api
- Free tier: 1,000 calls/day
- Documentation: https://openweathermap.org/current

### Google Gemini (AI Assistant)
- Website: https://makersuite.google.com/app/apikey
- Free tier: 60 requests/minute
- Documentation: https://ai.google.dev/docs

## Additional Notes

- Extension requires internet for API features
- Weather updates every 10 minutes automatically
- Todo list data stored locally (not synced across devices)
- Maximum of 50 shortcuts recommended
- Background images should be HTTPS URLs

## Happy Testing! 🎉

If you encounter any issues not covered in this guide, please check the browser console for error messages and refer to the troubleshooting section.
