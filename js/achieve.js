document.addEventListener("DOMContentLoaded", () => {
    const leaderboardList = document.getElementById("leaderboard-list");
  
    // Mock API URL
    const API_URL = "https://67ee128f4387d9117bbf48a4.mockapi.io/Rankings";
  
    // Fetch rankings from API
    async function fetchLeaderboard() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
  
        // Process rankings and ensure scores are at least 5 digits
        let rankings = data.map(user => ({
          name: user.name,
          score: user.score >= 10000 ? user.score : Math.floor(Math.random() * 90000) + 10000, // Ensure min 5-digit score
          award: null
        }));
  
        // Sort rankings in descending order (high score to low)
        rankings.sort((a, b) => b.score - a.score);
  
        // Highlight first place with an award icon
        if (rankings.length > 0) {
          rankings[0].award = "https://cdn-icons-png.flaticon.com/128/2864/2864060.png";
        }
  
        displayLeaderboard(rankings.slice(0, 5)); // Show top 5 players
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        leaderboardList.innerHTML = `<p class="loading">Failed to load rankings. Try again later.</p>`;
      }
    }
  
    // Render leaderboard
    function displayLeaderboard(rankings) {
      leaderboardList.innerHTML = ""; // Clear old content
  
      rankings.forEach((player, index) => {
        const listItem = document.createElement("li");
  
        listItem.innerHTML = `
          <p class="name">${player.name}</p>
          <div class="award">
            <p class="score">${player.score.toLocaleString()}</p>
            ${player.award ? `<img src="${player.award}" alt="Award">` : ""}
          </div>
        `;
  
        // Highlight first place
        if (index === 0) listItem.classList.add("first-place");
  
        leaderboardList.appendChild(listItem);
      });
    }
  
    fetchLeaderboard();
  });