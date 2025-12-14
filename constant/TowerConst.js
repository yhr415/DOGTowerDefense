const level1Range = {snack: 200, heal: 200, love: 300, slow: 200, antiTanker: 200}
const maxTowerLevel = 5;

const basicTowerStats = {
    canShoot: true,
    canBuiltPath: false,
    range: [null, 200, 210, 220, 230, 240],
    fireRate: [null, 60, 50, 45, 40, 30],
    damage: [null, 1, 1.2, 1.4, 1.6, 2.0],
    bulletColor: [210, 105, 30],
};

// Tower Stats (타워의 모든 능력치를 정의하는 핵심 객체)
// type은 상점 아이템 type과 일치해야 함
const towerStats = {
    "basic": { // 기본 타워 (snack, heal, love를 담을 임시 컨테이너)
        canShoot: true,
        canBuiltPath: false,
        range: basicTowerStats.range,
        fireRate: basicTowerStats.fireRate,
        damage: basicTowerStats.damage,
        bulletColor: basicTowerStats.bulletColor,
    },
    // 상점에서 팔 각 타입의 스탯도 여기에 정의되어 있어야 함
    "snack": { 
        canShoot: true,
        canBuiltPath: false,
        range: basicTowerStats.range,
        fireRate: basicTowerStats.fireRate,
        damage: basicTowerStats.damage,
        bulletColor: basicTowerStats.bulletColor,
    },
    "heal": { // Splash 타입
        canShoot: true,
        canBuiltPath: false,
        range: basicTowerStats.range,
        fireRate: [null, 90, 80, 75, 70, 60],
        damage: [null, 1, 1.2, 1.4, 1.6, 2],
        bulletColor: [100, 100, 100],
        maxRadius: [null, 100, 120, 140, 160, 200], 
    },
    "love": { // Penetrate 타입
        canShoot: true,
        canBuiltPath: false,
        range: [null, 300, 320, 340, 360, 400],
        fireRate: [null, 120, 110, 105, 100, 90],
        damage: [null, 0.5, 0.7, 0.9, 1.2, 1.5],
        bulletColor: [255, 105, 180]
    },
    
    "slow": { // 슬로우 (효과는 2초지속 고정)
        canShoot: true,
        canBuiltPath: false,
        range: basicTowerStats.range,
        fireRate: [null, 160, 150, 140, 130, 120],
        damage: [null, 0.5, 0.6, 0.7, 0.8, 1],
        bulletColor: [100, 150, 255],
        slowPower: [null, 0.5, 0.4, 0.3, 0.2, 0.1]  //속도를 1배 -> slowPower배로 감소시킴
    },
    "antiTanker": { // 동일 개체 지속 공격시 더 강한 공격, 타켓 재조준시 초기화
        canShoot: true,
        canBuiltPath: false,
        range: basicTowerStats.range,
        fireRate: basicTowerStats.fireRate,
        damage: basicTowerStats.damage,
        maxGrowLevel: 4,
        toGrowCnt: 3,  //발사횟수가 growLevel * growCnt도달시 growLevel += 1 -> 공속 2배
        bulletColor: [0, 0, 0]
    },
    "block": { // 물귀신 타워 : 경로에 설치 (maybe 입양해간다는 컨셉?)
        canShoot: false,
        canBuiltPath: true,
        blockCnt: 5  //데려갈 수 있는 몹 개수
    },
    "playground": { // 놀이터 타워 : 경로에 설치 (위에 있으면 일정 시간 정지 + 회복)
        canShoot: false,
        canBuiltPath: true, 
        stopTime: [null, 120, 150, 180, 210, 240], //멈추는 시간
    },
    "support": { //주변 타워 강화
        canShoot: false,
        canBuiltPath: false,
        supportPower: [null, 1.2, 1.4, 1.6, 1.8, 2.0]  //supportPower배 만큼 주변타워 강화
    },
    "factory": { // 재화획득타워 : 일정시간마다 재화획득
        canShoot: false,
        canBuiltPath: false,
        produceRate: [null, 70, 65, 60, 55, 50], //fireRate -> produceRate느낌.
        salary: [null, 20, 25, 30, 35, 40], //획득량
        printTime: 500 // 돈 획득 문구 출력 시간
    }
};

// 레벨업 비용 (mousePressed에서 사용)
const levelUpCost = {
    "basic": [0, 25, 30, 35, 40, 45], // 각 레벨별 업그레이드 비용
    "snack": [0, 25, 30, 35, 40, 45],
    "heal": [0, 50, 60, 70, 80, 90],
    "love": [0, 50, 60, 70, 80, 90],
    "slow": [0, 75, 80, 85, 90, 95],
    "antiTanker": [0, 100, 100, 100, 100, 100],
    "support": [0, 100, 100, 100, 100, 100],
    "block": null,
    "playground": [0, 50, 50, 50, 50, 50],
    "factory": [0, 100, 100, 100, 100, 100]
};