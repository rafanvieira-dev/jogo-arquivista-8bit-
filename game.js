// game.js - Lógica de movimento e colisão

// Selecionando elementos da tela
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const player = document.getElementById('player');
const obstacles = document.querySelectorAll('.obstacle');

// Variáveis do jogador
let playerX = 0;
let playerY = 0;
let speed = 10; // Velocidade de movimento

// Função para mover o jogador
function movePlayer(direction) {
  switch (direction) {
    case 'up':
      if (playerY > 0) playerY -= speed;
      break;
    case 'down':
      if (playerY < 370) playerY += speed;
      break;
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
  player.style.top = playerY + 'px';
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
      playerY < obstacleY + obstacleHeight &&
      playerY + 30 > obstacleY
    ) {
      alert("Colidiu com um gaveteiro! Game Over.");
      resetGame();
    }
  });
}

// Função para resetar o jogo
function resetGame() {
  playerX = 0;
  playerY = 0;
  updatePlayerPosition();
}

// Iniciar o jogo ao pressionar Enter
document.addEventListener('keydown', (event) => {
  // Quando pressionar Enter, esconder a tela inicial e mostrar o jogo
  if (event.key === 'Enter') {
    startScreen.style.display = 'none';  // Esconde a tela inicial
    gameScreen.style.display = 'block';  // Mostra o jogo
    document.removeEventListener('keydown', arguments.callee);  // Remove o evento após iniciar o jogo
  }

  // Movimentar o jogador (após iniciar o jogo)
  if (gameScreen.style.display === 'block') {
    if (event.key === 'ArrowUp') movePlayer('up');
    if (event.key === 'ArrowDown') movePlayer('down');
    if (event.key === 'ArrowLeft') movePlayer('left');
    if (event.key === 'ArrowRight') movePlayer('right');
  }
});
