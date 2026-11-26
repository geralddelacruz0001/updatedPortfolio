// ===== TIC-TAC-TOE GAME LOGIC =====
(function() {
  const gameScreen = document.getElementById("game");
  if (!gameScreen) return;

  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let gameActive = true;
  let isVsAI = false;
  let aiDifficulty = "medium";
  let aiFirst = false;
  let scores = { X: 0, O: 0, Draw: 0 };

  const scoreXEl = document.getElementById("scoreX");
  const scoreOEl = document.getElementById("scoreO");
  const scoreDrawEl = document.getElementById("scoreDraw");
  const opponentLabel = document.getElementById("opponentLabel");
  const modePvP = document.getElementById("modePvP");
  const modeAI = document.getElementById("modeAI");
  const aiSettings = document.getElementById("aiSettings");
  const diffBtns = document.querySelectorAll(".diff-btn");
  const firstPlayerBtn = document.getElementById("firstPlayer");
  const firstAIBtn = document.getElementById("firstAI");
  const historyList = document.getElementById("historyList");

  function updateScoreUI() {
    if(scoreXEl) scoreXEl.textContent = scores.X;
    if(scoreOEl) scoreOEl.textContent = scores.O;
    if(scoreDrawEl) scoreDrawEl.textContent = scores.Draw;
  }

  function updateGameStatus(msg) {
    const statusEl = document.getElementById("gameStatus");
    if (statusEl) statusEl.textContent = msg;
  }

  function checkWinner() {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return pattern;
      }
    }
    return null;
  }

  function minimax(newBoard, depth, isMaximizing) {
    const winPattern = checkWinner();
    if (winPattern) {
      const winner = newBoard[winPattern[0]];
      return winner === "O" ? 10 - depth : depth - 10;
    }
    if (!newBoard.includes("")) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === "") {
          newBoard[i] = "O";
          let score = minimax(newBoard, depth + 1, false);
          newBoard[i] = "";
          best = Math.max(best, score);
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === "") {
          newBoard[i] = "X";
          let score = minimax(newBoard, depth + 1, true);
          newBoard[i] = "";
          best = Math.min(best, score);
        }
      }
      return best;
    }
  }

  function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = null;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, 0, false);
        board[i] = "";
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  function getRandomMove() {
    const emptySpots = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    return emptySpots[Math.floor(Math.random() * emptySpots.length)];
  }

  function aiMove() {
    if (!gameActive || currentPlayer !== "O") return;
    
    let moveIndex;
    if (aiDifficulty === "easy") {
      moveIndex = getRandomMove();
    } else if (aiDifficulty === "medium") {
      moveIndex = Math.random() > 0.5 ? getBestMove() : getRandomMove();
    } else {
      moveIndex = getBestMove();
    }
    
    if (moveIndex !== null && moveIndex !== undefined) {
      makeMove(moveIndex, "O");
    }
  }

  function saveMatchHistory(result) {
    let history = JSON.parse(localStorage.getItem("tttHistory")) || [];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    history.unshift({ result, time });
    if (history.length > 5) history.pop();
    localStorage.setItem("tttHistory", JSON.stringify(history));
    loadMatchHistory();
  }

  function loadMatchHistory() {
    if (!historyList) return;
    let history = JSON.parse(localStorage.getItem("tttHistory")) || [];
    historyList.innerHTML = "";
    if (history.length === 0) {
      historyList.innerHTML = '<li class="empty-history">No matches yet. Play one!</li>';
      return;
    }
    history.forEach(match => {
      const li = document.createElement("li");
      let icon = "🤝", cls = "history-draw", text = "Draw";
      if (match.result === "win") { icon = "🎉"; cls = "history-win"; text = "You Won"; }
      if (match.result === "lose") { icon = "🤖"; cls = "history-lose"; text = isVsAI ? "AI Won" : "P2 Won"; }
      
      li.className = cls;
      li.innerHTML = `<span>${icon} ${text}</span><span style="color:var(--text-dim);">${match.time}</span>`;
      historyList.appendChild(li);
    });
  }

  function makeMove(index, player) {
    if (board[index] !== "" || !gameActive) return;
    
    board[index] = player;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    if(cell) {
      cell.textContent = player;
      cell.classList.add(player.toLowerCase());
    }
    
    if (typeof playTone === 'function') { playTone(700, 0.05); buzz(10); }
    
    const winPattern = checkWinner();
    if (winPattern) {
      gameActive = false;
      winPattern.forEach(i => {
        const winnerCell = document.querySelector(`.cell[data-index="${i}"]`);
        if(winnerCell) winnerCell.classList.add("winner");
      });
      
      if (player === "X") {
        scores.X++;
        updateGameStatus("You Win! 🎉");
        saveMatchHistory("win");
      } else {
        scores.O++;
        updateGameStatus(isVsAI ? "AI Wins! 🤖" : "Player O Wins! 🎉");
        saveMatchHistory("lose");
      }
      updateScoreUI();
      if (typeof playTone === 'function') { playTone(1200, 0.15); buzz(50); }
      return;
    }
    
    if (!board.includes("")) {
      gameActive = false;
      scores.Draw++;
      updateGameStatus("It's a Draw! 🤝");
      saveMatchHistory("draw");
      updateScoreUI();
      return;
    }
    
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateGameStatus(currentPlayer === "X" ? "Your turn (X)" : (isVsAI ? "AI thinking..." : "Player O's turn"));
    
    if (isVsAI && currentPlayer === "O") {
      setTimeout(aiMove, 500);
    }
  }

  function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index);
    
    if (board[index] !== "" || !gameActive) return;
    if (isVsAI && currentPlayer === "O") return;
    
    makeMove(index, currentPlayer);
  }

  function resetRound() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    
    const cells = document.querySelectorAll("#game .cell");
    cells.forEach(cell => {
      cell.textContent = "";
      cell.classList.remove("x", "o", "winner");
    });
    
    if (isVsAI) {
      currentPlayer = aiFirst ? "O" : "X";
      updateGameStatus(aiFirst ? "AI thinking..." : "Your turn (X)");
      if (aiFirst) setTimeout(aiMove, 500);
    } else {
      currentPlayer = "X";
      updateGameStatus("Player X's turn");
    }
    
    if (typeof playTone === 'function') { playTone(600, 0.05); buzz(10); }
  }

  // ===== INITIALIZATION =====
  loadMatchHistory();

  const cells = gameScreen.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
  });

  const resetBtn = document.getElementById("resetGame");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetRound);
  }

  if (modePvP && modeAI) {
    modePvP.addEventListener("click", () => {
      isVsAI = false;
      aiSettings.style.display = "none";
      modePvP.classList.add("active");
      modeAI.classList.remove("active");
      if(opponentLabel) opponentLabel.textContent = "P2 (O)";
      scores = { X: 0, O: 0, Draw: 0 };
      updateScoreUI();
      resetRound();
    });
    
    modeAI.addEventListener("click", () => {
      isVsAI = true;
      aiSettings.style.display = "block";
      modeAI.classList.add("active");
      modePvP.classList.remove("active");
      if(opponentLabel) opponentLabel.textContent = "AI (O)";
      scores = { X: 0, O: 0, Draw: 0 };
      updateScoreUI();
      resetRound();
    });
  }

  diffBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      diffBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      aiDifficulty = btn.dataset.diff;
      if (typeof playTone === 'function') { playTone(700, 0.04); }
    });
  });

  if (firstPlayerBtn && firstAIBtn) {
    firstPlayerBtn.addEventListener("click", () => {
      aiFirst = false;
      firstPlayerBtn.classList.add("active");
      firstAIBtn.classList.remove("active");
      resetRound();
    });
    firstAIBtn.addEventListener("click", () => {
      aiFirst = true;
      firstAIBtn.classList.add("active");
      firstPlayerBtn.classList.remove("active");
      resetRound();
    });
  }

})();
