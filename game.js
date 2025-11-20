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

// 🔗 Your MockAPI "scores" endpoint
// If your resource in MockAPI is named something else, change "scores" to that.
const API_URL = "https://691e6358bb52a1db22bdc021.mockapi.io/scores";

// Get top scores from backend
async function loadLeaderboard() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        // data is an array of { id, name, score, ... }
        const top3 = data
            .sort((a, b) => Number(b.score) - Number(a.score))
            .slice(0, 3);

        updateLeaderboardDOM(top3);
    } catch (err) {
        console.error("Error loading leaderboard:", err);
    }
}

// Save a new score to backend
async function saveScore(name, score) {
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, score })
        });
    } catch (err) {
        console.error("Error saving score:", err);
    }
}

function updateLeaderboardDOM(entries) {
    leaderboardList.innerHTML = "";

    entries.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

function openGame() {
    overlay.style.display = "flex";
    loadLeaderboard();
    resetGame();
}

function closeGame() {
    overlay.style.display = "none";
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
    gameBtn.textContent = "Start";
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
    statusText.textContent = "Go! Press SPACE to score!";
    gameBtn.textContent = "Click with SPACE";
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

async function endGame() {
    clearInterval(countdownInterval);
    gameActive = false;
    statusText.textContent = "Time up! Final score: " + score + ".";
    gameBtn.textContent = "Wait...";
    gameBtn.disabled = true;

    // Save to backend if score > 0
    if (score > 0) {
        const name = prompt("Enter your name for the leaderboard:", "Alex") || "Player";
        await saveScore(name, score);
        await loadLeaderboard(); // refresh after saving
    }

    cooldown = true;

    // 2-second cooldown before restart allowed
    setTimeout(() => {
        cooldown = false;
        gameBtn.disabled = false;
        gameBtn.textContent = "Play Again";
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
document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        e.preventDefault(); // prevent page from scrolling
        if (gameActive && !cooldown) {
            score++;
            scoreSpan.textContent = score;
        }
    }
});

iconBtn.addEventListener("click", openGame);
closeBtn.addEventListener("click", closeGame);
gameBtn.addEventListener("click", handleButtonPress);

// Load leaderboard once when script runs
loadLeaderboard();
