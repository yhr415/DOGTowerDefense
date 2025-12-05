const level1Range = {normal: 100, splash: 150, penetrate: 180}
const maxTowerLevel = 5;

// Tower Stats (타워의 모든 능력치를 정의하는 핵심 객체)
// type은 상점 아이템 type과 일치해야 함
const towerStats = {
    "basic": { // 기본 타워 (snack, heal, love를 담을 임시 컨테이너)
        range: [null, 100, 150, 200, 250, 300],
        fireRate: [null, 30, 25, 20, 15, 10],
        damage: [null, 1, 1.5, 2, 2.5, 3],
        maxRadius: [null, 0, 0, 0, 0, 0], 
        maxPenetrate: [null, 0, 0, 0, 0, 0]
    },
    // 상점에서 팔 각 타입의 스탯도 여기에 정의되어 있어야 함
    "snack": { 
        range: [null, 150, 180, 210, 240, 270],
        fireRate: [null, 30, 25, 20, 15, 10],
        damage: [null, 1, 1.5, 2, 2.5, 3],
        maxRadius: [null, 0, 0, 0, 0, 0], 
        maxPenetrate: [null, 0, 0, 0, 0, 0]
    },
    "heal": { // Splash 타입
        range: [null, 120, 150, 180, 210, 240],
        fireRate: [null, 90, 80, 70, 60, 50],
        damage: [null, 2, 3, 4, 5, 6],
        maxRadius: [null, 50, 70, 90, 110, 130], 
        maxPenetrate: [null, 0, 0, 0, 0, 0]
    },
    "love": { // Penetrate 타입
        range: [null, 300, 350, 400, 450, 500],
        fireRate: [null, 70, 65, 60, 55, 50],
        damage: [null, 3, 3.5, 4, 4.5, 5],
        maxRadius: [null, 0, 0, 0, 0, 0], 
        maxPenetrate: [null, 1, 2, 3, 4, 5]
    }
};

// 레벨업 비용 (mousePressed에서 사용)
const levelUpCost = {
    "basic": [0, 50, 75, 100, 125, 150], // 각 레벨별 업그레이드 비용
    "snack": [0, 50, 75, 100, 125, 150],
    "heal": [0, 50, 100, 150, 200, 250],
    "love": [0, 75, 125, 200, 275, 350]
};