"use strict";

let game = new MicroCanvas();


// Graphics
let gfxInvader, gfxDefender;
let gfxInvader2;
let gfxRocket;
let gfxBomb;
let gfxIntro;


// Track the defender
let rocketX, rocketY;
let turretX;

// Track the aliens
const INVADER_WAVES = 4; // 4 rows
const INVADER_ALIENS = 8 // 8 aliens in every row

let invaders = new Array(INVADER_WAVES * INVADER_ALIENS);
let totalInvaders;


// Track game state
let gameOver



// Initialize game
game.setup(function(game) {
  // Set up graphics
  gfxInvader = game.loadSprite(`! invader 9x8x3
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

  gfxIntro = game.loadSprite(`! singaporejs 64x64
................................................................
................................................................
............................#########...........................
..........................#############.........................
.........................#################......................
.......................############......##.....................
..................##############...######.......................
.................#############..############....................
................#############..###############..................
...................................############.................
...........######...###########.####...##########...............
.........######################..######...########..............
........#######################..#########.#####1###.............
..........#####################...#########.########............
........######################..##...#######..#######...........
.......###################.....#####..########.######...........
.......####################.###.######.#######..######..........
........###################.###..######.#######..######.........
........###....############.####.######..#######.######.........
................###########.####.#######.#######..#####.........
................###########.####.########.#######.######........
........###....###########.#####.########.#######.######........
........##################.#####.#########.#######.#####........
........#################.######.#########.#######.######.......
........###############..#######.#########.#######.######.......
.........###............########.#########.#######..#####.......
.........#.............#########.#########.#######..#####.......
.....................##########.##########.########.#####.......
...................############.#########.#########.#####.......
..................############..#########.#########.####........
.................#############.##########.########..####........
...............##############.##########.#########..###.........
..............##############..#########..#########.####.........
.............##############.##########..##########.###..........
............##############.###########.###########.##...........
...........###############.##########.###########.###...........
...........##############.##########.############.##............
..........##############.##########.############..#.............
..........#############.##########..############.#..............
..........############.###########.#####.......#................
.........#############.##########.######.#####......####........
.........############.###########.######.#####....########......
.........############.##########.#######.#####...##########.....
.........###########.###########.#######.#####...###########....
.........###########.###########.######..#####..#####...###.....
.........###########.###########.####....#####..####....##......
..........##########.###########.##......#####..#####...........
..........##########.###########.........#####...######.........
..........##########.##########..........#####...########.......
..........##########.#########...........#####....#########.....
...........#########.#######.............#####......########....
...........#########.######..............#####.......#######....
............#########.####...............#####..........#####...
.............########.###................#####...........####...
..............########.#............#....#####...##......####...
..............########.............###...####..#####....#####...
...............########...........###########...############....
................#######...........##########.....###########....
.................######.............#######.......#########.....
..................####................###...........#####.......
....................##..........................................
.....................#..........................................
................................................................
................................................................
`);

  // Place defender in the middle of the playing field
  turretX = game.width/2;

  // No rocket
  rocketX = 0;
  rocketY = 0;

  // All aliens are alive and happily invading!
  invaders.fill(1);
  totalInvaders = invaders.length;

  // Game is just about to start
  gameOver = false;

  // Reset all animations
  defender_win_animation_start = 0;
  game_timer_animation_start = 0
});



// Main game loop
var intro = true;
var intro_after = 0;
game.loop(function() {

  // Clear display, redraw background text
  game.clear();

  if (intro_after == 0) intro_after = game.frameCount+1;
  if (intro) {
    if (game.frameCount - intro_after < 2*game.frameRate) {
      game.drawImage(gfxIntro, game.width/2-64/2, game.height/2-64/2);
    } else {
	  intro = false;
    }
    return;
  }


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
  if (totalInvaders > 0 && !gameOver) {
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
    if (gameOver) {
      defeat();
    } else {
	  victory();
    }
  }

});

let defeat_after = 0
function defeat() {
  game.drawImage(gfxInvader[game.frameCount/15&1], game.width/2-gfxInvader.width/2, game.height/2-gfxInvader.height*2);

  game.fillStyle = "white";
  game.centerText(game.width/2, game.height/2, " OH NO!");

  // Wait 3s then show a message to restart
  // TODO: game.after('3s', _ => { ... }) or similar
  if (defeat_after === 0) defeat_after = game.frameCount;
  if (defeat_after>0 && game.frameCount-defeat_after>3*game.frameRate) {
    game.fillStyle = "white";
    game.centerText(game.width/2, game.height/4*3, "press [A] to retry");

    if (game.buttonPressed('space')) {
      defeat_after = 0;
      game.reset();
    }
  }
}

let victory_after = 0
function victory() {
  if (!defender_win_animation_start) defender_win_animation_start = game.frameCount;
  if (defender_win_animation_remaining() > 0) {
    let turretY = defender_win_animation()
    game.drawImage(gfxDefender , turretX-5, turretY);
  }

  game.fillStyle = "white";
  game.centerText(game.width/2, game.height/2, " HUMANITY PREVAILS!");
  // same as: game.drawText(game.width/2 -game.measureText(`…`).width/2, game.height/2 -game.measureText(`…`).height/2, `…`);
  // game.measureText(`Humanity prevails!`).width ~> `…`.length*5

  game.drawImage(gfxInvader[2], game.width/2+38, game.height/2-6 -4);

  if (victory_after == 0) victory_after = game.frameCount;
  if (victory_after > 0 && (game.frameCount - victory_after) > 2*game.frameRate) {
	const fall = (game.frameCount - victory_after - 2*game.frameRate)*2 + game.height/2+1;

    if (fall < game.height) {
	    game.drawImage(gfxInvader[2], game.width/2-55, fall);
    } else {
      game.fillStyle = "white";
      game.centerText(game.width/2, game.height/4*3, "[A] to play again");

      if (game.buttonPressed('space')) {
        victory_after = 0;
        game.reset();
      }
    }
  } else {
	game.drawImage(gfxInvader[2], game.width/2-55, game.height/2+1);
  }

}




function playgame() {
  game.clear()


  // Check game timer
  let invasion = game_timer_animation()


  // Invader animations
  let invaderX = invader_animation()


  // Draw invaders
  let startX = (game.width - (INVADER_ALIENS*(gfxInvader.width+4)-4))/2;

  let y = 0;
  while (y < INVADER_WAVES) {

    let x = 0;
    while (x < INVADER_ALIENS) {


      // Don't draw destroyed invaders
      if (invaders[x+INVADER_ALIENS*y]) {
        let dY = invasion + y*(gfxInvader.height+1)

        // The aliens have descended on Earth, all is lost!
        if (dY+gfxInvader.height >= game.height-gfxDefender.height) {
          gameOver = true
          return
        }

        // Move different rows of invaders differently
        if (y % 2) {
          game.drawImage(gfxInvader[invaderX>>1&1], startX + (invaderX-3) + x*(gfxInvader.width+4), dY);

          // rocket collision check
          if (rocketY >=3 && game.detectCollision(gfxInvader[invaderX>>1&1], startX + (invaderX-3) + x*(gfxInvader.width+4), dY, gfxRocket, rocketX, rocketY)) {
            invaders[x+INVADER_ALIENS*y] = 0;
            totalInvaders--;
            rocketY = 0;
          }

        } else {
          game.drawImage(gfxInvader2, startX - (invaderX-3) + x*(gfxInvader.width+4), dY);

          if (rocketY >=3 && game.detectCollision(gfxInvader2, startX - (invaderX-3) + x*(gfxInvader.width+4), dY, gfxRocket, rocketX, rocketY)) {
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
  game.drawImage(gfxDefender , turretX-5, game.height-gfxDefender.height);


  // Draw rocket
  if (rocketY >= 3) {
    game.fillRect(rocketX, rocketY, 1,2);
  }


  // Draw informational UI

  // Draw a text shadow for better visibility
  game.clearRect(game.width/2-7,0, 13,9)

  // Game timer
  game.fillStyle = "white";
  game.centerText(game.width/2, 5, `${(game_timer_animation_remaining()/60)|0}`);
}


console.log("MicroCanvas initialized: Code Invaders (Singapore JS Edition)");



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
  const x = ((easeCubicIn(null, t, 10*(game.height-gfxDefender.height), -10*(game.height-gfxDefender.height), defender_win_animation_duration)+5)/10)|0
  //rounded easeCubicIn(null, t, game.height-defender.height, -(game.height-defender.height), duration)

  return x
}
function defender_win_animation_remaining() {
  return Math.max(60 - (game.frameCount-defender_win_animation_start))
}

// t: current time, b: beginning value, c: change in value, d: duration
function easeCubicIn(x, t, b, c, d) {
  return c*(t/=d)*t*t + b;
  // TODO: arduino-friendliness
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
const game_timer_animation_duration = game.frameRate*1 +game.frameRate*24
var game_timer_animation_start = 0
function game_timer_animation() {
  const t = Math.min(game.frameCount-game_timer_animation_start, game_timer_animation_duration)
  // MIN(currentframe-startframe, duration) - capped at "duration"
  const duration1 = game.frameRate*1, duration2 = game.frameRate*24
  let x

  // first stop
  if (t < duration1) {
    x = ((easeCubicIn(null, t, 10*0, 10*0, duration1)+5)/10)|0
    //rounded easeCubicIn(null, t, 0, 0, duration)
  } else if (t <= duration1+duration2) { // TODO: last stop, not needed
    x = ((easeCubicIn(null, t-duration1, 10*0, 10*(game.height-gfxDefender.height-gfxInvader.height+1), duration2)+5)/10)|0
    //rounded easeCubicIn(null, t-duration1, 0, (game.height-8-gfxInvader.height), duration2)//|0
  }

  return x
}
function game_timer_animation_remaining() {
  return Math.max(game_timer_animation_duration - (game.frameCount-game_timer_animation_start), 0)
}
