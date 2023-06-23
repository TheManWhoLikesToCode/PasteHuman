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
  console.log('background.js: Context menu clicked:', info.menuItemId); // Log context menu item clicked

  if (info.menuItemId === "pasteHuman") {
    chrome.tabs.sendMessage(tab.id, { action: "emulateTyping" });
  } else if (info.menuItemId === "stopPasteHuman") {
    chrome.tabs.sendMessage(tab.id, { action: "stopTyping" });
  }
});
