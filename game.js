const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerX = 140; // Posição inicial do personagem (vai mudar para as 5 partes)
let playerY = 420;
let speed = 2;
let score = 0;
let record = localStorage.getItem("record") || 0;

let obstacles = [];
let running = false;
const sections = 5; // Dividindo o cenário em 5 partes horizontais

// Tela de início - Exibe mensagem
function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("O Arquivista", canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = "18px Arial";
    if (!running) { 
        ctx.fillText("Pressione Enter ou Toque para Iniciar", canvas.width / 2, canvas.height / 2 + 20);
    }
}

// Função para iniciar o jogo
function startGame() {
    running = true;
    score = 0;
    playerX = Math.floor(sections / 2) * (canvas.width / sections); // Inicia o personagem no centro
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
    // Movimento das setas
    if (running) {
        if (e.key === "ArrowLeft" && playerX > 0) playerX -= canvas.width / sections; // Mover para a esquerda
        if (e.key === "ArrowRight" && playerX < canvas.width - (canvas.width / sections)) playerX += canvas.width / sections; // Mover para a direita
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
    if (!running) {
        startGame();
    } else {
        handleTouch(e);
    }
});

// Desenha o personagem
function drawPlayer() {
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(playerX, playerY, canvas.width / sections - 5, 30); // Corpo do personagem ajustado às seções
}

// Desenha obstáculos
function drawObstacles() {
    ctx.fillStyle = "#888";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, canvas.width / sections - 5, 60); // Ajustando a largura do obstáculo às seções

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

function spawnObstacle() {
    let obstacleX = Math.floor(Math.random() * (sections - 1)) * (canvas.width / sections); // Coloca obstáculos aleatoriamente em 4 das 5 seções
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
    ctx.fillText("Pontos: " + score, 10, 40); // Ajustando a posição para evitar cortar
    ctx.fillText("Recorde: " + record, canvas.width - 100, 40); // Ajustando a posição
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

// Mostra a tela inicial quando a página carrega
window.onload = showStartScreen;
