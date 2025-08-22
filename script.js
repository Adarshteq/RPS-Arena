// DOM Elements
      const rockBtn = document.querySelector('.rock-btn');
      const paperBtn = document.querySelector('.paper-btn');
      const scissorBtn = document.querySelector('.scissors-btn');
      const userHandIcon = document.querySelector('.user-hand');
      const computerHandIcon = document.querySelector('.computer-hand');
      const resultArea = document.querySelector('.result-area');
      const userScoreEl = document.querySelector('.user-score');
      const computerScoreEl = document.querySelector('.computer-score');
      const roundsCountEl = document.querySelector('.rounds-count');
      const historyList = document.getElementById('historyList');
      const popupOverlay = document.querySelector('.popup-overlay');
      const popupTitle = document.querySelector('.popup-title');
      const popupMessage = document.querySelector('.popup-message');
      const popupCloseBtn = document.querySelector('.popup-close-btn');
      const rulesOverlay = document.querySelector('.rules-overlay');
      const rulesBtn = document.querySelector('.rules-btn');
      const rulesCloseBtn = document.querySelector('.rules-close-btn');
      const themeToggle = document.querySelector('.theme-toggle');
      const soundToggle = document.querySelector('.sound-toggle');
      
      // Game state
      let userScore = 0;
      let computerScore = 0;
      let roundsCount = 0;
      let gameHistory = [];
      let soundEnabled = true;
      
      // Icons
      const rockIcon = '✊';
      const paperIcon = '🤚';
      const scissorIcon = '✌️';
      const iconList = [rockIcon, paperIcon, scissorIcon];
      
      // Sounds (using base64 encoded short audio clips)
      const clickSound = new Audio("https://res.cloudinary.com/dbzvr3l7j/video/upload/v1755839511/click_bbyi8n.wav");
      const winSound = new Audio("https://res.cloudinary.com/dbzvr3l7j/video/upload/v1755839512/victory_wtsql8.wav");
      const loseSound = new Audio("https://res.cloudinary.com/dbzvr3l7j/video/upload/v1755839512/defeat_otgnyh.wav");
      const drawSound = new Audio("https://res.cloudinary.com/dbzvr3l7j/video/upload/v1755839512/draw_xxzt0i.wav");
      
      // Theme toggle
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeToggle.innerHTML = document.body.classList.contains('light-theme') ? 
          '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      });
      
      // Sound toggle
      soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggle.innerHTML = soundEnabled ? 
          '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
      });
      
      // Rules popup
      rulesBtn.addEventListener('click', () => {
        rulesOverlay.classList.add('active');
      });
      
      rulesCloseBtn.addEventListener('click', () => {
        rulesOverlay.classList.remove('active');
      });
      
      // Play sound function
      function playSound(sound) {
        if (soundEnabled) {
          sound.currentTime = 0;
          sound.play().catch(e => console.log("Audio play failed:", e));
        }
      }
      
      // Create confetti effect
      function createConfetti() {
        const colors = ['#6366f1', '#f43f5e', '#22c55e', '#f59e0b', '#8b5cf6'];
        
        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti';
          confetti.style.left = Math.random() * 100 + 'vw';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.width = (5 + Math.random() * 10) + 'px';
          confetti.style.height = (5 + Math.random() * 10) + 'px';
          confetti.style.animation = `confettiFall ${1 + Math.random() * 2}s linear forwards`;
          document.body.appendChild(confetti);
          
          setTimeout(() => {
            confetti.remove();
          }, 3000);
        }
      }
      
      // Add to history
      function addToHistory(userChoice, computerChoice, result) {
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${result}`;
        
        const resultIcon = result === 'win' ? '✅' : result === 'lose' ? '❌' : '➖';
        
        historyItem.innerHTML = `
          <span>${userChoice} vs ${computerChoice}</span>
          <span>${resultIcon} ${result.toUpperCase()}</span>
        `;
        
        historyList.prepend(historyItem);
        gameHistory.push({ userChoice, computerChoice, result });
        
        // Keep only last 10 history items
        if (historyList.children.length > 10) {
          historyList.removeChild(historyList.lastChild);
        }
      }
      
      // Calculate result
      function calculateResult(selectionIcon, winningIcon, selectionName) {
        userHandIcon.innerText = '🤜';
        computerHandIcon.innerText = '🤛';
        resultArea.textContent = 'Thinking...';
        resultArea.className = 'result-area';
        
        playSound(clickSound);
        
        // Remove any existing win classes
        userHandIcon.classList.remove('win');
        computerHandIcon.classList.remove('win');
        
        // Start shake animation
        userHandIcon.classList.add('shakeUserHands');
        computerHandIcon.classList.add('shakeComputerHands');
        
        // Disable buttons during animation
        rockBtn.style.pointerEvents = 'none';
        paperBtn.style.pointerEvents = 'none';
        scissorBtn.style.pointerEvents = 'none';
        
        setTimeout(() => {
          userHandIcon.classList.remove('shakeUserHands');
          computerHandIcon.classList.remove('shakeComputerHands');
          
          // Show user choice
          userHandIcon.innerText = selectionIcon;
          const computerChoice = Math.floor(Math.random() * 3);
          computerHandIcon.innerText = iconList[computerChoice];
          
          const computerChoiceName = 
            computerHandIcon.innerText === rockIcon ? 'Rock' :
            computerHandIcon.innerText === paperIcon ? 'Paper' : 'Scissors';
          
          if (computerHandIcon.innerText === userHandIcon.innerText) {
            resultArea.textContent = 'Draw!';
            resultArea.classList.add('draw');
            playSound(drawSound);
            addToHistory(selectionName, computerChoiceName, 'draw');
          } else if (computerHandIcon.innerText === winningIcon) {
            resultArea.textContent = 'You won!!';
            resultArea.classList.add('win');
            userScore++;
            userScoreEl.textContent = userScore;
            userHandIcon.classList.add('win');
            playSound(winSound);
            addToHistory(selectionName, computerChoiceName, 'win');
          } else {
            resultArea.textContent = 'Me Won!!';
            resultArea.classList.add('lose');
            computerScore++;
            computerScoreEl.textContent = computerScore;
            computerHandIcon.classList.add('win');
            playSound(loseSound);
            addToHistory(selectionName, computerChoiceName, 'lose');
          }
          
          roundsCount++;
          roundsCountEl.textContent = roundsCount;
          
          // Re-enable buttons
          rockBtn.style.pointerEvents = 'auto';
          paperBtn.style.pointerEvents = 'auto';
          scissorBtn.style.pointerEvents = 'auto';
          
          checkScore();
        }, 3000);
      }
      
      // Check score
      function checkScore() {
        if (userScore === 3) {
          // Show popup
          showPopup('You Wins! 🎉', 'Congratulations! You defeated Me!');
          createConfetti();
          playSound(winSound);
        } else if (computerScore === 3) {
          // Show popup
          showPopup('Me Wins! 😒', 'Better luck next time!');
          playSound(loseSound);
        }
      }
      
      // Show popup
      function showPopup(title, message) {
        popupTitle.textContent = title;
        popupMessage.textContent = message;
        popupOverlay.classList.add('active');
      }
      
      // Hide popup
      function hidePopup() {
        popupOverlay.classList.remove('active');
      }
      
      // Reset game
      function resetGame() {
        userScore = 0;
        computerScore = 0;
        roundsCount = 0;
        userScoreEl.textContent = '0';
        computerScoreEl.textContent = '0';
        roundsCountEl.textContent = '0';
        userHandIcon.innerText = '🤜';
        computerHandIcon.innerText = '🤛';
        resultArea.textContent = 'Start Playing!!';
        resultArea.className = 'result-area';
        historyList.innerHTML = '';
        gameHistory = [];
        hidePopup();
      }
      
      // Event listeners
      popupCloseBtn.addEventListener('click', resetGame);
      
      rockBtn.addEventListener('click', () => {
        calculateResult(rockIcon, scissorIcon, 'Rock');
      });
      
      paperBtn.addEventListener('click', () => {
        calculateResult(paperIcon, rockIcon, 'Paper');
      });
      
      scissorBtn.addEventListener('click', () => {
        calculateResult(scissorIcon, paperIcon, 'Scissors');
      });