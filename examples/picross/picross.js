"use strict";

let game = new MicroCanvas();

let fieldSize = 8;
let spriteSize = 5;

let generate = function (arr, infoArr) {
  arr.fill(0);
  let block = 0;
  let blockNum = 3;
  for (let i = 0; i < fieldSize; i++) {
    arr[i] = game.random(0, 2);
    if (arr[i] == 1) {
      block = block + 1;
    }
    else if (block > 0) {
      infoArr[blockNum] = block;
      blockNum = blockNum - 1;
      block = 0;
    }
  }
  if(block > 0) {
  	infoArr[blockNum] = block;
  }
};

let calcColumn = function (infoArr, x) {
  infoArr.fill(11);
  let block = 0;
  let blockNum = 3;
  if (board0[x] == 1) {
      block = block + 1;
  }
  else if (block > 0) {
    infoArr[blockNum] = block;
    blockNum = blockNum - 1;
    block = 0;
  }
  if (board1[x] == 1) {
      block = block + 1;
  }
  else if (block > 0) {
    infoArr[blockNum] = block;
    blockNum = blockNum - 1;
    block = 0;
  }
  if (board2[x] == 1) {
      block = block + 1;
  }
  else if (block > 0) {
    infoArr[blockNum] = block;
    blockNum = blockNum - 1;
    block = 0;
  }
  if (board3[x] == 1) {
      block = block + 1;
  }
  else if (block > 0) {
    infoArr[blockNum] = block;
    blockNum = blockNum - 1;
    block = 0;
  }
  if (board4[x] == 1) {
      block = block + 1;
  }
  else if (block > 0) {
    infoArr[blockNum] = block;
    blockNum = blockNum - 1;
    block = 0;
  }
  if (board5[x] == 1) {
      block = block + 1;
  }
  else if (block > 0) {
    infoArr[blockNum] = block;
    blockNum = blockNum - 1;
    block = 0;
  }
  if (board6[x] == 1) {
      block = block + 1;
  }
  else if (block > 0) {
    infoArr[blockNum] = block;
    blockNum = blockNum - 1;
    block = 0;
  }
  if (board7[x] == 1) {
      block = block + 1;
  }
  else if (block > 0) {
    infoArr[blockNum] = block;
    blockNum = blockNum - 1;
    block = 0;
  }
  if (block > 0) {
  	infoArr[blockNum] = block;
  }
}

let mark = function (arr, x) {
  if (arr[x] == 0) {
    arr[x] = 1;
  } else {
    arr[x] = 0;
  }
};

let markRow = function (x, y) {
  if (y == 0) {
    mark(current0, x);
  }
  else if (y == 1) {
    mark(current1, x);
  }
  else if (y == 2) {
    mark(current2, x);
  }
  else if (y == 3) {
    mark(current3, x);
  }
  else if (y == 4) {
    mark(current4, x);
  }
  else if (y == 5) {
    mark(current5, x);
  }
  else if (y == 6) {
    mark(current6, x);
  }
  else if (y == 7) {
    mark(current7, x);
  }
};

let gfxWin;
let gfxField;
let gfxNumbers;
let pressed = false;
let timeStart, timeNow;
let rowInfo0 = [11, 11, 11, 11];
let rowInfo1 = [11, 11, 11, 11];
let rowInfo2 = [11, 11, 11, 11];
let rowInfo3 = [11, 11, 11, 11];
let rowInfo4 = [11, 11, 11, 11];
let rowInfo5 = [11, 11, 11, 11];
let rowInfo6 = [11, 11, 11, 11];
let rowInfo7 = [11, 11, 11, 11];
let board0 = [0, 0, 0, 0, 0, 0, 0, 0];
let board1 = [0, 0, 0, 0, 0, 0, 0, 0];
let board2 = [0, 0, 0, 0, 0, 0, 0, 0];
let board3 = [0, 0, 0, 0, 0, 0, 0, 0];
let board4 = [0, 0, 0, 0, 0, 0, 0, 0];
let board5 = [0, 0, 0, 0, 0, 0, 0, 0];
let board6 = [0, 0, 0, 0, 0, 0, 0, 0];
let board7 = [0, 0, 0, 0, 0, 0, 0, 0];
let columnInfo0 = [11, 11, 11, 11];
let columnInfo1 = [11, 11, 11, 11];
let columnInfo2 = [11, 11, 11, 11];
let columnInfo3 = [11, 11, 11, 11];
let columnInfo4 = [11, 11, 11, 11];
let columnInfo5 = [11, 11, 11, 11];
let columnInfo6 = [11, 11, 11, 11];
let columnInfo7 = [11, 11, 11, 11];
let current0 = [0, 0, 0, 0, 0, 0, 0, 0];
let current1 = [0, 0, 0, 0, 0, 0, 0, 0];
let current2 = [0, 0, 0, 0, 0, 0, 0, 0];
let current3 = [0, 0, 0, 0, 0, 0, 0, 0];
let current4 = [0, 0, 0, 0, 0, 0, 0, 0];
let current5 = [0, 0, 0, 0, 0, 0, 0, 0];
let current6 = [0, 0, 0, 0, 0, 0, 0, 0];
let current7 = [0, 0, 0, 0, 0, 0, 0, 0];

let gameActive, resetting = false;
let cursorPosX = 0, cursorPosY = 0;
let fieldPxSize = fieldSize * spriteSize;
let displayWidth = 128, displayHeight = 64;
let fieldStartX = displayWidth-fieldPxSize-1, fieldStartY = displayHeight-fieldPxSize-1;

let checkRow = function (board, current) {
  for (let i = 0; i < fieldSize; i++) {
   	 if (board[i] != current[i]) {
       return 0;
     }
  }
  return 1;
}

let checkBoard = function () {
  return (checkRow(board0, current0) + checkRow(board1, current1) + checkRow(board2, current2) + checkRow(board3, current3) + checkRow(board4, current4) + checkRow(board5, current5) + checkRow(board6, current6) + checkRow(board7, current7)) == 8;
}

let startGame = function () {
  rowInfo0.fill(11);
  rowInfo1.fill(11);
  rowInfo2.fill(11);
  rowInfo3.fill(11);
  rowInfo4.fill(11);
  rowInfo5.fill(11);
  rowInfo6.fill(11);
  rowInfo7.fill(11);
  current0.fill(0);
  current1.fill(0);
  current2.fill(0);
  current3.fill(0);
  current4.fill(0);
  current5.fill(0);
  current6.fill(0);
  current7.fill(0);
  generate(board0, rowInfo0);
  generate(board1, rowInfo1);
  generate(board2, rowInfo2);
  generate(board3, rowInfo3);
  generate(board4, rowInfo4);
  generate(board5, rowInfo5);
  generate(board6, rowInfo6);
  generate(board7, rowInfo7);
  calcColumn(columnInfo0, 0);
  calcColumn(columnInfo1, 1);
  calcColumn(columnInfo2, 2);
  calcColumn(columnInfo3, 3);
  calcColumn(columnInfo4, 4);
  calcColumn(columnInfo5, 5);
  calcColumn(columnInfo6, 6);
  calcColumn(columnInfo7, 7);
  gameActive = true;
  resetting = false;
  timeStart = game.frameCount;
}

game.setup(function(game) {
  gfxWin = game.loadSprite(`! win 13x5
.............
.#...#.#.#..#
.#...#.#.##.#
.#.#.#.#.#.##
..#.#..#.#..#`);
  gfxField = game.loadSprite(`! field 5x5x4
#####
#....
#....
#....
#....

#####
#....
#.##.
#.##.
#....

#####
#####
##..#
##..#
#####

#####
#####
#####
#####
#####`);
  gfxNumbers = game.loadSprite(`! num 5x5x12
.....
.###.
.#.#.
.#.#.
.###.

.....
..#..
..#..
..#..
..#..

.....
.###.
...#.
.##..
.###.

.....
.###.
...#.
..##.
.###.

.....
.#...
.#.#.
.###.
...#.

.....
.###.
.#...
..##.
.###.

.....
.#...
.#...
.###.
.###.

.....
.###.
...#.
...#.
...#.

.....
.###.
.#.#.
.###.
.###.

.....
.###.
.#.#.
.###.
...#.

.....
.....
..#..
.....
..#..

.....
.....
.....
.....
.....`);
  startGame();
});


let drawRow = function (y, arr, infoArr) {
  for (let x = 0; x < fieldSize; x++) {
    let type = arr[x];
    if (x == cursorPosX && y == cursorPosY) {
      type = type + 2;
    }
    for (let i = 0; i < 4; i++) {
      game.drawImage(gfxNumbers[infoArr[i]], fieldStartX-5-(i*spriteSize), fieldStartY+(y*spriteSize));
    }
    game.drawImage(gfxField[type], fieldStartX+(x*spriteSize), fieldStartY+(y*spriteSize));
  }
}


game.loop(function() {

  // Clear display, redraw background text
  game.clear();

  if (checkBoard()) {
    gameActive = false
    game.drawImage(gfxWin[0], 0, 5);
  }

  if (!resetting && game.everyXFrames(3)) {
    if (game.buttonPressed('right')) {
      if (!pressed) {
	    cursorPosX = Math.min(cursorPosX + 1, 7);
        pressed = true;
      }
    }
    else if (game.buttonPressed('left')) {
      if (!pressed) {
      	cursorPosX = Math.max(cursorPosX - 1, 0);
        pressed = true;
      }
    }
    else if (game.buttonPressed('down')) {
      if (!pressed) {
      	cursorPosY = Math.min(cursorPosY + 1, 7);
        pressed = true;
      }
    }
    else if (game.buttonPressed('up')) {
      if (!pressed) {
        cursorPosY = Math.max(cursorPosY - 1, 0);
        pressed = true;
        if (game.buttonPressed('enter')) {
          let i = 0;
          while (i<current0.length) {
            current0[i] = board0[i];
            current1[i] = board1[i];
            current2[i] = board2[i];
            current3[i] = board3[i];
            current4[i] = board4[i];
            current5[i] = board5[i];
            current6[i] = board6[i];
            current7[i] = board7[i];
            ++i;
          }
        }
      }
    }
	else if (game.buttonPressed('space')) {
      if (!pressed) {
        pressed = true;
        if (gameActive) {
          markRow(cursorPosX, cursorPosY);
        }
        if (game.buttonPressed('enter')) {
          resetting = true;
          console.log("Resetting game");
          startGame();
        }
      }
    }
    else {
      pressed = false
    }
  }

  if (gameActive) {
    timeNow = game.frameCount;
  }
  let timeDiff = timeNow - timeStart;
  let timeDiffM = Math.floor(timeDiff / 60 / 60);
  let timeDiffS = Math.floor(timeDiff / 60 ) % 60;

  game.drawImage(gfxNumbers[Math.floor(timeDiffM / 10)], 0, 0);
  game.drawImage(gfxNumbers[timeDiffM - (Math.floor(timeDiffM / 10) * 10)], 4, 0);
  game.drawImage(gfxNumbers[10], 8, 0);
  game.drawImage(gfxNumbers[Math.floor(timeDiffS / 10)], 12, 0);
  game.drawImage(gfxNumbers[timeDiffS - (Math.floor(timeDiffS / 10) * 10)], 16, 0);

  for (let i = 0; i < 4; i++) {
    game.drawImage(gfxNumbers[columnInfo0[i]], fieldStartX+(0*spriteSize), fieldStartY-6-(i*spriteSize));
    game.drawImage(gfxNumbers[columnInfo1[i]], fieldStartX+(1*spriteSize), fieldStartY-6-(i*spriteSize));
    game.drawImage(gfxNumbers[columnInfo2[i]], fieldStartX+(2*spriteSize), fieldStartY-6-(i*spriteSize));
    game.drawImage(gfxNumbers[columnInfo3[i]], fieldStartX+(3*spriteSize), fieldStartY-6-(i*spriteSize));
    game.drawImage(gfxNumbers[columnInfo4[i]], fieldStartX+(4*spriteSize), fieldStartY-6-(i*spriteSize));
    game.drawImage(gfxNumbers[columnInfo5[i]], fieldStartX+(5*spriteSize), fieldStartY-6-(i*spriteSize));
    game.drawImage(gfxNumbers[columnInfo6[i]], fieldStartX+(6*spriteSize), fieldStartY-6-(i*spriteSize));
    game.drawImage(gfxNumbers[columnInfo7[i]], fieldStartX+(7*spriteSize), fieldStartY-6-(i*spriteSize));
  }

  // Draw Field
  drawRow(0, current0, rowInfo0);
  drawRow(1, current1, rowInfo1);
  drawRow(2, current2, rowInfo2);
  drawRow(3, current3, rowInfo3);
  drawRow(4, current4, rowInfo4);
  drawRow(5, current5, rowInfo5);
  drawRow(6, current6, rowInfo6);
  drawRow(7, current7, rowInfo7);

  game.fillRect(fieldStartX+fieldPxSize, fieldStartY, fieldStartX+fieldPxSize, displayHeight);
  game.fillRect(fieldStartX, fieldStartY+fieldPxSize, fieldStartX+fieldPxSize, fieldStartY+fieldPxSize);



});

console.log("MicroCanvas initialized");
