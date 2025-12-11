// 💡 게임 오버 화면 그리기 + 버튼 추가
function drawGameOver() {
  rectMode(CORNER);
  textAlign(CENTER,CENTER);
  fill(255);
  textSize(40);
  textFont(title_text);
  text("GAME OVER", width / 2, height / 2 - 20);
  textFont(body_text);
  textSize(20);
  text(`Final Score: ${score}`, width / 2, height / 2 + 20);

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