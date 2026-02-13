const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerX = 140;
let playerY = 420;
let speed = 2;
let score = 0;
let record = localStorage.getItem("record") || 0;

let obstacles = [];
let running = false;

// Tela de início - Exibe mensagem
function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("O Arquivista", canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = "20px Arial";
    ctx.fillText("Pressione Enter ou Toque para Iniciar", canvas.width / 2, canvas.height / 2 + 40);
}

// Função para iniciar o jogo
function startGame() {
    running = true;
    score = 0;
    playerX = 140;
    playerY = 420;
    obstacles = [];
    speed = 2;
    gameLoop();
    
    // Esconde a tela inicial
    document.getElementById('startScreen').classList.add('hidden'); 
}

// Detecta pressionamento de tecla (PC)
document.addEventListener("keydown", (e) => {
    if (!running && e.key === "Enter") startGame();  // Inicia o jogo quando pressionar Enter
});

// Função de controle de toque (mobile)
function handleTouch(e) {
    const touchX = e.touches[0].clientX;
    const sectionWidth = canvas.width / 5;  // Divide a tela em 5 partes iguais

    // Ajusta a posição do personagem para a parte tocada
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

// Detecta toque na tela (para dispositivos móveis)
canvas.addEventListener("touchstart", (e) => {
    if (!running) {
        startGame();  // Inicia o jogo ao tocar na tela
    } else {
        handleTouch(e);  // Mover o personagem para a área clicada
    }
});

// Desenha o personagem
function drawPlayer() {
    ctx.fillStyle = "#F4C542"; 
    ctx.fillRect(playerX + 10, playerY + 5, 20, 20); 

    ctx.fillStyle = "#00AEEF"; 
    ctx.fillRect(playerX + 5, playerY + 25, 30, 30); 

    ctx.fillStyle = "#8B8B8B"; 
    ctx.fillRect(playerX + 5, playerY + 55, 12, 15); 
    ctx.fillRect(playerX + 20, playerY + 55, 12, 15); 

    ctx.fillStyle = "#3B3B3B"; 
    ctx.fillRect(playerX + 5, playerY + 70, 12, 5); 
    ctx.fillRect(playerX + 20, playerY + 70, 12, 5); 

    ctx.fillStyle = "#FFDD44"; 
    ctx.fillRect(playerX + 10, playerY + 20, 20, 10); 
}

// Desenha obstáculos
function drawObstacles() {
    obstacles.forEach((obs) => {
        ctx.fillStyle = "#888"; 
        ctx.fillRect(obs.x, obs.y, 40, 60); 

        ctx.strokeStyle = "#444"; 
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.moveTo(obs.x, obs.y + i * 12);
            ctx.lineTo(obs.x + 40, obs.y + i * 12);
            ctx.stroke();
        }
    });
}

// Função para gerar obstáculos
function spawnObstacle() {
    let obstacleX = Math.floor(Math.random() * (canvas.width / 40)) * 40;
    obstacles.push({ x: obstacleX, y: -60 });
}

// Função de colisão
function collide(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

// Desenha a pontuação e o recorde
function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.fillText("Pontos: " + score, 10, 20);
    ctx.fillText("Recorde: " + record, canvas.width - 100, 20);
}

// Função do loop do jogo
function gameLoop() {
    if (!running) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawObstacles();
    drawScore();

    obstacles.forEach((obs, i) => {
        obs.y += speed;
        if (collide({ left: playerX, top: playerY, right: playerX + 40, bottom: playerY + 40 }, { left: obs.x, top: obs.y, right: obs.x + 40, bottom: obs.y + 60 })) {
            running = false;
            if (score > record) {
                record = score;
                localStorage.setItem("record", record); 
            }
            alert("Fim de expediente! Pontos: " + score);
            location.reload();
        }

        if (obs.y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
            if (score % 10 === 0) {
                speed += 0.5; 
            }
        }
    });

    requestAnimationFrame(gameLoop);
}

// Geração de obstáculos a cada intervalo
setInterval(() => {
    if (running) spawnObstacle();
}, 900);

// Inicializando o jogo ao carregar a página
window.onload = showStartScreen;
