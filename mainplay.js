/*
이차원 배열 towers를 레벨 0 타워로 초기화하고,
클릭한 셀에 해당되는 타워의 레벨을 1증가시켜주었습니다. (레벨업 비용은 설치비용과 동일하게)
각 레벨에 해당되는 타워의 범위, 발사속도는 아래의 게임설정변수에 임의 값으로 설정하였습니다. -> 이후 모든 능력치 저장된 json파일 불러오기?
*/

let dogs = [];
let shop;
let draggingItem = null; // 상점에서 drag and drop 기능 : 현재 drag 중인 타워 정보 저장
let bullets = [];
let money = 1000, lives = 10, score = 0, gameOver = false;

const spawnRate = 60;
const towerCost = 50;
const towerRange = [null, 100, 150, 200, 250, 300];
const towerFireRate = [null, 30, 25, 20, 15, 10];
const towerDamage = [null, 1, 1.5, 2, 3, 4]; // 데미지 변수 추가
const maxTowerLevel = 5;

let HEX_COLS = 15, HEX_ROWS = 7, HEX_R = 32, MARGIN = 24;
let hexGrid;

// 💡 스테이지 디자인 (네가 원하는 대로 수정해!)
const stageDesign = [
  // Stage 1: 시바견 5마리가 60프레임(1초) 간격으로 등장
  { stage: 1, type: "shiba", count: 5, interval: 60, hp: 10, stageReward: 100, fact: "시바견 군단이 몰려온다!" },
  
  // Stage 2: 비글 10마리가 빠르게(30프레임) 등장 (물량전)
  { stage: 2, type: "beagle", count: 10, interval: 30, hp: 8, stageReward: 150, fact: "비글들이 뛰어놀고 싶어해!" },
  
  // Stage 3: 튼튼한 진돗개 3마리
  { stage: 3, type: "jindo", count: 3, interval: 90, hp: 50, stageReward: 200, fact: "진돗개는 꽤 튼튼해." },
  
  // Stage 4: 엄청 튼튼한 도베르만 보스 1마리
  { stage: 4, type: "doberman", count: 1, interval: 0, hp: 200, stageReward: 300, fact: "보스 등장! 긴장해!" },
  
  // Stage 5: 푸들 떼거리
  { stage: 5, type: "pome", count: 20, interval: 20, hp: 5, stageReward: 500, fact: "너무 많아!" }
];

let currentStage = 0, stageManager, isStageActive = false;

// 💡 이미지 변수 선언
let jindoImg;
let shibaImg;
let PomeImg;
let BeagleImg;
let DobermanImg;
let backgrnd;

// 강아지 이미지 로딩
function preload() {
  jindoImg = loadImage('data/jindo.png'); 

  shibaImg = loadImage('data/jindo.png');
  PomeImg = loadImage('data/jindo.png');
  BeagleImg = loadImage('data/jindo.png');
  DobermanImg = loadImage('data/jindo.png');
//배경 이미지 로딩
  backgrnd= loadImage('data/dtdBackgrnd.png');
}

function setup() {
  hexGrid = new HexGridManager(HEX_COLS, HEX_ROWS, HEX_R, MARGIN);
  createCanvas(hexGrid.totalW, hexGrid.totalH); 
  textAlign(CENTER, CENTER);
  textSize(14);
  imageMode(CENTER);
  
  shop = new Shop(MARGIN, height - 120, width - MARGIN * 2, 110);

  const centerRow = floor(HEX_ROWS / 2);
  for (let c = 0; c < HEX_COLS; c++) hexGrid.setPathTile(centerRow, c, true);

  const pathWaypoints = [];
  for (let c = 0; c < HEX_COLS; c++) {
    pathWaypoints.push({
      x: hexGrid.tiles[centerRow][c].x,
      y: hexGrid.tiles[centerRow][c].y
    });
  }
  const pathY = hexGrid.tiles[centerRow][0].y;
  pathWaypoints.unshift({ x: -HEX_R, y: pathY });
  pathWaypoints.push({ x: hexGrid.totalW + HEX_R, y: pathY });

  // 💡 수정: stageDesign 데이터를 전달
  stageManager = new StageManager(stageDesign, pathWaypoints);
}

function draw() {
  image(backgrnd,width/2,height/2,width,height);

  if (gameOver) {
    drawGameOver();
    return;
  }

  hexGrid.draw();       
  drawUI();             

  if (isStageActive) stageManager.update();
  else drawStageInfo();

  // 적 업데이트/렌더링
  for (let i = dogs.length - 1; i >= 0; i--) {
    const e = dogs[i];
    e.update();
    e.show();

    if (e.reachedEnd()) {
      lives--;
      dogs.splice(i, 1);
      if (lives <= 0) gameOver = true;
    } else if (e.isDead()) {
      money += 10; score += 10;
      dogs.splice(i, 1);
      stageManager.enemyDefeated();
    }
  }

  // 타워 업데이트/발사
  for (let row = 0; row < hexGrid.rows; row++) {
    for (let col = 0; col < hexGrid.cols; col++) {
      const tile = hexGrid.tiles[row][col];
      if (tile.tower) {
        tile.tower.update();
        tile.tower.show();
        tile.tower.shoot(dogs);
      }
    }
  }

  // 총알 업데이트
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.update();
    b.show();
    if (b.hasHit()) {
      if (b.target && b.target.takeDamage) b.target.takeDamage(b.damage);
      bullets.splice(i, 1);
    } else if (b.isOffScreen()) bullets.splice(i, 1);
  }

  // 스테이지 완료 확인
  if (isStageActive && stageManager.isStageOver()) {
    isStageActive = false;
    // stageDesign을 사용하도록 수정
    money += stageDesign[currentStage].stageReward;
    currentStage++;
    if (currentStage >= stageDesign.length) gameOver = true;
  }
  
  shop.draw();

  if (draggingItem) {
    push();
    translate(mouseX, mouseY);
    noFill();
    stroke(255, 255, 255, 100);
    ellipse(0, 0, towerRange[1] * 2); 
    noStroke();
    fill(draggingItem.color);
    ellipse(0, 0, 40); 
    pop();
  }
}

function mousePressed() {
  // 💡 게임 오버 상태일 때 '다시 하기' 버튼 클릭 체크
  if (gameOver) {
    // 버튼 영역: 중앙(width/2), y위치(height/2 + 80), 크기(200x50)
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
        mouseY > height / 2 + 80 && mouseY < height / 2 + 130) {
      resetGame();
    }
    return;
  }

  // 1. 상점 아이템 클릭 체크
  let shopItem = shop.getItemAt(mouseX, mouseY);
  if (shopItem) {
    if (money >= shopItem.cost) {
      draggingItem = shopItem; // 드래그 시작!
    } else {
      console.log("돈이 부족합니다!");
    }
    return;
  }

  if (!isStageActive) {
    stageManager.startStage(currentStage);
    isStageActive = true;
    return;
  }

  const tile = hexGrid.getTileAt(mouseX, mouseY);
  if (!tile) return;
  if (tile.isPath) return;

  // 🚨 수정됨: 단순 터치 타워 설치 기능 제거 (업그레이드만 유지)
  const tower = tile.tower;

  if (tower) {
    if (tower.level < maxTowerLevel) {
      if (money >= towerCost) {
        tower.level++;
        const lvl = tower.level;
        tower.range = towerRange[lvl] || tower.range;
        tower.fireRate = towerFireRate[lvl] || tower.fireRate;
        tower.damage = towerDamage[lvl] || tower.damage;
        money -= towerCost;
      }
    }
  } 
  // else { ... } 블록을 제거하여 빈 타일 클릭 시 설치되지 않도록 함
}

function mouseReleased() {
  if (draggingItem) {
    const tile = hexGrid.getTileAt(mouseX, mouseY);
    if (tile && !tile.isPath && !tile.tower) {
      if (money >= draggingItem.cost) {
        money -= draggingItem.cost;
        const newTower = new Tower(tile.x, tile.y, tile.col, tile.row, 1);
        newTower.range = towerRange[1];
        newTower.fireRate = towerFireRate[1];
        newTower.damage = towerDamage[1];
        tile.tower = newTower;
        tile.placeTower(newTower);
      }
    }
    draggingItem = null;
  }
}

function drawUI() {
  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  textSize(14);
  text(`Money: $${money}`, 10, 10);
  text(`Lives: ${lives}`, 10, 30);
  text(`Score: ${score}`, 10, 50);
  // stageDesign 사용
  text(`Stage: ${min(currentStage + 1, stageDesign.length)}`, 10, 70);

  textAlign(RIGHT, TOP);
  text(`Tower Cost: $${towerCost}`, width - 10, 10);
  
  // stageDesign 사용
  let nextDog = stageDesign[currentStage];
  if (nextDog) {
    textAlign(RIGHT, TOP);
    fill(255, 200, 50);
    // type 대신 name이 없으므로 type을 표시하거나 이름을 추가해야 함
    text(`NEXT: ${nextDog.type}`, width - 10, 30);
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
  // stageDesign 사용
  let design = stageDesign[currentStage];
  if (design) {
    text(`강아지: ${design.type} x ${design.count}`, width / 2, height / 4 + 60);
    text(`보상: $${design.stageReward}`, width / 2, height / 4 + 90);
    text(`정보: ${design.fact}`, width / 2, height / 4 + 120);
  }

  textSize(14);
  text("클릭해서 시작", width / 2, height / 4 + 160);
}

// 💡 게임 오버 화면 그리기 + 버튼 추가
function drawGameOver() {
  fill(255);
  textSize(40);
  text("GAME OVER", width / 2, height / 2 - 20);
  textSize(20);
  text(`Final Score: ${score}`, width / 2, height / 2 + 20);

  // '다시 하기' 버튼 그리기
  fill(200);
  rect(width / 2 - 100, height / 2 + 80, 200, 50, 10); // x, y, w, h, radius
  fill(0);
  textSize(20);
  text("다시 하기", width / 2, height / 2 + 105);
}

// 💡 게임 리셋 함수 (재사용을 위해 분리함)
function resetGame() {
  dogs = [];
  bullets = [];
  money = 1000;
  lives = 10;
  score = 0;
  gameOver = false;
  currentStage = 0;
  isStageActive = false;

  hexGrid.generate(); // 그리드 초기화 (타워 제거됨)

  // 💡 수정됨: 경로를 다시 설정해주는 로직 추가! (setup과 동일하게)
  const centerRow = floor(HEX_ROWS / 2);
  for (let c = 0; c < HEX_COLS; c++) hexGrid.setPathTile(centerRow, c, true);

  // 경로 재설정 (setup에 있던 로직)
  const pathWaypoints = [];
  for (let c = 0; c < HEX_COLS; c++) {
    pathWaypoints.push({
      x: hexGrid.tiles[centerRow][c].x,
      y: hexGrid.tiles[centerRow][c].y
    });
  }
  const pathY = hexGrid.tiles[centerRow][0].y;
  pathWaypoints.unshift({ x: -HEX_R, y: pathY });
  pathWaypoints.push({ x: hexGrid.totalW + HEX_R, y: pathY });

  // stageDesign 전달
  stageManager = new StageManager(stageDesign, pathWaypoints);
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    resetGame();
  }
}