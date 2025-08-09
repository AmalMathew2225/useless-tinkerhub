let isActive = false;
let thesaurusMode = false;

chrome.runtime.onMessage.addListener((request) => {
  if (request?.action === 'activate') {
    isActive = true;
    thesaurusMode = !!request.thesaurusMode;
    absurdAutocorrectPage();
  } else if (request?.action === 'deactivate') {
    isActive = false;
  } else if (request?.action === 'updateMode') {
    thesaurusMode = !!request.thesaurusMode;
  }
});

function absurdAutocorrectPage() {
  if (!isActive) return;

  const replacements = {
    'hello': 'greetings, earthling',
    'goodbye': 'farewell, mortal',
    'thank you': 'gratitude, kind stranger',
    'please': 'pretty please with sprinkles',
    'sorry': 'my deepest apologies, noble one',
    'yes': 'indubitably',
    'no': 'nay, never',
    'okay': 'poda patti',
    'cool': 'radical, dude',
    'awesome': 'absolutely magnificent',
    'quickly': 'like a caffeinated squirrel',
    'happy': 'giggly as a jellybean',
    'run': 'zoom like a rocket-powered toaster'
  };

  replaceTextInNode(document.body);

  function replaceTextInNode(node) {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (parent && (
        parent.tagName === 'SCRIPT' ||
        parent.tagName === 'STYLE' ||
        parent.tagName === 'NOSCRIPT' ||
        parent.isContentEditable ||
        parent.tagName === 'INPUT' ||
        parent.tagName === 'TEXTAREA'
      )) return;

      let text = node.nodeValue;
      for (const word in replacements) {
        const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
        text = text.replace(regex, replacements[word]);
      }
      node.nodeValue = text;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.childNodes.forEach(replaceTextInNode);
    }
  }
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}