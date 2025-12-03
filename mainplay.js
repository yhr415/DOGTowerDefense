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
  image(backgrnd,width/2,height/2,width,height); //background 이미지 불러오기

  if (gameOver) {
    drawGameOver(); // 게임오버 시 화면
    return;
  }

  hexGrid.draw();       
  drawUI();             

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

  // 타워가 선택된 셀을 클릭했을 때 interaction
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
  if (isStageActive) stageManager.update();
  else drawStageInfo();
}

function mousePressed() {
  //게임 오버 상태일 때 '다시 하기' 버튼 클릭 체크
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

  // 타워 불러오기, 업그레이드 (지금은 단순 터치만 하면 업그레이드)
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

function keyPressed() {
  if (key === 'r' || key === 'R') {
    resetGame();
  }
}