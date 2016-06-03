var bootstraped = false;

function bootstrap() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    activeTabId = tabs[0].id

    chrome.tabs.insertCSS(activeTabId, {file: "spell/spell.css"});
    chrome.tabs.executeScript(activeTabId, {file: "typo/typo.js"});
    chrome.tabs.executeScript(activeTabId, {file: "spell/spell.js"});
    bootstraped = true;
  });
}

function toggleSpellCheck() {
  if (!bootstraped) {
    bootstrap();
  }
  else {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { command: 'toggle-spell-check'});
    });
  }
}

chrome.browserAction.onClicked.addListener(bootstrap);

chrome.commands.onCommand.addListener(function(command) {
  if (command === 'toggle-spell-check') {
    toggleSpellCheck();
  }
});