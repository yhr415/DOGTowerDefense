class Shop {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    // 판매할 타워 목록
    this.items = [
      { name: "안정 타워", cost: 50, type: "snack", color: [255, 200, 0] },
      // 추후 타워 종류가 늘어나면 여기에 추가
      // { name: "스나이퍼", type: "sniper", cost: 100, color: [255, 50, 50] } 
      { name: "치유 타워", cost: 60, type: "heal", color: [0, 200, 255] },
      { name: "치료 타워", cost: 70, type: "love", color: [100, 255, 100] },
      { name: "슬로우 타워", cost: 80, type: "slow", color: [0, 0, 255] },
      { name: "서포트 타워", cost: 90, type: "support", color: [150, 0, 255] },
      { name: "입양 타워", cost: 100, type: "block", color: [150, 100, 50] },
      { name: "놀이터 타워", cost: 150, type: "playground", color: [255, 0, 0] },
      { name: "공장 타워", cost: 200, type: "factory", color: [255, 128, 0] },
    ];

    this.itemSize = 70; // 상점 아이콘 크기
    this.padding = 7;
    this.inpadding = 5; //icon 내부 padding, 상하좌우 기본
    this.inbotmar = 14; //icon 내부 bottom margin 글씨 들어갈 공간 manage
    this.titleh = 34;
    this.titlew = 220;
    this.menuw = 90;
  }

  draw() {
    // 🛡️ [상점 전체 고립 시작] 
    // 이 안에서 무슨 짓을 해도 밖(메인 게임)에는 영향을 안 줌!
    push();

    // 1. 상점 배경 (UI)
    noStroke();
    fill(beige);
    rect(this.x, this.y, this.w, this.h);

    // 상점 타이틀
    rectMode(CENTER);
    fill(navy1);
    rect(this.w / 2, this.y + 5, this.w, this.titleh)
    textFont(title_text);
    fill(pink1);
    textAlign(CENTER, TOP);
    textSize(20);
    noStroke();
    text("SHOP", this.x + this.w / 2, this.y - this.titleh / 2 + 11);
    textFont(body_text);

    //gold 정보 그리기
    push();
    translate(this.w / 13, this.y + 5);
    stroke(navy2);
    strokeWeight(1);
    fill(navy3);
    rect(0, 0, this.menuw, this.titleh - 10, 3);
    fill(pink1);
    noStroke();
    textSize(14);
    text(`${money}g`, 0, -7);
    image(iconCoin, -this.menuw / 11 * 4, 0, 20, 20);
    pop();
    rectMode(CORNER);

    // 판매 아이템 그리기 (루프 시작)
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];

      // 좌표 계산 
      let ix = this.x + this.padding + (i * (this.itemSize + this.padding));
      let iy = this.y + 28;

      // --- [아이템 카드 그리기] ---
      push(); // 🛡️ 아이템 스타일 고립 시작

      // (1) 아이콘 배경 박스
      stroke(pink2);
      strokeWeight(1); // 선 굵기 안전하게 초기화
      fill(pink1);
      rect(ix, iy, this.itemSize, this.itemSize + this.inbotmar, 5);

      // (2) 타워 미리보기 배경 (네모)
      noStroke();
      fill(navy2);
      rect(
        ix + this.inpadding,
        iy + this.inpadding,
        this.itemSize - 2 * this.inpadding,
        this.itemSize - 2 * this.inpadding,
        5
      );

      noStroke();
      fill(navy2);
      rect(
        ix + this.inpadding,
        iy + this.inpadding,
        this.itemSize - 2 * this.inpadding,
        this.itemSize - 2 * this.inpadding,
        5
      );

      // (3) 타워 알맹이 그리기 (스프라이트 적용!) 🚀
      // 전역 변수 towerSpriteSheets에서 타입에 맞는 시트 가져오기
      const sheet = typeof towerSpriteSheets !== 'undefined' ? towerSpriteSheets[item.type] : null;

      if (sheet) {
        // 💡 이미지 있으면: 0번 프레임(1레벨)을 잘라서 그리기
        let spriteSize = 70; // 상점 칸에 맞게 크기 조절 (원하는 대로 수정 가능)

        // 중앙 정렬 계산
        let drawX = ix + (this.itemSize) / 2;
        let drawY = iy + (this.itemSize ) / 2;

        //실제로 그리는 부분
        drawSprite(sheet, 0, drawX, drawY, spriteSize, spriteSize, 5,1);
      } else {
        // 이미지 없으면: 기존 동그라미 (Fallback)
        fill(item.color);
        ellipse(ix + this.itemSize / 2, iy + this.itemSize / 2, 30);
      }

      // (4) 가격 텍스트
      fill(255);
      stroke(pink2);
      strokeWeight(2);
      textAlign(CENTER, CENTER);
      textSize(14);
      text(`${item.cost}g`, ix + this.itemSize / 2, iy + this.itemSize + 4.5);
      noStroke();
      pop(); //아이템 스타일

      // --- [로직 업데이트] ---
      // 클릭 감지용 좌표 저장 (그리기랑 상관없는 데이터 로직)
      item.x = ix;
      item.y = iy;
      item.w = this.itemSize;
      item.h = this.itemSize + this.inbotmar; // 높이 계산 정확하게 반영
    }

    pop();
  }

  // 마우스 클릭 시 어떤 아이템을 잡았는지 리턴
  getItemAt(mx, my) {
    for (let item of this.items) {
      if (mx > item.x && mx < item.x + item.w &&
        my > item.y && my < item.y + item.h) {
        return item;
      }
    }
    return null;
  }
}