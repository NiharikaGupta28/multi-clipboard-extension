document.addEventListener('DOMContentLoaded', () => {
    const clipboardList = document.getElementById('clipboardList');
    const clearButton = document.getElementById('clearButton');

    function displayClipboardItems(items) {
        clipboardList.innerHTML = '';
        if (items && items.length > 0) {
            items.slice().reverse().forEach((item, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = item;
                listItem.dataset.originalIndex = (items.length - 1) - index; // Store original index
                listItem.addEventListener('click', (event) => {
                    const textToCopy = event.currentTarget.textContent;
                    copyToClipboard(textToCopy, event.currentTarget); // Pass the list item element
                });
                clipboardList.appendChild(listItem);
            });
        } else {
            const noItems = document.createElement('li');
            noItems.textContent = "No items copied yet.";
            noItems.style.fontStyle = "italic";
            noItems.style.textAlign = "center";
            noItems.style.padding = "20px";
            clipboardList.appendChild(noItems);
        }
    }

    async function copyToClipboard(text, element) {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Text copied to clipboard:', text);

            // Temporarily show "Copied!" feedback
            const originalText = element.textContent;
            element.textContent = "Copied!";
            setTimeout(() => {
                element.textContent = originalText;
            }, 700);

        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    // Load items when popup opens
    chrome.storage.sync.get(['clipboardHistory'], (result) => {
        const items = result.clipboardHistory || [];
        displayClipboardItems(items);
    });

    // Clear button functionality
    clearButton.addEventListener('click', () => {
        chrome.storage.sync.set({ clipboardHistory: [] }, () => {
            displayClipboardItems([]);
            console.log('Clipboard history cleared.');
        });
    });
});