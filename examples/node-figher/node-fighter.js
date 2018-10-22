/*global MicroCanvas */

/**

 Made with ♥ @ NodeConfAr 2018 Workshop
 ======================================

 Art @NickoArias and @maxisalazar
 Programming @Webox @aderenzis and @nahue086
 **/

'use strict';

const game = new MicroCanvas();

/**
 Amazing Sprites Section!
 ========================
 **/

const gfxJsShip = game.loadSprite(`
! node_invaders 16x9@#424242,#8BC34A,#F44336,#c2c3c7
...###22222.....
.3####222222....
...###2222222...
..3#####222222..
33#######2222224
..3#####222222..
...###2222222...
.3####222222....
...###22222.....
`);


// Graphics
const gfxEnemy1 = game.loadSprite(`
! sprite 13x9@#ffffff,#254fd6,#E024C6
..22.........
.2222........
22..22......
22.....3...3.
22....333.333
22.....3...3.
22..22.......
.2222........
..22.........
`);

// Graphics
const gfxEnemy2 = game.loadSprite(`
! sprite 14x9@#7bbfff,#254fd6
..............
.....#........
.##..#.....##.
#..#.###..#..#
#..#.#..#.#..#
###..#..#.###.
#....#..#.#...
#.........#...
..............
`);

const gfxEnemy3= game.loadSprite(`
! sprite 9x10@#ffffff,#e76f00,#5382a1,#000000
...2.....
..2..2...
.2..2....
..2..2...
.....4...
333333.3.
........3
.33333.3.
.....4...
..333....
`);

const gfxEnemy4= game.loadSprite(`
! ruby 13x9@#ffffff,#e76f00,#5382a1,#000000
...2.........
..2..2.......
.2..2........
..2..2.......
.....4.......
333333.3.....
........3....
.33333.3.....
.....4.......
`);


const gfxRocket = game.loadSprite(`
! node_invaders 5x1@#424242,#8BC34A,#F44336
33#######22
`);

const gfxStar = game.loadSprite(`
! node_invaders 1x1@#616161,#8BC34A,#F44336
#
`);


const gfxIntro = game.loadSprite(`
 ! intro 96x27@#c2c3c7,#88c34a,#424242,#f44336
.....................................................#..........................................
.....................................................##.........................................
.....................................................###........................................
.....................................................####.......................................
.....................................................####.......................................
.....................................................####.......................................
.........................###...........#.............####.......###.............................
........................#####..........2.............####......#####............................
.......................#######........222........########.....#######...........................
......................#########......22222......#########....#########..........................
.....................#####.#####....2222222....##########...#####.#####.........................
....................#####...#####..222222222..#####.#####..#####...#####........................
....................####.....####..222222222..####...####..####......###........................
....................####.....####..222232222..###.....###..####..22...##........................
....................####.....####..222333222..###.....###..####..22....#........................
....................####.....####..222333222..####...####..#####................................
....................###.......###..333333333..#####.#####...#####...............................
....................##.........##..333333333...##########....######.............................
....................#...........#..33.333.33....########......######............................
....................................3.434.3......######........#####............................
....................................4..4..4.....................................................
................................................................................................
..............................................2222.222..222.2..2.22222.2222.222..2..............
..............................................2.....2..2....2..2...2...2....2..2.2..............
..............................................222...2..2.22.2222...2...222..222..2..............
..............................................2.....2..2..2.2..2...2...2....2.2.................
..............................................2....222..22..2..2...2...2222.2..2.2..............
`);


// Game variables
let shootTimer = 10;
const spaceship = {
    x:0,
    y:0
}
// Current enemies
let enemies= [];

// BG
let stars =[];


// List of possible enemy sprites
let possibleEnemies = [gfxEnemy1,gfxEnemy2,gfxEnemy3];

// Ingame rockets
let rockets = [];

// User Score
let score = 0;

// Game status handlers
let playing = false;
let inIntro = true;
let inScoreScreen = false;
let introTimeout;
let scoreTimeout;
let xOffset = 10;
let starsMovementTimer =0;


// Setting up the game..
game.setup(() => {

    generateStars(20);
    score = 0;

    //setup the spaceship initial position in the canvas
    spaceship.x = 10;
    spaceship.y = 32;

    // Pushing first wave  of enemies (3 enemies at the same time top)
    enemies.push({
        sprite:possibleEnemies[Math.floor(Math.random()*3)],
        x:Math.floor(Math.random()*game.width+ game.width/2),
        y:Math.floor(Math.random()*game.height)
    });
    enemies.push({
        sprite:possibleEnemies[Math.floor(Math.random()*3)],
        x:Math.floor(Math.random()*game.width+ game.width/2),
        y:Math.floor(Math.random()*game.height)
    });
    enemies.push({
        sprite:possibleEnemies[Math.floor(Math.random()*3)],
        x:Math.floor(Math.random()*game.width+ game.width/2),
        y:Math.floor(Math.random()*game.height)
    });
    // Starting game state
    playing = false;
    inIntro = true;
    inScoreScreen = false;
    introTimeout = 50;
    scoreTimeout = 50;
});

function generateStars(amount){
    for(let i =0; i<amount; i++){
        let newStar = {
            sprite:gfxStar,
            x:Math.floor(Math.random()*game.width),
            y:Math.floor(Math.random()*game.height)
        }
        stars.push(newStar);
    }
}

// Main Loop!
game.loop(() => {
    game.clear();
    // Drawing stars behind everything
    updateStars();

    // Checking game state..
    if(introTimeout>0)introTimeout --;
    if(inIntro){
        game.drawImage(gfxIntro, 0,10);
        game.drawText(`[A] to fight!`, 10, Math.floor(game.height/2) +20);
        starsMovementTimer-=2;

        if( game.buttonPressed('A') && introTimeout <= 0){
            inIntro = false;
            playing = true;
        }
    }
    else if(inScoreScreen){
        if(scoreTimeout>0) scoreTimeout --;
        game.drawText(`Final Score ${score}`, xOffset, Math.floor(game.height/2));
        game.drawText(`[A] to restart!`, 10, Math.floor(game.height/2) + 20);
        if( game.buttonPressed('A') && scoreTimeout <= 0){
            game.reset();
        }
    }
    else if(playing){
        shootTimer-= 2;
        game.drawImage(gfxJsShip, spaceship.x, spaceship.y);

        // if the spaceship is inside the canvas height viewport handle up and down movements
        if(spaceship.y > 0 && spaceship.y < game.height){
            if ( game.buttonPressed('up')) {
                spaceship.y -= 1;
                if(spaceship.y<= 0)
                    spaceship.y = 1;
            }else if( game.buttonPressed('down') ){
                spaceship.y += 1;
                if(spaceship.y>= game.height)
                    spaceship.y = game.height-1;
            }
        }

        if(game.buttonPressed('space') && shootTimer <=0 ){
            shoot();
            shootTimer= 30;
        }

        //check if spaceship crashed
        enemies.forEach((enemy,idx) => {

            let crash = game.detectCollision(gfxJsShip, spaceship.x, spaceship.y, enemy.sprite, enemy.x, enemy.y, true);
            if(crash){
                const idx = enemies.indexOf(enemy);
                enemies.splice(idx,1);
                gameOver();
            }

            rockets.forEach((rck)=>{
                console.log(`Checking rocket: ${rck}`);

                let isDead = game.detectCollision(rck.sprite, rck.x, rck.y, enemy.sprite, enemy.x, enemy.y, true);
                console.log(isDead);
                if(isDead){
                    const idx = enemies.indexOf(enemy);
                    enemies.splice(idx,1);
                    enemies.push({
                        sprite:possibleEnemies[Math.floor(Math.random()*3)],
                        x:game.width,
                        y:Math.floor(Math.random()*game.height)
                    });
                    score++;
                }
            })

        });
        starsMovementTimer--;
        updateEnemies();
        updateRockets();
        game.drawText(`Score ${score}`, 0, 0);


    }
});

// On spacebar press
function shoot(){
    console.log(game.height);
    rockets.push({
        x: spaceship.x+14,
        y: spaceship.y+4,
        sprite: gfxRocket
    });

}

// Handle game over
function gameOver(){
    game.clear();
    enemies = [];
    rockets =[];
    stars =[];

    playing = false;
    inScoreScreen = true;
}

// Update enemies positions
function updateEnemies(){
    enemies
        .forEach((enemy,index)=>{
            if(enemy.x<=0)
            {
                enemy.x = game.width;
                enemies.splice(index,1);
                enemies.push({
                    sprite:possibleEnemies[Math.floor(Math.random()*3)],
                    x:game.width,
                    y:Math.floor(Math.random()*game.height)
                });
            }
            enemy.x-=1;
            game.drawImage(enemy.sprite,enemy.x,enemy.y);
        });
}

// Update enemies positions
function updateStars(){
    stars
        .forEach((star,index)=>{
            if(star.x<=0)
            {
                star.x = game.width;
                stars.splice(index,1);
                stars.push({
                    sprite:gfxStar,
                    x:game.width,
                    y:Math.floor(Math.random()*game.height)
                });
            }
            if(starsMovementTimer<=0){
                star.x-=1
            }
            game.drawImage(star.sprite,star.x,star.y);
        });
    if(starsMovementTimer<=0){
        starsMovementTimer=10;
    };
}


// Update rockets positions
function updateRockets(){
    rockets
        .forEach((rocket,index)=>{
            if(rocket.x>=game.width)
            {
                rockets.splice(index,1);
            }
            rocket.x+=1;
            game.drawImage(rocket.sprite,rocket.x,rocket.y);
        });
}