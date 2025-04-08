
// document.addEventListener("DOMContentLoaded", () => {
//     const hamburger = document.querySelector(".menu-toggle");
//     const navLinks = document.querySelector(".nav-links");
  
//     hamburger.addEventListener("click", () => {
//       navLinks.classList.toggle("active");
//     });
//   });






  // grid view 
  document.addEventListener("DOMContentLoaded", function () {
    const achievementsContainer = document.getElementById("achievements");

    // Sample achievements data (for demo purposes)
    const sampleData = [
        { title: "Champion", img: "🏆", rank: "Gold", description: "Won first place in tournament." },
        { title: "Top 10", img: "🥈", rank: "Silver", description: "Ranked in the top 10 players." },
        { title: "MVP", img: "⭐", rank: "Bronze", description: "Achieved MVP status in a match." }
    ];

    // Store sample data in localStorage if it's empty
    if (!localStorage.getItem("achievements")) {
        localStorage.setItem("achievements", JSON.stringify(sampleData));
    }

    // Fetch and render achievements
    function loadAchievements() {
        const achievements = JSON.parse(localStorage.getItem("achievements")) || [];

        achievementsContainer.innerHTML = achievements.map(ach => `
            <div class="achievement">
                <div class="emoji">${ach.img}</div>
                <h3>${ach.title}</h3>
                <p><strong>Rank:</strong> ${ach.rank}</p>
                <p>${ach.description}</p>
            </div>
        `).join("");
    }
    loadAchievements();
});





//live stats

function animateValue(id, start, end, duration) {
            let range = end - start;
            let current = start;
            let increment = range / (duration / 50);
            let obj = document.getElementById(id);

            let timer = setInterval(function () {
                current += increment;
                obj.textContent = Math.round(current);
                if (current >= end) {
                    clearInterval(timer);
                    obj.textContent = end; 
                }
            }, 50);
        }

        function updateStats() {
            let newRank = Math.floor(Math.random() * 10) + 1;
            let newScore = Math.floor(Math.random() * 2000) + 1000;
            let newWinRate = Math.floor(Math.random() * 100);

            animateValue("rank", parseInt(document.getElementById("rank").textContent), newRank, 2000);
            animateValue("score", parseInt(document.getElementById("score").textContent), newScore, 2000);
            animateValue("winRate", parseInt(document.getElementById("winRate").textContent), newWinRate, 2000);
        }

        setInterval(updateStats, 5000);




  