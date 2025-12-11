class StageManager {
  constructor(stageData, pathWaypoints) {
    this.stageData = stageData;
    this.path = pathWaypoints;
    this.activeEnemies = []; 
    
    // 스폰 관련 변수
    this.spawnQueue = [];    
    this.spawnTimer = 0;     
    this.currentInterval = 60; 
  }

  startStage(stageIndex) {
    // 초기화
    this.activeEnemies = [];
    this.spawnQueue = [];
    this.spawnTimer = 0;

    if (stageIndex >= this.stageData.length) return;

    const design = this.stageData[stageIndex];
    
    // 기본 설정값
    const petCount = design.petCount || 5;
    const interval = design.interval || 60;
    
    // ⚡ 속도 설정
    // 보스는 0.5~0.8 정도로 느리게, 펫은 1.5~2.0 정도로 빠르게 : stagemanager에서 별도 설정 필요
    const petType = design.petType || 'small_shiba';
    const petHp = design.petHp || 5;       
    const petSpeed = design.petSpeed || 2.0; // 펫: 빠름
    
    const bossType = design.bossType || 'shiba';
    const bossHp = design.bossHp || 100;   
    const bossSpeed = design.bossSpeed || 0.6; // 보스: 아주 느림

    this.currentInterval = interval;

    console.log(`Stage ${stageIndex + 1}: 보스(${bossSpeed})와 펫(${petSpeed}) 동시 출격!`);

    // 보스 즉시 생성
    this.createAndSpawnEntity('boss', bossType, bossHp, bossSpeed);

    // 펫들을 큐에 넣기 (얘네는 간격 두고 나올지, 한방에 나올지 interval로 결정)
    // 만약 펫도 보스랑 동시에 우르르 나오게 하고 싶으면 interval을 아주 짧게(5~10)
    for (let i = 0; i < petCount; i++) {
      this.spawnQueue.push({ 
        category: 'pet', 
        type: petType, 
        hp: petHp, 
        speed: petSpeed 
      });
    }
  }

  update() {
    // 대기열에 남은 펫들 스폰
    if (this.spawnQueue.length > 0) {
      this.spawnTimer++;
      
      if (this.spawnTimer >= this.currentInterval) {
        this.processSpawnQueue(); // 함수 이름 살짝 바꿈
        this.spawnTimer = 0; 
      }
    }
  }

  // 큐에서 꺼내서 생성하는 함수
  processSpawnQueue() {
    if (this.spawnQueue.length === 0) return;
    const info = this.spawnQueue.shift(); 
    this.createAndSpawnEntity(info.category, info.type, info.hp, info.speed);
  }

  // 실제 적을 만들어서 배열에 넣는 공통 함수 (코드 중복 제거!)
  createAndSpawnEntity(category, type, hp, speed) {
    let entity;

    if (category === 'boss') {
      entity = new Dog(this.path, hp, speed, type); // 보스는 Dog (이름이 dog일 때)
    } else {
      // Pet 클래스가 있다고 가정 (Dog와 생성자 구조 동일)
      // 만약 Pet 클래스가 아직 없으면 Dog 클래스를 쓰되 구분을 줘야 함
      if (typeof Pet !== 'undefined') {
          entity = new Pet(this.path, hp, speed, type); 
      } else {
          entity = new Dog(this.path, hp, speed, type); // Pet 클래스 없으면 Dog로 대체
      }
    }
    
    // 통합된 enemies 리스트에 추가 (타워가 쏠 수 있게)
    enemies.push(entity); 

    // 스테이지 관리용 리스트에도 추가
    this.activeEnemies.push(entity);
  }

  enemyDefeated() {
    // 필요시 로직 추가
  }

  isStageOver() {
    // 스폰도 다 끝났고, 필드에 몹도 없으면 끝
    return this.spawnQueue.length === 0 && enemies.length === 0;
  }
}