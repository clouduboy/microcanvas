"use strict";

let game = new MicroCanvas();

let gfxInvader, gfxDefender;
let gfxInvader2;
let gfxRocket;
let gfxBomb;



let rocketX, rocketY;
let turretX;


let invaders = Array(8*4).fill(1);
let totalInvaders = invaders.length;
let turretAnimation = 0;


// Initialize game
game.setup(function(game) {
  // Set up graphics
  gfxInvader = game.loadSprite(`! invader 9x8x2
    .........
    ..#...#..
    ...#.#...
    .#######.
    ##.###.##
    #########
    #.#.#.#.#
    ..#...#..

    .........
    ..#...#..
    ...#.#...
    .#######.
    ##.###.##
    #########
    #.#...#.#
    ...#.#..
`);

  gfxInvader2 = game.loadSprite(`! gfx_invader_2 9x8
    ....#....
    ..#####..
    ....#....
    #.#####.#
    .##.#.##.
    #.#####.#
    ...#.#...
    ..#...#..
  `);

  gfxDefender = game.loadSprite(`! gfx_defender 9x6
    ....#....
    ...###...
    ..#####..
    #.##.##.#
    ###...###
    #########
  `);

  gfxRocket = game.loadSprite(`! rocket 1x3
    #
    #
    #
  `);

  gfxBomb = game.loadSprite(`! bomb 5x5x2
    .....
    .#.#.
    ..#..
    #####
    .###.

    .....
    ..#..
    ..#..
    #####
    .###.
  `);

  // Place defender in the middle of the playing field
  turretX = game.width/2;

  // Reset rocket
  rocketX = 0;
  rocketY = 0;
});



// Main game loop
game.loop(function() {

  // Clear display, redraw background text
  game.clear();


  // Update turret projectile
  // No rocket on-screen
  if (rocketY < 3) {
	/// Fire new rocket
    if (totalInvaders > 0 && game.buttonPressed('space')) {
      rocketY = game.height - 3;
      rocketX = turretX - 1;
    }
  }
  // If rocket is still visible, move it towards the top of the screen
  if (rocketY >= 3) {
    rocketY = rocketY -3;
  }


  // Draw the game
  if (totalInvaders > 0) {
    // Handle keypresses
    if ( game.buttonPressed('left') ) {
      turretX = turretX-3;
    }

    if ( game.buttonPressed('right') ) {
      turretX = turretX+3;
    }


    // Enforce screen boundaries
    if ( turretX < 0 ) {
      turretX = 0;
    }

    if ( turretX > game.width-gfxDefender.width/2) {
      turretX = game.width-gfxDefender.width/2;
    }

    playgame();
  } else {
    endgame()
  }

});

function defeat() {
  game.fillStyle = "white";
  game.centerText(game.width/2, game.height/2, `OH NO!`);
}

function endgame() {
  if (!defender_win_animation_start) defender_win_animation_start = game.frameCount;
  if (defender_win_animation_remaining() > 0) {
    let turretY = defender_win_animation()
    game.drawImage(gfxDefender , turretX-5, turretY);
  }

  game.fillStyle = "white";
  game.centerText(game.width/2, game.height/2, `HUMANITY PREVAILS!`);
  // same as: game.drawText(game.width/2 -game.measureText(`…`).width/2, game.height/2 -game.measureText(`…`).height/2, `…`);
  // game.measureText(`Humanity prevails!`).width ~> `…`.length*5
}

let invaderAnimation = 1;
let invaderX = 0;

function playgame() {
  game.clear()


  // Animate invaders
  invaderX = invader_animation()


  // Draw invaders
  let startX = (game.width - (8*(gfxInvader.width+4)-4))/2;

  let y = 0;
  while (y < 4) {

    let x = 0;
    while (x < 8) {


      // Don't draw destroyed invaders
      if (invaders[x+8*y]) {
        // Move different rows of invaders differently
        if (y % 2) {
          game.drawImage(gfxInvader[invaderX>>1&1], startX + (invaderX-3) + x*(gfxInvader.width+4), y*(gfxInvader.height+1));

          if (rocketY >=3 && game.detectCollision(gfxInvader[invaderX>>1&1], startX + (invaderX-3) + x*(gfxInvader.width+4), y*(gfxInvader.height+1), gfxRocket, rocketX, rocketY)) {
            invaders[x+8*y] = 0;
            totalInvaders--;
            rocketY = 0;
          }

        } else {
          game.drawImage(gfxInvader2, startX - (invaderX-3) + x*(gfxInvader.width+4), y*(gfxInvader.height+1));

          if (rocketY >=3 && game.detectCollision(gfxInvader2, startX - (invaderX-3) + x*(gfxInvader.width+4), y*(gfxInvader.height+1), gfxRocket, rocketX, rocketY)) {
            invaders[x+8*y] = 0;
            totalInvaders--;
            rocketY = 0;
          }
        }
      }

      x = x + 1;
    }

    y = y + 1;
  }


  // Draw defender
  game.drawImage(gfxDefender , turretX-5, game.height-8);


  // Draw rocket
  if (rocketY >= 3) {
    game.fillRect(rocketX, rocketY, 1,2);
  }
}


console.log("MicroCanvas initialized: HCFDemo");

/*
animate([{uint:0}, {uint:6}, {uint:0}], {
  duration: 2000,
  id: 'invader_animation',
  easing: 'linear',
  iterations: Infinity // TODO: remove second stop and implement direction:alternate
})
*/
function invader_animation() {
  const t = game.frameCount%120
  // a period of 120 (duration)
  // TODO: add invader_animation_start?
  // (note: frame count overflow issues? 16.6 minutes overflow period is FINE)
  let x

  // first stop
  if (t < 60) {
    // add rounding to first decimal
    x = ( 0+((6-0)*(t-0)*10/60+5)/10 )|0
    // TODO: bad rounding when result is negative (rounds only towards zero)

  // second stop
} else if (t < 120) {
    x = ( 6+((0-6)*(t-60)*10/60+5)/10 )|0
  }

  //console.log(t,x)
  return x
}

/*
animate([{uint:game.height-8}, {uint:0}], {
  duration: 1000,
  id: 'defender_win_animation',
  easing: 'cubic-in', //same as "cubic-bezier(0.550, 0.055, 0.675, 0.190)"
  iterations: 1
})
*/
const defender_win_animation_duration = 60
let defender_win_animation_start = 0
function defender_win_animation() {
  const t = Math.min(game.frameCount-defender_win_animation_start, defender_win_animation_duration)
  // MIN(currentframe-startframe, duration) - capped at "duration"

  // first stop
  const x = ((easeCubicIn(null, t, 10*(game.height-8), -10*(game.height-8), defender_win_animation_duration)+5)/10)|0
  //rounded easeCubicIn(null, t, game.height-8, -(game.height-8), duration)

  return x
}
function defender_win_animation_remaining() {
  return Math.max(60 - (game.frameCount-defender_win_animation_start))
}

// t: current time, b: beginning value, c: change in value, d: duration
function easeCubicIn(x, t, b, c, d) {
  return c*(t/=d)*t*t + b;
}

/*
animate([
  { uint: 0 }, // offset: 0
  { uint: 0, game.frameRate*6 }, // x seconds in still zero (leeway)
  { uint: game.height-game.frameRate*10 }
], {
  duration: 1000,
  id: 'game_timer_animation',
  easing: 'cubic-in', //same as "cubic-bezier(0.550, 0.055, 0.675, 0.190)"
  iterations: 1
})
*/
