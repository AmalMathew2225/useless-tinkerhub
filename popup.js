document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('activateChaos'); // ensure this ID exists in popup.html
  let enabled = false;

  btn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    enabled = !enabled;
    btn.textContent = enabled ? 'Deactivate Chaos' : 'Activate Chaos';

    chrome.tabs.sendMessage(tab.id, {
      action: enabled ? 'activate' : 'deactivate',
      thesaurusMode: false
    });
  });
});