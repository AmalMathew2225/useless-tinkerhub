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
  console.log('Content script loaded with settings:', { isActive, currentMode, insultCount });
  
  // Always try to activate when content script loads
  if (isActive && (document.readyState === 'complete' || document.readyState === 'interactive')) {
    activate();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request || !request.action) return;

  switch (request.action) {
    case 'ping':
      // Respond to ping to confirm content script is loaded
      sendResponse({ status: 'ok', mode: currentMode, isActive: isActive });
      break;
      
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
  if (!document.body) {
    console.log('Document body not ready yet');
    return;
  }
  
  console.log('Processing page content...');
  
  // Process all text nodes in the document
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip empty text nodes and whitespace-only nodes
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        
        // Skip scripts, styles, and form elements
        if (parent.tagName === 'SCRIPT' || 
            parent.tagName === 'STYLE' || 
            parent.tagName === 'NOSCRIPT' ||
            parent.isContentEditable ||
            parent.tagName === 'INPUT' ||
            parent.tagName === 'TEXTAREA') {
          return NodeFilter.FILTER_REJECT;
        }
        
        return NodeFilter.FILTER_ACCEPT;
      }
    },
    false
  );

  let node;
  let processedCount = 0;
  while (node = walker.nextNode()) {
    if (!processedElements.has(node)) {
      const wasProcessed = processTextNode(node);
      if (wasProcessed) processedCount++;
      processedElements.add(node);
    }
  }
  
  console.log(`Processed ${processedCount} text nodes`);
}

function processTextNode(textNode) {
  if (!textNode || !textNode.parentElement || !textNode.nodeValue) return false;
  
  const parent = textNode.parentElement;
  
  // Skip scripts, styles, and form elements
  if (parent.tagName === 'SCRIPT' || 
      parent.tagName === 'STYLE' || 
      parent.tagName === 'NOSCRIPT' ||
      parent.isContentEditable ||
      parent.tagName === 'INPUT' ||
      parent.tagName === 'TEXTAREA') {
    return false;
  }

  let text = textNode.nodeValue;
  let originalText = text;
  
  console.log('Processing text:', text.substring(0, 50) + '...');
  
  // Apply replacements
  for (const [word, replacement] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
    text = text.replace(regex, (match) => {
      console.log(`Replacing "${match}" with "${replacement}"`);
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
    console.log('Text updated from:', originalText.substring(0, 50), 'to:', text.substring(0, 50));
    return true;
  }
  
  return false;
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
  const editableFields = document.querySelectorAll('input[type="text"], input:not([type]), textarea, [contenteditable="true"]');
  console.log(`Found ${editableFields.length} editable fields`);
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
  
  // Re-setup listeners for all fields
  const editableFields = document.querySelectorAll('input[type="text"], input:not([type]), textarea, [contenteditable="true"]');
  console.log(`Refreshing listeners for ${editableFields.length} fields`);
  editableFields.forEach(setupFieldListener);
}

function setupFieldListener(field) {
  if (inputListeners.has(field)) return;
  
  console.log('Setting up field listener for:', field.tagName, 'Mode:', currentMode);
  
  const inputListener = (event) => {
    if (currentMode === 'LIVE' && event.type === 'input') {
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
  console.log('Processing editable field:', field.tagName, 'Live mode:', isLiveMode);
  
  if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
    // Input/textarea elements
    let value = field.value;
    let originalValue = value;
    const originalCursorStart = field.selectionStart;
    const originalCursorEnd = field.selectionEnd;
    
    console.log('Original value:', value, 'Cursor at:', originalCursorStart, '-', originalCursorEnd);
    
    const result = processTextWithCursorTracking(value, originalCursorStart, originalCursorEnd, replacements);
    
    if (result.text !== originalValue) {
      field.value = result.text;
      
      // Set the cursor position based on our tracking
      if (field.setSelectionRange) {
        console.log(`Setting cursor position to ${result.newCursorStart} (was ${originalCursorStart})`);
        field.setSelectionRange(result.newCursorStart, result.newCursorStart);
      }
      
      incrementInsultCount();
      console.log('Field updated to:', result.text);
    }
    
  } else if (field.isContentEditable) {
    // Contenteditable elements - more complex due to DOM structure
    const selection = window.getSelection();
    let savedRange = null;
    
    // Save current selection/cursor position
    if (selection.rangeCount > 0) {
      savedRange = selection.getRangeAt(0).cloneRange();
    }
    
    let innerText = field.innerText;
    let originalText = innerText;
    
    // Apply replacements
    for (const [word, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
      innerText = innerText.replace(regex, (match) => {
        console.log(`Replacing contenteditable "${match}" with "${replacement}"`);
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
      
      // Try to restore cursor position (basic implementation for contenteditable)
      if (savedRange) {
        try {
          selection.removeAllRanges();
          // For contenteditable, we'll place cursor at the end for now
          // A more sophisticated implementation would track DOM node positions
          const range = document.createRange();
          range.selectNodeContents(field);
          range.collapse(false);
          selection.addRange(range);
        } catch (e) {
          console.log('Could not restore cursor position in contenteditable');
        }
      }
      
      incrementInsultCount();
      console.log('Contenteditable updated to:', innerText);
    }
  }
}

function processTextWithCursorTracking(text, cursorStart, cursorEnd, replacements) {
  let newText = text;
  let newCursorStart = cursorStart;
  let adjustments = []; // Track all position adjustments
  
  // First pass: find all matches and their positions
  const matches = [];
  for (const [word, replacement] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Determine the replacement with proper casing
      let finalReplacement;
      if (match[0] === match[0].toUpperCase()) {
        finalReplacement = replacement.toUpperCase();
      } else if (match[0] === match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase()) {
        finalReplacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
      } else {
        finalReplacement = replacement.toLowerCase();
      }
      
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        original: match[0],
        replacement: finalReplacement,
        lengthDiff: finalReplacement.length - match[0].length
      });
    }
  }
  
  // Sort matches by position (earliest first)
  matches.sort((a, b) => a.start - b.start);
  
  // Apply replacements from right to left to maintain position accuracy
  let cumulativeOffset = 0;
  
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const adjustedStart = match.start;
    const adjustedEnd = match.end;
    
    console.log(`Replacing "${match.original}" with "${match.replacement}" at position ${adjustedStart}-${adjustedEnd}`);
    
    // Replace the text
    newText = newText.substring(0, adjustedStart) + match.replacement + newText.substring(adjustedEnd);
    
    // Adjust cursor position based on where the replacement occurred
    if (cursorStart > adjustedEnd) {
      // Cursor is after the replacement, shift it by the length difference
      newCursorStart += match.lengthDiff;
    } else if (cursorStart >= adjustedStart && cursorStart <= adjustedEnd) {
      // Cursor is within the word being replaced
      // Position cursor at the start of the replacement
      newCursorStart = adjustedStart;
    }
    // If cursor is before the replacement, no adjustment needed
  }
  
  // Ensure cursor position is within bounds
  newCursorStart = Math.max(0, Math.min(newText.length, newCursorStart));
  
  return {
    text: newText,
    newCursorStart: newCursorStart,
    newCursorEnd: newCursorStart // For now, we don't maintain selection ranges
  };
}

function isEditableField(element) {
  return element.tagName === 'INPUT' || 
         element.tagName === 'TEXTAREA' || 
         element.isContentEditable === true;
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
console.log('Content script loading...');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    chrome.storage.local.get(['isActive'], (result) => {
      if (result.isActive !== false) {
        setTimeout(() => activate(), 100); // Small delay to ensure DOM is ready
      }
    });
  });
} else {
  console.log('DOM already loaded, checking activation...');
  // DOM is already loaded
  chrome.storage.local.get(['isActive'], (result) => {
    if (result.isActive !== false) {
      setTimeout(() => activate(), 100);
    }
  });
}

// Also listen for window load as backup
window.addEventListener('load', () => {
  console.log('Window load event fired');
  chrome.storage.local.get(['isActive'], (result) => {
    if (result.isActive !== false && !processedElements.size) {
      setTimeout(() => activate(), 100);
    }
  });
});