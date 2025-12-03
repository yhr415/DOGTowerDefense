function getGridCoords(x, y) {
    const col = floor(x / GRID_SIZE);
    const row = floor(y / GRID_SIZE);
    
    // 타워를 격자 칸 중앙에 배치하기 위한 픽셀 좌표
    const centerX = col * GRID_SIZE + GRID_SIZE / 2;
    const centerY = row * GRID_SIZE + GRID_SIZE / 2;
    
    return { col, row, centerX, centerY };
  }
  
  function drawGrid() {
    stroke(100, 100, 100, 50); // 흐릿한 회색 선
    strokeWeight(1);
    // 수직선
    for (let c = 0; c < NUM_COLS; c++) {
      line(c * GRID_SIZE, 0, c * GRID_SIZE, height);
    }
    // 수평선
    for (let r = 0; r < NUM_ROWS; r++) {
      line(0, r * GRID_SIZE, width, r * GRID_SIZE);
    }
  }