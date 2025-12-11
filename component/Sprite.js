/**
 * 스프라이트 시트를 잘라서 그려주는 함수를 만들것임...
 * @param {p5.Image} sheet - 스프라이트 시트 이미지 input
 * @param {number} frameIndex - 현재 보여줄 프레임 번호
 * @param {number} x - 화면 X
 * @param {number} y - 화면 Y
 * @param {number} w - 화면 너비
 * @param {number} h - 화면 높이
 * @param {number} cols - 가로 칸
 * @param {number} rows - 세로 칸
 * @param {number} totalFrames - 프레임 수 안전장치용
 */

function drawSprite(sheet, frameIndex, x, y, w,h, cols,rows) {
    if (!sheet) return;

    //single image의 width, height 찾기
    let frameW = sheet.width / cols;
    let frameH = sheet.height / rows;

    //frameIndex를 입력받고, frameindex에 따라 (c,r)로 위치 찾기
    let col = frameIndex % cols;
    let row = floor(frameIndex / cols); //floor은 버림함수 - 나머지 계산

    //image 잘라서 그리기
    image(
        sheet, 
        x, y, w, h,           // output 위치, size
        col * frameW,         // 원본 x
        row * frameH,         // 원본 y
        frameW,frameH    // 원본 w, h
    );
}