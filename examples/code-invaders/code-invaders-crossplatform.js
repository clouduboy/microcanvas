"use strict";

const game = new MicroCanvas();


// Graphics
const gfxInvader = game.loadSprite(`! invader 9x8x3
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

! dead x^x
..#..#...
.#....#..
..##.##..
##.###.##
#...#...#
.#######.
...#.##..
...#...#.
`);

let gfxInvader2 = game.loadSprite(`
  ! gfx_invader_2 9x8
  ....#....
  ..#####..
  ....#....
  #.#####.#
  .##.#.##.
  #.#####.#
  ...#.#...
  ..#...#..
`);

const gfxDefender = game.loadSprite(`
  ! gfx_defender 9x6
  ....#....
  ...###...
  ..#####..
  #.##.##.#
  ###...###
  #########
`);

const gfxRocket = game.loadSprite(`
  ! rocket 1x3
  #
  #
  #
`);

const gfxIntro = game.loadSprite(`
  ! clouduboy 96x17
  .....#####.....##..............................##..............##.............................
  ...##.....#...#..#............................#..#............#..#............................
  ..#...##...#..#..#............................#..#............#..#............................
  ..#..#..#...#.#..#...#####....##....##....#####..#..##....##..#..#####.....#####....##....##..
  .#..#....#..#.#..#..#.....#..#..#..#..#..#....#..#.#..#..#..#.#..#....#...#.....#..#..#..#..#.
  .#..#.....##..#..#.#...#...#.#..#..#..#.#........#.#..#..#..#.#....#...#.#...#...#.#..#..#..#.
  .#..#.........#..#.#..#.#...##..#..#..#.#...###..#.#..#..#..#.#...#.#..#.#..#.#...##..#.#..#..
  .#..#.....###.#..##..#...#..##..#..#..#.#..#..#..#.#..#..#..#.#..#..#..##..#...#..#.#..##..#..
  .#..#....#..#.#..##..#...#..##..#..#..#.#..#..#..#.#..#..#..#.#..#..#..##..#...#..#.#..#..#...
  .#...#...#..#.#..##..#...#..##..#..#..#.#..#..#..#.#..#..#..#.#..#..#..##..#...#..#.#..#..#...
  ..#...###...#.#..#.#..#.#...##...###..#.#...###..#.#...###..#.#...##...#.#..#.#..#...#...#....
  ..#........#..#..#.#...#...#.#........#.#........#.#........#.#........#.#...#...#...#...#....
  ...##....##...#..#..#.....#...#....#..#..#....#..#..#....#..#.#..#....#...#.....#....#..#.....
  .....####......##....#####.....####.###...####.###...####.###..##.####.....#####....#...#.....
  ..................................................................................##...#......
  .................................................................................#....#.......
  ..................................................................................####........
`);



// Countdown timer starts at (seconds)
const COUNTDOWN_TIMER = 13;

// Track the aliens
const INVADER_WAVES = 4; // 4 rows
const INVADER_ALIENS = 8 // 8 aliens in every row

// Create an array that will have as many elements as many invaders
// whe are going to have. Each element is a number, that signifies
// whether that invader is alive (1) or dead (0)
let invaders = new Array(INVADER_WAVES * INVADER_ALIENS);

// This variable will keep track of the total number of aliens still
// alive. When this variable reaches 0, we have won as we managed to
// stop the alien invasion!
let totalInvaders;

// The spacing of invaders on-screen (required to support multiple
// screen sizes of various game devices)
// Distance between space invaders
let invaderDistance;



// Track the defender
let turretX;
let rocketX, rocketY;


// Track game state
let gameOver;



// Initialize game
game.setup(function() {
  // Place defender in the middle of the playing field
  turretX = game.width/2;

  // No rockets in flight
  rocketX = 0;
  rocketY = 0;

  // All aliens are alive and happily invading!
  invaders.fill(1);
  totalInvaders = invaders.length;

  // Align the spacing of the space invaders to the current screen
  invaderDistance = Math.floor((game.width - INVADER_ALIENS*gfxInvader.width)/INVADER_ALIENS);
  if (invaderDistance > 4) invaderDistance = 4;

  // Game is just about to start
  gameOver = false;

  // Reset all animations
  defender_win_animation_start = 0;
  game_timer_animation_start = 0
});



// Main game loop
let intro = true;
let introAfter = 0; // only needed until animations/.after() is implemented
game.loop(function() {

  // Clear display, redraw background text
  game.clear();

  // Start the game with an intro splash-screen
  // Note: because `frameCount` is incremented at the begining of every
  // loop() iteration (and starts out as 0) `intro_screen` cannot be assigned
  // zero again (leaving the player stuck on the intro screen indefinitely)
  if (introAfter == 0) introAfter = game.frameCount;
  if (intro) {
    if (game.frameCount - introAfter < 3*game.frameRate) {
      // Draw intro screen
      game.drawImage(gfxIntro,
        // Center the intro screen in the middle of the screen
        // (both horizontally & vertically)
        // See Concepts - Centering things
        game.width/2-gfxIntro.width/2, game.height/2-gfxIntro.height/2
      );
    } else {
	    intro = false;
      game_timer_animation_start = game.frameCount;
    }
    return;
  }


  // Update turret projectile
  // No rocket on-screen
  if (rocketY < 3) {
	/// Fire new rocket
    if (totalInvaders > 0 && game.buttonPressed('space')) {
      rocketY = game.height - 3;
      rocketX = turretX;
    }
  }
  // If rocket is still visible, move it towards the top of the screen
  if (rocketY >= 3) {
    rocketY = rocketY -3;
  }


  // Draw the game
  if (totalInvaders > 0 && !gameOver) {
    // Handle keypresses
    if ( game.buttonPressed('left') ) {
      turretX = turretX-3;
    }

    if ( game.buttonPressed('right') ) {
      turretX = turretX+3;
    }


    // Enforce screen boundaries
    if ( turretX < gfxDefender.width/2 ) {
      turretX = gfxDefender.width/2;
    }

    if ( turretX >= game.width-gfxDefender.width/2) {
      turretX = game.width-gfxDefender.width/2 - 1;
    }

    playgame();
  } else {
    if (gameOver) {
      defeat();
    } else {
	  victory();
    }
  }

});

let defeat_after = 0;
function defeat() {
  game.drawImage(gfxInvader[game.frameCount/15&1], game.width/2-gfxInvader.width/2, game.height/2-gfxInvader.height*2);

  game.fillStyle = "white";
  game.centerText(" OH NO!", game.width/2, game.height/2);

  // Wait 3s then show a message to restart
  // TODO: game.after('3s', _ => { ... }) or similar
  if (defeat_after === 0) defeat_after = game.frameCount;
  if (defeat_after>0 && game.frameCount-defeat_after>3*game.frameRate) {
    game.fillStyle = "white";
    game.centerText("press [B] to retry", game.width/2, game.height/4*3);

    if (game.buttonPressed('enter')) {
      defeat_after = 0;
      game.reset();
    }
  }
}

let victory_after = 0;
function victory() {
  if (!defender_win_animation_start) defender_win_animation_start = game.frameCount;
  if (defender_win_animation_remaining() > 0) {
    let turretY = defender_win_animation()
    game.drawImage(gfxDefender , turretX-5, turretY);
  }

  game.fillStyle = "white";
  game.centerText(" HUMANITY PREVAILS!", game.width/2, game.height/2);
  // same as: game.drawText(game.width/2 -game.measureText(`…`).width/2, game.height/2 -game.measureText(`…`).height/2, `…`);
  // game.measureText(`Humanity prevails!`).width ~> `…`.length*5

  game.drawImage(gfxInvader[2], game.width/2+40, game.height/2-6);

  if (victory_after == 0) victory_after = game.frameCount;
  if (victory_after > 0 && (game.frameCount - victory_after) > 2*game.frameRate) {
	const fall = (game.frameCount - victory_after - 2*game.frameRate)*2 + game.height/2+5;

    if (fall < game.height) {
	    game.drawImage(gfxInvader[2], game.width/2-55, fall);
    } else {
      game.fillStyle = "white";
      game.centerText("[B] to play again", game.width/2, game.height/4*3);

      if (game.buttonPressed('enter')) {
        victory_after = 0;
        game.reset();
      }
    }
  } else {
	game.drawImage(gfxInvader[2], game.width/2-55, game.height/2+5);
  }

}




function playgame() {
  game.clear();


  // Check game timer
  let invasion = game_timer_animation();


  // Invader animations
  let invaderX = invader_animation();

  // Draw invaders
  let startX = (game.width - (INVADER_ALIENS*(gfxInvader.width+invaderDistance)-invaderDistance))/2;

  let y = 0;
  while (y < INVADER_WAVES) {

    let x = 0;
    while (x < INVADER_ALIENS) {


      // Don't draw destroyed invaders
      if (invaders[x+INVADER_ALIENS*y]) {
        let dY = invasion + y*(gfxInvader.height+1)

        // The aliens have descended on Earth, all is lost!
        if (dY+gfxInvader.height >= game.height-gfxDefender.height) {
          gameOver = true;
          return false;
        }

        // Move different rows of invaders differently
        if (y % 2) {
          game.drawImage(gfxInvader[invaderX>>1&1], startX + (invaderX-3) + x*(gfxInvader.width+invaderDistance), dY);

          // rocket collision check
          if (rocketY >=3 && game.detectCollision(gfxInvader[invaderX>>1&1], startX + (invaderX-3) + x*(gfxInvader.width+invaderDistance), dY, gfxRocket, rocketX, rocketY)) {
            invaders[x+INVADER_ALIENS*y] = 0;
            totalInvaders--;
            rocketY = 0;
          }

        } else {
          game.drawImage(gfxInvader2, startX - (invaderX-3) + x*(gfxInvader.width+invaderDistance), dY);

          if (rocketY >=3 && game.detectCollision(gfxInvader2, startX - (invaderX-3) + x*(gfxInvader.width+invaderDistance), dY, gfxRocket, rocketX, rocketY)) {
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
  game.drawImage(gfxDefender, turretX-gfxDefender.width/2,game.height-gfxDefender.height);


  // Draw rocket
  if (rocketY >= 3) {
    game.drawImage(gfxRocket, rocketX,rocketY);
  }


  // Draw informational UI

  // Draw a text shadow for better visibility
  game.clearRect(game.width/2-7,0, 13,8)

  // Game timer
  game.fillStyle = "white";
  game.centerText(`${Math.floor((game_timer_animation_remaining()/60))}`, game.width/2, 4);
}





// ANIMATIONS
// TODO: these are/should be generated by the runtime or the compiler

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
var defender_win_animation_start = 0
function defender_win_animation() {
  const t = Math.min(game.frameCount-defender_win_animation_start, defender_win_animation_duration)
  // MIN(currentframe-startframe, duration) - capped at "duration"

  // first stop
  const x = ((easeCubicIn(0, t, 10*(game.height-gfxDefender.height), -10*(game.height-gfxDefender.height), defender_win_animation_duration)+5)/10)|0
  //rounded easeCubicIn(null, t, game.height-defender.height, -(game.height-defender.height), duration)

  return x
}
function defender_win_animation_remaining() {
  return Math.max(60 - (game.frameCount-defender_win_animation_start), 0)
}

/*
animate([
  { uint: 0 }, // offset: 0
  { uint: 0, game.frameRate*1 }, // x seconds in still zero (leeway)
  { uint: game.height-8-invader.height+1, game.frameRate*29 }
], {
  duration: 1000,
  id: 'game_timer_animation',
  easing: 'cubic-in', //same as "cubic-bezier(0.550, 0.055, 0.675, 0.190)"
  iterations: 1
})
*/
const game_timer_animation_duration = game.frameRate*1 +game.frameRate*COUNTDOWN_TIMER
var game_timer_animation_start = 0
function game_timer_animation() {
  const t = Math.min(game.frameCount-game_timer_animation_start, game_timer_animation_duration)
  // MIN(currentframe-startframe, duration) - capped at "duration"
  const duration1 = game.frameRate*1, duration2 = game.frameRate*COUNTDOWN_TIMER
  let x

  // first stop
  if (t < duration1) {
    x = ((easeCubicIn(0, t, 10*0, 10*0, duration1)+5)/10)|0
    //rounded easeCubicIn(null, t, 0, 0, duration)
  } else if (t <= duration1+duration2) { // TODO: last stop, not needed
    x = ((easeCubicIn(0, t-duration1, 10*0, 10*(game.height-gfxDefender.height-gfxInvader.height+3), duration2)+5)/10)|0
    //rounded easeCubicIn(null, t-duration1, 0, (game.height-8-gfxInvader.height), duration2)//|0
  }

  return x
}
function game_timer_animation_remaining() {
  return Math.max(game_timer_animation_duration - (game.frameCount-game_timer_animation_start), 0)
}


// t: current time, b: beginning value, c: change in value, d: duration
function easeCubicIn(x, t, b, c, d) {
  return c*(t/=d)*t*t + b;
  // TODO: arduino-friendliness
}
