class StageManager {
  // 🚨 수정: constructor가 pathWaypoints를 인수로 받도록 변경
  constructor(dogData, pathWaypoints) {
    this.dogData = dogData;
    this.activeEnemies = [];
    this.spawnCounter = 0;
    this.stageEnemyCount = 5; // 적 수
    this.path = pathWaypoints; // 💡 mainplay.js에서 계산된 경로를 저장
  }

  startStage(stageIndex) {
    // 적의 타입과 HP 배율을 dogData에서 가져옴
    const IndexDog = this.dogData[stageIndex];
    const initialHp = 5 * (IndexDog?.hpMultiplier || 1);
    const IndexDogName = IndexDog.type || 'jindo'; //dog data에서 가져옴. default 값은 jindo

    for (let i = 0; i < this.stageEnemyCount; i++) {
      let e = new Dog(this.path, initialHp, IndexDogName);
      dogs.push(e);
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
    // 모든 적이 죽거나 끝에 도달했는지 확인
    return this.activeEnemies.every(e => e.isDead() || e.reachedEnd());
  }
}