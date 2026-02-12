const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerX = 140;
let playerY = 420;
let speed = 2;
let score = 0;

let obstacles = [];
let running = false;

function startGame() {
    running = true;
    score = 0;
    playerX = 140;
    playerY = 420;
    gameLoop();
    document.getElementById('startScreen').classList.add('hidden');  // Esconde a tela inicial
}

// Detecta pressionamento de tecla (PC)
document.addEventListener("keydown", (e) => {
    if (!running && e.key === "Enter") startGame();  // Inicia o jogo quando pressionar Enter

    if (running) {
        if (e.key === "ArrowLeft") move(-40); // Mover para a esquerda
        if (e.key === "ArrowRight") move(40); // Mover para a direita
    }
});

// Função para movimentar o personagem
function move(dir) {
    playerX += dir;
    playerX = Math.max(0, Math.min(canvas.width - 40, playerX)); // Limite da tela
}

// Função de controle de toque (mobile)
function handleTouch(e) {
    const touchX = e.touches[0].clientX;
    const sectionWidth = canvas.width / 5;  // Divide a tela em 5 partes iguais

    // Ajusta a posição do personagem para a parte tocada
    if (touchX < sectionWidth) {
        playerX = sectionWidth / 2; // Move para a primeira seção
    } else if (touchX < sectionWidth * 2) {
        playerX = sectionWidth * 1.5; // Move para a segunda seção
    } else if (touchX < sectionWidth * 3) {
        playerX = sectionWidth * 2.5; // Move para a terceira seção
    } else if (touchX < sectionWidth * 4) {
        playerX = sectionWidth * 3.5; // Move para a quarta seção
    } else {
        playerX = sectionWidth * 4.5; // Move para a quinta seção
    }
}

// Detecta toque na tela (para dispositivos móveis)
canvas.addEventListener("touchstart", (e) => {
    if (!running) startGame();  // Inicia o jogo ao tocar na tela
    handleTouch(e);  // Mover o personagem para a área clicada
});

// Detecta toque na tela inicial (para iniciar o jogo no celular)
document.getElementById("startScreen").addEventListener("touchstart", (e) => {
    startGame(); // Iniciar o jogo ao tocar na tela inicial
});

// Desenha o cenário
function drawRoad() {
    ctx.fillStyle = "#333"; // Cor de fundo (pista)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhando linhas para dividir a pista em 5 partes
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 2;
    for (let i = 1; i <= 4; i++) {
        ctx.moveTo(i * (canvas.width / 5), 0);
        ctx.lineTo(i * (canvas.width / 5), canvas.height);
        ctx.stroke();
    }
}

// Desenha o personagem
function drawPlayer() {
    ctx.fillStyle = "#00FF00"; // Cor do personagem (arquiivista)
    ctx.fillRect(playerX, playerY, 40, 40); // Personagem representado por um quadrado
}

// Desenha os obstáculos
function drawObstacles() {
    ctx.fillStyle = "#FF4444"; // Cor dos obstáculos (armários)
    obstacles.forEach((obs) => {
        ctx.fillRect(obs.x, obs.y, 40, 60); // Obstáculo representado por um retângulo
    });
}

// Função para gerar obstáculos
function spawnObstacle() {
    let obstacleX = Math.floor(Math.random() * (canvas.width / 40)) * 40;
    obstacles.push({ x: obstacleX, y: -60 });
}

// Função de colisão
function collide(a, b) {
    return !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
    );
}

// Função de loop do jogo
function gameLoop() {
    if (!running) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();
    drawPlayer();
    drawObstacles();

    // Atualizar obstáculos
    obstacles.forEach((obs, i) => {
        obs.y += speed;
        if (collide({ left: playerX, top: playerY, right: playerX + 40, bottom: playerY + 40 }, { left: obs.x, top: obs.y, right: obs.x + 40, bottom: obs.y + 60 })) {
            running = false;
            alert("Fim de expediente! Pontos: " + score);
            location.reload();
        }

        if (obs.y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
        }
    });

    requestAnimationFrame(gameLoop);
}

// Geração de obstáculos a cada intervalo
setInterval(() => {
    if (running) spawnObstacle();
}, 900);
