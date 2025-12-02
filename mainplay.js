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
const towerDamage = [null, 1, 1.5, 2, 3, 4]; // 데미지 변수 추가 (Tower 클래스와 Bullet 클래스에서 사용된다고 가정)
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

// 💡 이미지 변수 선언 (Enemy 클래스에서 사용)
let jindoImg;
let shibaImg;
let PomeImg;
let BeagleImg;
let DobermanImg;

// 🖼️ P5.js의 이미지 사전 로딩 함수
function preload() {
  jindoImg = loadImage('data/jindo.png'); // 네가 요청한 파일 로드!

  // 나머지 강아지 이미지도 Enemy.show()에서 사용되므로 임시로 로드
  shibaImg = loadImage('https://placehold.co/32x32/ff7800/white?text=SHB');
  PomeImg = loadImage('https://placehold.co/32x32/e8f7ff/333?text=POM');
  BeagleImg = loadImage('https://placehold.co/32x32/8b4513/white?text=BEA');
  DobermanImg = loadImage('https://placehold.co/32x32/333333/ff0000?text=DOB');
}

function setup() {
  // HexGridManager 클래스가 외부 파일에 있다고 가정하고 사용
  hexGrid = new HexGridManager(HEX_COLS, HEX_ROWS, HEX_R, MARGIN);
  createCanvas(hexGrid.totalW, hexGrid.totalH); // HexGridManager의 totalW, totalH 사용
  textAlign(CENTER, CENTER);
  textSize(14);
  imageMode(CENTER); // Enemy 클래스에서 이미지를 중앙 정렬하기 위해 추가
  // 캔버스 하단에 상점 배치
  shop = new Shop(MARGIN, height - 120, width - MARGIN * 2, 110);

  // 중앙 행을 경로로 지정
  const centerRow = floor(HEX_ROWS / 2);
  for (let c = 0; c < HEX_COLS; c++) hexGrid.setPathTile(centerRow, c, true);

  // StageManager 생성 시 필요한 경로 웨이포인트를 HexGridManager가 제공한다고 가정
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

  stageManager = new StageManager(dogData, pathWaypoints);
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

  // 타워 업데이트/발사 (HexTile.tower만 사용)
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
      // b.target이 유효한지 체크 및 데미지 적용
      if (b.target && b.target.takeDamage) b.target.takeDamage(b.damage);
      bullets.splice(i, 1);
    } else if (b.isOffScreen()) bullets.splice(i, 1);
  }

  // 스테이지 완료 확인
  if (isStageActive && dogs.length === 0 && stageManager.isStageOver()) {
    isStageActive = false;
    money += dogData[currentStage].stageReward;
    currentStage++;
    if (currentStage >= dogData.length) gameOver = true;
  }
  //상점과 관련된 draw logic
  shop.draw(); //상점 UI 그리기

  //drag 중인 상점 draggingItem에 넣고, drag and drop으로 설치
  if (draggingItem) {
    push();
    translate(mouseX, mouseY);
    
    // 사거리 표시 (설치 전 미리보기)
    noFill();
    stroke(255, 255, 255, 100);
    ellipse(0, 0, towerRange[1] * 2); // 1레벨 사거리
  
    // 타워 아이콘 (마우스 커서 위치)
    noStroke();
    fill(draggingItem.color);
    ellipse(0, 0, 40); // 타워 모양
    pop();
  }

}

// 📐 마우스 클릭 처리 (업그레이드 오류 수정 완료)
function mousePressed() {
  if (gameOver) return;

  // 1. 상점 아이템 클릭 체크
  let shopItem = shop.getItemAt(mouseX, mouseY);
  if (shopItem) {
    if (money >= shopItem.cost) {
      draggingItem = shopItem; // 드래그 시작!
      console.log(`${shopItem.name} 구매 드래그 시작`);
    } else {
      console.log("돈이 부족합니다!");
    }
    return; // 상점을 눌렀으면 맵 클릭은 무시
  }

  if (!isStageActive) {
    stageManager.startStage(currentStage);
    isStageActive = true;
    return;
  }

  const tile = hexGrid.getTileAt(mouseX, mouseY);
  if (!tile) return;
  if (tile.isPath) { console.log("경로 타일에는 설치 불가"); return; }

  // 🚨 타워 업그레이드/설치 로직 🚨
  const tower = tile.tower;

  if (tower) {
    // 1. 타워가 이미 있다면 -> 업그레이드 시도
    if (tower.level < maxTowerLevel) {
      if (money >= towerCost) {
        tower.level++;
        const lvl = tower.level;

        // 능력치 업데이트
        tower.range = towerRange[lvl] || tower.range;
        tower.fireRate = towerFireRate[lvl] || tower.fireRate;
        tower.damage = towerDamage[lvl] || tower.damage; // 데미지 업데이트

        money -= towerCost;
        console.log(`타워 레벨 ${lvl}로 업그레이드!`);
      } else console.log("돈 부족");
    } else console.log("최대 레벨");

  } else {
    // 2. 타워가 없다면 -> 새 타워 설치 시도
    if (money >= towerCost) {
      // Tower 클래스는 외부 파일에 정의되어 있다고 가정
      const { x, y, col, row } = tile; // 타일 정보

      const newTower = new Tower(x, y, col, row, 1);

      // 타워 초기 능력치 설정 (레벨 1)
      newTower.range = towerRange[1];
      newTower.fireRate = towerFireRate[1];
      newTower.damage = towerDamage[1]; // 데미지 초기 설정

      tile.tower = newTower; // HexTile에 타워 객체 할당
      tile.placeTower(newTower); // HexTile의 placeTower 메서드 호출 

      money -= towerCost;
      console.log("레벨 1 타워 설치 완료.");
    } else console.log("돈 부족");
  }
}

function mouseReleased() {
  // 드래그 중인 아이템이 있을 때만 실행
  if (draggingItem) {
    // 마우스 위치의 타일 찾기
    const tile = hexGrid.getTileAt(mouseX, mouseY);

    // 설치 조건 확인: 타일이 존재함 && 경로 아님 && 타워 없음
    if (tile && !tile.isPath && !tile.tower) {
      if (money >= draggingItem.cost) {
        // 돈 차감
        money -= draggingItem.cost;

        // 타워 생성 (새로운 Tower 객체)
        const newTower = new Tower(tile.x, tile.y, tile.col, tile.row, 1);
        
        // 능력치 설정 (이전에 만든 로직 활용)
        newTower.range = towerRange[1];
        newTower.fireRate = towerFireRate[1];
        newTower.damage = towerDamage[1];

        // 타일과 연결
        tile.tower = newTower;
        tile.placeTower(newTower);

        console.log(`${draggingItem.name} 설치 완료!`);
      }
    } else {
      console.log("여기엔 설치할 수 없어!");
    }

    // 드래그 종료 (초기화)
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
  text(`Stage: ${min(currentStage + 1, dogData.length)}`, 10, 70);

  textAlign(RIGHT, TOP);
  text(`Tower Cost: $${towerCost}`, width - 10, 10);
  let nextDog = dogData[currentStage];
  if (nextDog) {
    textAlign(RIGHT, TOP);
    fill(255, 200, 50);
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
    dogs = []; bullets = [];
    money = 1000; lives = 10; score = 0;
    gameOver = false; currentStage = 0; isStageActive = false;

    hexGrid.generate();
    for (let r = 0; r < HEX_ROWS; r++)
      for (let c = 0; c < HEX_COLS; c++)
        hexGrid.tiles[r][c].tower = null;

    // StageManager 생성 시 필요한 경로 웨이포인트를 직접 생성하여 전달
    const centerRow = floor(HEX_ROWS / 2);
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

    stageManager = new StageManager(dogData, pathWaypoints);
  }
}