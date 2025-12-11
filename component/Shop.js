class Shop {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    // 판매할 타워 목록
    this.items = itemDesc;

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

    let hoveringItem = null;

    // 판매 아이템 그리기 (루프 시작)
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];

      // 좌표 계산 
      let ix = this.x + this.padding + (i * (this.itemSize + this.padding));
      let iy = this.y + 28;

      if (mouseX > ix && mouseX < ix + this.itemSize &&
        mouseY > iy && mouseY < iy + this.itemSize + this.inbotmar) {
        hoveringItem = item; // 당첨! 루프 끝나고 그릴 거야.

        // (선택사항) 호버 시 살짝 테두리 강조
        stroke(255, 0, 0); strokeWeight(2);
      } else {
        noStroke();
      }

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
        let drawY = iy + (this.itemSize) / 2;

        //실제로 그리는 부분
        drawSprite(sheet, 0, drawX, drawY, spriteSize, spriteSize, 5, 1);
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
    if (hoveringItem) {
      this.drawTooltip(hoveringItem);
    }

    pop();
  }

  drawTooltip(item) {
    push();
    // 툴팁 위치: 마우스 오른쪽 아래
    let tx = mouseX + 15;
    let ty = mouseY + 15;
    let tw = 200; // 툴팁 너비
    let th = 100; // 툴팁 높이 (텍스트 길이에 따라 늘려도 됨)

    // 화면 밖으로 나가는 거 방지 (오른쪽 끝이면 왼쪽으로 보여주기)
    if (tx + tw > width) tx = mouseX - tw - 10;
    if (ty + th > height) ty = mouseY - th - 10;

    // 1. 툴팁 배경 (반투명 검정 or 네이비)
    fill(0, 0, 0, 200); // 약간 투명한 검정
    stroke(255);
    strokeWeight(1);
    rect(tx, ty, tw, th, 8); // 둥근 모서리

    // 2. 텍스트 설정
    noStroke();
    textAlign(LEFT, TOP);

    // 제목 (노란색)
    fill(255, 200, 0);
    textSize(16);
    textStyle(BOLD);
    text(item.name, tx + 10, ty + 10);

    // 가격
    fill(200, 200, 255);
    textSize(14);
    textStyle(NORMAL);
    text(`가격: ${item.cost}g`, tx + 10, ty + 35);

    // 설명 (흰색, 줄바꿈 처리)
    fill(255);
    textSize(12);
    textLeading(18); // 줄 간격
    text(item.desc, tx + 10, ty + 55, tw - 20, th - 55); // 박스 안에 텍스트 가두기

    pop();
  }

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