chrome.storage.local.set({ active: 'active' });

chrome.storage.local.get('cogit_repo').then((data) => {
  const repo = data.cogit_repo;
  if (repo) {
    chrome.storage.sync.set({ cogit_repo: repo }, () => {
      chrome.storage.local.remove('cogit_repo');
    });
  }
});
