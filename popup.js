document.getElementById('startTyping').addEventListener('click', function() {
  //console.log("popup.js: Start typing button clicked");

  // Using a timeout function to delay the message being sent by 5 seconds
  setTimeout(function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var currentTab = tabs[0]; // There should be only one in this array
          //console.log(`popup.js: Sending message to tab ${currentTab.id}`);
          chrome.tabs.sendMessage(currentTab.id, {
              action: 'emulateTyping',
              delayedStart: true,
          }, function(response) {
              //console.log("popup.js: Message sent: emulateTyping");
          });
      });
  }, 5000); // 5000 milliseconds (5 seconds) delay
});
