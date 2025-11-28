/*
이차원 배열 towers를 레벨 0 타워로 초기화하고,
클릭한 셀에 해당되는 타워의 레벨을 1증가시켜주었습니다. (레벨업 비용은 설치비용과 동일하게)
각 레벨에 해당되는 타워의 범위, 발사속도는 아래의 게임설정변수에 임의 값으로 설정하였습니다. -> 이후 모든 능력치 저장된 json파일 불러오기?
*/

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
const towerRange = [null, 100, 150, 200, 250, 300];
const towerFireRate = [null, 30, 25, 20, 15, 10];
const maxTowerLevel = 5;

// 타워 배치 격자 관련 변수 : 수정 필요
const GRID_SIZE = 40; // 한 칸의 크기 (픽셀)
const NUM_COLS = 20; // 800 / 40
const NUM_ROWS = 10; // 400 / 40

// 🐕 강아지 데이터 (스테이지 정보)
const dogData = [
  { name: "시바견 (Shiba Inu)", hpMultiplier: 1.0, fact: "충성심이 강하고 용감해!", stageReward: 100 },
  { name: "골든 리트리버 (Golden Retriever)", hpMultiplier: 1.5, fact: "가장 인기 있는 반려견 중 하나야.", stageReward: 150 },
  { name: "푸들 (Poodle)", hpMultiplier: 2.0, fact: "털이 곱슬곱슬하고 매우 똑똑해!", stageReward: 200 },
  { name: "비글 (Beagle)", hpMultiplier: 2.5, fact: "호기심이 많고 냄새 맡기를 좋아해.", stageReward: 250 },
  { name: "도베르만 (Doberman)", hpMultiplier: 3.0, fact: "경비견으로 많이 활약하는 듬직한 강아지야!", stageReward: 300 },
  // 스테이지를 더 추가하려면 여기에 객체를 추가해
];

let currentStage = 0;
let stageManager; // StageManager 인스턴스
let isStageActive = false; // 현재 스테이지 진행 중 여부

function setup() {
  // 캔버스 크기를 격자 크기에 딱 맞게 재설정 (800x400으로 유지)
  createCanvas(NUM_COLS * GRID_SIZE, NUM_ROWS * GRID_SIZE); 
  textAlign(CENTER, CENTER);
  textSize(20);

  // 타워 배열 초기화 (모든 값을 레벨 0 타워로)
  for (let r = 0; r < NUM_ROWS; r++) {
    towers[r] = [];
    for (let c = 0; c < NUM_COLS; c++) {
      towers[r][c] = new Tower(c * GRID_SIZE + GRID_SIZE / 2, r * GRID_SIZE + GRID_SIZE / 2, c, r, 0);
    }
  }

  // 스테이지 매니저 초기화
  stageManager = new StageManager(dogData);
  stageManager.startStage(currentStage);
}

function draw() {
  background(50); // 어두운 배경

  if (gameOver) {
    drawGameOver();
    return;
  }

  // 1. UI 및 경로 그리기 (경로도 격자에 맞춰서 그려지도록 변경)
  drawGrid(); // 💡 격자 라인 추가
  drawPath();
  drawUI();

  // 2. 스테이지 진행 관리
  if (isStageActive) {
    stageManager.update();
  } else {
    drawStageInfo();
  }
  // 3. 적 관리
  for (let i = enemies.length - 1; i >= 0; i--) {
    // ... (기존 적 관리 로직 동일)
    let e = enemies[i];
    e.update();
    e.show();

    if (e.reachedEnd()) {
      lives--;
      enemies.splice(i, 1);
      if (lives <= 0) gameOver = true;
    } else if (e.isDead()) {
      money += 10; 
      score += 10;
      enemies.splice(i, 1);
      stageManager.enemyDefeated(); 
    }
  }

  // 4. 타워 관리
  for (let r = 0; r < NUM_ROWS; r++) {
    for (let c = 0; c < NUM_COLS; c++) {
      if (towers[r][c].level > 0) {
        towers[r][c].show()
        towers[r][c].shoot(enemies);
      }
    }
  }

  // 5. 총알 관리
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

  // 스테이지 종료 및 다음 스테이지 준비 확인
  if (isStageActive && enemies.length === 0 && stageManager.isStageOver()) {
    isStageActive = false; 
    money += dogData[currentStage].stageReward; 
    currentStage++;
    
    if (currentStage >= dogData.length) {
      gameOver = true; 
    }
  }
}

// 💥 게임 오버 화면
function drawGameOver() {
  fill(255);
  textSize(40);
  text("GAME OVER", width / 2, height / 2);
  textSize(20);
  text(`Final Score: ${score}`, width / 2, height / 2 + 40);
  if (currentStage >= dogData.length && lives > 0) {
    text("ALL STAGES CLEARED!", width / 2, height / 2 - 40);
  }
}

// 🐶 스테이지 시작 전 정보 표시
function drawStageInfo() {
  fill(255, 180);
  rect(width / 4, height / 4, width / 2, height / 2, 10);
  
  fill(0);
  textAlign(CENTER, TOP);
  textSize(30);
  text(`STAGE ${currentStage + 1}`, width / 2, height / 4 + 20);
  
  textSize(20);
  let dog = dogData[currentStage];
  text(`강아지: ${dog.name}`, width / 2, height / 4 + 70);
  text(`HP 요구치: x${dog.hpMultiplier.toFixed(1)}`, width / 2, height / 4 + 100);
  text(`정보: ${dog.fact}`, width / 2, height / 4 + 130);
  text(`스테이지 보상: $${dog.stageReward}`, width / 2, height / 4 + 160);
  
  textSize(25);
  text("클릭해서 다음 스테이지 시작!", width / 2, height / 4 + 220);
}

// 🖱️ 마우스 클릭 시 타워 설치 또는 스테이지 시작
function mousePressed() {
  if (gameOver) return;
  
  if (!isStageActive) {
    // 스테이지 시작
    stageManager.startStage(currentStage);
    isStageActive = true;
    return;
  }
  
  // 1. 클릭 좌표를 격자 좌표로 변환
  const { col, row, centerX, centerY } = getGridCoords(mouseX, mouseY);

  // 2. 격자 범위 및 타워 설치 금지 구역 (경로) 확인
  // 경로는 중앙 줄(row 4 또는 5)에 위치한다고 가정 (height/2)
  const pathRow = floor(height / 2 / GRID_SIZE); // 400/2/40 = 5
  if (row === pathRow) {
    console.log("경로에는 타워를 설치할 수 없습니다.");
    return; 
  }

  // 3. 타워 설치 가능 여부 및 재화 확인
  if (money >= towerCost) {
    if (col >= 0 && col < NUM_COLS && row >= 0 && row < NUM_ROWS) {
      if (towers[row][col].level < maxTowerLevel) { // 타워가 최대레벨이 아닌 경우
        levelUpTower(row, col)
        money -= towerCost;
      }
      else {
        console.log("이미 타워가 최대레벨입니다.");
      }
    }
  } else {
    console.log("돈이 부족합니다.");
  }
}

// --- 경로 그리기 ---
function drawPath() {
  stroke(100);
  strokeWeight(GRID_SIZE); // 경로 폭을 격자 크기에 맞춤
  
  // 화면 중앙을 가로지르는 길 (격자 중앙 라인)
  const pathY = NUM_ROWS * GRID_SIZE / 2; 
  line(0, pathY, width, pathY); 
}

// --- UI 그리기 ---
function drawUI() {
  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  text(`Money: $${money}`, 20, 20);
  text(`Lives: ${lives}`, 20, 50);
  text(`Score: ${score}`, 20, 80);
  text(`Stage: ${currentStage + 1}`, 20, 110);
  
  // 타워 가격 안내
  textAlign(RIGHT, TOP);
  text(`Tower Cost: $${towerCost}`, width - 20, 20);
  
  // 다음 강아지 정보 (현재 스테이지의 정보)
  let nextDog = dogData[currentStage];
  if (nextDog) {
    textAlign(RIGHT, TOP);
    fill(255, 200, 50); // 강조색
    text(`NEXT DOG: ${nextDog.name}`, width - 20, 50);
  }
}

function levelUpTower(row, col) {
  towers[row][col].level++;
  towers[row][col].range = towerRange[towers[row][col].level];
  towers[row][col].fireRate = towerFireRate[towers[row][col].level];
}