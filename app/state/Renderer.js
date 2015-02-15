var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

module.exports = {

  rootNode : undefined,
  lastVTree: undefined,

  initialize: function (newTree) {
    // Clear the old root node.
    // http://jsperf.com/innerhtml-vs-removechild/15
    while (document.body.lastChild) {
      document.body.removeChild(document.body.lastChild);
    }

    this.lastVTree = newTree;
    this.rootNode = createElement(this.lastVTree);
    document.body.appendChild(this.rootNode);
  },

  update: function (newTree) {
    var patches = diff(this.lastVTree, newTree);
    this.rootNode = patch(this.rootNode, patches);
    this.lastVTree = newTree;
  }
};
