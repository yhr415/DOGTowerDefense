const fs = require("fs");
const path = require("path");
const axios = require("axios");

// 1. JSON 파일 불러오기
const rawData = require("./data/daejeon_dog.json");

// 2. 배열 가져오기 (items 키 확인)
const apiData = rawData.items;

if (!Array.isArray(apiData)) {
  console.error("apiData.items가 배열이 아닙니다!");
  process.exit(1);
}

// 3. images 폴더 생성
const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
  console.log("images 폴더 생성됨");
}

// 4. 이미지 다운로드 함수
async function downloadImages() {
  for (const item of apiData) {
    const url = item.imageUrl;
    if (!url) continue;

    const filename = url.split("/").pop(); // URL에서 파일명 추출
    const filepath = path.join(imagesDir, filename);

    // 이미 다운로드된 파일은 건너뛰기
    if (fs.existsSync(filepath)) {
      console.log(`이미 존재: ${filename}`);
      continue;
    }

    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(filepath, response.data);
      console.log(`다운로드 성공: ${filename}`);
    } catch (err) {
      console.error(`다운로드 실패: ${filename}`, err.message);
    }
  }

  console.log("모든 이미지 다운로드 완료!");
}

// 5. 실행
downloadImages();


