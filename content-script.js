// content-script.js

// Function to attach event listeners
function attachClipboardListeners() {
    // Reverting to document, but keeping 'true' for capture phase
    document.addEventListener('copy', handleClipboardEvent, true);
    document.addEventListener('cut', handleClipboardEvent, true);
    console.log("Clipboard event listeners attached.");
}

function handleClipboardEvent(event) {
    let copiedText = '';

    // Try to get data from clipboardData (standard and usually best)
    if (event.clipboardData) {
        copiedText = event.clipboardData.getData('text/plain');
    }

    // Fallback for when clipboardData might be empty (common for 'cut' on some sites/browsers)
    // or if it's a non-standard event handling
    if (!copiedText || copiedText.trim() === '') {
        const selection = window.getSelection(); // Still use window.getSelection() as it's a global method
        if (selection && selection.rangeCount > 0) {
            copiedText = selection.toString(); // Get the currently selected text
        }
    }

    if (copiedText && copiedText.trim() !== '') {
        console.log("Content script captured clipboard event. Text:", copiedText);

        chrome.runtime.sendMessage({
            action: "copyText",
            text: copiedText
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error sending message from content script:", chrome.runtime.lastError.message);
            } else {
                console.log("Message sent to background script. Response:", response);
            }
        });
    }
}

// Attach listeners.
attachClipboardListeners(); // Attach immediately
setTimeout(attachClipboardListeners, 500); // Attach again after 0.5 seconds (for timing robustness)