const level1Range = {normal: 100, splash: 150, penetrate: 180}
const maxTowerLevel = 5;

// Tower Stats (타워의 모든 능력치를 정의하는 핵심 객체)
// type은 상점 아이템 type과 일치해야 함
const towerStats = {
    "basic": { // 기본 타워 (snack, heal, love를 담을 임시 컨테이너)
        canShoot: true,
        canBuiltPath: false,
        range: [null, 100, 150, 200, 250, 300],
        fireRate: [null, 30, 25, 20, 15, 10],
        damage: [null, 1, 1.5, 2, 2.5, 3],
        bulletColor: [210, 105, 30],
    },
    // 상점에서 팔 각 타입의 스탯도 여기에 정의되어 있어야 함
    "snack": { 
        canShoot: true,
        canBuiltPath: false,
        range: [null, 150, 180, 210, 240, 270],
        fireRate: [null, 30, 25, 20, 15, 10],
        damage: [null, 1, 1.5, 2, 2.5, 3],
        bulletColor: [210, 105, 30],
    },
    "heal": { // Splash 타입
        canShoot: true,
        canBuiltPath: false,
        range: [null, 120, 150, 180, 210, 240],
        fireRate: [null, 90, 80, 70, 60, 50],
        damage: [null, 2, 3, 4, 5, 6],
        bulletColor: [100, 100, 100],
        maxRadius: [null, 50, 70, 90, 110, 130], 
    },
    "love": { // Penetrate 타입
        canShoot: true,
        canBuiltPath: false,
        range: [null, 300, 350, 400, 450, 500],
        fireRate: [null, 70, 65, 60, 55, 50],
        damage: [null, 3, 3.5, 4, 4.5, 5],
        bulletColor: [255, 105, 180],
        maxPenetrate: [null, 1, 2, 3, 4, 5]
    },
    "slow": { // 슬로우
        canShoot: true,
        canBuiltPath: false,
        range: [null, 150, 200, 250, 300, 350],
        fireRate: [null, 70, 65, 60, 55, 50],
        damage: [null, 1, 1.5, 2, 2.5, 3],
        bulletColor: [100, 150, 255],
        slowPower: [null, 0.5, 0.4, 0.3, 0.2, 0.1]  //속도를 1배 -> slowPower배로 감소시킴
    },
    "support": { //주변 타워 강화
        canShoot: false,
        canBuiltPath: false,
        supportPower: [null, 1.2, 1.4, 1.6, 1.8, 2.0]  //supportPower배 만큼 주변타워 강화
    },
    "block": { // 물귀신 타워 : 경로에 설치 (maybe 입양해간다는 컨셉?)
        canShoot: false,
        canBuiltPath: true,
        blockCnt: 5  //데려갈 수 있는 몹 개수
    },
    "playground": { // 놀이터 타워 : 경로에 설치 (위에 있으면 일정 시간 정지 + 회복)
        canShoot: false,
        canBuiltPath: true, 
        stopTime: [null, 500, 750, 1000, 1250, 1500], //멈추는 시간
        fun: [null, 1, 2, 3, 4, 5], //1번 놀 때 데미지
    },
    "factory": { // 재화획득타워 : 일정시간마다 재화획득
        canShoot: false,
        canBuiltPath: false,
        produceRate: [null, 70, 65, 60, 55, 50], //fireRate -> produceRate느낌.
        salary: [null, 50, 100, 150, 200, 250], //획득량
        printTime: 500 // 돈 획득 문구 출력 시간
    }
};

// 레벨업 비용 (mousePressed에서 사용)
const levelUpCost = {
    "basic": [0, 50, 75, 100, 125, 150], // 각 레벨별 업그레이드 비용
    "snack": [0, 50, 75, 100, 125, 150],
    "heal": [0, 50, 100, 150, 200, 250],
    "love": [0, 75, 125, 200, 275, 350],
    "slow": [0, 100, 100, 200, 200, 500],
    "support": [0, 100, 100, 200, 200, 500],
    "block": null,
    "playground": [0, 100, 100, 200, 200, 500],
    "factory": [0, 100, 200, 300, 400, 500]
};