var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');

exports.convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText
});
