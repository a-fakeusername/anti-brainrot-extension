const closeButton = document.getElementById('close-overlay-button');

const WAIT_TIME = 10; // seconds

let valid = false;
let t = Date.now();

function decrementTime() {
    let curr = Date.now();
    if (curr - t < 1000 * WAIT_TIME) {
        closeButton.innerText = `Amogus Emergency!!11!! ඞ (${Math.ceil(10 - (curr - t) / 1000)}s)`;
        setTimeout(() => {
            decrementTime();
        }, 100);
    } else {
        closeButton.innerText = `Amogus Emergency!!11!! ඞ`;
        valid = true;
    }
}

setTimeout(() => {
    decrementTime();
}, 100);
closeButton.addEventListener('click', () => {
    if (Date.now() - t < 1000 * WAIT_TIME) {
        alert('Not so fast lil bro');
        return;
    }
    window.parent.postMessage({ type: 'CLOSE_OVERLAY' }, '*');
});