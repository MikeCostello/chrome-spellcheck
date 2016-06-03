var utilityDict = new Typo();
var affData = utilityDict._readFile(chrome.extension.getURL('typo/dictionaries/en_US/en_US.aff'));
var wordData = utilityDict._readFile(chrome.extension.getURL('typo/dictionaries/en_US/en_US.dic'));

var dict = new Typo('en_US', affData, wordData);
var ignore = 'style script textarea code canvas'.replace(/\w+/g, '$&, $& *,').slice(0, -1);
var pElm;

function textNodesUnder(elm){
  var n;
  var a = [];
  var walk = document.createTreeWalker(elm, NodeFilter.SHOW_TEXT, null, false);

  while(n = walk.nextNode()) {
    a.push(n);
  }
  return a;
}

function clean(word) {
  return word.replace('’', '\'')
          .replace(/^'*(.*?)'*$/,'$1')
          .replace('_', '');
}

function replaceMarkers(elm) {
  if (elm) {
    elm.innerHTML = elm.innerHTML.replace(/##@(.*?)@##/g, '<span class="misspelled">$1</span>');
  }
}

function toggleSpellCheck() {
  document.body.classList.toggle('ext-spell-check');
}

chrome.runtime.onMessage.addListener(function(message, sender) {
  if (message.command === 'toggle-spell-check') {
    toggleSpellCheck();
  }
});

textNodesUnder(document.body).forEach(function(n) {
  var text = n.nodeValue;
  var words = text.match(/[’'\w]+/g);
  var elm = n.parentElement;
  var unmarked;

  if (!words || elm.matches(ignore)) { return; }

  words.forEach(function(word) {
    if ( !dict.check(clean(word)) && !/^\d+$/.test(word)) {
      unmarked = new RegExp('\\b' + word + '(?!@##)\\b', 'g');
      text = text.replace(unmarked, '##@$&@##');
    }
  });

  n.nodeValue = text;

  if (!pElm) {
    pElm = elm;
  } else if (!pElm.contains(elm)) {
    replaceMarkers(pElm);
    pElm = elm;
  }
});

replaceMarkers(pElm);
document.body.classList.add('ext-spell-check');