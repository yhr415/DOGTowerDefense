function preload() {
  loadeverything();
}
//const/preload.js/loadeverything

function setup() {
  if (bgm && bgm.isLoaded()) {
    bgm.setVolume(0.4);
  }
  if (bgmFail && bgmFail.isLoaded()) {
    bgmFail.setVolume(0.3);
  }
  if (bgmClear && bgmClear.isLoaded()) {
    bgmClear.setVolume(0.2);
  }
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
  // 배경은 공통으로 깔아주기
  image(backgrnd, width / 2 - 20, height / 2 - 20, width * 1.1, height * 1.1);

  switch (gameState) {
    case "INTRO":
      drawIntroduction();
      break;

    case "GUIDE1":
      drawGameBackground(manual1); // 게임 가이드 화면
      break;

    case "GUIDE2":
      drawGameBackground(manual2);
      break;

    case "PLAY":
      runInGameLogic(); // 실제 게임 플레이 로직 (따로 뺌)
      break;

    case "API":
      drawApiInfoScreen();
      break;

    case "GAMEOVER":
      drawGameOver();
      break;

    case "GAMECLEAR":
      drawGameClear();
      break;
  }
}

function mousePressed() {
  fxsounds['click']?.play(); // 공통 클릭음

  switch (gameState) {
    case "INTRO":
      gameState = "GUIDE1"; // 클릭하면 가이드로
      break;

    case "GUIDE1":
      gameState = "GUIDE2"; // 클릭하면 인게임으로
      break;

    case "GUIDE2":
      gameState = "PLAY";
      break;

    case "API":
      gameState = "PLAY"; // 정보창 닫고 다시 게임으로
      showApiInfoScreen = false;
      break;

    case "PLAY":
      handleInGameClick(); // 기존 상점, 타워 설치 클릭 로직
      break;

    case "GAMEOVER":
      resetGame();
      gamsState="INTRO";
      break;
    case "GAMECLEAR":
      resetGame();
      gameState = "INTRO"; // 다시 시작화면으로
      break;
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
  fill(navy2);
  noStroke();
  rect(uiX, uiY, uiWidth, uiHeight, 10);

  // 타워 이름
  fill(255, 200, 0);
  textAlign(CENTER, TOP);
  textSize(18);
  textFont(body_text);
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