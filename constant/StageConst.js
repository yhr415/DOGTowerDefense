// 스테이지 디자인
const stageDesign = [
    // Stage 1: 시바견 5마리가 60프레임(1초) 간격으로 등장
    { stage: 1, type: "shiba", speed: 1.1, count: 5, interval: 60, hp: 10, speed:1.1, stageReward: 100, fact: "시바견 군단이 몰려온다!" },
    
    // Stage 2: 비글 10마리가 빠르게(30프레임) 등장 (물량전)
    { stage: 2, type: "beagle", speed: 1.1, count: 10, interval: 30, hp: 8, stageReward: 150, fact: "비글들이 뛰어놀고 싶어해!" },
    
    // Stage 3: 튼튼한 진돗개 3마리
    { stage: 3, type: "jindo", speed: 1.1, count: 3, interval: 90, hp: 50, stageReward: 200, fact: "진돗개는 꽤 튼튼해." },
    
    // Stage 4: 엄청 튼튼한 도베르만 보스 1마리
    { stage: 4, type: "doberman", speed: 1.1, count: 1, interval: 0, hp: 200, stageReward: 300, fact: "보스 등장! 긴장해!" },
    
    // Stage 5: 푸들 떼거리
    { stage: 5, type: "pome", speed: 1.1, count: 20, interval: 20, hp: 5, stageReward: 500, fact: "너무 많아!" }
  ];