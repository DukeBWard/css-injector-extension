function applyCustomCSS(css) {
    let styleElement = document.getElementById('css-customizer-style');
    if (styleElement) {
        styleElement.textContent = css;
    } else {
        styleElement = document.createElement('style');
        styleElement.id = 'css-customizer-style';
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }
}

function removeCustomCSS() {
    let styleElement = document.getElementById('css-customizer-style');
    if (styleElement) {
        styleElement.parentNode.removeChild(styleElement);
    }
}

// Initial injection of CSS when the content script loads
chrome.storage.sync.get('customCSS', (data) => {
    if (data.customCSS) {
        applyCustomCSS(data.customCSS);
    }
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateCSS') {
        applyCustomCSS(request.css);
    } else if (request.action === 'removeCSS') {
        removeCustomCSS();
    }
});
