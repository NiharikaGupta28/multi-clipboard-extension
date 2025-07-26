// background.js

// Listener for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "copyText") {
        const copiedText = request.text;
        console.log("Background script received copied text:", copiedText);

        // Get current history AND the maxHistoryItems limit from storage
        chrome.storage.sync.get(['clipboardHistory', 'maxHistoryItems'], (result) => {
            const history = result.clipboardHistory || [];
            // Define a default if the user hasn't set a limit yet
            const MAX_HISTORY_ITEMS_DEFAULT = 50;
            const maxItemsLimit = result.maxHistoryItems !== undefined ? result.maxHistoryItems : MAX_HISTORY_ITEMS_DEFAULT;

            history.unshift(copiedText); // Add new item to the beginning

            // Enforce the limit
            if (history.length > maxItemsLimit) {
                history.splice(maxItemsLimit); // Remove older items beyond the limit
            }

            chrome.storage.sync.set({ clipboardHistory: history }, () => {
                console.log("Clipboard history updated:", history);
                console.log("Current history length:", history.length, "Max limit:", maxItemsLimit); // Added for debugging
                sendResponse({ status: "success", message: "History updated" });
            });
        });
        return true; // Indicates an asynchronous response
    }
});

// Existing chrome.commands.onCommand.addListener code (if you added Feature 1)
// If you've already added Feature 1 (Keyboard Shortcuts), keep that code here.