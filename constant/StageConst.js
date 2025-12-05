// 💡 스테이지 디자인 (보스와 펫 분리 적용)
const stageDesign = [
    { 
      stage: 1, 
      // 쫄병
      petType: "pome", petCount: 20, interval: 30, petHp: 5, petSpeed: 1.2,
      // 보스
      bossType: "pome", bossHp: 100, bossSpeed: 0.2,
      // 보상 & 정보
      stageReward: 100, fact: "Stage 1: 포메 군단과 대장 포메!" 
    },
    
    { 
      stage: 2, 
      petType: "beagle", petCount: 40, interval: 25, petHp: 8, petSpeed: 2.2, // 비글은 좀 더 빠름
      bossType: "jindo", bossHp: 200, bossSpeed: 0.6,
      stageReward: 150, fact: "Stage 2: 정신없는 비글들과 진돗개!" 
    },
    
    { 
      stage: 3, 
      petType: "pome", petCount: 60, interval: 20, petHp: 10, petSpeed: 2.0,
      bossType: "shiba", bossHp: 400, bossSpeed: 0.5, 
      stageReward: 200, fact: "Stage 3: 끝없는 포메 웨이브와 시바!" 
    },
    
    { 
      stage: 4, 
      petType: "shiba", petCount: 80, interval: 15, petHp: 15, petSpeed: 1.8,
      bossType: "jindo", bossHp: 800, bossSpeed: 0.5,
      stageReward: 300, fact: "Stage 4: 시바견 부대와 진돗개 대장!" 
    },
    
    { 
      stage: 5, 
      petType: "beagle", petCount: 100, interval: 10, petHp: 20, petSpeed: 2.5,
      bossType: "doberman", bossHp: 2000, bossSpeed: 0.4, // 도베르만은 진짜 탱크
      stageReward: 500, fact: "Stage 5: 비글 지옥과 도베르만 보스!" 
    }
  ];