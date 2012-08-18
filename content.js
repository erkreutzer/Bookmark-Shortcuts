(function() {
    // Generate allowed keycodes for 0-9
    var codes = {};
    var i = 48, n = 0;
    while (i < 58) { codes[i++] = n++};
    // These are the accepted states of keycodes
    var expectedModifiers = {
        ctrlKey: true,
        altGraphKey: false,
        altKey: false,
        metaKey: false
    };

    /**
     * Check if all of the key/value pairs in 
     * desired exist and equal those in target
     * @param target the object we are searching for desired attributes
     * @param desired the desired attributes 
     * @return true if all key/value pairs in desired exist in target,
     *         false otherwise
     */
    var matches = function(target, desired) {
        for (var key in desired) {
            if (!(desired.hasOwnProperty(key)
                  && target.hasOwnProperty(key)
                  && (target[key] === desired[key]))) {
                return false;
            }
        }
        return true;
    };

    /**
     * Key event handler. If we're a keycode and have the
     * correct modifiers then we message the background.js
     * part of the extension to trigger the correct bookmark.
     * @param KeyboardEvent event the event we're comparing against
     */
    var keyHandler = function(event) {
        if (codes.hasOwnProperty(event.keyCode) && matches(event, expectedModifiers)) {
            chrome.extension.sendRequest({key: codes[event.keyCode], newTab: event.shiftKey});
        }
    };

    // Setup the actual event listener
    document.addEventListener('keydown', keyHandler, false);
})();

