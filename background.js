chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "emulateTyping",
    title: "Emulate typing",
    contexts: ["editable"],
  });

  chrome.contextMenus.create({
    id: "stopTyping",
    title: "Stop typing",
    contexts: ["editable"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "emulateTyping") {
    chrome.tabs.sendMessage(tab.id, { action: "emulateTyping" });
  } else if (info.menuItemId === "stopTyping") {
    chrome.tabs.sendMessage(tab.id, { action: "stopTyping" });
  }
});