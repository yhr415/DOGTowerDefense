//게임 리셋 함수 (재사용을 위해 분리함)
function resetGame() {
    enemies = [];
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