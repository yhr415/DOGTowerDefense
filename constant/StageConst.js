// 💡 스테이지 디자인 (보스와 펫 분리 적용)
const stageDesign = [
    {
      stage: 0,
      petType: "pome", petCount: 2, interval: 240, petHp: 3, petSpeed: 0.5,
      bossType: "pome", bossHp: 5, bossSpeed: 0.3,
      stageReward: 0, fact: "튜토리얼"
    },

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
      bossType: "retriever", bossHp: 200, bossSpeed: 0.3, 
      stageReward: 600, fact: "Stage 3: 높은 체력 (슬로우, 집중케어 타워 해금)" 
    },
    
    { 
      stage: 4, 
      petType: "shiba", petCount: 15, interval: 100, petHp: 30, petSpeed: 1.0,
      bossType: "blackretriever", bossHp: 350, bossSpeed: 0.4,
      stageReward: 1500, fact: "Stage 4: 빠른 속도 대처 (block, 놀이터 해금)" 
    },
    
    { 
      stage: 5, 
      petType: "beagle", petCount: 40, interval: 30, petHp: 40, petSpeed: 0.7,
      bossType: "doberman", bossHp: 1000, bossSpeed: 0.4,
      stageReward: 999999999, fact: "Last Stage: 최종스테이지 (support, factory 해금)" 
    }
  ];

let manual1=
"이 길을 걷는 아이들은 처음부터 이곳을 향해 오려던 게 아니었습니다. \n" +
"누군가의 집, 누군가의 이름, 누군가의 손길이 있었지만 \n" +
"어느 날 갑자기, 모든 것이 끊겼습니다. \n" +
"그리고 아이들은 아무도 기다리지 않는 길 위에 놓였습니다. \n"+
"아이들의 체력 게이지가 비어있다는 것은 \n"+
"당신의 손길을 기다리고 있다는 뜻입니다."
;

let manual2=
"당신이 놓는 타워는 아이들에게 관심을, 사랑을 건넵니다.\n" +
"그 곁을 지날 때마다 비어있던 아이들의 마음이 조금씩 채워집니다.\n" +
"체력이 가득 찬 순간, 아이는 구조되어 새로운 삶을 살 수 있습니다.\n" +
"하지만, 시간 내에 구조되지 못한 아이들은 결국 안락사하게 됩니다.\n" +
"최대한 많은 아이들을 구해주세요!"
;