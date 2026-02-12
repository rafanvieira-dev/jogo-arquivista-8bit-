// game.js - Lógica de movimento e colisão

// Selecionando o jogador e os obstáculos
const player = document.getElementById('player');
const obstacles = document.querySelectorAll('.obstacle');

// Definindo a posição inicial do jogador
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

// Detectando as teclas pressionadas
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') movePlayer('up');
  if (event.key === 'ArrowDown') movePlayer('down');
  if (event.key === 'ArrowLeft') movePlayer('left');
  if (event.key === 'ArrowRight') movePlayer('right');
});
