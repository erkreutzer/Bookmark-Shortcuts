(function() {
    var handleRequest = function(req, sender, sendResponse) {
        // We don't need to send anything so respond quickly
        sendResponse();

        // Request all bookmarks from chrome and then handle
        // the request
        chrome.bookmarks.getTree(function(allBookmarks) {
            // allBookmarks is the root of the tree

            // We need to get to the bookmarksbar
            var bookmarksBar = allBookmarks[0].children[0].children;

            // Shift the 0 to the correct position
            var key = req.key === 0 ? 9 : req.key - 1;

            var desiredItem = bookmarksBar[key];
            if (desiredItem && desiredItem.url) {
                var url = desiredItem.url;

                if (url.indexOf("javascript:") === 0) {
                    // JavaScript bookmarklets need to be decoded and then
                    // we execute them to avoid the popupblocker
                    chrome.tabs.executeScript(sender.tab.id, {code: decodeURIComponent(desiredItem.url)});
                } else {
                    if (req.newTab) {
                        chrome.tabs.create({'url': url, active: true, openerTabId: sender.tab.id})
                    } else {
                        chrome.tabs.update(sender.tab.id, {'url': url});
                    }
                }
            }
        });
    };

    // Register our event listener for passing information from page
    // to our background javascript
    chrome.extension.onRequest.addListener(handleRequest);
})();