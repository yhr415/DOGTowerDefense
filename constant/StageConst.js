// 💡 스테이지 디자인 (보스와 펫 분리 적용)
const stageDesign = [
    { 
      stage: 1, 
      // 쫄병
      petType: "pome", petCount: 5, interval: 240, petHp: 5, petSpeed: 0.5,
      // 보스
      bossType: "pome", bossHp: 30, bossSpeed: 0.3,
      // 보상 & 정보
      stageReward: 200, fact: "Stage 1: 기본" 
    },
    
    { 
      stage: 2, 
      petType: "beagle", petCount: 20, interval: 50, petHp: 10, petSpeed: 0.5,
      bossType: "jindo", bossHp: 60, bossSpeed: 0.3,
      stageReward: 300, fact: "Stage 2: 물량 (치유, 치료 타워 해금)" 
    },
    
    { 
      stage: 3, 
      petType: "pome", petCount: 3, interval: 400, petHp: 60, petSpeed: 0.5,
      bossType: "shiba", bossHp: 200, bossSpeed: 0.3, 
      stageReward: 600, fact: "Stage 3: 높은 체력 (슬로우, 집중케어 타워 해금)" 
    },
    
    { 
      stage: 4, 
      petType: "shiba", petCount: 15, interval: 100, petHp: 30, petSpeed: 1.0,
      bossType: "jindo", bossHp: 350, bossSpeed: 0.4,
      stageReward: 1500, fact: "Stage 4: 빠른 속도 대처 (block, 놀이터 해금)" 
    },
    
    { 
      stage: 5, 
      petType: "beagle", petCount: 40, interval: 30, petHp: 40, petSpeed: 0.7,
      bossType: "doberman", bossHp: 1000, bossSpeed: 0.4,
      stageReward: 999999999, fact: "Last Stage: 최종스테이지 (support, factory 해금)" 
    }
  ];