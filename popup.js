// Load saved settings when the popup opens
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['fontSize', 'textColor', 'bgColor'], (data) => {
        if (data.fontSize) document.getElementById('fontSize').value = data.fontSize;
        if (data.textColor) document.getElementById('textColor').value = data.textColor;
        if (data.bgColor) document.getElementById('bgColor').value = data.bgColor;
    });
});

document.getElementById('applyBtn').addEventListener('click', () => {
    const fontSize = document.getElementById('fontSize').value;
    const textColor = document.getElementById('textColor').value;
    const bgColor = document.getElementById('bgColor').value;

    // Save the settings
    chrome.storage.sync.set({ fontSize, textColor, bgColor }, () => {
        // Create the CSS
        const css = `
            body * {
                ${fontSize ? 'font-size: ' + fontSize + 'px !important;' : ''}
                ${textColor ? 'color: ' + textColor + ' !important;' : ''}
                ${bgColor ? 'background-color: ' + bgColor + ' !important;' : ''}
            }
        `;

        // Save the CSS to storage
        chrome.storage.sync.set({ customCSS: css }, () => {
            // Send a message to the content script to update the CSS
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'updateCSS', css: css });
                }
            });
        });
    });
});

// Event listener for the Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
    // Clear the saved settings
    chrome.storage.sync.remove(['fontSize', 'textColor', 'bgColor', 'customCSS'], () => {
        // Send a message to the content script to remove the CSS
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'removeCSS' });
            }
        });
        // Reset the input fields in the popup
        document.getElementById('fontSize').value = '';
        document.getElementById('textColor').value = '';
        document.getElementById('bgColor').value = '';
    });
});
