var template = require('./EmojiPicker.dot');

var db = require('../../state/Database');

var className = 'EmojiPicker';

function renderAsync(state) {
  state = state || {};
  return db.emojis.toArray().then(function(emojis){
    state.emojis = emojis;
    return template(state);
  });
}

function close() {
  var el = document.querySelector('.EmojiPicker');
  el.parentNode.removeChild(el);
}

function onEmojiClick(e) {
  if(e.target.classList.contains('emoji')) {
    var emojiId = parseInt(e.target.getAttribute('data-id'), 10);
    e.stopPropagation();
    this.cb(emojiId, e.target.getAttribute('src'));
    close();
  }
}

module.exports = {
  className : className,
  renderAsync : renderAsync,

  init: function(state) {
    document.querySelector('.EmojiPicker .emoji-container')
      .addEventListener('click', onEmojiClick.bind(state));

    document.querySelector('.EmojiPicker .background')
      .addEventListener('click', close);
  }
};
