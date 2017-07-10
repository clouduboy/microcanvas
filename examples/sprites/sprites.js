"use strict";

let game = new MicroCanvas();

let gfxBats;

let x, y;
let sx = 1, sy = 1;

let animationSpeed;
let cSprite;


// Load bat sprite & initialize animation
game.setup(function(game) {
  gfxBats = game.loadSprite(`
    ! bats 16x6x2
    ##....#..#....##
    .##...####...##.
    .###.#.##.#.###.
    .##############.
    ...##########...
    ....##.##.##....
    ...#..#..#..#...
    .#.##.####.##.#.
    ######.##.######
    ###.########.###
    #.....####.....#
    .......##.......
  `);

  // Start in the left-side center of the screen
  x = 0;
  y = (game.height-gfxBats.height)/2;

  // Animation speed of bat wing flaps (in frames)
  animationSpeed = 8;

  // Helper variable for flapping animation
  cSprite = 0;
});


game.loop(function() {
  // Update flapping animation
  if (game.everyXFrames(animationSpeed)) {
    cSprite = !cSprite;
  }

  // Update position
  x += sx;
  y += sy;

  // Constrain bat inside screen bounds
  if (x >= (game.width-gfxBats.width-1) || x<1) sx = -sx;
  if (y >= (game.height-gfxBats.height-1) || y<1) sy = -sy;


  // Clear display, redraw background text
  game.clear();

  // Draw some background text
  game.drawText("Sprite\nDemo", 0,0, 3);

  // Draw shadow (unset pixels on screen based on the bitmap)
  // TODO: platform support outside of Arduboy (JS canvas, Tiny Arcade)
  game.eraseImage(gfxBats[cSprite|0], 0 +x,2 +y);
  game.eraseImage(gfxBats[cSprite|0], 2 +x,2 +y);

  // Draw Bat
  game.drawImage(gfxBats[cSprite|0], 1 +x,1 +y);
});


console.log("MicroCanvas initialized");
