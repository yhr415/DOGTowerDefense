class StageManager {
  constructor(stageData, pathWaypoints) {
    this.stageData = stageData;
    this.path = pathWaypoints;
    this.activeEnemies = []; // 현재 살아있는 적들
    
    // 스폰 관련 변수
    this.spawnQueue = [];    // 대기 중인 적 목록
    this.spawnTimer = 0;     // 스폰 타이머
    this.currentInterval = 60; // 현재 스폰 간격
  }

  startStage(stageIndex) {
    // 안전장치
    this.activeEnemies = [];
    this.spawnQueue = [];
    this.spawnTimer = 0;

    if (stageIndex >= this.stageData.length) return;

    // 현재 스테이지 디자인 가져오기
    const design = this.stageData[stageIndex];
    
    // 디자인에 따라 스폰 큐 채우기
    const count = design.count || 1; // 마리 수 (기본 1)
    const type = design.type || 'jindo';
    const hp = design.hp || 10;
    const speed = design.speed || 1.2;
    this.currentInterval = design.interval || 60; // 등장 간격 (프레임)

    console.log(`Stage ${stageIndex + 1} 시작! ${type} ${count}마리 출격 대기!`);

    for (let i = 0; i < count; i++) {
      // 큐에는 생성할 적의 정보만 담아둠
      this.spawnQueue.push({ type: type, hp: hp, speed: speed });
    }
  }

  update() {
    // 1. 스폰 로직 (대기열에 적이 남아있으면)
    if (this.spawnQueue.length > 0) {
      this.spawnTimer++;
      
      // 타이머가 간격보다 커지면 적 생성 (첫 번째 적은 바로 생성)
      if (this.spawnTimer >= this.currentInterval || this.spawnQueue.length === this.stageData.count) {
        this.spawnEnemy();
        this.spawnTimer = 0; // 타이머 리셋
      }
    }
  }

  spawnEnemy() {
    if (this.spawnQueue.length === 0) return;

    // 큐에서 하나 꺼내서 진짜 적(Dog) 생성
    const enemyInfo = this.spawnQueue.shift(); 
    let e = new Dog(this.path, enemyInfo.hp, enemyInfo.speed, enemyInfo.type);
    
    // 메인 게임 루프와 매니저 관리 목록에 추가
    dogs.push(e); 
    this.activeEnemies.push(e);
  }

  enemyDefeated() {
    // 필요시 보상 로직
  }

  isStageOver() {
    // 1. 스폰할 적이 더 이상 없고 (Queue empty)
    // 2. 필드에 살아있는 적도 없어야 함 (activeEnemies check)
    // 참고: activeEnemies 배열에서 죽은 적을 제거하는 건 mainplay.js의 draw()가 dogs 배열을 정리할 때 같이 처리되지 않으므로,
    // 여기서 엄격하게 체크하거나, activeEnemies 관리를 더 빡세게 해야 함.
    // 간단하게: 스폰도 끝났고, 메인 dogs 배열도 비었으면 끝!
    
    return this.spawnQueue.length === 0 && dogs.length === 0;
  }
}