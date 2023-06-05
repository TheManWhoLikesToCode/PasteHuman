document.getElementById('start').addEventListener('click', () => {
    let inputText = document.getElementById('inputText').value;
    let wpm = document.getElementById('wpm').value;
    let randomness = document.getElementById('randomness').value;
  
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {inputText, wpm, randomness});
    });
  });
  