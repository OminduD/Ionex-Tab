# AI Assistant - Debugging Steps

## The Problem Was: "API request failed"

This has been fixed with **extensive debugging logs** and **better error messages**.

---

## What's Changed Now

### ✅ Enhanced Logging
Every API call now logs:
- 🔑 API key (first 10 characters)
- 📡 Response status code
- 📦 Full response data
- ❌ Detailed error information

### ✅ Better Error Messages
You'll now see:
- **Actual error from the API** (not generic "API request failed")
- **HTTP status code** (400, 403, 429, etc.)
- **Helpful hints** about what the error means
- **Action steps** to fix the issue

### ✅ Network Error Detection
- Detects "Failed to fetch" errors (no internet)
- Detects CORS errors (browser blocking)
- Shows specific solutions for each type

---

## How to Test

### Step 1: Open Browser Console
1. Press **F12** or right-click → Inspect
2. Go to **Console** tab
3. Keep it open while testing

### Step 2: Try the AI Assistant
1. Type a message in the AI widget
2. Press Enter or click Send
3. Watch the console for detailed logs

### Step 3: Check the Logs

You should see logs like this:

#### ✅ Successful Request:
```
🔑 Using Gemini API with key: AIzaSyBcD...
📡 Response status: 200 OK
📦 Response data: { candidates: [...] }
```

#### ❌ Error (Invalid API Key):
```
🔑 Using Gemini API with key: invalid123...
📡 Response status: 400 Bad Request
📦 Response data: { error: { message: "API key not valid..." } }
❌ Gemini API error: {...}
Status code: 400
Full error: { "error": { "message": "API key not valid..." } }
```

---

## Common Errors & What They Mean

### Error: "Gemini API Error (400)"
**Meaning:** Invalid API key format
**Solution:**
1. Go to https://aistudio.google.com/app/apikey
2. Create a NEW API key
3. Copy the ENTIRE key (starts with `AIza`)
4. Paste in Settings → API Keys → Gemini AI
5. Make sure there are NO spaces before or after
6. Save settings

### Error: "Gemini API Error (403)"
**Meaning:** API key is invalid or revoked
**Solution:**
1. Your API key might be disabled
2. Generate a new key at https://aistudio.google.com/app/apikey
3. Make sure "Generative Language API" is enabled in your Google Cloud project

### Error: "Gemini API Error (429)"
**Meaning:** Rate limit exceeded
**Solution:**
- Wait 1-2 minutes
- Try again
- Free tier has limits: 60 requests per minute

### Error: "Network Error: Unable to connect"
**Meaning:** Can't reach the API server
**Solution:**
1. Check your internet connection
2. Disable VPN temporarily
3. Check if firewall is blocking the request
4. Try a different network

### Error: "CORS Error"
**Meaning:** Browser blocked the request
**Solution:**
- This is rare with Google APIs
- Try a different browser
- Clear browser cache
- Check if browser extensions are interfering

---

## Quick Checklist

Before asking for help, verify:

✅ **API Key:**
- [ ] Copied the entire key (no missing characters)
- [ ] No spaces before or after the key
- [ ] Key starts with `AIza` (for Gemini)
- [ ] Key is active in your Google AI Studio

✅ **Browser Console:**
- [ ] F12 console is open
- [ ] You can see the detailed logs
- [ ] Error message shows specific status code
- [ ] Full error response is logged

✅ **Network:**
- [ ] Internet connection is working
- [ ] Can access other websites
- [ ] No VPN interfering
- [ ] Firewall allows API requests

---

## Example: How to Get Gemini API Key

1. **Visit:** https://aistudio.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click:** "Create API Key"
4. **Choose:** "Create API key in new project" (or select existing project)
5. **Copy** the key that appears (it's long, starts with `AIza`)
6. **Open Ionex Settings** → API Keys section
7. **Paste** the key in "Gemini AI" field
8. **Save** settings
9. **Test** by sending a message to the AI

---

## What You'll See in Chat Now

### Before (Old):
```
User: Hello
Bot: API request failed
```

### After (Fixed):
```
User: Hello
Bot: Gemini API Error (400): API key not valid. Please pass a valid API key.

💡 This usually means:
- Invalid API key format
- API key has incorrect characters
- Try generating a new API key
```

---

## Still Not Working?

1. **Check the Console** (F12) - look for the detailed error logs
2. **Copy the error message** - it now shows what's actually wrong
3. **Try the Gemini AI Studio** - test your API key at https://aistudio.google.com
4. **Generate a new key** - sometimes keys get corrupted
5. **Clear browser cache** - old settings might be cached

---

## Test Your API Key Manually

Open browser console (F12) and paste this (replace `YOUR_KEY`):

```javascript
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: 'Hello' }] }]
  })
})
.then(r => r.json())
.then(d => console.log('✅ Success:', d))
.catch(e => console.error('❌ Error:', e))
```

If this works, your key is valid. If not, you'll see the exact error.

---

**The AI Assistant now has full debugging capabilities!** 🎉
