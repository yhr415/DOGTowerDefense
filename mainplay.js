/*
이차원 배열 towers를 레벨 0 타워로 초기화하고,
클릭한 셀에 해당되는 타워의 레벨을 1증가시켜주었습니다. (레벨업 비용은 설치비용과 동일하게)
각 레벨에 해당되는 타워의 범위, 발사속도는 아래의 게임설정변수에 임의 값으로 설정하였습니다. -> 이후 모든 능력치 저장된 json파일 불러오기?
*/

let enemies = [];
let bullets = [];
let money = 1000, lives = 10, score = 0, gameOver = false;

const spawnRate = 60;
const towerCost = 50;
const towerRange = [null, 100, 150, 200, 250, 300];
const towerFireRate = [null, 30, 25, 20, 15, 10];
const maxTowerLevel = 5;

let HEX_COLS = 15, HEX_ROWS = 7, HEX_R = 32, MARGIN = 24;
let hexGrid;
const dogData = [
  { name: "시바견 (Shiba Inu)", hpMultiplier: 1.0, fact: "충성심이 강하고 용감해!", stageReward: 100 },
  { name: "골든 리트리버 (Golden Retriever)", hpMultiplier: 1.5, fact: "가장 인기 있는 반려견 중 하나야.", stageReward: 150 },
  { name: "푸들 (Poodle)", hpMultiplier: 2.0, fact: "털이 곱슬곱슬하고 매우 똑똑해!", stageReward: 200 },
  { name: "비글 (Beagle)", hpMultiplier: 2.5, fact: "호기심이 많고 냄새 맡기를 좋아해.", stageReward: 250 },
  { name: "도베르만 (Doberman)", hpMultiplier: 3.0, fact: "경비견으로 많이 활약하는 듬직한 강아지야!", stageReward: 300 },
];

let currentStage = 0, stageManager, isStageActive = false;

function setup() {
  hexGrid = new HexGridManager(HEX_COLS, HEX_ROWS, HEX_R, MARGIN);
  createCanvas(hexGrid.cols * HEX_R * 1.5 + MARGIN, HEX_ROWS * Math.sqrt(3) * HEX_R + MARGIN);
  textAlign(CENTER, CENTER);
  textSize(14);

  // 중앙 행을 경로로 지정
  const centerRow = floor(HEX_ROWS / 2);
  for (let c = 0; c < HEX_COLS; c++) hexGrid.setPathTile(centerRow, c, true);

  stageManager = new StageManager(dogData);
}

function draw() {
  background(48);

  if (gameOver) {
    drawGameOver();
    return;
  }

  hexGrid.draw();       // 육각형 타일 렌더링
  drawUI();             // UI

  if (isStageActive) stageManager.update();
  else drawStageInfo();

  // 적 업데이트/렌더링
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.update();
    e.show();

    if (e.reachedEnd()) {
      lives--;
      enemies.splice(i, 1);
      if (lives <= 0) gameOver = true;
    } else if (e.isDead()) {
      money += 10; score += 10;
      enemies.splice(i, 1);
      stageManager.enemyDefeated();
    }
  }

  // 타워 업데이트/발사 (HexTile.tower만 사용)
  for (let row = 0; row < hexGrid.rows; row++) {
    for (let col = 0; col < hexGrid.cols; col++) {
      const tile = hexGrid.tiles[row][col];
      if (tile.tower) {
        tile.tower.update();
        tile.tower.show();
        tile.tower.shoot(enemies);
      }
    }
  }

  // 총알 업데이트
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.update();
    b.show();
    if (b.hasHit()) {
      if (b.target) b.target.takeDamage(b.damage);
      bullets.splice(i, 1);
    } else if (b.isOffScreen()) bullets.splice(i, 1);
  }

  // 스테이지 완료 확인
  if (isStageActive && enemies.length === 0 && stageManager.isStageOver()) {
    isStageActive = false;
    money += dogData[currentStage].stageReward;
    currentStage++;
    if (currentStage >= dogData.length) gameOver = true;
  }
}

function mousePressed() {
  if (gameOver) return;

  if (!isStageActive) {
    stageManager.startStage(currentStage);
    isStageActive = true;
    return;
  }

  const tile = hexGrid.getTileAt(mouseX, mouseY);
  if (!tile) return;
  if (tile.isPath) { console.log("경로 타일에는 설치 불가"); return; }

    // 새 타워 설치 불가 조건 추가
    if (tile.tower) {
      console.log("이미 타워가 설치된 타일입니다.");
      return; // 여기서 설치 중단
    }

  if (money >= towerCost) {
    if (!tile.tower) {
      tile.tower = new Tower(tile.x, tile.y, tile.col, tile.row, 1);
      tile.tower.range = towerRange[1];
      tile.tower.fireRate = towerFireRate[1];
      money -= towerCost;
    } else {
      if (tile.tower.level < maxTowerLevel) {
        tile.tower.level++;
        const lvl = tile.tower.level;
        tile.tower.range = towerRange[lvl] || tile.tower.range;
        tile.tower.fireRate = towerFireRate[lvl] || tile.tower.fireRate;
        money -= towerCost;
      } else console.log("최대 레벨");
    }
  } else console.log("돈 부족");
}


function drawUI() {
  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  textSize(14);
  text(`Money: $${money}`, 10, 10);
  text(`Lives: ${lives}`, 10, 30);
  text(`Score: ${score}`, 10, 50);
  text(`Stage: ${min(currentStage + 1, dogData.length)}`, 10, 70);

  textAlign(RIGHT, TOP);
  text(`Tower Cost: $${towerCost}`, width - 10, 10);
  let nextDog = dogData[currentStage];
  if (nextDog) {
    textAlign(RIGHT, TOP);
    fill(255,200,50);
    text(`NEXT: ${nextDog.name}`, width - 10, 30);
    fill(255);
  }
}

function drawStageInfo() {
  fill(255, 200);
  rect(width / 4, height / 4, width / 2, height / 2, 10);
  fill(0);
  textAlign(CENTER, TOP);
  textSize(24);
  text(`STAGE ${currentStage + 1}`, width / 2, height / 4 + 16);

  textSize(16);
  let dog = dogData[currentStage];
  if (dog) {
    text(`강아지: ${dog.name}`, width / 2, height / 4 + 60);
    text(`보상: $${dog.stageReward}`, width / 2, height / 4 + 90);
    text(`정보: ${dog.fact}`, width / 2, height / 4 + 120);
  }

  textSize(14);
  text("클릭해서 시작", width / 2, height / 4 + 160);
}

function drawGameOver() {
  fill(255);
  textSize(40);
  text("GAME OVER", width / 2, height / 2);
  textSize(20);
  text(`Final Score: ${score}`, width / 2, height / 2 + 40);
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    enemies = []; bullets = [];
    money = 1000; lives = 10; score = 0;
    gameOver = false; currentStage = 0; isStageActive = false;

    hexGrid.generate();
    for (let r = 0; r < HEX_ROWS; r++)
      for (let c = 0; c < HEX_COLS; c++)
        hexGrid.tiles[r][c].tower = null;

    stageManager = new StageManager(dogData);
  }
}