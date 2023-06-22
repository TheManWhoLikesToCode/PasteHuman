chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "pasteHuman",
    title: "PasteHuman: Emulate typing",
    contexts: ["editable"],
  });

  chrome.contextMenus.create({
    id: "stopPasteHuman",
    title: "PasteHuman: Stop typing",
    contexts: ["editable"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "pasteHuman") {
    chrome.tabs.sendMessage(tab.id, { action: "emulateTyping" });
  } else if (info.menuItemId === "stopPasteHuman") {
    chrome.tabs.sendMessage(tab.id, { action: "stopTyping" });
  }
});
