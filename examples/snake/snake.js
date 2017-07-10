"use strict";

// Initialize MicroCanvas
let game = new MicroCanvas();


// Define your globals and variables holding your assets here
let gfxSnake;
let gfxSnakeFood;




// Load graphics, sounds assets and initialize variables here
// head x4
// mouth x4
// body x2 +stuffed x2
// turning x4 +stuffed x4
// tail x4 +stuffed x4
game.setup(function(game) {
  gfxSnake = game.loadSprite(`! snake 4x4x14

  ! head pointing left
    ...#
    .##.
    .###
    ....

  ! head pointing right
    #..
    .##.
    ###.
    ....

  ! turning up-left
    ....
    ##..
    #.#.
    .##.

  ! turning left-up
    .##.
    .#.#
    ..##
    ....

  ! turning down-left
    .##.
    #.#.
    ##..
    ....

  ! turning right-down
    ....
    ##..
    #.#.
    .##.

  ! body pointing up
    .##.
    ..#.
    .#..
    .##.

  ! body pointing down
    .##.
    .#..
    ..#..
    .##.

  ! body pointing left
    ....
    #.##
    ##.#
    ....

  ! body pointing right
    ....
    ##.#
    #.##
    ....

  ! tail pointing left
    ....
    ##..
    ####
    ....

  ! tail pointing right
    ....
    ..##
    ####
    ....

  ! open mouth pointing left
    .#.#
    ..#.
    ..##
    .#..

  ! food blip
    ..#.
    .#.#
    ..#.
    ....
`);

  gfxSnakeFood = game.loadSprite(`! snakefood 8x4
    ....##..
    #..##.#.
    #.#####.
    .#######
  `);

  // Authentic 3210-looks! :)
  game.custom({
    canvas: `this.canvas.style.backgroundColor='#9c0'; this.filter='invert(100%)'`,
  });

});


// More globals
let map = Array(20*10).fill(0);
let mouth = false;


// Main game loop code goes here
game.loop(function() {
  // Clear display
  game.clear();
  if (game.everyXFrames(30)) {
    mouth = !mouth;
  }


  let x = 20;
  let y = 20;

  if (mouth) game.drawImage(gfxSnake[13], x-4, y);

  game.drawImage(gfxSnake[mouth*12], x   ,y);
  game.drawImage(gfxSnake[8], x+4 ,y);
  game.drawImage(gfxSnake[8], x+8 ,y);
  game.drawImage(gfxSnake[2], x+12,y);
  game.drawImage(gfxSnake[6], x+12,y+4);
  game.drawImage(gfxSnake[3], x+12,y+8);
  game.drawImage(gfxSnake[8], x+16,y+8);
  game.drawImage(gfxSnake[10], x+20,y+8);

  game.drawImage(gfxSnakeFood, x,y+16);
});

console.log("MicroCanvas initialized");
