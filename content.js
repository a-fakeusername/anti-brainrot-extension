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
 * Doesn't matter if vulnerable since emergency button exists.
 * @param {MessageEvent} event - The message event object.
*/
function handleMessages(event) {
    if (event.data && event.data.type === 'CLOSE_OVERLAY') {
        console.log('Removing overlay...');
        removeBlockingOverlay();
    }
}

// --- Script Execution ---

// Run the function to create the overlay
createBlockingOverlay();
// Add a listener to the window to catch messages (e.g., from the iframe)
window.addEventListener('message', handleMessages);