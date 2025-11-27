//game 전체 flow 관리, 강아지 생성 관리 (n stage에 n마리~)
class StageManager {
    constructor(data) {
      this.dogData = data;
      this.stageStartTime = 0;
      this.stageDuration = 15 * 60; // 15초 동안 적 생성 (프레임 단위)
      this.totalEnemiesToSpawn = 30; // 스테이지 당 총 적의 수
      this.enemiesSpawned = 0;
      this.enemiesDefeated = 0;
      this.currentHpMultiplier = 1.0;
    }
  
    startStage(stageIndex) {
      if (stageIndex >= this.dogData.length) return; // 스테이지 끝
      
      this.stageStartTime = frameCount;
      this.enemiesSpawned = 0;
      this.enemiesDefeated = 0;
      this.currentHpMultiplier = this.dogData[stageIndex].hpMultiplier;
      
      console.log(`Stage ${stageIndex + 1} started! HP Multiplier: ${this.currentHpMultiplier}`);
    }
  
    update() {
      if (this.enemiesSpawned < this.totalEnemiesToSpawn && frameCount % spawnRate === 0) {
        // 적 생성 조건 (총 생성 수 제한)
        let initialHp = 3 * this.currentHpMultiplier; // HP에 스테이지 배율 적용
        enemies.push(new Enemy(initialHp));
        this.enemiesSpawned++;
      }
    }
  
    isStageOver() {
      // 적 생성은 모두 끝났고, 현재 필드에 적이 남아있지 않으면 스테이지 종료
      return this.enemiesSpawned >= this.totalEnemiesToSpawn;
    }
    
    enemyDefeated() {
      this.enemiesDefeated++;
    }
  }

