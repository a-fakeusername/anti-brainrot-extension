let currentDifficulty = 'MEDIUM'; // Default difficulty

// Load in saved difficulty from storage
chrome.storage.local.get(['difficulty'], (result) => {
    if (result.difficulty) {
        currentDifficulty = result.difficulty;
        document.querySelectorAll('.diff-button').forEach(button => {
            if (button.id === `diff-${currentDifficulty.toLowerCase()}`) {
                button.classList.add('diff-selected');
            } else {
                button.classList.remove('diff-selected');
            }
        });
    }
});

document.querySelectorAll('.diff-button').forEach(button => {
    if (button.id === `diff-${currentDifficulty.toLowerCase()}`) {
        button.classList.add('diff-selected');
    }
    button.addEventListener('click', () => {
        const name = button.id.replace('diff-', '').toUpperCase();
        chrome.storage.local.set({ difficulty: name }); // UPPERCASE enum type
        currentDifficulty = name;
        console.log(`Difficulty set to: ${name}`);
        document.querySelectorAll('.diff-button').forEach(btn => {
            btn.classList.remove('diff-selected');
        });
        button.classList.add('diff-selected');
    });
});