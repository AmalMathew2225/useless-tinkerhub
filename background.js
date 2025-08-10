// Errorly - Background Service Worker
// Handles background tasks and messaging

// Set default extension state on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Errorly extension installed');
  
  // Set default settings
  chrome.storage.local.set({
    isActive: true,
    mode: 'LIVE',
    insultCount: 0,
    dictionary: {
      'hello': 'greetings, peasant',
      'goodbye': 'good riddance',
      'thank you': 'whatever',
      'please': 'begging won\'t help',
      'sorry': 'not sorry at all',
      'yes': 'obviously',
      'no': 'absolutely not',
      'okay': 'if you say so',
      'cool': 'whatever floats your boat',
      'awesome': 'mediocre at best',
      'friend': 'clown',
      'love': 'despise passionately',
      'I': 'this egomaniac',
      'Pope': 'soap breath',
      'quickly': 'like a caffeinated squirrel',
      'happy': 'giggly as a jellybean',
      'run': 'zoom like a rocket-powered toaster'
    }
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'insultCountUpdate') {
    // Forward insult count updates to popup if it's open
    chrome.runtime.sendMessage(request);
  }
});

// Handle extension icon click (optional - could open popup or activate)
chrome.action.onClicked.addListener((tab) => {
  // This is optional since we have a popup
  // Could be used for quick activation/deactivation
  console.log('Errorly icon clicked on tab:', tab.id);
});

// Keep service worker alive
chrome.runtime.onStartup.addListener(() => {
  console.log('Errorly service worker started');
});