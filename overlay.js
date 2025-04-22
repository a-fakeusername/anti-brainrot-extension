// Get the button element
const closeButton = document.getElementById('close-overlay-button');

// Add click event listener
closeButton.addEventListener('click', () => {
    console.log('Close button clicked inside overlay.html');
    // Send a message to the parent window (content script)
    // '*' allows any origin, which is fine for this simple case,
    // but for security, you might restrict it if needed.
    window.parent.postMessage({ type: 'CLOSE_OVERLAY' }, '*');
});