let currentTypingSession = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "emulateTyping") {
    console.log("Action received: emulateTyping");
    currentTypingSession = Math.random().toString(); // Create a new unique typing session identifier
    navigator.clipboard.readText().then(clipText => emulateTyping(clipText, currentTypingSession));
  } else if (request.action === "stopTyping") {
    currentTypingSession = null; // Invalidate the current typing session
  }
});

function emulateTyping(text, session) {
  const activeElement = document.activeElement;
  let i = 0;

  function typeNextCharacter() {
    if (i < text.length && session === currentTypingSession) { // Only continue typing if this session is still valid
      activeElement.value += text[i++];
      
      let delay = Math.random() * (200 - 50) + 50;

      if (Math.random() < 0.05) {
        delay += Math.random() * (700 - 200) + 200; 
      }

      setTimeout(typeNextCharacter, delay);
    }
  }

  typeNextCharacter();
}