let leaderboard = [];

document.getElementById("add-score").addEventListener("click", () => {
    let playerName = document.getElementById("player-name").value.trim();
    let playerScore = parseInt(document.getElementById("player-score").value);

    if (playerName === "" || isNaN(playerScore)) {
        alert("Please enter a valid name and score.");
        return;
    }

    // Add to leaderboard
    leaderboard.push({ name: playerName, score: playerScore });

    // Sort leaderboard (Descending by score)
    leaderboard.sort((a, b) => b.score - a.score);

    // Update leaderboard UI
    updateLeaderboard();

    // Clear input fields
    document.getElementById("player-name").value = "";
    document.getElementById("player-score").value = "";
});

function updateLeaderboard() {
    let tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = ""; // Clear existing rows

    leaderboard.forEach((player, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${index + 1}</td><td>${player.name}</td><td>${player.score}</td>`;
        tbody.appendChild(row);
    });
}
