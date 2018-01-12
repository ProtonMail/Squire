var SCROLL_BUFFER = 10;

/**
 * Gets the scroll position of the element, bounded by the size.
 *
 * @param {DOMElement} scrollable
 * @return {object} Map with `x` and `y` keys.
 */
var getScrollPosition = function (scrollable) {
    var scrollPosition = {
        x: scrollable.scrollLeft,
        y: scrollable.scrollTop
    };

    var xMax = scrollable.scrollWidth - scrollable.clientWidth;
    var yMax = scrollable.scrollHeight - scrollable.clientHeight;

    scrollPosition.x = Math.max(0, Math.min(scrollPosition.x, xMax));
    scrollPosition.y = Math.max(0, Math.min(scrollPosition.y, yMax));

    return scrollPosition;
};

/**
 * Sets the scroll of the element.
 *
 * @param {DOMElement} root of the editor
 * @param {DOMElement} node that was inserted in to the root.
 */
var handleScroll = function (root, node) {
    var scrollPosition = getScrollPosition(root);

    var nodeTop = node.offsetTop;
    var nodeBottom = node.offsetHeight + nodeTop;
    var rootHeight = root.offsetHeight;
    var scrollBottom = rootHeight + scrollPosition.y;
    var scrollDelta = nodeBottom - scrollBottom;

    if (scrollDelta > 0) {
        root.scrollTop = Math.min(
            nodeTop - rootHeight / 2,
            root.scrollTop + scrollDelta + SCROLL_BUFFER
        );
    }
};
