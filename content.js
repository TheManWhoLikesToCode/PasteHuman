let currentTypingSession = null;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "emulateTyping") {
    console.log("PasteHuman Action received: emulateTyping");
    currentTypingSession = Math.random().toString(); // Create a new unique typing session identifier
    navigator.clipboard
      .readText()
      .then((clipText) =>
        emulateTyping(clipText, currentTypingSession, request.delayedStart)
      );
  } else if (request.action === "stopTyping") {
    currentTypingSession = null; // Invalidate the current typing session
  }
});

// Listen for any keydown event at the window level
window.addEventListener("keydown", function () {
  currentTypingSession = null; // Invalidate the current typing session
});

function emulateTyping(text, session, delayedStart) {
  const activeElement = document.activeElement;
  let i = 0;

  const startTyping = function () {
    function typeNextCharacter() {
      if (i < text.length && session === currentTypingSession) {
        // Create a KeyboardEvent instance
        let event = new KeyboardEvent("keydown", {
          key: text[i],
          code: "Key" + text[i].toUpperCase(),
          charCode: text[i].charCodeAt(0),
          keyCode: text[i].charCodeAt(0),
          which: text[i].charCodeAt(0),
        });

        // Dispatch the event
        activeElement.dispatchEvent(event);

        // Attempt to insert the text using document.execCommand
        document.execCommand("insertText", false, text[i++]);

        let delay = Math.random() * (200 - 50) + 50;

        if (Math.random() < 0.05) {
          delay += Math.random() * (700 - 200) + 200;
        }

        setTimeout(typeNextCharacter, delay);
      }
    }

    typeNextCharacter();
  };

  if (delayedStart) {
    setTimeout(startTyping, 5000); // Delay is in milliseconds
  } else {
    startTyping();
  }
}
