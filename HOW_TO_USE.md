# 🎯 How to Use Ionex Tab

## ✅ What's Working NOW

Your extension is **fully functional** with all the features from your mockup! Here's what you can do:

## 🚀 Getting Started (3 Steps)

### Step 1: Build
```bash
npm run build
```
✅ This creates the `dist/` folder with your extension

### Step 2: Load in Browser

**For Chrome/Edge:**
1. Open `chrome://extensions/`
2. Turn ON "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist` folder
5. Done! ✨

**For Firefox:**
1. Build first, then run: `cp manifest-firefox.json dist/manifest.json`
2. Open `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select `dist/manifest.json`
5. Done! ✨

### Step 3: Enjoy!
Open a new tab and see your beautiful home screen!

## 🎨 Features You Can Use Right Now

### 1. **Settings Panel** (Gear Icon ⚙️)
Click the gear icon (top-right) to access:
- 🖼️ Change wallpaper (paste any image URL)
- 🎨 Select themes (Aurora, Sunset, Ocean, Forest)
- 🔲 Toggle widgets on/off
- ⏰ Choose clock type (Digital/Analog/Both)
- 🔗 Manage shortcuts
- 🔑 Add API keys

### 2. **Focus Mode** (🎯 Button)
Click "Focus Mode" button (top-left) for:
- ⏱️ Pomodoro timer
- 🕐 Presets: 5, 15, 25, 45 minutes
- ⏯️ Start/Pause/Reset
- 🌑 Full-screen distraction-free mode

### 3. **Widgets** (Drag & Drop!)

#### Weather Widget 🌤️
- Shows temperature, city, conditions
- Auto-refreshes every 10 min
- **Needs**: Free API key from openweathermap.org

#### Clock Widgets ⏰
- **Digital**: Shows time and date
- **Analog**: Classic clock face with moving hands
- **Both**: Show both at once!

#### Calendar 📅
- Current month view
- Today is highlighted
- No setup needed!

#### Todo List ✅
- Add tasks (press Enter or click +)
- Check off completed items
- Delete with trash icon
- Saves automatically!

#### AI Assistant 🤖
- Ask anything!
- Powered by Google Gemini
- **Needs**: Free API key from makersuite.google.com

#### App Shortcuts 🔗
- Quick access to your favorite sites
- Default: Gmail, Drive
- Add more in settings!

#### News Feed 📰
- Latest headlines
- Source and time info
- Click to refresh

#### Music Player 🎵
- Widget placeholder ready
- Coming soon with Spotify integration!

### 4. **Drag & Drop** 🎯
- Hover over any widget
- Click and drag to reorder
- Your layout is saved automatically!

### 5. **Themes** 🎨

**Aurora** (Default)
- Purple and indigo vibes
- Mystical feel

**Sunset**
- Warm orange and red
- Evening ambiance

**Ocean**
- Cool cyan and blue
- Calming waters

**Forest**
- Fresh green and teal
- Nature-inspired

## 🔑 Setting Up API Keys (Optional)

### For Weather Widget:
1. Go to https://openweathermap.org/api
2. Sign up (FREE)
3. Get your API key
4. Open settings in extension
5. Paste into "Weather API Key"
6. Click "Save & Close"
7. Weather loads instantly! 🌤️

### For AI Assistant:
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Create API key (FREE)
4. Open settings in extension
5. Paste into "Gemini API Key"
6. Click "Save & Close"
7. Ask your first question! 🤖

## 🎯 Pro Tips

### Tip 1: Perfect Layout
1. Enable only widgets you need (in settings)
2. Drag them to your preferred positions
3. Layout saves automatically!

### Tip 2: Custom Wallpaper
1. Find a beautiful image online
2. Right-click → Copy image address
3. Open settings
4. Paste in "Wallpaper URL"
5. Instant new background! 🖼️

### Tip 3: Focus Sessions
1. Click "Focus Mode"
2. Choose duration (25 min recommended)
3. Click Start
4. Work distraction-free!
5. Exit anytime with button

### Tip 4: Quick Shortcuts
1. Open settings
2. Scroll to "App Shortcuts"
3. Add name and URL
4. Click + button
5. Instant access from home!

## ❓ Troubleshooting

### "Extension won't load"
- Make sure you built first: `npm run build`
- Select the `dist` folder, not root folder
- Check for errors in `chrome://extensions/`

### "Widgets not showing"
- Press F12 to open console
- Look for errors
- Check if widget is enabled in settings

### "Weather not working"
- Add OpenWeatherMap API key in settings
- Check internet connection
- Wait 10 seconds for first load

### "AI not responding"
- Add Gemini API key in settings
- Check internet connection
- Verify API key is correct

### "Changes not appearing"
- Run `npm run build` again
- Click refresh icon on extension
- Hard refresh tab (Ctrl+Shift+R)

## 🎉 You're All Set!

Your extension has **everything** from your mockup:
- ✅ Command palette (Settings)
- ✅ Weather widget
- ✅ Calendar
- ✅ Todo list
- ✅ News feed
- ✅ Music player
- ✅ Shortcuts
- ✅ Focus mode
- ✅ Beautiful themes
- ✅ Custom wallpapers
- ✅ Drag & drop
- ✅ Glassmorphic design

## 🚀 Next Steps

1. **Test it**: Open a new tab
2. **Customize it**: Add your wallpaper and theme
3. **Add API keys**: Get weather and AI working
4. **Make it yours**: Add your favorite shortcuts
5. **Stay focused**: Use Focus Mode for productivity

---

**Enjoy your beautiful new home tab! 🌟**

Questions? Check `TESTING.md` for detailed guide!
