const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerX = 140;
let playerY = 420;
let speed = 2;
let score = 0;
let record = localStorage.getItem("record") || 0;

let obstacles = [];
let running = false;

// Tela de início - Exibe mensagem no canvas
function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("O Arquivista", canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = "18px Arial";
    ctx.fillText("Pressione Enter ou Toque para Iniciar", canvas.width / 2, canvas.height / 2 + 20);
}

// Função para iniciar o jogo
function startGame() {
    running = true;
    score = 0;
    playerX = 140;
    obstacles = [];
    speed = 2;

    // Esconde a tela HTML inicial
    const startEl = document.getElementById('startScreen');
    if (startEl) startEl.classList.add('hidden');

    // Começa o loop de jogo
    gameLoop();
}

// Evento de tecla para iniciar o jogo
document.addEventListener("keydown", (e) => {
    if (!running && e.key === "Enter") startGame();
});

// Evento de toque para iniciar e mover
canvas.addEventListener("touchstart", (e) => {
    if (!running) {
        startGame();
    } else {
        handleTouch(e);
    }
});

// Função para controle de toque (mobile) movimento em 5 zonas
function handleTouch(e) {
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    const sectionWidth = canvas.width / 5;
    if (touchX < sectionWidth) {
        playerX = sectionWidth / 2;
    } else if (touchX < sectionWidth * 2) {
        playerX = sectionWidth * 1.5;
    } else if (touchX < sectionWidth * 3) {
        playerX = sectionWidth * 2.5;
    } else if (touchX < sectionWidth * 4) {
        playerX = sectionWidth * 3.5;
    } else {
        playerX = sectionWidth * 4.5;
    }
}

// Desenha o personagem (simplificado)
function drawPlayer() {
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(playerX, playerY, 30, 30);
}

// Desenha obstáculos
function drawObstacles() {
    ctx.fillStyle = "#888";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, 40, 60);

        ctx.strokeStyle = "#444";
        ctx.lineWidth = 2;
        for (let i = 1; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(obs.x, obs.y + i * 12);
            ctx.lineTo(obs.x + 40, obs.y + i * 12);
            ctx.stroke();
        }
    });
}

function spawnObstacle() {
    let obstacleX = Math.floor(Math.random() * 5) * (canvas.width / 5);
    obstacles.push({ x: obstacleX, y: -60 });
}

function collide(a, b) {
    return !(a.right < b.left ||
             a.left > b.right ||
             a.bottom < b.top ||
             a.top > b.bottom);
}

function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.fillText("Pontos: " + score, 10, 20);
    ctx.fillText("Recorde: " + record, canvas.width - 110, 20);
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
            { left: playerX, top: playerY, right: playerX + 30, bottom: playerY + 30 },
            { left: obs.x, top: obs.y, right: obs.x + 40, bottom: obs.y + 60 })) {
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

// Mostra a tela inicial quando a página carrega
window.onload = showStartScreen;
