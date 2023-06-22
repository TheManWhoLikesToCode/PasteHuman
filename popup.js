document.getElementById('startTyping').addEventListener('click', function() {
  chrome.runtime.sendMessage({
    action: 'emulateTyping',
    delayedStart: true, // Notify the content script that the typing should start with a delay
  });
  console.log("PasteHuman Action sent: emulateTyping");
});
