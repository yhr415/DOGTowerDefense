//dog, pet들의 정보를 담는 list
let enemies = [];

//1205 update : 타워 데이터를 기존에는 Hex grid에 저장
//-> 전역변수 towers를 만들어서 따로 관리
let towers = [];

let shop;
let draggingItem = null; // 상점에서 drag and drop 기능 : 현재 drag 중인 타워 정보 저장
let bullets = [];
const startMoney = 70
let money = startMoney
let lives = 10, score = 0, gameOver = false, gameClear = false;

//pet spawn Rate 변수 하나 만들었음... 근데 dog에 spawn rate가 필요할까?
const spawnRate = 60;
const petSpawnRate = 60;

let bossActive = false
let bossDog = null;

let HEX_COLS = 15, HEX_ROWS = 7, HEX_R = 50, MARGIN = 24;
let hexGrid;

let currentStage = 0, stageManager, isStageActive = false;

//sound 변수 선언
let bgm;
let fxsounds = {};
// 효과음 재생 제어용 상태
let sfxLastPlayTime = {};
let sfxActiveCount = {};

// 이미지 변수 선언
let jindoImg;
let shibaImg;
let PomeImg;
let BeagleImg;
let DobermanImg;
let backgrnd;

//effect를 담는 List
let effects = [];

let towerSpriteSheets = {}; //타워 이미지 담기
let bulletimgs = {}; //bullet image 담기
let dogPics = {};

// API / apiInfo 관련 전역 변수
let rescueData = null;        // preload에서 불러온 전체 JSON (rescueData.items)
let currentApiInfo = null;  // 지금 화면에 띄운 선택된 item 객체
let apiInfo = null;
let showApiInfoScreen = false; // API 정보 화면 표시 여부
let isApiScreenOpen = false; //현재 API 정보 화면 열림 여부
let apiInfoImg = null;      // 선택 item의 p5.Image
let imageCache = {};          // imageUrl -> p5.Image 캐시
let showStageInfoScreen = false; // info 화면 표시 여부
let apiImgLoading = false;
let apiImgLoadError = false;
let apiQrTargetUrl = "";

// 타워 선택 관련 변수
let selectedTower = null; // 선택된 타워
let selectedTile = null; // 선택된 타일

let gameState = "INTRO";
let manualPage=0;

let lastHitSoundTime = 0;

// 공용 SFX 재생 헬퍼: 과도한 중첩을 막기 위해 최소 간격과 동시 재생 수를 제한
function playSfx(key, { interval = 120, maxStack = 2, decayMs = 400 } = {}) {
  const s = fxsounds[key];
  if (!s || typeof s.play !== "function") return;

  const now = (typeof millis === "function") ? millis() : Date.now();
  const last = sfxLastPlayTime[key] ?? 0;
  if (now - last < interval) return;

  const active = sfxActiveCount[key] ?? 0;
  if (active >= maxStack) return;

  sfxLastPlayTime[key] = now;
  sfxActiveCount[key] = active + 1;

  s.play();

  // 일정 시간이 지나면 active 카운트 감소 (간단한 풀링 효과)
  setTimeout(() => {
    sfxActiveCount[key] = Math.max(0, (sfxActiveCount[key] ?? 1) - 1);
  }, decayMs);
}