// game.js - Lógica de movimento e colisão

// Selecionando elementos da tela
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const player = document.getElementById('player');
const obstacles = document.querySelectorAll('.obstacle');

// Controles móveis
const startBtn = document.getElementById('start-btn');
const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');

// Variáveis do jogador
let playerX = 0;
let speed = 10; // Velocidade de movimento

// Função para mover o jogador (somente esquerda e direita)
function movePlayer(direction) {
  switch (direction) {
    case 'left':
      if (playerX > 0) playerX -= speed;
      break;
    case 'right':
      if (playerX < 570) playerX += speed;
      break;
  }
  updatePlayerPosition();
  checkCollision();
}

// Função para atualizar a posição do jogador
function updatePlayerPosition() {
  player.style.left = playerX + 'px';
}

// Função para verificar colisões com obstáculos
function checkCollision() {
  obstacles.forEach(obstacle => {
    const obstacleX = obstacle.offsetLeft;
    const obstacleY = obstacle.offsetTop;
    const obstacleWidth = obstacle.offsetWidth;
    const obstacleHeight = obstacle.offsetHeight;

    // Verificar colisão com o jogador
    if (
      playerX < obstacleX + obstacleWidth &&
      playerX + 30 > obstacleX &&
      obstacleY < player.offsetTop + 30 &&
      obstacleY + obstacleHeight > player.offsetTop
    ) {
      alert("Colidiu com um gaveteiro! Game Over.");
      resetGame();
    }
  });
}

// Função para resetar o jogo
function resetGame() {
  playerX = 0;
  updatePlayerPosition();
}

// Iniciar o jogo ao pressionar Enter ou tocar no botão Iniciar
startBtn.addEventListener('click', startGame);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    startGame();
  }
});

// Função para iniciar o jogo
function startGame() {
  startScreen.style.display = 'none';  // Esconde a tela inicial
  gameScreen.style.display = 'block';  // Mostra o jogo
  document.removeEventListener('keydown', arguments.callee);  // Remove o evento após iniciar o jogo
}

// Movimentar o jogador (após iniciar o jogo)
leftBtn.addEventListener('click', () => movePlayer('left'));
rightBtn.addEventListener('click', () => movePlayer('right'));

// Detectar as teclas pressionadas (para PC)
document.addEventListener('keydown', (event) => {
  if (gameScreen.style.display === 'block') {
    if (event.key === 'ArrowLeft') movePlayer('left');
    if (event.key === 'ArrowRight') movePlayer('right');
  }
});
