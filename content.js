// Errorly - The Mean Autocorrect Content Script
// Replaces words with insulting, sarcastic alternatives

let isActive = false;
let currentMode = 'LIVE';
let insultCount = 0;
let replacements = {
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
};

// Track processed elements to avoid duplicates
const processedElements = new WeakSet();
const inputListeners = new Map();

// Load settings on startup
chrome.storage.local.get(['isActive', 'mode', 'insultCount', 'dictionary'], (result) => {
  isActive = result.isActive !== false; // Default to true
  currentMode = result.mode || 'LIVE';
  insultCount = result.insultCount || 0;
  if (result.dictionary) {
    replacements = result.dictionary;
  }
  if (isActive) {
    activate();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request || !request.action) return;

  switch (request.action) {
    case 'updateActivation':
      isActive = request.isActive;
      console.log('Errorly activation updated:', isActive);
      if (isActive) {
        activate();
      } else {
        deactivate();
      }
      break;
      
    case 'updateMode':
      currentMode = request.mode;
      console.log('Errorly mode updated:', currentMode);
      // Refresh input listeners for the new mode
      console.log('Refreshing input listeners for mode:', currentMode);
      refreshInputListeners();
      break;
      
    case 'updateDictionary':
      replacements = request.dictionary;
      console.log('Errorly dictionary updated:', replacements);
      break;
      
    case 'activate':
      isActive = true;
      activate();
      break;
      
    case 'deactivate':
      isActive = false;
      deactivate();
      break;
  }
});

function activate() {
  if (!isActive) return;
  
  console.log('Errorly activated in', currentMode, 'mode');
  
  // Process existing page content
  processPageContent();
  
  // Set up mutation observer for dynamic content
  setupMutationObserver();
  
  // Set up input listeners for editable fields
  setupInputListeners();
}

function deactivate() {
  console.log('Errorly deactivated');
  
  // Remove all input listeners
  inputListeners.forEach((listeners, element) => {
    if (listeners.inputListener) {
      element.removeEventListener('input', listeners.inputListener);
    }
    if (listeners.keydownListener) {
      element.removeEventListener('keydown', listeners.keydownListener);
    }
  });
  inputListeners.clear();
  
  // Clear processed elements
  processedElements.clear();
}

function processPageContent() {
  // Process all text nodes in the document
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while (node = walker.nextNode()) {
    if (!processedElements.has(node)) {
      processTextNode(node);
      processedElements.add(node);
    }
  }
}

function processTextNode(textNode) {
  if (!textNode || !textNode.parentElement) return;
  
  const parent = textNode.parentElement;
  
  // Skip scripts, styles, and form elements
  if (parent.tagName === 'SCRIPT' || 
      parent.tagName === 'STYLE' || 
      parent.tagName === 'NOSCRIPT' ||
      parent.isContentEditable ||
      parent.tagName === 'INPUT' ||
      parent.tagName === 'TEXTAREA') {
    return;
  }

  let text = textNode.nodeValue;
  let originalText = text;
  
  // Apply replacements
  for (const [word, replacement] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
    text = text.replace(regex, (match) => {
      // Preserve original casing
      if (match === match.toUpperCase()) {
        return replacement.toUpperCase();
      } else if (match === match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      } else {
        return replacement.toLowerCase();
      }
    });
  }
  
  // Update text if changed
  if (text !== originalText) {
    textNode.nodeValue = text;
    incrementInsultCount();
  }
}

function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Process new text nodes
          const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );
          
          let textNode;
          while (textNode = walker.nextNode()) {
            if (!processedElements.has(textNode)) {
              processTextNode(textNode);
              processedElements.add(textNode);
            }
          }
          
          // Check for new editable fields
          if (isEditableField(node)) {
            setupFieldListener(node);
          }
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function setupInputListeners() {
  // Find existing editable fields
  const editableFields = document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');
  editableFields.forEach(setupFieldListener);
}

function refreshInputListeners() {
  console.log('Refreshing input listeners. Current mode:', currentMode);
  
  // Clear existing listeners
  inputListeners.forEach((listeners, element) => {
    if (listeners.inputListener) {
      element.removeEventListener('input', listeners.inputListener);
    }
    if (listeners.keydownListener) {
      element.removeEventListener('keydown', listeners.keydownListener);
    }
  });
  inputListeners.clear();
  
  // Re-setup listeners for all processed fields
  const editableFields = document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');
  console.log('Found editable fields:', editableFields.length);
  editableFields.forEach(setupFieldListener);
}

function setupFieldListener(field) {
  if (processedElements.has(field)) return;
  
  console.log('Setting up field listener for:', field.tagName, 'Mode:', currentMode);
  processedElements.add(field);
  
  // Always set up both listeners, but only activate based on current mode
  const inputListener = (event) => {
    console.log('Input event triggered:', event.type, 'Mode:', currentMode, 'Field:', field.tagName);
    if (currentMode === 'LIVE' && event.type === 'input') {
      console.log('Processing LIVE mode replacement for field:', field);
      processEditableField(field, true);
    }
  };
  
  const keydownListener = (event) => {
    if (currentMode === 'ENTER' && event.key === 'Enter') {
      processEditableField(field, false);
    }
  };
  
  field.addEventListener('input', inputListener);
  field.addEventListener('keydown', keydownListener);
  
  // Store both listeners
  inputListeners.set(field, { inputListener, keydownListener });
}

function processEditableField(field, isLiveMode) {
  if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
    // Input/textarea elements
    let value = field.value;
    let originalValue = value;
    
    // Apply replacements
    for (const [word, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
      value = value.replace(regex, (match) => {
        if (match === match.toUpperCase()) {
          return replacement.toUpperCase();
        } else if (match === match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        } else {
          return replacement.toLowerCase();
        }
      });
    }
    
    if (value !== originalValue) {
      field.value = value;
      incrementInsultCount();
    }
    
  } else if (field.isContentEditable) {
    // Contenteditable elements
    let innerText = field.innerText;
    let originalText = innerText;
    
    // Apply replacements
    for (const [word, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
      innerText = innerText.replace(regex, (match) => {
        if (match === match.toUpperCase()) {
          return replacement.toUpperCase();
        } else if (match === match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        } else {
          return replacement.toLowerCase();
        }
      });
    }
    
    if (innerText !== originalText) {
      field.innerText = innerText;
      incrementInsultCount();
    }
  }
}

function isEditableField(element) {
  return element.tagName === 'INPUT' || 
         element.tagName === 'TEXTAREA' || 
         element.isContentEditable === 'true';
}

function incrementInsultCount() {
  insultCount++;
  
  // Update popup
  chrome.runtime.sendMessage({
    action: 'insultCountUpdate',
    count: insultCount
  });
  
  // Save to storage
  chrome.storage.local.set({ insultCount });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Auto-activate when page loads
document.addEventListener('DOMContentLoaded', () => {
  if (isActive) {
    activate();
  }
});

// Also activate if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (isActive) {
      activate();
    }
  });
} else {
  if (isActive) {
    activate();
  }
}
