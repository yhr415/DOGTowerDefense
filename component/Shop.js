class Shop {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    // 판매할 타워 목록
    this.items = itemDesc;

    // 성능 최적화: 사용 가능한 타워 목록 캐시
    this.availableItems = itemDesc; // 초기값은 모든 아이템
    this.currentStageCache = -1; // 캐시된 스테이지 인덱스

    this.itemSize = 70; // 상점 아이콘 크기
    this.padding = 7;
    this.inpadding = 5; //icon 내부 padding, 상하좌우 기본
    this.inbotmar = 14; //icon 내부 bottom margin 글씨 들어갈 공간 manage
    this.titleh = 34;
    this.titlew = 220;
    this.menuw = 90;
  }

  // 스테이지별 사용 가능한 타워 타입 (상수로 정의하여 매번 계산하지 않음)
  static getAvailableTypes(stageIndex) {
    const types = {
      0: ["snack"], // stage 1
      1: ["snack", "heal", "love"], // stage 2
      2: ["snack", "heal", "love", "slow", "antiTanker"], // stage 3
      3: ["snack", "heal", "love", "slow", "antiTanker", "block", "playground"], // stage 4
      4: ["snack", "heal", "love", "slow", "antiTanker", "block", "playground", "support", "factory"] // stage 5
    };
    // stage 5 이상이면 모든 타워 사용 가능
    return types[Math.min(stageIndex, 4)] || types[0];
  }

  // 사용 가능한 타워 목록 업데이트 (스테이지 변경 시에만 호출)
  updateAvailableItems(stageIndex) {
    // 이미 같은 스테이지면 업데이트하지 않음
    if (this.currentStageCache === stageIndex) {
      return;
    }

    this.currentStageCache = stageIndex;
    const availableTypes = Shop.getAvailableTypes(stageIndex);

    // 사용 가능한 타워만 필터링
    this.availableItems = this.items.filter(item => availableTypes.includes(item.type));
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
    text(`${Math.floor(money)}g`, 0, -7);
    image(iconCoin, -this.menuw / 11 * 4, 0, 20, 20);
    pop();
    rectMode(CORNER);

    let hoveringItem = null;

    // 현재 스테이지에서 사용 가능한 타워 타입 가져오기 (성능 최적화)
    const availableTypes = Shop.getAvailableTypes(this.currentStageCache >= 0 ? this.currentStageCache : 0);

    // 판매 아이템 그리기 (루프 시작) - 모든 아이템 표시
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      const isAvailable = availableTypes.includes(item.type);
      const canAfford = typeof money !== 'undefined' && money >= item.cost; // 돈이 충분한지 확인

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
      if (isAvailable) {
        fill(pink1);
      } else {
        fill(100, 100, 100); // 어두운 회색
      }
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

      // 해금되었지만 돈이 부족하면 반투명 검은색 레이어로 어둡게 표시 (tint 대신)
      if (isAvailable && !canAfford) {
        noStroke();
        fill(0, 0, 0, 150); // 반투명 검은색 (150 = 약 60% 불투명도)
        rect(
          ix + this.inpadding,
          iy + this.inpadding,
          this.itemSize - 2 * this.inpadding,
          this.itemSize - 2 * this.inpadding,
          5
        );
      }

      // (4) 가격 텍스트
      if (isAvailable) {
        // 돈이 부족하면 어둡게 표시
        if (canAfford) {
          fill(255);
          stroke(pink2);
          strokeWeight(2);
        } else {
          fill(150, 150, 150);
          stroke(100, 100, 100);
          strokeWeight(1);
        }
        textAlign(CENTER, CENTER);
        textSize(14);
        text(`${item.cost}g`, ix + this.itemSize / 2, iy + this.itemSize + 4.5);
        noStroke();
      } else {
        // 사용 불가능한 타워는 "잠김" 표시
        fill(150, 150, 150);
        stroke(100, 100, 100);
        strokeWeight(1);
        textAlign(CENTER, CENTER);
        textSize(12);
        text("잠김", ix + this.itemSize / 2, iy + this.itemSize + 4.5);
        noStroke();
      }
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

    // 1. 크기 대폭 상향 (기존 대비 1.5배~2배)
    let tw = 280; // 너비 확장 (200 -> 280)
    let th = 160; // 높이 확장 (100 -> 160)

    // 툴팁 위치: 마우스 오른쪽 아래 (여백 조금 더 줌)
    let tx = mouseX + 20;
    let ty = mouseY + 20;

    // 화면 밖으로 나가는 거 방지 로직 (확장된 크기 반영)
    if (tx + tw > width) tx = mouseX - tw - 15;
    if (ty + th > height) ty = mouseY - th - 15;

    // 2. 툴팁 배경 (더 고급스러운 디자인)
    fill(navy2_80); // 깊은 네이비 톤으로 무게감 있게
    stroke(orangeline);   // 테두리를 노란색/금색으로 포인트
    strokeWeight(2);       // 테두리 두께 강화
    rect(tx, ty, tw, th, 12); // 모서리를 더 둥글게 (8 -> 12)

    // 3. 텍스트 설정
    noStroke();
    textAlign(LEFT, TOP);

    // [제목] - 크고 아름답게
    fill(255, 220, 50); // 좀 더 밝은 골드
    textSize(20);       // (16 -> 20)
    textStyle(BOLD);
    text(item.name, tx + 15, ty + 15);

    // [가격] - 가독성 업
    fill(150, 200, 255); // 하늘색 톤
    textSize(16);        // (14 -> 16)
    textStyle(NORMAL);
    // 아이콘 느낌으로 '💰' 하나 넣어주면 더 직관적이야
    text(`💰 가격: ${item.cost}g`, tx + 15, ty + 45);

    // 구분선 하나 그어주면 훨씬 깔끔함
    stroke(255, 50);
    strokeWeight(1);
    line(tx + 15, ty + 70, tx + tw - 15, ty + 70);
    noStroke();

    // [설명] - 많은 내용을 담을 수 있게
    fill(240);          // 순수 흰색보다 약간 눈이 편한 밝은 회색
    textSize(14);       // (12 -> 14)
    textLeading(22);    // 줄 간격을 벌려서 빽빽하지 않게 (18 -> 22)

    // 텍스트 영역을 넉넉하게 잡아서 줄바꿈 처리
    // x, y, width, height 순서
    text(item.desc, tx + 15, ty + 80, tw - 30, th - 90);

    pop();
  }

  getItemAt(mx, my) {
    // 모든 아이템 검사하되, 해금된 것만 반환
    const availableTypes = Shop.getAvailableTypes(this.currentStageCache >= 0 ? this.currentStageCache : 0);

    for (let item of this.items) {
      if (mx > item.x && mx < item.x + item.w &&
        my > item.y && my < item.y + item.h) {
        // 해금된 타워만 반환
        if (availableTypes.includes(item.type)) {
          return item;
        }
        return null; // 해금되지 않은 타워는 null 반환
      }
    }
    return null;
  }

}

function shopItemClick() {
  if (money >= shopItem.cost) {
    draggingItem = shopItem; // 드래그 시작!
    selectedTower = null;
    selectedTile = null;

    // 🔊 아이템 집는 소리 (촥!)
    //fxsounds['money'].play();

  } else {
    console.log("돈이 부족합니다!");

    // 🔊 실패/경고 소리 (띠딕!)
    //if (typeof sfxError !== 'undefined') sfxError.play();
  }
  return;
}