const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerX = 140;
let playerY = 420;
let speed = 2;
let score = 0;
let record = localStorage.getItem("record") || 0;

let obstacles = [];
let running = false;
const sections = 5; // Divisão da pista em 5 partes

// Tela de início - Exibe mensagem
function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("O Arquivista", canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = "20px Arial";
    ctx.fillText("Iniciar", canvas.width / 2, canvas.height / 2 + 40);
}

// Função para iniciar o jogo
function startGame() {
    running = true;
    score = 0;
    playerX = Math.floor(sections / 2) * (canvas.width / sections); // Inicia no centro
    obstacles = [];
    speed = 2;
    gameLoop();

    // Esconde a tela HTML inicial
    const startEl = document.getElementById('startScreen');
    if (startEl) startEl.classList.add('hidden');
}

// Evento de tecla para iniciar o jogo
document.addEventListener("keydown", (e) => {
    if (!running && e.key === "Enter") startGame();
    // Movimento com setas
    if (running) {
        if (e.key === "ArrowLeft" && playerX > 0) playerX -= canvas.width / sections;
        if (e.key === "ArrowRight" && playerX < canvas.width - (canvas.width / sections)) playerX += canvas.width / sections;
    }
});

// Função de controle de toque (mobile)
function handleTouch(e) {
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    const sectionWidth = canvas.width / sections;

    if (touchX < sectionWidth) {
        playerX = sectionWidth / 2; // 1ª parte
    } else if (touchX < sectionWidth * 2) {
        playerX = sectionWidth * 1.5; // 2ª parte
    } else if (touchX < sectionWidth * 3) {
        playerX = sectionWidth * 2.5; // 3ª parte
    } else if (touchX < sectionWidth * 4) {
        playerX = sectionWidth * 3.5; // 4ª parte
    } else {
        playerX = sectionWidth * 4.5; // 5ª parte
    }
}

// Detecta toque na tela (para dispositivos móveis)
canvas.addEventListener("touchstart", (e) => {
    if (!running) startGame();
    handleTouch(e);
});

// Desenha o personagem
function drawPlayer() {
    ctx.fillStyle = "#F4C542"; // Cor para o "corpo humano"
    ctx.fillRect(playerX, playerY, canvas.width / sections - 5, 30); // Corpo do personagem ajustado

    ctx.fillStyle = "#00AEEF"; // Cor para as roupas
    ctx.fillRect(playerX, playerY + 30, canvas.width / sections - 5, 30); // Roupa do personagem

    ctx.fillStyle = "#8B8B8B"; // Cor para as mãos
    ctx.fillRect(playerX + 5, playerY + 60, 10, 15); // Mãos
    ctx.fillRect(playerX + canvas.width / sections - 15, playerY + 60, 10, 15); // Mãos
}

// Desenha obstáculos (gavetas)
function drawObstacles() {
    ctx.fillStyle = "#888"; // Cor das gavetas
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, canvas.width / sections - 5, 60);

        ctx.strokeStyle = "#444";
        ctx.lineWidth = 2;
        for (let i = 1; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(obs.x, obs.y + i * 12);
            ctx.lineTo(obs.x + (canvas.width / sections - 5), obs.y + i * 12);
            ctx.stroke();
        }
    });
}

// Função de colisão
function collide(a, b) {
    return !(a.right < b.left ||
             a.left > b.right ||
             a.bottom < b.top ||
             a.top > b.bottom);
}

// Desenha a pontuação e o recorde
function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.fillText("Pontos: " + score, 10, 20);
    ctx.fillText("Recorde: " + record, canvas.width - 100, 20);
}

function gameLoop() {
    if (!running) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawObstacles();
    drawScore();

    obstacles.forEach((obs, i) => {
        obs.y += speed;
        if (collide(
            { left: playerX, top: playerY, right: playerX + canvas.width / sections - 5, bottom: playerY + 30 },
            { left: obs.x, top: obs.y, right: obs.x + canvas.width / sections - 5, bottom: obs.y + 60 })) {
            running = false;
            if (score > record) {
                localStorage.setItem("record", score);
            }
            alert("Game Over! Pontos: " + score);
            window.location.reload();
        }

        if (obs.y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
            if (score % 10 === 0) speed += 0.5;
        }
    });

    requestAnimationFrame(gameLoop);
}

setInterval(() => {
    if (running) spawnObstacle();
}, 900);

// Geração de obstáculos
function spawnObstacle() {
    let obstacleX = Math.floor(Math.random() * (sections - 1)) * (canvas.width / sections);
    obstacles.push({ x: obstacleX, y: -60 });
}

// Mostrar a tela inicial ao carregar a página
window.onload = showStartScreen;
