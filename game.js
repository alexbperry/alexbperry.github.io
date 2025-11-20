const iconBtn = document.querySelector('.header-icon-btn');
const overlay = document.getElementById('game-overlay');
const closeBtn = document.querySelector('.game-close');
const gameBtn = document.getElementById('game-btn');
const scoreSpan = document.getElementById('game-score');
const timerSpan = document.getElementById('game-timer');
const statusText = document.getElementById('game-status');
const leaderboardList = document.getElementById('leaderboard-list');

let score = 0;
let gameActive = false;
let timeLeft = 5;
let countdownInterval = null;
let cooldown = false;

// leaderboard data
let leaderboard = [];

function loadLeaderboard() {
    try {
        const stored = localStorage.getItem('dogGameLeaderboard');
        leaderboard = stored ? JSON.parse(stored) : [];
    } catch (e) {
        leaderboard = [];
    }
    updateLeaderboardDOM();
}

function saveLeaderboard() {
    try {
        localStorage.setItem('dogGameLeaderboard', JSON.stringify(leaderboard));
    } catch (e) {
        // ignore storage errors
    }
}

function updateLeaderboardDOM() {
    if (!leaderboardList) return;

    leaderboardList.innerHTML = '';

    // show only top 3
    leaderboard.slice(0, 3).forEach((entry) => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

function openGame() {
    overlay.style.display = 'flex';
    loadLeaderboard();
    resetGame();
}

function closeGame() {
    overlay.style.display = 'none';
    resetGame();
}

function resetGame() {
    score = 0;
    timeLeft = 5;
    gameActive = false;
    cooldown = false;

    scoreSpan.textContent = score;
    timerSpan.textContent = timeLeft;
    statusText.textContent = 'Press "Start" to begin.';
    gameBtn.textContent = 'Start';
    gameBtn.disabled = false;

    clearInterval(countdownInterval);
}

function startGame() {
    if (cooldown) return; // block starts during cooldown

    gameActive = true;
    score = 0;
    timeLeft = 5;

    scoreSpan.textContent = score;
    timerSpan.textContent = timeLeft;
    statusText.textContent = 'Go! Press SPACE to score!';
    gameBtn.textContent = 'Click with SPACE';
    gameBtn.disabled = false;

    // Countdown timer
    countdownInterval = setInterval(() => {
        timeLeft--;
        timerSpan.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(countdownInterval);
    gameActive = false;
    statusText.textContent = 'Time up! Final score: ' + score + '.';
    gameBtn.textContent = 'Wait...';
    gameBtn.disabled = true;

    // Update leaderboard if they scored > 0
    if (score > 0) {
        const name = prompt('Enter your name for the leaderboard:', 'Alex') || 'Player';
        leaderboard.push({ name, score });

        // Sort highest score first & keep top 3
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 3);

        saveLeaderboard();
        updateLeaderboardDOM();
    }

    cooldown = true;

    // 2-second cooldown before restart allowed
    setTimeout(() => {
        cooldown = false;
        gameBtn.disabled = false;
        gameBtn.textContent = 'Play Again';
        statusText.textContent = 'Press "Play Again" to start.';
    }, 2000);
}

function handleButtonPress() {
    if (cooldown) return;

    // Button only starts / restarts game, no scoring
    if (!gameActive) {
        startGame();
    }
}

// SPACEBAR scoring
document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        e.preventDefault(); // prevent page from scrolling
        if (gameActive && !cooldown) {
            score++;
            scoreSpan.textContent = score;
        }
    }
});

iconBtn.addEventListener('click', openGame);
closeBtn.addEventListener('click', closeGame);
gameBtn.addEventListener('click', handleButtonPress);

// Load leaderboard once when script runs
loadLeaderboard();
