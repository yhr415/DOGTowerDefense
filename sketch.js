function setup() {
    createCanvas(windowWidth, windowHeight); // 전체 화면
  }
  
  function draw() {
    background(0); // 그냥 background! p5. 안 붙임!
    
    fill(255, 0, 0);
    noStroke();
    circle(mouseX, mouseY, 100); // 그냥 mouseX!
  }
  
  // 화면 크기 바꿀 때 캔버스도 같이 조절해주는 센스
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }