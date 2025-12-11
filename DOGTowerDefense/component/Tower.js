class Tower {
  constructor(x, y, col, row, level, type, color) {
    this.x = x; this.y = y;
    this.col = col; this.row = row;

    this.level = level;
    this.type = type
    this.color = color

    this.cooldown = 0;
    // [수정] 마지막 발사 시간을 저장할 변수 추가. 초기값은 0으로 설정.
    this.lastShotTime = 0;
    this.generate()

  }

  generate() {
    const stats = towerStats[this.type];
    const enhancedValue = hexGrid.tiles[this.row][this.col].enhanced

    if (stats.canShoot) {
      this.range = stats.range[this.level] * enhancedValue
      this.fireRate = stats.fireRate[this.level] / enhancedValue
      this.damage = stats.damage[this.level] * enhancedValue
    }

    if (this.type === "heal") {
      this.maxRadius = stats.maxRadius[this.level] * enhancedValue
    }
    else if (this.type === "love") {
      this.maxPenetrate = stats.maxPenetrate[this.level] * enhancedValue
    }
    else if (this.type === "slow") {
      this.slowPower = stats.slowPower[this.level] * enhancedValue
    }
    else if (this.type === "support") {
      this.supportPower = stats.supportPower[this.level]
    }
    else if (this.type === "block") {
      this.blockCnt = stats.blockCnt
    }
    else if (this.type === "playground") { //경로 내의 타워라서 enhance 불가로 일단 구현
      this.stopTime = stats.stopTime[this.level]
      this.fun = stats.fun[this.level]
      this.playedList = []
    }
    else if (this.type === "factory") {
      this.produceRate = stats.produceRate[this.level] / enhancedValue
      this.salary = stats.salary[this.level] * enhancedValue
      this.printTime = stats.printTime
      this.printing = false
      this.printStartTime = 0
    }
  }


  levelUp() {
    if (this.level < maxTowerLevel) {
      this.level++;
      this.generate();
    }
  }

  update() { if (this.cooldown > 0) this.cooldown--; }

  show() {
    // [수정] drawTower 함수에 마지막 발사 시간(this.lastShotTime)을 인자로 전달
    drawTower(this.type, this.level, this.x, this.y, this.color, this.lastShotTime);
    drawIndicator(this.level, this.x, this.y); //타워 아래에 level 표시하는 indicator 그리기
  }

  shoot(enemies) {
    if (this.cooldown > 0) return;
    for (let e of enemies) {
      if (dist(this.x, this.y, e.x, e.y) <= this.range) {
        bullets.push(new Bullet(e, this));
        this.cooldown = this.fireRate;
        // [수정] 발사하는 순간의 시간을 millis()로 기록
        this.lastShotTime = millis();
        break;
      }
    }
  }

  enhance(tile) {
    for (const [r, c] of tile.adjTiles) {
      const adjTile = hexGrid.tiles[r][c]
      if (tile.tower.supportPower > adjTile.enhanced) {
        adjTile.enhanced = tile.tower.supportPower
        const adjTower = adjTile.tower
        if (adjTower) {
          adjTower.generate()
        }
      }
    }
  }

  block() {
    strokeWeight(3)
    stroke(0)
    fill(this.color)
    textAlign(CENTER, TOP)
    textSize(24);
    text(`${this.blockCnt}`, this.x, this.y - 30)

    for (let e of enemies) {
      if (e instanceof Dog) { // 만약 보스(Dog)라면
        continue
      }
      if (dist(this.x, this.y, e.x, e.y) < 4) {
        e.hp = e.maxHp
        this.blockCnt--
        if (this.blockCnt == 0) {
          hexGrid.tiles[this.row][this.col].tower = null
          break
        }
      }
    }
  }

  play() {
    for (let e of enemies) {
      if (e.playing) {
        let passedTime = millis() - e.playStartTime
        if (passedTime > this.stopTime) {
          e.playing = false
          e.hp += this.fun
        }
      }
      if (!this.playedList.includes(e) && dist(this.x, this.y, e.x, e.y) <= 4) {
        e.playing = true
        e.playStartTime = millis()
        this.playedList.push(e);
      }
    }
  }

  earn() {
    if (!isStageActive) {
      return
    }
    if (this.printing) {
      let passedTime = millis() - this.printStartTime
      if (passedTime < this.printTime) {
        strokeWeight(3)
        stroke(0)
        fill(this.color)
        textAlign(CENTER, BOTTOM)
        textSize(24);
        text(`+${this.salary}g`, this.x, this.y - passedTime / 20)
      }
      else {
        this.printing = false
      }
    }
    if (this.cooldown > 0) return;
    money += this.salary
    this.cooldown = this.produceRate;
    this.printing = true
    this.printStartTime = millis()
  }
}



function drawTower(type, level, x, y, color, lastShotTime) {
  const baseSize = 120;         // 원래 기본 크기
  const recoilDuration = 150;   // 반동 효과 지속 시간 (ms, 0.15초)
  const minScale = 0.85;        // 가장 작아졌을 때의 비율 (85% 크기)

  // --- [스케일 계산 로직] ---
  let currentScale = 1.0; // 기본은 원래 크기 (100%)

  // lastShotTime이 존재하고, 발사한 지 recoilDuration 보다 안 지났다면 반동 적용
  if (lastShotTime !== undefined && millis() - lastShotTime < recoilDuration) {
    // 발사 후 경과 시간
    const timePassed = millis() - lastShotTime;
    // 진행률 (0.0: 방금 쏨 ~ 1.0: 반동 끝)
    const t = timePassed / recoilDuration;

    // lerp(시작값, 끝값, 진행률): 시작값에서 끝값으로 진행률만큼 선형 보간
    // 즉, minScale(0.85)에서 시작해서 시간이 지날수록 1.0으로 돌아옴
    currentScale = lerp(minScale, 1.0, t);
  }

  // 최종적으로 그릴 너비와 높이 계산
  const currentWidth = baseSize * currentScale;
  const currentHeight = baseSize * currentScale;
  // --------------------


  const sheet = towerSpriteSheets[type];
  if (sheet) {
    // [수정] 원본 코드의 this.level은 함수 파라미터 level로 추정되어 수정했습니다.
    let frameIndex = level - 1;

    drawSprite(
      sheet,
      frameIndex,
      x, y,
      currentWidth, currentHeight, // [수정] 고정된 120 대신 계산된 크기 적용
      5, 1
    );
  } else {
    // 이미지가 없을 때 대체 원 그리기
    fill(color);
    noStroke();
    // [선택사항] 여기에도 반동을 적용하고 싶다면 아래처럼 수정
    const baseEllipseSize = 10 + level * 5;
    ellipse(x, y, baseEllipseSize * currentScale);
  }
}

function drawIndicator(level, x, y) {
  let indicatorSize = 6;  // 동그라미 크기
  let spacing = 8;        // 동그라미 간격
  let totalWidth = (level * indicatorSize) + ((level - 1) * (spacing - indicatorSize));
  // 그냥 간편하게: (개수 * 간격)에서 중앙 정렬 보정

  // 중앙 정렬을 위한 시작 X 좌표 계산
  // (level이 1이면 0, 2면 -4, 3이면 -8... 이런 식으로 좌우로 벌림)
  let startX = x - ((level - 1) * spacing) / 2;
  let startY = y + 35;

  noStroke();
  for (let i = 0; i < level; i++) {
    // 5레벨(만렙)이면 금색(황금별), 아니면 은색/흰색
    if (level === 5) fill(255, 215, 0); // Gold
    else fill(200, 230, 255); // Silver/White

    // 약간의 테두리를 주면 더 잘 보임
    stroke(0, 100);
    strokeWeight(1);

    ellipse(startX + (i * spacing), startY, indicatorSize);
  }
}