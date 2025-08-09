// Errorly - The world's most unhelpful autocorrect extension
console.log("Errorly activated! Prepare for chaos! 🎭");

// Hilariously wrong corrections
const errorlyCorrections = {
  // Common words to mess up
  "the": ["teh", "thee", "da", "le"],
  "you": ["u", "yuo", "ewe", "gnu"],
  "and": ["adn", "nad", "ampersand", "plus"],
  "are": ["r", "arr", "our", "ear"],
  "for": ["four", "fore", "fur", "phor"],
  "that": ["taht", "hat", "cat", "bat"],
  "with": ["wiht", "whit", "width", "myth"],
  "have": ["hav", "half", "cave", "wave"],
  "this": ["tis", "dis", "his", "kiss"],
  "will": ["wil", "well", "pill", "bill"],
  "your": ["yur", "you're", "yor", "hour"],
  "from": ["form", "frum", "frog", "forum"],
  "they": ["dey", "thy", "thay", "gray"],
  "know": ["no", "now", "knee", "gnu"],
  "want": ["wnat", "won't", "went", "what"],
  "been": ["bean", "seen", "teen", "keen"],
  "good": ["god", "food", "mood", "hood"],
  "much": ["munch", "match", "mooch", "mulch"],
  "some": ["sum", "come", "home", "dome"],
  "time": ["tim", "lime", "mime", "dime"],
  "very": ["vary", "berry", "merry", "ferry"],
  "when": ["wen", "hen", "then", "wren"],
  "come": ["cum", "dome", "home", "comb"],
  "here": ["hear", "her", "beer", "deer"],
  "just": ["juts", "rust", "dust", "must"],
  "like": ["lick", "bike", "hike", "mike"],
  "over": ["oven", "lover", "cover", "hover"],
  "also": ["aloe", "alto", "Oslo", "salsa"],
  "back": ["bak", "sack", "pack", "hack"],
  "after": ["aft", "laughter", "rafter", "daft"],
  "use": ["us", "user", "fuse", "muse"],
  "two": ["too", "to", "tutu", "choo"],
  "how": ["cow", "now", "bow", "wow"],
  "work": ["wok", "word", "wore", "wort"],
  "first": ["fist", "thirst", "worst", "burst"],
  "well": ["we'll", "wall", "bell", "yell"],
  "way": ["weigh", "whey", "bay", "hay"],
  "even": ["eve", "oven", "seven", "eleven"],
  "new": ["mew", "few", "pew", "dew"],
  "years": ["ears", "beers", "tears", "gears"],
  "most": ["must", "moist", "ghost", "toast"],
  "give": ["gif", "gave", "live", "hive"],
  "day": ["gay", "bay", "hay", "may"],
  "same": ["shame", "tame", "game", "lame"],
  "these": ["cheese", "geese", "trees", "fees"],
  "used": ["used", "user", "fused", "mused"],
  "each": ["beach", "reach", "teach", "peach"],
  "which": ["witch", "whip", "rich", "itch"],
  "she": ["he", "sea", "see", "bee"],
  "many": ["manny", "money", "marry", "any"],
  "some": ["sum", "come", "home", "dome"],
  "what": ["wut", "hat", "cat", "bat"],
  "would": ["wood", "could", "wound", "should"],
  "make": ["mak", "cake", "take", "fake"],
  "like": ["lick", "bike", "hike", "mike"],
  "him": ["hem", "gym", "dim", "rim"],
  "into": ["in2", "onto", "unto", "info"],
  "has": ["as", "gas", "was", "jazz"],
  "more": ["mor", "door", "poor", "floor"],
  "her": ["he", "hair", "hear", "beer"],
  "two": ["too", "to", "tutu", "choo"],
  "go": ["goo", "no", "so", "do"],
  "see": ["sea", "bee", "pee", "tee"],
  "no": ["know", "now", "go", "so"],
  "if": ["iff", "of", "is", "it"],
  "out": ["oat", "our", "but", "cut"],
  "so": ["sew", "saw", "slow", "show"],
  "said": ["sad", "paid", "laid", "maid"],
  "what": ["wut", "hat", "cat", "bat"],
  "up": ["cup", "pup", "sup", "yup"],
  "its": ["it's", "tis", "sits", "bits"],
  "about": ["a bout", "doubt", "shout", "clout"],
  "who": ["hoo", "woo", "boo", "zoo"],
  "get": ["got", "net", "bet", "set"],
  "all": ["owl", "awl", "ill", "ell"],
  "were": ["where", "we're", "wore", "wire"],
  "when": ["wen", "hen", "then", "wren"],
  "there": ["their", "they're", "hear", "beer"],
  "can": ["can't", "ban", "man", "tan"],
  "had": ["has", "bad", "mad", "sad"],
  "do": ["doo", "due", "boo", "moo"],
  "get": ["got", "net", "bet", "set"],
  "may": ["maybe", "bay", "hay", "gay"],
  "him": ["hem", "gym", "dim", "rim"],
  "old": ["olds", "bold", "cold", "fold"],
  "see": ["sea", "bee", "pee", "tee"],
  "now": ["cow", "how", "bow", "wow"],
  "find": ["fund", "kind", "mind", "bind"],
  "any": ["Annie", "many", "penny", "nanny"],
  "day": ["gay", "bay", "hay", "may"],
  "get": ["got", "net", "bet", "set"],
  "man": ["men", "ban", "can", "tan"],
  "own": ["one", "won", "owe", "owl"],
  "say": ["says", "bay", "hay", "may"],
  "she": ["he", "sea", "see", "bee"],
  "may": ["maybe", "bay", "hay", "gay"],
  "use": ["us", "user", "fuse", "muse"]
};

// Fun responses when corrections happen
const errorlyResponses = [
  "✨ Fixed it for you! (You're welcome) ✨",
  "🎯 Errorly strikes again! 🎯", 
  "📝 Making your text 'better' since never! 📝",
  "🤖 Beep boop! Text has been 'improved'! 🤖",
  "🎪 Another successful un-correction! 🎪",
  "🌟 Errorly magic in action! 🌟",
  "🎭 Plot twist: Your text is now worse! 🎭",
  "🚀 Launched your text into chaos! 🚀",
  "🎨 Artistic interpretation complete! 🎨",
  "🎲 Rolled the dice on your words! 🎲"
];

let isErrorlyActive = true;

// Listen for storage changes
if (chrome.storage && chrome.storage.sync) {
  chrome.storage.sync.get(['errorlyEnabled'], (result) => {
    isErrorlyActive = result.errorlyEnabled !== false;
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.errorlyEnabled) {
      isErrorlyActive = changes.errorlyEnabled.newValue;
    }
  });
}

function getRandomCorrection(word) {
  const corrections = errorlyCorrections[word.toLowerCase()];
  if (corrections) {
    return corrections[Math.floor(Math.random() * corrections.length)];
  }
  return word;
}

function showErrorlyNotification() {
  const response = errorlyResponses[Math.floor(Math.random() * errorlyResponses.length)];
  
  // Create a fun notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    z-index: 9999999;
    animation: errorlyBounce 0.5s ease-out;
    cursor: pointer;
    font-family: 'Comic Sans MS', cursive, sans-serif;
  `;
  
  notification.textContent = response;
  
  // Add bounce animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes errorlyBounce {
      0% { transform: translateX(100px); opacity: 0; }
      50% { transform: translateX(-10px); opacity: 1; }
      100% { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'errorlyBounce 0.3s ease-in reverse';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
  
  // Click to dismiss
  notification.addEventListener('click', () => {
    notification.style.animation = 'errorlyBounce 0.3s ease-in reverse';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });
}

// Main text replacement function
function errorlyText(inputElement) {
  if (!isErrorlyActive || !inputElement.value) return;
  
  const words = inputElement.value.split(/(\s+)/);
  let changed = false;
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i].trim();
    if (word && Math.random() < 0.3) { // 30% chance to "correct"
      const newWord = getRandomCorrection(word);
      if (newWord !== word) {
        words[i] = words[i].replace(word, newWord);
        changed = true;
      }
    }
  }
  
  if (changed) {
    inputElement.value = words.join('');
    showErrorlyNotification();
    
    // Update correction count
    if (chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['correctionsCount'], (result) => {
        const newCount = (result.correctionsCount || 0) + 1;
        chrome.storage.sync.set({ correctionsCount: newCount });
      });
    }
  }
}

// Event listeners for different input types
function attachErrorlyListeners() {
  // Text inputs and textareas
  const inputs = document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');
  
  inputs.forEach(input => {
    if (!input.hasErrorlyListener) {
      input.hasErrorlyListener = true;
      
      // For regular inputs and textareas
      if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
        input.addEventListener('blur', () => errorlyText(input));
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === 'Tab') {
            setTimeout(() => errorlyText(input), 100);
          }
        });
      }
      
      // For contenteditable elements
      if (input.contentEditable === 'true') {
        input.addEventListener('blur', () => {
          const fakeInput = { value: input.textContent };
          errorlyText(fakeInput);
          input.textContent = fakeInput.value;
        });
      }
    }
  });
}

// Initialize and watch for new elements
attachErrorlyListeners();

// Watch for dynamically added elements
const observer = new MutationObserver(() => {
  attachErrorlyListeners();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log("🎭 Errorly is ready to make your text wonderfully wrong! 🎭");