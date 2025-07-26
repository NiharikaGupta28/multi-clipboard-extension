document.addEventListener('DOMContentLoaded', () => {
    const maxItemsInput = document.getElementById('maxItems');
    const saveButton = document.getElementById('saveButton');
    const statusDiv = document.getElementById('status');

    // Load saved settings
    chrome.storage.sync.get('maxHistoryItems', (data) => {
        if (data.maxHistoryItems) {
            maxItemsInput.value = data.maxHistoryItems;
        }
    });

    // Save settings
    saveButton.addEventListener('click', () => {
        const maxItems = parseInt(maxItemsInput.value, 10);
        if (maxItems >= 1 && maxItems <= 200) {
            chrome.storage.sync.set({ maxHistoryItems: maxItems }, () => {
                statusDiv.textContent = 'Settings saved!';
                setTimeout(() => statusDiv.textContent = '', 2000);
            });
        } else {
            statusDiv.textContent = 'Please enter a number between 1 and 200.';
            statusDiv.style.color = 'red';
        }
    });
});