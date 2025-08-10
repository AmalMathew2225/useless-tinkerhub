document.addEventListener('DOMContentLoaded', () => {
  const extensionToggle = document.getElementById('extensionToggle');
  const activationDescription = document.getElementById('activationDescription');
  const liveModeBtn = document.getElementById('liveMode');
  const enterModeBtn = document.getElementById('enterMode');
  const modeDescription = document.getElementById('modeDescription');
  const currentModeDisplay = document.getElementById('currentMode');
  const insultCountDisplay = document.getElementById('insultCount');
  const dictionaryEditor = document.getElementById('dictionaryEditor');
  const saveDictionaryBtn = document.getElementById('saveDictionary');

  let isExtensionActive = true;
  let currentMode = 'LIVE';
  let insultCount = 0;

  // Load saved settings
  chrome.storage.local.get(['isActive', 'mode', 'insultCount', 'dictionary'], (result) => {
    isExtensionActive = result.isActive !== false; // Default to true
    currentMode = result.mode || 'LIVE';
    insultCount = result.insultCount || 0;
    
    updateActivationDisplay();
    updateModeDisplay();
    updateInsultCount();
    loadDictionary(result.dictionary);
  });

  // Extension toggle
  extensionToggle.addEventListener('click', () => {
    isExtensionActive = !isExtensionActive;
    updateActivationDisplay();
    saveSettings();
    sendActivationToContentScript();
  });

  // Mode switching
  liveModeBtn.addEventListener('click', () => {
    if (!isExtensionActive) return; // Don't allow mode changes when inactive
    currentMode = 'LIVE';
    updateModeDisplay();
    saveSettings();
    sendModeToContentScript();
  });

  enterModeBtn.addEventListener('click', () => {
    if (!isExtensionActive) return; // Don't allow mode changes when inactive
    currentMode = 'ENTER';
    updateModeDisplay();
    saveSettings();
    sendModeToContentScript();
  });

  // Save dictionary
  saveDictionaryBtn.addEventListener('click', () => {
    try {
      const dictionaryText = dictionaryEditor.value;
      const dictionary = JSON.parse(dictionaryText);
      
      chrome.storage.local.set({ dictionary }, () => {
        saveDictionaryBtn.textContent = 'SAVED!';
        saveDictionaryBtn.style.background = '#00aa00';
        
        setTimeout(() => {
          saveDictionaryBtn.textContent = 'SAVE DICTIONARY';
          saveDictionaryBtn.style.background = '#ff0000';
        }, 2000);
        
        sendDictionaryToContentScript(dictionary);
      });
    } catch (error) {
      alert('Invalid JSON! Please check your dictionary format.');
    }
  });

  function updateActivationDisplay() {
    if (isExtensionActive) {
      extensionToggle.classList.add('active');
      extensionToggle.classList.remove('inactive');
      extensionToggle.textContent = 'EXTENSION ON';
      activationDescription.textContent = 'ERRORLY is currently ACTIVE and ready to make text meaner!';
    } else {
      extensionToggle.classList.remove('active');
      extensionToggle.classList.add('inactive');
      extensionToggle.textContent = 'EXTENSION OFF';
      activationDescription.textContent = 'ERRORLY is currently INACTIVE. Words will NOT be replaced.';
    }
    
    // Update mode display to reflect activation state
    updateModeDisplay();
  }

  function updateModeDisplay() {
    if (currentMode === 'LIVE') {
      liveModeBtn.classList.add('active');
      enterModeBtn.classList.remove('active');
      modeDescription.textContent = 'LIVE: Words get replaced as you type. ENTER: Words get replaced when you press Enter.';
    } else {
      enterModeBtn.classList.add('active');
      liveModeBtn.classList.remove('active');
      modeDescription.textContent = 'ENTER: Words get replaced when you press Enter. LIVE: Words get replaced as you type.';
    }
    
    // Disable mode buttons when extension is inactive
    if (!isExtensionActive) {
      liveModeBtn.disabled = true;
      enterModeBtn.disabled = true;
      liveModeBtn.style.opacity = '0.5';
      enterModeBtn.style.opacity = '0.5';
      modeDescription.textContent = 'Extension is inactive. Mode selection disabled.';
    } else {
      liveModeBtn.disabled = false;
      enterModeBtn.disabled = false;
      liveModeBtn.style.opacity = '1';
      enterModeBtn.style.opacity = '1';
      // Restore normal mode description
      if (currentMode === 'LIVE') {
        modeDescription.textContent = 'LIVE: Words get replaced as you type. ENTER: Words get replaced when you press Enter.';
      } else {
        modeDescription.textContent = 'ENTER: Words get replaced when you press Enter. LIVE: Words get replaced as you type.';
      }
    }
    
    currentModeDisplay.textContent = currentMode;
  }

  function updateInsultCount() {
    insultCountDisplay.textContent = insultCount;
  }

  function loadDictionary(savedDictionary) {
    const defaultDictionary = {
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

    const dictionary = savedDictionary || defaultDictionary;
    dictionaryEditor.value = JSON.stringify(dictionary, null, 2);
  }

  function saveSettings() {
    chrome.storage.local.set({
      isActive: isExtensionActive,
      mode: currentMode,
      insultCount: insultCount
    });
  }

  function sendModeToContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateMode',
          mode: currentMode
        });
      }
    });
  }

  function sendDictionaryToContentScript(dictionary) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateDictionary',
          dictionary: dictionary
        });
      }
    });
  }

  function sendActivationToContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateActivation',
          isActive: isExtensionActive
        });
      }
    });
  }

  // Listen for insult count updates from content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'insultCountUpdate') {
      insultCount = request.count;
      updateInsultCount();
      saveSettings();
    }
  });
});