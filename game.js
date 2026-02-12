const startScreen = document.getElementById("startScreen");
const road = document.getElementById("road");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");

let running = false;
let playerX = 140;
let speed = 2;
let score = 0;

let obstacles = [];

function startGame(){
    startScreen.classList.add("hidden");
    road.classList.remove("hidden");
    running = true;
    gameLoop();
}

document.addEventListener("keydown", e=>{
    if(!running && e.key==="Enter") startGame();

    if(running){
        if(e.key==="ArrowLeft") move(-40);
        if(e.key==="ArrowRight") move(40);
    }
});

document.addEventListener("touchstart", ()=>{
    if(!running) startGame();
});

function move(dir){
    playerX += dir;
    playerX = Math.max(0, Math.min(280, playerX));
    player.style.left = playerX+"px";
}

/* criar armários */
function spawnObstacle(){
    let obs = document.createElement("div");
    obs.className="obstacle";
    obs.style.left = (Math.floor(Math.random()*8)*40)+"px";
    obs.style.top = "-60px";
    road.appendChild(obs);
    obstacles.push(obs);
}

setInterval(()=>{
    if(running) spawnObstacle();
},900);

/* colisão */
function collide(a,b){
    return !(
        a.right<b.left ||
        a.left>b.right ||
        a.bottom<b.top ||
        a.top>b.bottom
    );
}

function gameLoop(){
    if(!running) return;

    obstacles.forEach((obs,i)=>{
        let top = parseInt(obs.style.top);
        top += speed;
        obs.style.top = top+"px";

        if(collide(player.getBoundingClientRect(),obs.getBoundingClientRect())){
            running=false;
            alert("Fim de expediente! Pontos: "+score);
            location.reload();
        }

        if(top>480){
            obs.remove();
            obstacles.splice(i,1);
            score++;
            scoreEl.textContent=score;

            if(score%10===0) speed+=0.5;
        }
    });

    requestAnimationFrame(gameLoop);
}
