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

// 타워 선택 관련 변수
let selectedTower = null; // 선택된 타워
let selectedTile = null; // 선택된 타일

let gameState = "INTRO";
let manualPage=0;