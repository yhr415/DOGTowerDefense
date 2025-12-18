//게임 리셋 함수 (재사용을 위해 분리함)
function resetGame() {
  enemies = [];
  bullets = [];
  money = startMoney;
  lives = 10;
  score = 0;
  gameState="INTRO";
  manualPage=0;
  currentStage = 0;
  isStageActive = false;

  hexGrid.generate(); // 그리드 초기화 (타워 제거됨)

  // 💡 수정됨: 경로를 다시 설정해주는 로직 추가! (setup과 동일하게)
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
  stageManager = new StageManager(stageDesign, pathWaypoints);

  for (let r = 0; r < hexGrid.rows; r++) {
    for (let c = 0; c < hexGrid.cols; c++) {
      hexGrid.tiles[r][c].setAdjTiles()
    }
  }

  // stageDesign 전달
  stageManager = new StageManager(stageDesign, pathWaypoints);

  shop.updateAvailableItems(0)
}

function gameOverReset() {
  if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
    mouseY > height / 2 + 80 && mouseY < height / 2 + 130) {
    resetGame(); // resetGame 안에서 BGM을 다시 켜는 로직이 있으면 좋음
    if (bgmFail.isPlaying()) {
      bgmFail.stop();
    }
  }
  return;
}

function gameClearReset() {
  if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
    mouseY > height / 2 + 80 && mouseY < height / 2 + 130) {
    resetGame();
    if (bgmClear.isPlaying()) {
      bgmClear.stop();
    }
  }
  return;
}