function startApiInfoScreen(item) {
    if (!item || typeof item !== 'object') {
        console.warn('startApiInfoScreen called without valid item:', item);
        return; // 방어: 잘못 호출됐으면 무시
      }
    currentApiInfo = item || null;
    showApiInfoScreen = true;
    apiInfoImg = null;
    apiImgLoading = false;
    apiImgLoadError = false;
  
    if (!item) return;
  
    const url = item.imageUrl || item.filePath || null;
    if (!url) return;
  
    // 캐시 있으면 사용
    if (imageCache[url]) {
      apiInfoImg = imageCache[url];
      return;
    }
  
    apiImgLoading = true;
    loadImage(url,
      (img) => {
        imageCache[url] = img;
        apiInfoImg = img;
        apiImgLoading = false;
      },
      (err) => {
        console.warn('API image load failed:', url, err);
        apiImgLoading = false;
        apiImgLoadError = true;
      }
    );
  }

  function drawApiInfoScreen() {
    // 반투명 전체 배경
    push();
    fill(0, 150);
    rect(0, 0, width, height);
    pop();
  
    // 카드 박스
    const boxW = min(width - 80, 860);
    const boxH = min(height - 200, 520);
    const boxX = (width - boxW) / 2;
    const boxY = (height - boxH) / 2;
  
    push();
    fill(255);
    stroke(200);
    rect(boxX, boxY, boxW, boxH, 12);
  
    // 타이틀
    noStroke();
    fill(0);
    textAlign(CENTER, TOP);
    textSize(24);
    textFont(title_text); // 네 폰트 변수 사용
    text("구조 동물 정보", width/2, boxY + 12);
  
    // 이미지 영역 (좌측)
    const imgX = boxX + 24;
    const imgY = boxY + 56;
    const imgW = 280;
    const imgH = 280;
  
    imageMode(CORNER);
    if (apiInfoImg) {
      image(apiInfoImg, imgX, imgY, imgW, imgH);
    } else {
      // 플레이스홀더
      fill(230);
      rect(imgX, imgY, imgW, imgH, 8);
      fill(100);
      textSize(14);
      textAlign(CENTER, CENTER);
      if (apiImgLoading) text("이미지 로딩 중...", imgX + imgW/2, imgY + imgH/2);
      else if (apiImgLoadError) text("이미지 로드 실패", imgX + imgW/2, imgY + imgH/2);
      else text("이미지 없음", imgX + imgW/2, imgY + imgH/2);
    }
  
    // 라벨:값 영역 (우측)
    const rx = imgX + imgW + 24;
    let y = imgY;
    const lineH = 28;
    textAlign(LEFT, TOP);
    textSize(16);
    textFont(body_text);
  
    function drawKV(label, key) {
      fill(110);
      text(label, rx, y);
      fill(0);
      const val = currentApiInfo && currentApiInfo[key] ? String(currentApiInfo[key]) : "-";
      text(val, rx + 110, y, boxW - imgW - 170, lineH * 3);
      y += lineH;
    }
  
    drawKV("종류", "species");
    drawKV("나이", "age");
    drawKV("성별", "gender");
    drawKV("체중", "weight");
    drawKV("털색", "hairColor");
    drawKV("발견 장소", "foundPlace");
    drawKV("메모", "memo");
  
    // 하단 버튼 (다음)
    const btnW = 200, btnH = 48;
    const btnX = width/2 - btnW/2;
    const btnY = boxY + boxH - 70;
  
    fill(40);
    rect(btnX, btnY, btnW, btnH, 8);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("다음", btnX + btnW/2, btnY + btnH/2);
  
    pop();
  }
  