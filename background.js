chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'www.example.com'}, // set your desired host here
        })],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      let inputText = request.inputText;
      let wpm = request.wpm;
      let randomness = request.randomness;
  
      // convert WPM to characters per second
      let cps = wpm * 5 / 60;
  
      let index = 0;
      let interval = setInterval(() => {
        if (index < inputText.length) {
          window.document.activeElement.value += inputText.charAt(index);
          index++;
  
          // modify the interval with randomness
          let randomFactor = Math.random() * 2 * randomness - randomness;
          let time = (1 / cps) * (1 + randomFactor) * 1000;
          clearInterval(interval);
          interval = setInterval(type, time);
        } else {
          clearInterval(interval);
        }
      }, (1 / cps) * 1000);
    }
  );
  