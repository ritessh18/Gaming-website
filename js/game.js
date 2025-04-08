document.querySelectorAll('.review').forEach(review => {
      const upvoteBtn = review.querySelector('.upvote');
      const downvoteBtn = review.querySelector('.downvote');
      const scoreElem = review.querySelector('.score');

      upvoteBtn.addEventListener('click', () => {
        updateScore(1, upvoteBtn, downvoteBtn, scoreElem);
      });

      downvoteBtn.addEventListener('click', () => {
        updateScore(-1, downvoteBtn, upvoteBtn, scoreElem);
      });

      function updateScore(change, clickedBtn, otherBtn, scoreElem) {
        let currentScore = parseInt(scoreElem.textContent.replace('Score: ', ''));
        if (!clickedBtn.classList.contains('active')) {
          clickedBtn.classList.add('active');
          otherBtn.classList.remove('active');
          currentScore += change;
        } else {
          clickedBtn.classList.remove('active');
          currentScore -= change;
        }
        scoreElem.textContent = `Score: ${currentScore}`;
      }
    });

    const CLIENT_ID = 'gp762nuuoqcoxypju8c569th9wz7q5';
    const ACCESS_TOKEN = 'pd2284mc4osx9c211xfk1bbv3qyby2';
    const USER_LOGIN = 'MsAppletree'; // Replace this
    
  
    async function fetchLiveStream() {
      try {
        const res = await fetch(`https://api.twitch.tv/helix/streams?user_login=${USER_LOGIN}`, {
          headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': `Bearer ${ACCESS_TOKEN}`
          }
        });
  
        const data = await res.json();
        const container = document.getElementById("live-stream");
  
        if (data.data && data.data.length > 0) {
          const stream = data.data[0];
          container.innerHTML = `
            <h2>${stream.title}</h2>
            <iframe
              src="https://player.twitch.tv/?channel=${USER_LOGIN}&parent=http://localhost"
              allowfullscreen>
            </iframe>
          `;
        } else {
          container.innerHTML = `<p>🚫 You're currently offline. Check back later!</p>`;
        }
      } catch (err) {
        document.getElementById("live-stream").innerHTML = `<p>⚠️ Failed to load stream info.</p>`;
        console.error(err);
      }
    }
  
    fetchLiveStream();