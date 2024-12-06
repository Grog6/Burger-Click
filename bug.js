let bugsSquashed = 0; // Track the number of bugs squashed
let score = 0; // Placeholder for points in the game

// Save and load points from localStorage
function savePoints() {
    localStorage.setItem('burgerGamePoints', score);
}

function loadPoints() {
    const savedPoints = localStorage.getItem('burgerGamePoints');
    if (savedPoints !== null) {
        score = parseInt(savedPoints, 10);
        updateScoreDisplay();
    }
}

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Points: ${score}`;
    }
}

function spawnBug() {
    const bug = document.createElement('div');
    bug.classList.add('bug');

    // Randomize initial position
    bug.style.position = 'absolute';
    bug.style.top = `${Math.random() * 80 + 10}%`;
    bug.style.left = `${Math.random() * 80 + 10}%`;

    // Add bug to the game container
    const gameContainer = document.getElementById('game-container');
    gameContainer.appendChild(bug);

    // Add event to smush the bug
    bug.addEventListener('click', () => {
        bug.remove();
        bugsSquashed++;
        alert(`You squashed a bug! Total bugs squashed: ${bugsSquashed}`);
        savePoints();
    });

    // Timer to move toward the burger
    const bugInterval = setInterval(() => {
        const burger = document.getElementById('click-button');
        const burgerRect = burger.getBoundingClientRect();
        const bugRect = bug.getBoundingClientRect();

        // Move bug closer to the burger
        const topDiff = burgerRect.top - bugRect.top;
        const leftDiff = burgerRect.left - bugRect.left;

        bug.style.top = `${bug.offsetTop + topDiff / 20}px`;
        bug.style.left = `${bug.offsetLeft + leftDiff / 20}px`;

        // Check if the bug reaches the burger
        if (
            bugRect.left < burgerRect.right &&
            bugRect.right > burgerRect.left &&
            bugRect.top < burgerRect.bottom &&
            bugRect.bottom > burgerRect.top
        ) {
            clearInterval(bugInterval);
            bug.remove();
            const lostPoints = Math.floor(score * (Math.random() * 0.15 + 0.15));
            score = Math.max(0, score - lostPoints); // Prevent negative points
            alert(`A bug reached your burger! You lost ${lostPoints} points.`);
            updateScoreDisplay();
            savePoints();
        }
    }, 200);

    // Remove bug after a certain duration if not smushed
    setTimeout(() => {
        if (bug.parentElement) {
            bug.remove();
            clearInterval(bugInterval);
        }
    }, 10000);
}

// Spawn bugs at random intervals (1-5 minutes)
function startBugSpawning() {
    setInterval(() => {
        spawnBug();
    }, Math.random() * (5 * 60 * 1000 - 1 * 60 * 1000) + 1 * 60 * 1000);
}

// Initialize game
loadPoints();
startBugSpawning();
