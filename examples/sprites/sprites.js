'use strict';

let game = new MicroCanvas();



// Assets (graphics sprites, audio etc.) needs to be preloaded

// The bat sprite. It contains two frames with different poses
const gfxBats = game.loadSprite(`
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



// Constants (things that don't change)
// They get their initial value right here where they are declared
// (defined), and this value won't ever change during the course of
// running the rest of the code.

// Animation speed of bat wing flaps (in frames)
const animationDelay = 8;


//
// VARIABLES (global)
//
// The value of these variables can be accessed from anywhere throughout
// the code and will (at least, it can) change.
// (Re-)Initialization happens in the setup function, this ensures
// that when setup() is called again (this is called a "soft" reset)
// these values are re-set to their initial value (e.g. score is
// reset to zero, etc.)

// Bat's current x, y coordinates; speed in x & y axes
let x, y, speedX, speedY;

// The pose (frame) of the bat currently being displayed
// The value is flipped every "animationDelay" frames
let cSprite;



//
// SETUP FUNCTION (runs once every time the program is loaded)
//
game.setup(() => {

  // Start in the left-side center of the screen
  x = 0;
  y = (game.height-gfxBats.height)/2;


  // Helper variable for flapping animation
  cSprite = 0;

  // Reset speed
  speedX = 1
  speedY = 1
});



//
// LOOP FUNCTION (executed 60 times a second while the game is running)
//
game.loop(function() {
  //
  // UPDATE (update the game state)
  //

  // Update flapping animation
  if (game.everyXFrames(animationDelay)) {
    cSprite = 1 - cSprite;
  }

  // Update position
  x += speedX;
  y += speedY;

  // Constrain bat inside screen bounds (bat will "bounce"
  // whenever it reaches the edges of the screen)
  if (x >= (game.width-gfxBats.width-1) || x<1) speedX = -speedX;
  if (y >= (game.height-gfxBats.height-1) || y<1) speedY = -speedY;


  //
  // DRAW (display game state)
  //

  // Clear display
  game.clear();

  // Draw some background text
  game.drawText("Sprite\nDemo", 0,0, 3);

  // Draw bat shadow
  // (draw the bat, slightly offset, with the background color
  // this helps in distinguishing the bat we'll be drawing on top
  // from the background)
  game.eraseImage(gfxBats[cSprite], 2 +x,2 +y);
  game.eraseImage(gfxBats[cSprite], 0 +x,2 +y);
  // TODO: platform support outside of Arduboy (JS canvas, Tiny Arcade)

  // Draw bat in current pose (use correct frame)
  game.drawImage(gfxBats[cSprite], 1 +x,1 +y);
});
