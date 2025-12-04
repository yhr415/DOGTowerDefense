// 스테이지 디자인
const stageDesign = {
  stage1: {
      // 스테이지에 등장하는 일반 엔티티 목록 (Pet)
      pets: [
          {
              type: "Pet",     // 구분: Pet
              species: "포메",      // 종: 
              abilityType: "안정", // 속성: 안정 
              count: 520,           // 수: 총 50마리 등장
              hp: 5,               // HP: 각 엔티티의 체력
              speed: 1.5,          // 속도: 이동 속도
              reward: 1            // 보상: 처치 시 획득하는 보상 
          }
      ],
      // 스테이지의 보스 엔티티 목록 (Boss)
      bosses: [
          {
              type: "Boss",    // 구분: Boss
              species: "포메",  // 종: 
              abilityType: "안정", // 속성: 안정 
              count: 1,            // 수: 총 1마리 등장
              hp: 30,              // HP: 보스의 체력
              speed: 0.7,          // 속도: 이동 속도
              reward: 50           // 보상: 처치 시 획득하는 보상 
          }
      ]
  },

  stage2: {
      pets: [
          {
              type: "Pet",         // 구분: Pet
              species: "비글",      // 종: 비글
              abilityType: "치료", // 속성: 치료 
              count: 40,           // 수: 총 40마리 등장
              hp: 8,               // HP: 각 엔티티의 체력
              speed: 1.5,          // 속도: 이동 속도
              reward: 2            // 보상: 처치 시 획득하는 보상 
          }
      ],
      // 스테이지의 보스 엔티티 목록 (Boss)
      bosses: [
          {
              type: "Boss",        // 구분: Boss
              species: "진도",      // 종: 진도
              abilityType: "치료", // 속성: 치료 
              count: 1,            // 수: 총 1마리 등장
              hp: 50,              // HP: 보스의 체력
              speed: 0.7,          // 속도: 이동 속도 
              reward: 80           // 보상: 처치 시 획득하는 보상 
          }
      ]
  },

  stage3: {
    // 스테이지에 등장하는 일반 엔티티 목록 (Pet)
    pets: [
        {
            type: "Pet",         // 구분: Pet
            species: "포메",      // 종: 포메
            abilityType: "안정", // 속성: 안정 
            count: 60,           // 수: 총 40마리 등장
            hp: 8,               // HP: 각 엔티티의 체력
            speed: 1.5,          // 속도: 이동 속도
            reward: 2            // 보상: 처치 시 획득하는 보상 
        }
    ],
    bosses: [
        {
            type: "Boss",        // 구분: Boss
            species: "시바",      // 종: 시바
            abilityType: "안정", // 속성: 안정 
            count: 1,            // 수: 총 1마리 등장
            hp: 50,              // HP: 보스의 체력
            speed: 0.7,          // 속도: 이동 속도 
            reward: 120           // 보상: 처치 시 획득하는 보상 
        }
    ]
},

  stage4: {
    pets: [
        {
            type: "Pet",         // 구분: Pet
            species: "시바",      // 종: 시바
            abilityType: "안정", // 속성: 안정 
            count: 80,           // 수: 총 40마리 등장
            hp: 8,               // HP: 각 엔티티의 체력
            speed: 1.5,          // 속도: 이동 속도
            reward: 3            // 보상: 처치 시 획득하는 보상
        }
    ],
    bosses: [
        {
            type: "Boss",        // 구분: Boss
            species: "진도",      // 종: 진도
            abilityType: "치료", // 속성: 치료 
            count: 1,            // 수: 총 1마리 등장
            hp: 50,              // HP: 보스의 체력
            speed: 0.7,          // 속도: 이동 속도 
            reward: 160           // 보상: 처치 시 획득하는 보상 
        }
    ]
  },

  stage5: {
    pets: [
        {
            type: "Pet",         // 구분: Pet
            species: "비글",      // 종: 비글
            abilityType: "치료", // 속성: 치료 
            count: 80,           // 수: 총 40마리 등장
            hp: 8,               // HP: 각 엔티티의 체력
            speed: 1.5,          // 속도: 이동 속도
            reward: 3            // 보상: 처치 시 획득하는 보상 
        }
    ],
    bosses: [
        {
            type: "Boss",        // 구분: Boss
            species: "도베르만",  // 종: 도베르만
            abilityType: "치료", // 속성: 치료 
            count: 2,            // 수: 총 1마리 등장
            hp: 50,              // HP: 보스의 체력
            speed: 0.7,          // 속도: 이동 속도 
            reward: 250           // 보상: 처치 시 획득하는 보상 
        }
    ]
  }
};