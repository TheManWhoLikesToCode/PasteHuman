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

    // Set default settings
    const defaultSettings = {
        minDelay: 10,
        maxDelay: 75,
        extraDelayChance: 0.05,
        extraDelayMin: 20,
        extraDelayMax: 100,
    };

    chrome.storage.sync.set(defaultSettings, function () {
        console.log("Default settings saved");
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log("background.js: Context menu clicked:", info.menuItemId); // Log context menu item clicked

    if (info.menuItemId === "pasteHuman") {
        // Get settings from chrome.storage
        chrome.storage.sync.get(defaultSettings, function (items) {
            // Send settings along with action
            chrome.tabs.sendMessage(tab.id, { action: "emulateTyping", settings: items });
        });
    } else if (info.menuItemId === "stopPasteHuman") {
        chrome.tabs.sendMessage(tab.id, { action: "stopTyping" });
    }
});

chrome.commands.onCommand.addListener(function (command) {
    console.log("Command:", command);

    if (command === "emulateTyping") {
        // Get settings from chrome.storage
        chrome.storage.local.get(
            {
                minDelay: 50,
                maxDelay: 200,
                extraDelayChance: 0.05,
                extraDelayMin: 200,
                extraDelayMax: 700,
            },
            function (items) {
                // Send settings along with action
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "emulateTyping", settings: items });
                });
            }
        );
    } else if (command === "stopTyping") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "stopTyping" });
        });
    }
});
