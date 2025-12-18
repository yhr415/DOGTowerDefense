// 1215 update 게임오버 화면 이미지 변경, 텍스트 변경
function drawGameOver() {
  image(backgrndGameover, width / 2, height / 2, width, height);
  rectMode(CORNER);
  textAlign(CENTER,CENTER);
  fill(255);
  textSize(40);
  textFont(title_text);
  text("유기견을 구조하지 못했습니다.", width / 2, height / 2 - 20);
  textFont(body_text);
  textSize(20);
  text(`구조한 강아지 : ${score}`, width / 2, height / 2 + 20);

  // '다시 하기' 버튼 그리기
  fill(pink1);
  stroke(pink2);
  rect(width / 2 - 100, height / 2 + 80, 200, 50, 10); // x, y, w, h, radius
  fill(navy2);
  noStroke();
  textFont(body_text);
  textSize(20);
  text("유기견 구하러 가기", width / 2, height / 2 + 105);
}

//game over one shot 함수
function triggerGameOver(){
  if (gameOver) return; // 이미 게임오버면 중복 실행 방지
  gameState = "GAMEOVER";
  if (bgm.isPlaying()) {
    bgm.stop(); 
  }
  if (!bgmFail.isPlaying()) {
    bgmFail.loop();
  }
}

//game over one shot 함수
function triggerGameClear(){
  if (gameClear) return; // 중복실행 방지용
  gameState = "GAMECLEAR";
  if (bgm.isPlaying()) {
    bgm.stop(); 
  }
  if (!bgmClear.isPlaying()) {
    bgmClear.loop();
  }
}

// 💡 게임 클리어 화면 그리기
function drawGameClear() {
  rectMode(CORNER);
  textAlign(CENTER,CENTER);
  fill(255);
  textSize(40);
  textFont(title_text);
  text("유기견 구조 성공!", width / 2, height / 2 - 20);
  textFont(body_text);
  textSize(20);
  text(`구조한 강아지 : ${score}`, width / 2, height / 2 + 20);

  // '다시 하기' 버튼 그리기
  fill(pink1);
  stroke(pink2);
  rect(width / 2 - 100, height / 2 + 80, 200, 50, 10); // x, y, w, h, radius
  fill(navy2);
  noStroke();
  textFont(body_text);
  textSize(20);
  text("다시 하기", width / 2, height / 2 + 105);
}