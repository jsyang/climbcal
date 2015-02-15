var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');

var convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText
});

module.exports = function (html) {
    return convertHTML(
        {
            getVNodeKey: function (attributes) {
                return attributes.id;
            }
        },
        html.trim()
    );
};
