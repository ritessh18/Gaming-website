// ---------- TOURNAMENT DATA ----------
const tournaments = [
    { id: 1, title: "Valorant Cup", game: "Valorant", date: "2025-04-10T16:00:00Z", fee: "$10", prize: "$500" },
    { id: 2, title: "CSGO Elite", game: "CSGO", date: "2025-04-15T18:00:00Z", fee: "$15", prize: "$700" },
    { id: 3, title: "Dota 2 Showdown", game: "Dota 2", date: "2025-04-20T20:00:00Z", fee: "$12", prize: "$600" }
  ];
  
  // ---------- BRACKET DATA (local simulated API) ----------
  const matchData = [
    { team1: "Wolves", team2: "Titans", score: "3 - 1" },
    { team1: "Vikings", team2: "Reapers", score: "0 - 2" },
    { team1: "Falcons", team2: "Cyclones", score: "1 - 1" },
    { team1: "Blazers", team2: "Knights", score: "2 - 3" },
    { team1: "Storm", team2: "Panthers", score: "4 - 0" },
    { team1: "Raiders", team2: "Grizzlies", score: "2 - 2" },
  ];
  
  // ---------- DOM ELEMENTS ----------
  const gameFilter = document.getElementById("gameFilter");
  const tournamentCards = document.getElementById("tournamentCards");
  const selectedTournament = document.getElementById("selectedTournament");
  const registrationForm = document.getElementById("registrationForm");
  const registeredList = document.getElementById("registeredList");
  const bracketGrid = document.getElementById("bracketGrid");
  
  // ---------- LOAD TOURNAMENTS ----------
  function loadTournaments(filter = "All") {
    tournamentCards.innerHTML = "";
    selectedTournament.innerHTML = `<option value="">Choose tournament</option>`;
  
    const now = new Date();
    const filtered = tournaments
      .filter(t => (filter === "All" || t.game === filter))
      .filter(t => new Date(t.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  
    filtered.forEach(t => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${t.title}</h3>
        <p><strong>Game:</strong> ${t.game}</p>
        <p><strong>Date:</strong> ${new Date(t.date).toLocaleString()}</p>
        <p><strong>Entry Fee:</strong> ${t.fee}</p>
        <p><strong>Prize:</strong> ${t.prize}</p>
        <p class="countdown" data-date="${t.date}">Countdown: --</p>
      `;
      tournamentCards.appendChild(card);
  
      const option = document.createElement("option");
      option.value = t.title;
      option.textContent = t.title;
      selectedTournament.appendChild(option);
    });
  
    updateCountdowns();
  }
  
  // ---------- FILTER BY GAME ----------
  gameFilter.addEventListener("change", () => loadTournaments(gameFilter.value));
  
  // ---------- REGISTRATION ----------
  registrationForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const tournament = selectedTournament.value;
  
    if (!username || !email || !tournament) {
      alert("All fields are required.");
      return;
    }
  
    const newReg = { username, email, tournament };
    let registrations = JSON.parse(localStorage.getItem("registrations")) || [];
  
    const alreadyRegistered = registrations.some(
      reg => reg.username === username && reg.tournament === tournament
    );
  
    if (alreadyRegistered) {
      showPopup("You are already registered for this tournament!");
      return;
    }
  
    registrations.push(newReg);
    localStorage.setItem("registrations", JSON.stringify(registrations));
    showRegistrations();
    registrationForm.reset();
  });
  
  // ---------- SHOW REGISTRATIONS ----------
  function showRegistrations() {
    const registrations = JSON.parse(localStorage.getItem("registrations")) || [];
    registeredList.innerHTML = "<h3>Registered Players</h3>";
    registrations.forEach(reg => {
      const div = document.createElement("div");
      div.textContent = `${reg.username} - ${reg.tournament}`;
      registeredList.appendChild(div);
    });
  }
  
  // ---------- COUNTDOWN UPDATES ----------
  function updateCountdowns() {
    const countdowns = document.querySelectorAll(".countdown");
    countdowns.forEach(el => {
      const date = new Date(el.getAttribute("data-date"));
      const now = new Date();
      const diff = date - now;
  
      if (diff <= 0) {
        el.textContent = "LIVE NOW!";
        return;
      }
  
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      el.textContent = `Starts in: ${hours}h ${minutes}m ${seconds}s`;
    });
  }
  
  // ---------- LOAD BRACKETS (FAKE FETCH) ----------
  async function loadBrackets() {
    const blob = new Blob([JSON.stringify(matchData)], { type: "application/json" });
    const fakeApiUrl = URL.createObjectURL(blob);
  
    try {
      const res = await fetch(fakeApiUrl);
      const matches = await res.json();
  
      bracketGrid.innerHTML = "";
      matches.forEach(match => {
        const div = document.createElement("div");
        div.className = "match";
        div.innerHTML = `
          <strong>${match.team1}</strong><br>vs<br>
          <strong>${match.team2}</strong><br>
          <em>${match.score}</em>
        `;
        bracketGrid.appendChild(div);
      });
  
      URL.revokeObjectURL(fakeApiUrl);
    } catch (err) {
      bracketGrid.innerHTML = "<p>❌ Failed to load brackets.</p>";
      console.error("Bracket Fetch Error:", err);
    }
  }

  
  
  // ---------- INIT PAGE ----------
  loadTournaments();
  showRegistrations();
  loadBrackets();
  setInterval(updateCountdowns, 1000);      // Live countdown
  setInterval(loadBrackets, 30000);         // Auto-refresh brackets every 30s
  

  function showRegistrations() {
    const registrations = JSON.parse(localStorage.getItem("registrations")) || [];
    registeredList.innerHTML = "<h3>Registered Players</h3>";
  
    registrations.forEach((reg, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <span>${reg.username} - ${reg.tournament}</span>
    <button class="delete-btn" data-index="${index}" title="Remove">❌</button>
  </div>
`;
      registeredList.appendChild(div);
    });
  
    // Add delete functionality
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const index = e.target.getAttribute("data-index");
        registrations.splice(index, 1);
        localStorage.setItem("registrations", JSON.stringify(registrations));
        showRegistrations(); // Refresh list
      });
    });
  }
  
const popupModal = document.getElementById("popupModal");
const popupMessage = document.getElementById("popupMessage");
const closePopup = document.getElementById("closePopup");

closePopup.addEventListener("click", () => {
  popupModal.classList.add("hidden");
});

function showPopup(message) {
  popupMessage.textContent = message;
  popupModal.classList.remove("hidden");
}
