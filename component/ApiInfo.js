function startApiInfoScreen(item) {
  if (!item || typeof item !== "object") return;

  currentApiInfo = item;
  showApiInfoScreen = true;
  apiInfoImg = null;
  apiImgLoading = false;
  apiImgLoadError = false;

  const originalUrl = item.imageUrl || item.filePath;
  if (!originalUrl) return;

  const filename = originalUrl.split("/").pop();
  const localUrl = "images/" + filename;

  // 캐시 확인
  if (imageCache[localUrl]) {
    apiInfoImg = imageCache[localUrl];
    return;
  }

  apiImgLoading = true;
  loadImage(
    localUrl,
    (img) => {
      imageCache[localUrl] = img;
      apiInfoImg = img;
      apiImgLoading = false;
    },
    (err) => {
      console.warn("API image load failed:", localUrl, err);
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
  let boxX = (width - boxW) / 2;
  let boxY = (height - boxH) / 2;
  let marginY=20;
  let marginY2=50;
  let marginY3=90;

  push();
  fill(y1);
  stroke(orangeline);
  rect(boxX, boxY, boxW, boxH, 12);

  // 타이틀
  boxY = boxY+marginY
  fill(orangefill);
  stroke(orangeline);
  strokeWeight(5);
  textAlign(CENTER, TOP);
  textSize(30);
  textFont(title_text); // 네 폰트 변수 사용
  text("구조한 유기견", width / 2, boxY);
  noStroke();

  //qr자리 여기에 삽입하면 됩니다!!//
  fill(200);
  rect(boxX+30,boxY,120,120);

  boxY = boxY+marginY2
  //subtitle
  fill(orangeline);
  noStroke();
  textAlign(CENTER,TOP);
  textFont(body_text);
  textSize(20);
  text("지금 당신이 구할 수 있는 유기견은...",width/2,boxY);

  // 이미지 영역 (좌측)
  boxY=boxY+marginY3;
  const imgX = boxX + 24;
  const imgY = boxY;
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
    if (apiImgLoading) text("이미지 로딩 중...", imgX + imgW / 2, imgY + imgH / 2);
    else if (apiImgLoadError) text("이미지 로드 실패", imgX + imgW / 2, imgY + imgH / 2);
    else text("이미지 없음", imgX + imgW / 2, imgY + imgH / 2);
  }
  image(frame,imgX-40,imgY-35,imgW+80,imgH+60);


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
  const btnX = width / 2 - btnW / 2;
  const btnY = (height-btnH)/2 + boxH - 70;

  fill(orangefill);
  rect(btnX, btnY, btnW, btnH, 8);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  text("다음", btnX + btnW / 2, btnY + btnH / 2);

  pop();
}

function clickCloseApiInfo() {
  const boxW = min(width - 80, 860);
  const boxH = min(height - 200, 520);
  const boxY = (height - boxH) / 2;

  const btnW = 200, btnH = 48;
  const btnX = width / 2 - btnW / 2;
  const btnY = boxY + boxH - 70;

  if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
    showApiInfoScreen = false;

    fxsounds['click'].play();
  }
  return;
}
