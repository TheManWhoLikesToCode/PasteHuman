

let currentTypingSession = null;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //console.log("content.js: Message received:", request.action); // Log message received

    if (request.action === "emulateTyping") {
        //console.log("content.js: Action received: emulateTyping");
        let settings = request.settings;
        currentTypingSession = Math.random().toString(); // Create a new unique typing session identifier
        navigator.clipboard.readText().then((clipText) => {
            //console.log("content.js: Clipboard text read:", clipText); // Log clipboard text
            emulateTyping(clipText, currentTypingSession, request.delayedStart, settings);
        });
    } else if (request.action === "stopTyping") {
        currentTypingSession = null; // Invalidate the current typing session
    }
});

// Listen for any keydown event at the window level
window.addEventListener("keydown", function () {
    currentTypingSession = null; // Invalidate the current typing session
    //console.log("content.js: Keydown event detected"); // Log keydown event
});

function emulateTyping(text, session, delayedStart, settings) {
    const activeElement = document.activeElement;
    //console.log("content.js: Active element:", activeElement); // Log the active element

    let i = 0;

    const startTyping = function () {
        function typeNextCharacter() {
           // console.log("content.js: Typing character", text[i]); // Log character being typed

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

                // Set the initial delay to a random value between MIN_DELAY and MAX_DELAY.
                // This simulates the natural variation in the time it takes a human to press each key.
                let delay = Math.random() * (settings.maxDelay - settings.minDelay) + settings.minDelay;

                // With a 5% chance, add an additional delay to the base delay.
                // This simulates the occasional longer pauses a human might take while typing, such as when thinking or moving from one part of the keyboard to another.
                if (Math.random() < settings.extraDelayChance) {
                    delay += Math.random() * (settings.extraDelayMax - settings.extraDelayMin) + settings.extraDelayMin;
                }

                setTimeout(typeNextCharacter, delay);
            }
        }

        typeNextCharacter();
    };

    if (delayedStart) {
        //console.log("content.js: Starting typing with a delay");
        setTimeout(startTyping, 0); // Delay is in milliseconds
    } else {
        startTyping();
    }
}
