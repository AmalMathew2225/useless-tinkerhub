# 🎭 Errorly - The Mean Autocorrect Extension

A Chrome extension that intentionally replaces words with insulting, sarcastic, or otherwise rude/funny alternatives. Because nice is boring.

## ✨ Features

### 🎯 Two Trigger Modes
- **LIVE Mode**: Words get replaced as you type in real-time
- **ENTER Mode**: Words get replaced only when you press Enter

### 😈 Mean Word Replacements
- **Case-Preserving**: Maintains original text casing (e.g., "Pope" → "Soap Breath", "POPE" → "SOAP BREATH")
- **Whole Word Matching**: Only replaces complete words, preserving punctuation
- **Customizable Dictionary**: Edit the replacement list through the popup interface

### 🌐 Universal Compatibility
- Works on all websites
- Supports input fields, textareas, and contenteditable elements
- Ignores password fields and autocomplete=off elements
- Processes both existing page content and dynamically added content

### 📊 Statistics & Monitoring
- Tracks number of insults injected per session
- Displays current mode and replacement count
- Persistent storage across browser sessions

## 🚀 Installation

### Method 1: Load Unpacked Extension
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked" and select the extension folder
5. The Errorly icon should appear in your Chrome toolbar

### Method 2: Chrome Web Store (when published)
1. Visit the Chrome Web Store
2. Search for "Errorly - The Mean Autocorrect"
3. Click "Add to Chrome"

## 🎮 Usage

### Basic Operation
1. **Click the Errorly icon** in your Chrome toolbar
2. **Choose your mode**:
   - **LIVE**: Words get replaced as you type
   - **ENTER**: Words get replaced when you press Enter
3. **Start typing** in any text field on any website
4. **Watch the magic happen** as words get replaced with mean alternatives

### Customizing Replacements
1. Open the Errorly popup
2. Scroll to the "MEAN DICTIONARY" section
3. Edit the JSON text to add/modify word replacements
4. Click "SAVE DICTIONARY" to apply changes
5. Changes take effect immediately across all tabs

### Example Replacements
```json
{
  "hello": "greetings, peasant",
  "goodbye": "good riddance",
  "thank you": "whatever",
  "friend": "clown",
  "love": "despise passionately",
  "I": "this egomaniac",
  "Pope": "soap breath"
}
```

## 🧪 Testing

Open `test.html` in your browser to test the extension with various input types:
- Regular text inputs
- Textareas
- Contenteditable elements
- Static page content

## 🔧 Technical Details

### Architecture
- **Manifest V3**: Modern Chrome extension architecture
- **Content Script**: Runs on every webpage to process text
- **Popup Interface**: User controls and settings
- **Background Service Worker**: Handles messaging and storage
- **MutationObserver**: Watches for dynamic DOM changes

### Permissions
- `activeTab`: Access to current tab
- `storage`: Save user preferences and statistics
- `scripting`: Programmatic script injection (if needed)

### Storage
- Uses `chrome.storage.local` for persistent settings
- Stores mode preference, insult count, and custom dictionary
- Data persists across browser sessions

## 🎨 Customization

### CSS Styling
The extension uses aggressive, mean styling with:
- Loud red/orange color scheme
- Bold, aggressive fonts
- Dark theme with high contrast
- Animated elements and hover effects

### Adding New Words
1. Open the popup and edit the dictionary
2. Follow the JSON format: `"original": "replacement"`
3. Save and test immediately
4. Words are case-insensitive but preserve original casing

## 🐛 Troubleshooting

### Extension Not Working?
1. **Check permissions**: Ensure the extension has access to the current site
2. **Reload the page**: Sometimes a page refresh is needed
3. **Check console**: Open DevTools and look for Errorly messages
4. **Verify mode**: Make sure you've selected LIVE or ENTER mode

### Words Not Replacing?
1. **Check spelling**: Ensure exact word matches in the dictionary
2. **Verify mode**: LIVE mode replaces as you type, ENTER mode on Enter key
3. **Field type**: Works on text inputs, textareas, and contenteditable elements
4. **Page refresh**: Some sites may need a refresh after activation

### Performance Issues?
1. **Large pages**: Very long pages may take a moment to process
2. **Many replacements**: Extensive dictionaries may slow down typing
3. **Dynamic content**: Heavy AJAX sites may cause delays

## 🎭 Default Word Replacements

The extension comes with these mean replacements pre-loaded:
- `hello` → `greetings, peasant`
- `goodbye` → `good riddance`
- `thank you` → `whatever`
- `please` → `begging won't help`
- `sorry` → `not sorry at all`
- `yes` → `obviously`
- `no` → `absolutely not`
- `okay` → `if you say so`
- `cool` → `whatever floats your boat`
- `awesome` → `mediocre at best`
- `friend` → `clown`
- `love` → `despise passionately`
- `I` → `this egomaniac`
- `Pope` → `soap breath`
- `quickly` → `like a caffeinated squirrel`
- `happy` → `giggly as a jellybean`
- `run` → `zoom like a rocket-powered toaster`

## 🔒 Privacy & Security

- **No data collection**: The extension doesn't send any data to external servers
- **Local storage only**: All settings and statistics are stored locally in your browser
- **No tracking**: No user behavior or typing patterns are monitored
- **Open source**: Full source code available for inspection

## 🤝 Contributing

Want to make Errorly even meaner? Contributions welcome!
1. Fork the repository
2. Add more insulting word replacements
3. Improve the UI/UX
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## ⚠️ Disclaimer

This extension is intended for entertainment purposes. The mean word replacements are meant to be funny, not genuinely offensive. Use responsibly and consider your audience when activating it in professional or sensitive contexts.

---

**Made with 💔 by developers who gave up on being nice** 