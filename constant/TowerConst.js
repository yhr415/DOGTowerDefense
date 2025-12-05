const level1Range = {normal: 100, splash: 150, penetrate: 180}
const maxTowerLevel = 5;

const levelUpCost = {
    normal:     [null, 50, 50, 50, 50], 
    splash:     [null, 40, 50, 60, 70], 
    penetrate:  [null, 50, 60, 70, 80]
  };

  const towerStats = {
    normal: {
      range:            [null, 100, 130, 160, 190, 220],
      fireRate:         [null, 30, 26, 22, 18, 14],
      damage:           [null, 1, 2, 3, 4, 6],
      maxRadius:        [null, null, null, null, null, null],
      maxPenetrate:     [null, null, null, null, null, null]
    },
    splash: {
      range:            [null, 150, 180, 210, 250, 300],
      fireRate:         [null, 60, 54, 48, 42, 36],
      damage:           [null, 2, 2, 3, 4, 5],
      maxRadius:        [null, 70, 75, 80, 85, 90],
      maxPenetrate:     [null, null, null, null, null, null]
    },
    penetrate: {
      range:            [null, 180, 210, 240, 270, 310],
      fireRate:         [null, 72, 66, 60, 54, 48],
      damage:           [null, 1, 2, 3, 4, 5],
      maxRadius:        [null, null, null, null, null, null],
      maxPenetrate:     [null, 3, 3, 4, 4, 5]
    }
  }