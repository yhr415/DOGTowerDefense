//dog, pet들의 정보를 담는 list
let enemies = [];

//1205 update : 타워 데이터를 기존에는 Hex grid에 저장
//-> 전역변수 towers를 만들어서 따로 관리
let towers = [];

let shop;
let draggingItem = null; // 상점에서 drag and drop 기능 : 현재 drag 중인 타워 정보 저장
let bullets = [];
const startMoney = 70
let money = startMoney
let lives = 10, score = 0, gameOver = false, gameClear = false;

//pet spawn Rate 변수 하나 만들었음... 근데 dog에 spawn rate가 필요할까?
const spawnRate = 60;
const petSpawnRate = 60;

let bossActive = false
let bossDog = null;

let HEX_COLS = 15, HEX_ROWS = 7, HEX_R = 50, MARGIN = 24;
let hexGrid;

let currentStage = 0, stageManager, isStageActive = false;

//sound 변수 선언
let bgm;
let fxsounds = {};

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

// 타워 선택 관련 변수
let selectedTower = null; // 선택된 타워
let selectedTile = null; // 선택된 타일
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
  backgrndGameover = loadImage('data/gameOver.png');
  //icon loading
  iconCoin = loadImage('data/coin_icon.png');
  //effect loading
  healGreen20 = loadImage('data/effect/healGreen20.png');
  healYellow5 = loadImage('data/effect/healYellow5.png');
  heartEffect5 = loadImage('data/effect/heartEffect.png');
  //bullet loading
  bulletimgs['love'] = loadImage('data/bullet/heartbullet.png');
  bulletimgs['snack'] = loadImage('data/bullet/snackbullet.png');
  //tower loading
  towerSpriteSheets["heal"] = loadImage('data/tower/heal.png');
  towerSpriteSheets["snack"] = loadImage('data/tower/snack.png');
  towerSpriteSheets["love"] = loadImage('data/tower/love.png');
  towerSpriteSheets["block"] = loadImage('data/tower/block.png');
  towerSpriteSheets["factory"] = loadImage('data/tower/gold.png');
  towerSpriteSheets["support"] = loadImage('data/tower/support.png');

  rescueData = loadJSON('data/daejeon_dog.json');

  //음악
  //bgm
  bgm = loadSound('data/sound/hyperpop.wav');
  bgmFail = loadSound('data/sound/rescue_failed.wav');
  bgmClear = loadSound('data/sound/gameEndBGM.wav');
  fxsounds["click"] = loadSound('data/sound/click.wav');
  fxsounds["hit"] = loadSound('data/sound/뿅뿅.wav');
  fxsounds["money"] = loadSound('data/sound/돈소리.wav');
  fxsounds["eat"] = loadSound('data/sound/eat.wav');
}

function setup() {
  bgm.setVolume(0.3);
  bgmFail.setVolume(0.3);
  bgmClear.setVolume(0.3);
  fxsounds["money"].setVolume(0.2);
  fxsounds["hit"].setVolume(0.1);
  fxsounds["eat"].setVolume(0.1);
  hexGrid = new HexGridManager(HEX_COLS, HEX_ROWS, HEX_R, MARGIN);
  createCanvas(hexGrid.totalW, hexGrid.totalH + 100);
  textAlign(CENTER, CENTER);
  textSize(14);
  imageMode(CENTER);

  shop = new Shop(0, height - 120, width, 120);
  // 초기 스테이지의 사용 가능한 타워 목록 설정
  shop.updateAvailableItems(currentStage);

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
  const endTile = hexGrid.tiles[pathDesign.at(-1).r][pathDesign.at(-1).c];

  pathWaypoints.unshift({ x: -HEX_R, y: startTile.y });
  pathWaypoints.push({ x: hexGrid.totalW + HEX_R, y: endTile.y });

  // 5) StageManager에 전달

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
  image(backgrnd, width / 2 - 20, height / 2 - 20, width * 1.1, height * 1.1); //background 이미지 불러오기

  if (gameOver) {
    drawGameOver(); // 게임오버 시 화면
    return;
  }

  if (gameClear) {
    drawGameClear(); //game 클리어 시 화면
    return;
  }

  if (showApiInfoScreen) {
    if (currentApiInfo) {
      drawApiInfoScreen();
      return;
    } else {
      isApiScreenOpen = false;
    }
  }

  if (!isStageActive) {
    drawStageInfo();
    return;
  }

  hexGrid.draw();
  drawUI();

  // 선택된 타워의 사거리 표시
  if (selectedTower && selectedTile) {
    drawSelectedTowerRange();
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
          if (t.type === "block") {
            t.block()
          }
          else if (t.type === "playground") {
            t.play()
          }
          else if (t.type === "support") {
            t.enhance(tile)
          }
          else if (t.type === "factory") {
            t.earn()
          }
        }
      }
    }
  }

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
        triggerGameOver(); // 보스를 놓치면 바로 게임 오버!
      } else {
        lives--; // 펫이면 라이프 1 감소
        if (lives <= 0) { triggerGameOver(); }
      }

    } else if (e.isDead()) {
      money += 5; score += 10;
      enemies.splice(i, 1);
      // stageManager에게 알릴 필요가 있을 경우 (적 카운트 등)
      // stageManager.enemyDefeated(); 
    }
  }

  // 총알 업데이트
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.update();
    b.show();
    if (b.hasHit()) {
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
    if (currentStage >= stageDesign.length) {
      triggerGameClear();
    }

    // 스테이지 변경 시 상점의 사용 가능한 타워 목록 업데이트
    if (shop) {
      shop.updateAvailableItems(currentStage);
    }
  }

  //boss alert 팝업 인터페이스 관리
  if (stageManager.bossPopupText) { // 텍스트가 있을 때만 그림
    drawInfo(stageManager.bossPopupText);
  }

  shop.draw();

  // 선택된 타워 UI 그리기 (Shop 이후에 그려서 Shop 배경이 UI를 가리지 않도록)
  if (selectedTower && selectedTile) {
    drawTowerSelectionUI();
  }

  // 🖱️ 드래그 중인 아이템 그리기
  if (draggingItem) {
    push();
    translate(mouseX, mouseY); // 마우스 위치를 (0,0) 기준으로 잡음

    // 1. 사거리 미리보기 원 (이건 유지!)
    // level1Range가 정의되어 있다고 가정, 없으면 기본값 0
    let range = (typeof level1Range !== 'undefined' && level1Range[draggingItem.type]) ? level1Range[draggingItem.type] : 0;

    noFill();
    stroke(255, 255, 255, 200); // 반투명 흰색
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


  //test용 코드입니다. 켜져있으면 주석처리해주세요
  drawtestButton1();
  drawtestButton2();
}

function mousePressed() {

  // 1. [UI] API 정보창 닫기
  if (showApiInfoScreen) {
    const boxW = min(width - 80, 860);
    const boxH = min(height - 200, 520);
    const boxY = (height - boxH) / 2;

    const btnW = 200, btnH = 48;
    const btnX = width / 2 - btnW / 2;
    const btnY = boxY + boxH - 70;

    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
      showApiInfoScreen = false;

      // 🔊 클릭 소리 재생
      fxsounds['click'].play();
    }
    return;
  }

  clicktestButton();

  //[UI] 게임 오버 -> 다시 하기
  if (gameOver) {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 80 && mouseY < height / 2 + 130) {
      resetGame(); // resetGame 안에서 BGM을 다시 켜는 로직이 있으면 좋음
      if (bgmFail.isPlaying()) {
        bgmFail.stop();
      }
    }
    return;
  }
  //game Clear 시에도 동일한 Logic으로 돌아가게!
  if (gameClear) {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 80 && mouseY < height / 2 + 130) {
      resetGame();
      if (bgmClear.isPlaying()) {
        bgmClear.stop();
      }
    }
    return;
  }

  if (handleTowerSelectionUI()) {
    return; // 버튼 클릭 처리됨
  }

  let shopItem = shop.getItemAt(mouseX, mouseY);
  if (shopItem) {
    if (money >= shopItem.cost) {
      draggingItem = shopItem; // 드래그 시작!
      selectedTower = null;
      selectedTile = null;

      // 🔊 아이템 집는 소리 (촥!)
      //fxsounds['money'].play();

    } else {
      console.log("돈이 부족합니다!");

      // 🔊 실패/경고 소리 (띠딕!)
      //if (typeof sfxError !== 'undefined') sfxError.play();
    }
    return;
  }

  if (!isStageActive) {
    stageManager.startStage(currentStage);
    isStageActive = true;
    selectedTower = null;
    selectedTile = null;

    // 🔊 전투 시작 소리 & 배경음악 재생
    fxsounds['click'].play();

    // BGM이 꺼져있다면 켜기 (중복 재생 방지)
    if (!bgm.isPlaying()) {
      bgm.loop();
    }

    return;
  }

  // 6. [타워] 선택 (업그레이드/제거 UI 표시)
  const tile = hexGrid.getTileAt(mouseX, mouseY);
  if (!tile) {
    // 타일이 아닌 곳을 클릭하면 선택 해제
    selectedTower = null;
    selectedTile = null;
    return;
  }

  const tower = tile.tower;

  // 타워가 있는 타일을 클릭하면 선택
  if (tower) {
    selectedTower = tower;
    selectedTile = tile;
  } else {
    // 타워가 없는 타일을 클릭하면 선택 해제
    selectedTower = null;
    selectedTile = null;
  }
}

function mouseReleased() {
  if (draggingItem) {
    const tile = hexGrid.getTileAt(mouseX, mouseY);
    if (tile && !tile.tower && (!tile.isPath ^ towerStats[draggingItem.type]["canBuiltPath"])) {
      if (money >= draggingItem.cost) {
        money -= draggingItem.cost;
        const newTower = new Tower(tile.x, tile.y, tile.col, tile.row, 1, draggingItem.type, draggingItem.color);
        tile.tower = newTower;
        towers.push(newTower);
        tile.placeTower(newTower);

        selectedTower = null; // 새 타워 설치 시 선택 해제
        selectedTile = null;
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

// 선택된 타워의 사거리 표시 함수
function drawSelectedTowerRange() {
  if (!selectedTower || !selectedTile) return;

  // 공격 가능한 타워만 사거리 표시
  const stats = towerStats[selectedTower.type];
  if (!stats || !stats.canShoot || !selectedTower.range) return;

  push();
  noFill();
  stroke(255, 255, 255, 200); // 반투명 흰색 (드래그 중인 타워와 동일한 스타일)
  strokeWeight(2);
  ellipse(selectedTower.x, selectedTower.y, selectedTower.range * 2);
  pop();
}

// 타워 선택 UI 그리기 함수
function drawTowerSelectionUI() {
  if (!selectedTower || !selectedTile) return;

  // 타워 이름 찾기
  const towerItem = itemDesc.find(item => item.type === selectedTower.type);
  const towerName = towerItem ? towerItem.name : selectedTower.type;

  // UI 위치 (Shop 내부 오른쪽 아래)
  const uiWidth = 250;
  const uiHeight = 100; // Shop 높이(120)보다 작게 설정
  const shopHeight = 120; // Shop 높이
  const uiX = width - uiWidth - 20; // 화면 오른쪽에서 20px 여백
  const uiY = height - shopHeight + (shopHeight - uiHeight) / 2; // Shop 내부 중앙에 배치

  // 배경
  push();
  fill(0, 0, 0, 200);
  noStroke();
  rect(uiX, uiY, uiWidth, uiHeight, 10);

  // 타워 이름
  fill(255, 200, 0);
  textAlign(CENTER, TOP);
  textSize(18);
  text(towerName, uiX + uiWidth / 2, uiY + 10);

  // 레벨 정보
  fill(255);
  textSize(14);
  text(`레벨: ${selectedTower.level}`, uiX + uiWidth / 2, uiY + 35);

  // 업그레이드 버튼
  const upgradeBtnX = uiX + 20;
  const upgradeBtnY = uiY + 60;
  const upgradeBtnW = 100;
  const upgradeBtnH = 35;

  // block 타워는 업그레이드 불가
  const isBlockTower = selectedTower.type === "block";

  // 업그레이드 가능 여부 확인
  const canUpgrade = !isBlockTower &&
    selectedTower.level < maxTowerLevel &&
    levelUpCost[selectedTower.type] &&
    money >= levelUpCost[selectedTower.type][selectedTower.level];

  if (canUpgrade) {
    fill(100, 200, 100);
  } else {
    fill(150, 150, 150);
  }
  rect(upgradeBtnX, upgradeBtnY, upgradeBtnW, upgradeBtnH, 5);

  fill(0);
  textSize(14);
  textAlign(CENTER, CENTER);
  if (isBlockTower) {
    text(`업그레이드\n불가`, upgradeBtnX + upgradeBtnW / 2, upgradeBtnY + upgradeBtnH / 2);
  } else {
    const upgradeCost = levelUpCost[selectedTower.type] ? levelUpCost[selectedTower.type][selectedTower.level] : 0;
    if (selectedTower.level < maxTowerLevel) {
      text(`업그레이드\n${upgradeCost}g`, upgradeBtnX + upgradeBtnW / 2, upgradeBtnY + upgradeBtnH / 2);
    } else {
      text(`최대 레벨`, upgradeBtnX + upgradeBtnW / 2, upgradeBtnY + upgradeBtnH / 2);
    }
  }

  // 제거 버튼
  const removeBtnX = uiX + 130;
  const removeBtnY = uiY + 60;
  const removeBtnW = 100;
  const removeBtnH = 35;

  // block과 playground 타워는 제거 불가
  const canRemove = selectedTower.type !== "block" && selectedTower.type !== "playground";

  if (canRemove) {
    fill(200, 100, 100);
  } else {
    fill(150, 150, 150);
  }
  rect(removeBtnX, removeBtnY, removeBtnW, removeBtnH, 5);

  fill(0);
  textSize(14);
  textAlign(CENTER, CENTER);
  if (canRemove) {
    const refundAmount = towerItem ? Math.floor(towerItem.cost / 2) : 0;
    text(`제거\n+${refundAmount}g`, removeBtnX + removeBtnW / 2, removeBtnY + removeBtnH / 2);
  } else {
    text(`제거\n불가`, removeBtnX + removeBtnW / 2, removeBtnY + removeBtnH / 2);
  }

  pop();
}

// 타워 선택 UI 버튼 클릭 처리
function handleTowerSelectionUI() {
  if (!selectedTower || !selectedTile) return false;

  // 타워 이름 찾기
  const towerItem = itemDesc.find(item => item.type === selectedTower.type);

  // UI 위치 (Shop 내부 오른쪽 아래)
  const uiWidth = 250;
  const uiHeight = 100; // Shop 높이(120)보다 작게 설정
  const shopHeight = 120; // Shop 높이
  const uiX = width - uiWidth - 20; // 화면 오른쪽에서 20px 여백
  const uiY = height - shopHeight + (shopHeight - uiHeight) / 2; // Shop 내부 중앙에 배치

  // 업그레이드 버튼
  const upgradeBtnX = uiX + 20;
  const upgradeBtnY = uiY + 60;
  const upgradeBtnW = 100;
  const upgradeBtnH = 35;

  if (mouseX >= upgradeBtnX && mouseX <= upgradeBtnX + upgradeBtnW &&
    mouseY >= upgradeBtnY && mouseY <= upgradeBtnY + upgradeBtnH) {
    // 업그레이드 처리 (block 타워는 업그레이드 불가)
    if (selectedTower.type !== "block" &&
      selectedTower.level < maxTowerLevel &&
      levelUpCost[selectedTower.type] &&
      money >= levelUpCost[selectedTower.type][selectedTower.level]) {
      money -= levelUpCost[selectedTower.type][selectedTower.level];
      selectedTower.levelUp();
      fxsounds['money'].play();
      return true;
    }
  }

  // 제거 버튼
  const removeBtnX = uiX + 130;
  const removeBtnY = uiY + 60;
  const removeBtnW = 100;
  const removeBtnH = 35;

  if (mouseX >= removeBtnX && mouseX <= removeBtnX + removeBtnW &&
    mouseY >= removeBtnY && mouseY <= removeBtnY + removeBtnH) {
    // 제거 처리 (block과 playground 타워는 제거 불가)
    if (selectedTower.type === "block" || selectedTower.type === "playground") {
      return true; // 클릭은 처리했지만 제거하지 않음
    }

    const removedTowerType = selectedTower.type;
    const removedTile = selectedTile;

    if (towerItem) {
      const refundAmount = Math.floor(towerItem.cost / 2);
      money += refundAmount;
      fxsounds['money'].play();
    }

    // 타워 제거 전에 타일 정보 저장
    selectedTile.tower = null;

    // support 타워 제거 시 인접 타일들의 enhanced 값 재계산
    if (removedTowerType === "support") {
      // 모든 support 타워를 다시 확인하여 enhanced 값 재계산
      recalculateAllSupportEnhancements();
    } else {
      // support 타워가 아닌 경우, 해당 타일의 enhanced 값만 초기화
      // (다른 support 타워가 영향을 주고 있을 수 있으므로 재계산은 하지 않음)
      removedTile.enhanced = 1;
    }
    selectedTower = null;
    selectedTile = null;
    return true;
  }

  return false;
}

// 모든 support 타워의 강화 효과를 재계산하는 함수
function recalculateAllSupportEnhancements() {
  // 먼저 모든 타일의 enhanced 값을 1로 초기화
  for (let row = 0; row < hexGrid.rows; row++) {
    for (let col = 0; col < hexGrid.cols; col++) {
      const tile = hexGrid.tiles[row][col];
      tile.enhanced = 1;
    }
  }

  // 모든 support 타워를 순회하며 enhanced 값 재계산
  for (let row = 0; row < hexGrid.rows; row++) {
    for (let col = 0; col < hexGrid.cols; col++) {
      const tile = hexGrid.tiles[row][col];
      const tower = tile.tower;
      if (tower && tower.type === "support") {
        // support 타워의 enhance 함수 호출
        tower.enhance(tile);
      }
    }
  }

  // 모든 타워의 스탯 재계산 (enhanced 값이 변경되었으므로)
  for (let row = 0; row < hexGrid.rows; row++) {
    for (let col = 0; col < hexGrid.cols; col++) {
      const tile = hexGrid.tiles[row][col];
      const tower = tile.tower;
      if (tower) {
        tower.generate();
      }
    }
  }
}