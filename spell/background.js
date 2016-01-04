chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.insertCSS(null, {file: "spell/spell.css"});
  chrome.tabs.executeScript(null, {file: "typo/typo.js"});
  chrome.tabs.executeScript(null, {file: "spell/spell.js"});
});
