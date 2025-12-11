class Tower {
  constructor(x, y, col, row, level, type, color) {
    this.x = x; this.y = y;
    this.col = col; this.row = row;

    this.level = level;
    this.type = type
    this.color = color

    this.cooldown = 0;
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
    // 현재 타워 타입에 맞는 스프라이트 시트 찾기
    const sheet = towerSpriteSheets[this.type];
    if (sheet) {
      // 2. 레벨에 따라 몇 번째 그림을 쓸지 결정
      // Level 1 -> 0번 (첫 번째)
      // Level 2 -> 1번 (두 번째) ...
      // 3x2 이미지니까 인덱스는 0 ~ 5까지 가능
      let frameIndex = this.level - 1;

      drawSprite(
        sheet,          // 원본 이미지
        frameIndex,     // 자를 순서
        this.x, this.y, // 위치
        120, 120,         // 화면에 그릴 크기 (원하는 대로 조절해!)
        5,1               // ★ 가로 3칸짜리 이미지라고 알려줌 (3x2)
      );
    } else {
      // 4. 혹시 이미지가 없으면? (에러 방지용) 기존 동그라미 그리기
      fill(this.color);
      noStroke();
      ellipse(this.x, this.y, 10 + this.level * 5);
    }
    drawIndicator(this.level,this.x,this.y);
  }

  shoot(enemies) {
    if (this.cooldown > 0) return;
    for (let e of enemies) {
      if (dist(this.x, this.y, e.x, e.y) <= this.range) {
        bullets.push(new Bullet(e, this));
        this.cooldown = this.fireRate;
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