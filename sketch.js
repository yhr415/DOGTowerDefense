const width = 800
const height = 600

const marginY = 200
const roadNums = 7
const roadWidth = (height - marginY) / roadNums
const endWidth = 100
const buttonWidth = width / 4
const buttonHeight = 100

const maxBuildColumn = 3
const towerTypes = 2
const towerMaxLevel = 2
const towerCost = [2, 5]
const towerShootSpeed = [4, 8]
const towerText = [["🏠", "🏛️"], ["🏘️", "🏢"]]
const bulletText = [["🦴", "❤️"], ["🍖", "💕"]]
const towerSize = 40

let wallet = 100
let missedDogCnt = 0
let summonTime = new Array(roadNums)
let beforeSummoned = new Array(roadNums)

let dogArr = []
let towerArr = []
const benchSize = 15
let benchTowerType = []
let benchTowerLevel = []

let dragging = false
let draggingTowerType = -1
let draggingTowerLevel = -1
let draggingIdx = -1

class Dog {
  constructor(idx) {
    this.idx = idx
    this.x = 150
    this.y = idx * (height - marginY) / roadNums + roadWidth / 2
    this.size = 30
    this.speed = 2
    this.life = [floor(random(2, 5)), floor(random(2, 5))]
  }

  show() {
    textSize(this.size)
    text("🐶", this.x, this.y)
    fill(0)
    textSize(20)
    text(`배고픔 : ${this.life[0]}`, this.x + 50, this.y)
    text(`관심 : ${this.life[1]}`, this.x + 50, this.y + 20)
  }
  
  move(){
    this.x += this.speed
  }
}

class Tower {
  constructor(idxX, idxY, type, level) {
    this.idx = idxY
    this.x = (idxX + 1) * towerSize
    this.y = idxY * (height - marginY) / roadNums + roadWidth / 2
    this.size = towerSize
    this.type = type
    this.level = level
    
    this.boneX = this.x
    this.boneY = this.y
    this.boneSpeed = towerShootSpeed[level]
  }

  show() {
    textSize(this.size)
    text(towerText[this.level][this.type], this.x, this.y)
  }
  
  shoot(){
    this.boneX += this.boneSpeed
    if (this.boneX > width - endWidth){
      this.boneX = this.x
    }

    for (let dog of dogArr[this.idx]){
      if (abs(this.boneX - dog.x) < 10 && dog.life[this.type] > 0){
        dog.life[this.type] -= 1
        this.boneX = this.x
        break
      }
    }

    textSize(30)
    text(bulletText[this.level][this.type], this.boneX, this.boneY)
  }
}

function setup() {
  createCanvas(width, height)
  textAlign(CENTER, CENTER)

  for (let i = 0; i < roadNums; i++){
    towerArr[i] = new Array(maxBuildColumn)
    dogArr[i] = []
    for (let j = 0; j < maxBuildColumn; j++){
      towerArr[i][j] = new Tower(j, i, null, -1)
    }
  }

  for (let i = 0; i < roadNums; i++) {
    summonTime[i] = random(3000, 5000)
    beforeSummoned[i] = 0
  }
}

function draw() {
  drawBackground()
  controlDrag()
  controlObject()
}

function drawBackground(){
  background(220)

  fill(100, 150, 100)
  for (let i = 0; i < height - marginY; i += roadWidth){
    rect(0, i, width, roadWidth)
  }

  fill(0)
  rect(towerSize / 2 - 10, 0, 10, height - marginY)
  rect(towerSize * (maxBuildColumn + 1/2), 0, 10, height - marginY)
  rect(width - endWidth, 0, 10, height - marginY)

  fill(150, 150, 200)
  if ((0 < mouseX && mouseX < buttonWidth) && (height - buttonHeight < mouseY && mouseY < height)){
    fill(100, 100, 200)
  }
  rect(0, (height - marginY / 2), buttonWidth, buttonHeight)

  fill(150, 150, 200)
  if ((buttonWidth < mouseX && mouseX < buttonWidth * 2) && (height - buttonHeight < mouseY && mouseY < height)){
    fill(100, 100, 200)
  }
  rect(buttonWidth, (height - marginY / 2), buttonWidth, buttonHeight)

  fill(200, 100, 100)
  rect(buttonWidth * 2, (height - marginY / 2), buttonWidth, buttonHeight)
  rect(buttonWidth * 3, (height - marginY / 2), buttonWidth, buttonHeight)

  fill(0)
  
  textSize(30)
  text(`음식 타워 구매`, buttonWidth * 0.5, height - buttonHeight / 2)
  text(`(${towerCost[0]}원)`, buttonWidth * 0.5, height - buttonHeight / 4)
  text(`사랑 타워 구매`, buttonWidth * 1.5, height - buttonHeight / 2)
  text(`(${towerCost[1]}원)`, buttonWidth * 1.5, height - buttonHeight / 4)
  text(`남은 돈 : ${wallet}`, buttonWidth * 2.5, height - buttonHeight / 2)
  text(`놓친 개 : ${missedDogCnt}`, buttonWidth * 3.5, height - buttonHeight / 2)

  fill(150)
  rect(towerSize / 2, height - 1.5 * buttonHeight - towerSize / 2, towerSize * benchSize, towerSize)
  
  textSize(towerSize)
  for (let i = 0; i < benchTowerType.length; i++){
    if (benchTowerLevel[i] == -1){
      continue
    }
    text(towerText[benchTowerLevel[i]][benchTowerType[i]], (i+1) * towerSize, height - 1.5 * buttonHeight)
  }

  if (dragging && draggingTowerLevel >= 0){
    fill(100, random(190, 210), 100)
    for (let i = 0; i < roadNums; i++){
      for (let j = 0; j < maxBuildColumn; j++){
        if (towerArr[i][j].level == -1 || (towerArr[i][j].type == draggingTowerType && towerArr[i][j].level == draggingTowerLevel && draggingTowerLevel < towerMaxLevel - 1)){
          rect(towerSize * (0.5 + j), (roadWidth - towerSize) / 2 + roadWidth * i, towerSize, towerSize)
        }
      }
    }
  }
}

function controlDrag(){
  if (!mouseIsPressed){
    return
  }

  if (!dragging){
    dragging = true
    draggingIdx = floor((mouseX - towerSize / 2) / towerSize)
    draggingTowerType = 0
    draggingTowerLevel = -1
    if ((0 <= draggingIdx && draggingIdx < benchTowerType.length) && (height - 1.5 * buttonHeight - towerSize / 2 < mouseY && mouseY < height - 1.5 * buttonHeight + towerSize / 2)){
      draggingTowerType = benchTowerType[draggingIdx]
      draggingTowerLevel = benchTowerLevel[draggingIdx]
      benchTowerLevel[draggingIdx] = -1
    }
  }
  else{
    if (draggingTowerLevel >= 0){
      textSize(towerSize)
      text(towerText[draggingTowerLevel][draggingTowerType], mouseX, mouseY)
    }
  }
}

function controlObject(){
  for (let i = 0; i < roadNums; i++){
    if (millis() - beforeSummoned[i] > summonTime[i]){
      beforeSummoned[i] = millis()
      dogArr[i].push(new Dog(i))
    }
  }
  
  for (let i = 0; i < roadNums; i++){
    for (let dog of dogArr[i]){
      dog.move()
      dog.show()
    }

    for (let tower of towerArr[i]){
      if (tower.level == -1){
        continue
      }
      tower.show()
      tower.shoot()
    }

    if (dogArr[i].length != 0){
      if (dogArr[i][0].x >= width - endWidth){
        dogArr[i].shift()
        missedDogCnt += 1
      }
    }

    for (let j = 0; j < dogArr[i].length; j++){
      if (dogArr[i][j].life[0] <= 0 && dogArr[i][j].life[1] <= 0){
        dogArr[i].splice(j, 1)
        break
      }
    }
  }
}

function mousePressed(){
  let buttonIdx = floor(mouseX / buttonWidth)
  if ((0 <= buttonIdx && buttonIdx < towerTypes)  && (height - buttonHeight < mouseY && mouseY < height)){
    if (benchTowerType.length >= benchSize){
      return
    }
    
    if (wallet >= towerCost[buttonIdx]){
      wallet -= towerCost[buttonIdx]
      benchTowerType.push(buttonIdx)
      benchTowerLevel.push(0)
    }
  }
}

function mouseReleased(){
  dragging = false
  if (draggingTowerLevel == -1){
    return
  }
  
  let idxX = floor((mouseX - towerSize / 2) / towerSize)
  let idxY = floor(mouseY / roadWidth)
  let built = false

  if ((0 <= idxX && idxX < maxBuildColumn) && (0 <= idxY && idxY < roadNums)){
    if (towerArr[idxY][idxX].level == -1){
      towerArr[idxY][idxX] = new Tower(idxX, idxY, draggingTowerType, draggingTowerLevel)
      built = true
    }
    else if (towerArr[idxY][idxX].type == draggingTowerType && towerArr[idxY][idxX].level == draggingTowerLevel && draggingTowerLevel < towerMaxLevel - 1){
      towerArr[idxY][idxX] = new Tower(idxX, idxY, draggingTowerType, draggingTowerLevel + 1)
      built = true
    }
  }
  else if ((0 <= idxX && idxX <= benchTowerType.length) && (height - 1.5 * buttonHeight - towerSize / 2 < mouseY && mouseY < height - 1.5 * buttonHeight + towerSize / 2)){
    if (benchTowerType[idxX] == draggingTowerType && benchTowerLevel[idxX] == draggingTowerLevel && draggingTowerLevel < towerMaxLevel - 1){
      benchTowerLevel[idxX] += 1
      built = true
    }
  }

  if (built){
    benchTowerType.splice(draggingIdx, 1)
    benchTowerLevel.splice(draggingIdx, 1)
  }
  else{
    benchTowerType[draggingIdx] = draggingTowerType
    benchTowerLevel[draggingIdx] = draggingTowerLevel
  }
}