class StageManager {
  constructor(dogData) {
    this.dogData = dogData;
    this.activeEnemies = [];
    this.spawnCounter = 0;
    this.stageEnemyCount = 5; // 적 수
  }

  startStage(stageIndex) {
    const path = this.createPath();
    for(let i=0;i<this.stageEnemyCount;i++){
      let e = new Enemy(path);
      enemies.push(e); // 반드시 Enemy 객체
      this.activeEnemies.push(e);
    }
  }

  update() {
    // Enemy 업데이트는 mainplay.js에서 처리
  }

  enemyDefeated() {
    // 필요시 점수/보상 관리
  }

  isStageOver() {
    return this.activeEnemies.every(e=>e.isDead() || e.reachedEnd());
  }

  createPath() {
    const path = [];
    const row = floor(HEX_ROWS / 2);
    for(let c=0;c<HEX_COLS;c++){
      path.push({x: hexGrid.tiles[row][c].x, y: hexGrid.tiles[row][c].y});
    }
    return path;
  }
}