const closeButton = document.getElementById('close-overlay-button');

closeButton.addEventListener('click', () => {
    window.parent.postMessage({ type: 'CLOSE_OVERLAY' }, '*');
});