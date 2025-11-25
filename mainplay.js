let enemies = [];
let towers = [];
let bullets = [];

let money = 1000;
let lives = 10;
let score = 0;
let gameOver = false;

// 게임 설정 변수
const spawnRate = 60; // 적 생성 주기 (프레임 단위)
const towerCost = 50;
const towerRange = 150;

function setup() {
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);
  textSize(20);
}

function draw() {
  background(50); // 어두운 배경

  if (gameOver) {
    fill(255);
    textSize(40);
    text("GAME OVER", width / 2, height / 2);
    textSize(20);
    text(`Final Score: ${score}`, width / 2, height / 2 + 40);
    return;
  }

  // 1. UI 및 경로 그리기
  drawPath();
  drawUI();

  // 2. 적 생성 및 관리
  if (frameCount % spawnRate === 0) {
    enemies.push(new Enemy());
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    e.update();
    e.show();

    // 적이 오른쪽 끝에 도달했을 때
    if (e.reachedEnd()) {
      lives--;
      enemies.splice(i, 1);
      if (lives <= 0) gameOver = true;
    } else if (e.isDead()) {
      money += 10; // 적 처치 시 보상
      score += 10;
      enemies.splice(i, 1);
    }
  }

  // 3. 타워 관리
  for (let t of towers) {
    t.show();
    t.shoot(enemies);
  }

  // 4. 총알 관리
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.update();
    b.show();
    
    if (b.hasHit()) {
      b.target.takeDamage(1); // 데미지 1
      bullets.splice(i, 1);
    } else if (b.isOffScreen()) {
      bullets.splice(i, 1);
    }
  }
}

// 마우스 클릭 시 타워 설치
function mousePressed() {
  if (gameOver) return;
  if (money >= towerCost) {
    towers.push(new Tower(mouseX, mouseY));
    money -= towerCost;
  }
}

// --- 경로 그리기 ---
function drawPath() {
  stroke(100);
  strokeWeight(40);
  line(0, height / 2, width, height / 2); // 화면 중앙을 가로지르는 길
}

// --- UI 그리기 ---
function drawUI() {
  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  text(`Money: $${money}`, 20, 20);
  text(`Lives: ${lives}`, 20, 50);
  text(`Score: ${score}`, 20, 80);
  
  // 타워 가격 안내
  textAlign(RIGHT, TOP);
  text(`Tower Cost: $${towerCost}`, width - 20, 20);
}
