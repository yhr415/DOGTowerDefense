class StageManager {
  constructor(stageData, pathWaypoints) {
    this.stageData = stageData;
    this.path = pathWaypoints;
    this.activeEnemies = [];

    // 스폰 관련 변수
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.currentInterval = 60;

    // 팝업을 띄우기 위한 변수 설정, 보스가 몇마리 등장했는지... 몇 번째 스테이지인지... 기억하기
    this.spawnedBossCount = 0; //boss가 한 마리 등장할 때마다 업데이트
    this.currentStageIndex = 0;

    //popup statement를 띄우기 위한 변수 (1215 update)
    this.bossPopupText = null; // 현재 띄울 텍스트 (없으면 null)
    this.popupTimer = 0;       // 팝업 유지 시간 (프레임 단위)
    this.towerTutorial=true;
    this.towerPopupText=null;

    this.upgradeTutorialShown = false //추가한 변수
  }
  // 타워가 하나 설치되면 멘트 체인지지
  showUpgradeHint() {
    if (!this.upgradeTutorialShown) {
      this.bossPopupText = "타워를 클릭해서 더 강력하게 업그레이드 하세요!";
      this.popupTimer = 180; // 약 3초 동안 표시
      this.upgradeTutorialShown = true; // 이후에는 뜨지 않음
    }
  }
  startStage(stageIndex) {
    // 초기화
    this.activeEnemies = [];
    this.spawnQueue = [];
    this.spawnTimer = 0;

    this.currentStageIndex = stageIndex; // stage index는 startstage마다 update
    
    if (stageIndex === 0) {
      this.spawnedBossCount = 0;
    }

    if (stageIndex === 0 && towers.length === 0) {
      this.bossPopupText = "드래그 앤 드랍으로 타워를 설치하세요!  일반적인 타워는 강아지가 이동하는 경로 밖에 설치할 수 있어요!";
      this.popupTimer = 240; // 4초 동안 넉넉하게 띄우기
  }


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
    this.spawnQueue.push({
      category: 'boss',
      type: bossType,
      hp: bossHp,
      speed: bossSpeed
    });
  }

  update() {
    // 대기열에 남은 펫들 스폰
    if (this.spawnQueue.length > 0) {
      this.spawnTimer++;

      if (this.spawnTimer >= this.currentInterval) {
        this.processSpawnQueue();
        this.spawnTimer = 0;
      }
    }
    if (this.popupTimer > 0) {
      this.popupTimer--;
      if (this.popupTimer === 0) {
        this.bossPopupText = null; // 시간 다 되면 텍스트 지우기
      }
    }
  }

  // 큐에서 꺼내서 생성하는 함수
  processSpawnQueue() {
    if (this.spawnQueue.length === 0) return;
    const info = this.spawnQueue.shift();
    this.createAndSpawnEntity(info.category, info.type, info.hp, info.speed);
  }

  // 실제 적을 만들어서 배열에 넣는 공통 함수
  createAndSpawnEntity(category, type, hp, speed) {
    let entity;

    if (category === 'boss') {
      entity = new Dog(this.path, hp, speed, type);

      // 1. [오타 수정] spanwed -> spawned
      this.spawnedBossCount++;

      // 2. [추가] 팝업 띄우는 함수를 여기서 실행해야 함!
      this.handleBossPopup();

    } else {
      if (typeof Pet !== 'undefined') {
        entity = new Pet(this.path, hp, speed, type);
      } else {
        entity = new Dog(this.path, hp, speed, type);
      }
    }

    enemies.push(entity);
    this.activeEnemies.push(entity);
  }

  enemyDefeated() {
    // 필요시 로직 추가
  }

  isStageOver() {
    // 스폰도 다 끝났고, 필드에 몹도 없으면 끝
    return this.spawnQueue.length === 0 && enemies.length === 0;
  }

  handleBossPopup() {
    let popUpStatement = "";

    // 1. 상황별 멘트 정하기 (형 로직 그대로)
    if (this.spawnedBossCount === 1) {
      popUpStatement = "🚨 경고: 첫 번째 보스 출현! 타워를 집중하세요!";
    } else if (this.spawnedBossCount === 3) {
      popUpStatement = "🚨 경고: 강력한 중간 보스입니다!";
    } else if (this.currentStageIndex === this.stageData.length - 1) {
      popUpStatement = "☠️ 경고: 최종 보스 등장! 모든 것을 쏟아부으세요!";
    } else {
      popUpStatement = "⚠️ 보스 등장!";
    }

    // 2. [핵심] 상태 변수에 저장하기 (그리기는 안 함!)
    this.bossPopupText = popUpStatement;
    this.popupTimer = 360; // 180프레임 = 약 3초 동안 띄우기 (60fps 기준)
  }
}


