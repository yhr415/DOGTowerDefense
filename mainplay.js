//dog, pet들의 정보를 담는 list
let enemies = [];

let shop;
let draggingItem = null; // 상점에서 drag and drop 기능 : 현재 drag 중인 타워 정보 저장
let bullets = [];
let money = 1000, lives = 10, score = 0, gameOver = false;

//pet spawn Rate 변수 하나 만들었음... 근데 dog에 spawn rate가 필요할까?
const spawnRate = 60;
const petSpawnRate = 60;

let bossActive = false
let bossDog = null;

let HEX_COLS = 15, HEX_ROWS = 7, HEX_R = 50, MARGIN = 24;
let hexGrid;

let currentStage = 0, stageManager, isStageActive = false;

// 이미지 변수 선언
let jindoImg;
let shibaImg;
let PomeImg;
let BeagleImg;
let DobermanImg;
let backgrnd;

//effect를 담는 List
let effects = [];

let towerSpriteSheets = {}; //타워 이미지 담기
let bulletimgs = {}; //bullet image 담기
let dogPics = {};

// API / apiInfo 관련 전역 변수
let rescueData = null;        // preload에서 불러온 전체 JSON (rescueData.items)
let currentApiInfo = null;  // 지금 화면에 띄운 선택된 item 객체
let apiInfo = null;
let showApiInfoScreen = false; // API 정보 화면 표시 여부
let isApiScreenOpen = false; //현재 API 정보 화면 열림 여부
let apiInfoImg = null;      // 선택 item의 p5.Image
let imageCache = {};          // imageUrl -> p5.Image 캐시
let showStageInfoScreen = false; // info 화면 표시 여부
let apiImgLoading = false;
let apiImgLoadError = false;
// 강아지 이미지 로딩
function preload() {
  dogPics['jindo'] ||= {}; 
  dogPics['jindo']['white'] ||= {};
  dogPics['pome'] ||= {}; 
  dogPics['pome']['white'] ||= {};
  dogPics['jindo']['white']['sad'] = loadImage('data/dog/WhiteJindoSad.png');
  dogPics['jindo']['white']['neutral'] = loadImage('data/dog/WhiteJindoNeutral.png');
  dogPics['jindo']['white']['happy'] = loadImage('data/dog/WhiteJindoHappy.png');
  dogPics['pome']['white']['sad'] = loadImage('data/dog/WhiteJindoSad.png');
  dogPics['pome']['white']['neutral'] = loadImage('data/dog/WhiteJindoNeutral.png');
  dogPics['pome']['white']['happy'] = loadImage('data/dog/WhiteJindoHappy.png');
  dogPics['shiba'] ||= {}; 
  dogPics['shiba']['white'] ||= {};
  dogPics['shiba']['white']['sad'] = loadImage('data/dog/WhiteJindoSad.png');
  dogPics['shiba']['white']['neutral'] = loadImage('data/dog/WhiteJindoNeutral.png');
  dogPics['shiba']['white']['happy'] = loadImage('data/dog/WhiteJindoHappy.png');
  dogPics['doberman'] ||= {}; 
  dogPics['doberman']['white'] ||= {};
  dogPics['doberman']['white']['sad'] = loadImage('data/dog/WhiteJindoSad.png');
  dogPics['doberman']['white']['neutral'] = loadImage('data/dog/WhiteJindoNeutral.png');
  dogPics['doberman']['white']['happy'] = loadImage('data/dog/WhiteJindoHappy.png');


  shibaImg = loadImage('data/jindo.png');
  PomeImg = loadImage('data/jindo.png');
  BeagleImg = loadImage('data/jindo.png');
  DobermanImg = loadImage('data/jindo.png');
  petPome = loadImage('data/pome.png');
  //배경 이미지 로딩
  backgrnd = loadImage('data/dtdBackgrnd.png');
  //icon loading
  iconCoin = loadImage('data/coin_icon.png');
  //effect loading
  healGreen20 = loadImage('data/effect/healGreen20.png');
  healYellow5 = loadImage('data/effect/healYellow5.png');
  heartEffect5 = loadImage('data/effect/heartEffect.png');
  //bullet loading
  bulletimgs['love'] = loadImage('data/bullet/heartbullet.png');
  bulletimgs['snack']=loadImage('data/bullet/snackbullet.png');
  //tower loading
  towerSpriteSheets["heal"] = loadImage('data/tower/heal.png');
  towerSpriteSheets["snack"] = loadImage('data/tower/snack.png');
  towerSpriteSheets["love"] = loadImage('data/tower/love.png');
  towerSpriteSheets["block"]=loadImage('data/tower/block.png');
  towerSpriteSheets["factory"]=loadImage('data/tower/gold.png');
  towerSpriteSheets["support"]=loadImage('data/tower/support.png');

  rescueData = loadJSON('data/daejeon_dog.json');

}

function setup() {
  hexGrid = new HexGridManager(HEX_COLS, HEX_ROWS, HEX_R, MARGIN);
  createCanvas(hexGrid.totalW, hexGrid.totalH + 100);
  textAlign(CENTER, CENTER);
  textSize(14);
  imageMode(CENTER);

  shop = new Shop(0, height - 120, width, 120);

  const pathDesign = [
    { r: 1, c: 0 },
    { r: 1, c: 1 },
    { r: 2, c: 2 },
    { r: 3, c: 2 },
    { r: 4, c: 2 },
    { r: 5, c: 2 },
    { r: 5, c: 3 },
    { r: 5, c: 4 },
    { r: 5, c: 5 },
    { r: 5, c: 6 },
    { r: 5, c: 7 },
    { r: 5, c: 8 },
    { r: 4, c: 8 },
    { r: 3, c: 8 },
    { r: 2, c: 8 },
    { r: 1, c: 9 },
    { r: 1, c: 10 },
    { r: 1, c: 11 },
    { r: 1, c: 12 },
    { r: 1, c: 13 },
    { r: 2, c: 13 },
    { r: 3, c: 13 },
    { r: 4, c: 13 },
    { r: 5, c: 13 },
    { r: 6, c: 13 },
  ];

  // 2) path 타일 지정
  for (let p of pathDesign) {
    hexGrid.setPathTile(p.r, p.c, true);
  }

  // 3) Waypoints 생성
  const pathWaypoints = [];
  for (let p of pathDesign) {
    const tile = hexGrid.tiles[p.r][p.c];
    pathWaypoints.push({ x: tile.x, y: tile.y });
  }

  // 4) 맵 바깥에서 등장/퇴장 보정
  const startTile = hexGrid.tiles[pathDesign[0].r][pathDesign[0].c];
  const endTile   = hexGrid.tiles[pathDesign.at(-1).r][pathDesign.at(-1).c];

  pathWaypoints.unshift({ x: -HEX_R, y: startTile.y });
  pathWaypoints.push({ x: hexGrid.totalW + HEX_R, y: endTile.y });

  // 5) StageManager에 전달
  stageManager = new StageManager(stageDesign, pathWaypoints);

  //각 타일마다 인접 타일들 미리 저장
  for (let r = 0; r < hexGrid.rows; r++) {
    for (let c = 0; c < hexGrid.cols; c++) {
      hexGrid.tiles[r][c].setAdjTiles()
    }
  }

  // stageDesign 데이터를 전달
  stageManager = new StageManager(stageDesign, pathWaypoints);
}

function draw() {
  image(backgrnd, width / 2, height / 2, width, height); //background 이미지 불러오기

  if (showApiInfoScreen) {
    if (currentApiInfo) {
      drawApiInfoScreen();
      return;
    } else {
      // 데이터 없음 — 플래그 클리어
      isApiScreenOpen = false;
    }
  }
  if (!isStageActive && !gameOver) {
    drawStageInfo(); 
    return;
  }

  if (gameOver) {
    drawGameOver(); // 게임오버 시 화면
    return;
  }

  hexGrid.draw();
  drawUI();
  // 적 관리 시스템 update (1205): dog과 pet을 별도의 object로 받아와서 enemies로 한 번에 관리
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.update();
    e.show(); //enemies 배열 안에 있는 것들을 불러와서 보여줌

    if (e.reachedEnd()) {
      // 끝에 도달했을 때 로직
      enemies.splice(i, 1);

      // Dog(보스)면 바로 게임 오버로 설정
      // 여기서는 Dog 클래스의 인스턴스인지 확인 (instanceof Dog) 하거나 
      // 속성(e.isBoss)으로 확인
      if (e instanceof Dog) { // 만약 보스(Dog)라면
        gameOver = true; // 보스를 놓치면 바로 게임 오버!
      } else {
        lives--; // 펫이면 라이프 1 감소
        if (lives <= 0) gameOver = true;
      }

    } else if (e.isDead()) {
      money += 10; score += 10;
      enemies.splice(i, 1);
      // stageManager에게 알릴 필요가 있을 경우 (적 카운트 등)
      // stageManager.enemyDefeated(); 
    }
  }

  // 타워 관리
  for (let row = 0; row < hexGrid.rows; row++) {
    for (let col = 0; col < hexGrid.cols; col++) {
      const tile = hexGrid.tiles[row][col];
      const t = tile.tower
      if (t) {
        t.update();
        t.show();
        if (towerStats[t.type].canShoot) {
          t.shoot(enemies);
        }
        else {
          if (t.type === "support") {
            t.enhance(tile)
          }
          else if (t.type === "block") {
            t.block()
          }
          else if (t.type === "factory") {
            t.earn()
          }
          else if (t.type === "playground") {
            t.play()
          }
        }
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

  //effect update
  for (let i = effects.length - 1; i >= 0; i--) {
    let ef = effects[i];
    ef.update();
    ef.show();

    // 애니메이션 끝난 배열 삭제
    if (ef.finished) {
      effects.splice(i, 1);
    }
  }

  // 스테이지 완료 확인
  // enemies가 비었고, 더 이상 스폰할 것도 없으면 다음 스테이지
  if (isStageActive && stageManager.isStageOver() && enemies.length === 0) {
    isStageActive = false;
    money += stageDesign[currentStage].stageReward;

      // rescueData에서 랜덤 선택
  if (rescueData && rescueData.items && rescueData.items.length > 0) {
    const rndIndex = floor(random(rescueData.items.length));
    startApiInfoScreen(rescueData.items[rndIndex]);
  } else {
    // 데이터 없으면 바로 StageInfo로 복귀(혹시 몰라서 넣어둠)
    showApiInfoScreen = false;
  }

    currentStage++;
    if (currentStage >= stageDesign.length) gameOver = true;
  }

  shop.draw();

  // ... (draw 함수 맨 아래쪽) ...

  // 🖱️ 드래그 중인 아이템 그리기
  if (draggingItem) {
    push();
    translate(mouseX, mouseY); // 마우스 위치를 (0,0) 기준으로 잡음

    // 1. 사거리 미리보기 원 (이건 유지!)
    // level1Range가 정의되어 있다고 가정, 없으면 기본값 100
    let range = (typeof level1Range !== 'undefined' && level1Range[draggingItem.type]) ? level1Range[draggingItem.type] : 100;

    noFill();
    stroke(255, 255, 255, 100); // 반투명 흰색
    ellipse(0, 0, range * 2);   // 사거리 표시

    // 2. 타워 스프라이트 그리기 (여기가 수정됨! 🚀)
    const sheet = towerSpriteSheets[draggingItem.type];

    if (sheet) {
      // 0번 인덱스(1레벨) 모습을 보여줌
      // translate(mouseX, mouseY)를 했기 때문에 좌표는 0, 0 기준인데,
      // 이미지를 마우스 정중앙에 오게 하려면 크기의 절반만큼 빼줘야 해 (-32, -32)
      drawSprite(
        sheet,
        0,         // 1레벨(인덱스 0)
        0, 0,  // 위치 (중앙 정렬 보정)
        70, 70,    // 크기
        5, 1          // 가로 3칸짜리 시트
      );
    } else {
      // 이미지 없으면 기존 동그라미 (백업)
      noStroke();
      fill(draggingItem.color);
      ellipse(0, 0, 40);
    }

    pop();
  }
  if (isStageActive) stageManager.update();
  else drawStageInfo();
}

function mousePressed() {

  if (showApiInfoScreen) {
    const boxW = min(width - 80, 860);
    const boxH = min(height - 200, 520);
    const boxX = (width - boxW) / 2;
    const boxY = (height - boxH) / 2;

    const btnW = 200, btnH = 48;
    const btnX = width/2 - btnW/2;
    const btnY = boxY + boxH - 70;

    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
      // API 화면 닫고 기존 StageInfo 화면 보이도록
      showApiInfoScreen = false;
      // (currentApiInfo 유지하거나 null 처리 가능)
    }
    return; // API 화면이 켜져 있는 동안 다른 클릭 이벤트 차단
  }

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

  // 타워 불러오기, 업그레이드 (지금은 단순 터치만 하면 업그레이드)
  const tower = tile.tower;

  if (tower && levelUpCost[tower.type]) {
    if (tower.level < maxTowerLevel) {
      if (money >= levelUpCost[tower.type][tower.level]) {
        money -= levelUpCost[tower.type][tower.level]
        tower.levelUp()
      }
    }
  }
  // else { ... } 블록을 제거하여 빈 타일 클릭 시 설치되지 않도록 함
}

function mouseReleased() {
  if (draggingItem) {
    const tile = hexGrid.getTileAt(mouseX, mouseY);
    if (tile && !tile.tower && (!tile.isPath ^ towerStats[draggingItem.type]["canBuiltPath"])) {
      if (money >= draggingItem.cost) {
        money -= draggingItem.cost;
        const newTower = new Tower(tile.x, tile.y, tile.col, tile.row, 1, draggingItem.type, draggingItem.color);
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

function spawnBoss(stageIndex) {
  let boss = new Dog(stageManager.path, bossHp[stageIndex], bossSpeed[stageIndex], bossName[stageIndex]);
  bossDog = boss;
  dogs.push(boss);
  bossActive = true;
}