/**
 * Creates and injects an iframe overlay pointing to a local HTML file.
 */
function createBlockingOverlay() {
    // Check if the overlay iframe already exists
    if (document.getElementById('url-blocker-iframe')) {
      return;
    }
  
    // Create the iframe element
    const iframe = document.createElement('iframe');
    iframe.id = 'url-blocker-iframe'; // Assign an ID for styling and identification
    iframe.src = chrome.runtime.getURL('overlay.html'); // Get the URL of the packaged overlay file
    iframe.style.border = 'none'; // Remove default iframe border
  
    // Append the iframe to the document's root element.
    document.documentElement.appendChild(iframe);
  
    console.log('Blocking iframe overlay added for:', window.location.href);
}

/**
 * Removes the blocking overlay iframe.
*/
function removeBlockingOverlay() {
    const iframe = document.getElementById('url-blocker-iframe');
    if (iframe) {
        iframe.remove();
        console.log('Blocking iframe overlay removed.');
        // Remove the message listener after closing to prevent memory leaks
        window.removeEventListener('message', handleMessages);
    }
}

/**
 * Handles messages received from the iframe or other sources.
 * @param {MessageEvent} event - The message event object.
*/
function handleMessages(event) {
    // IMPORTANT: Check the origin for security if the overlay could be hosted elsewhere
    // or if the message contained sensitive data. For a simple close action from
    // a chrome-extension:// URL, checking the type might be sufficient.
    // Example origin check:
    // if (event.origin !== chrome.runtime.getURL('').slice(0, -1)) { // Get base extension origin
    //     console.warn('Message received from unexpected origin:', event.origin);
    //     return;
    // }
    
    // Check if the message is the one we expect from our overlay
    if (event.data && event.data.type === 'CLOSE_OVERLAY') {
        console.log('Received CLOSE_OVERLAY message from iframe.');
        removeBlockingOverlay();
    }
}

// --- Script Execution ---

// Run the function to create the overlay
createBlockingOverlay();
// Add a listener to the window to catch messages (e.g., from the iframe)
window.addEventListener('message', handleMessages);