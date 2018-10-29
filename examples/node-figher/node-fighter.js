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

const MAX_ENEMIES = 3;

// Game variables
let shootTimer = 10;
let xSpaceship = 0;
let ySpaceship = 0;

// Current enemies
let spriteEnemies = new Array(3);
let xEnemies = new Array(3);
let yEnemies = new Array(3);

// BG
let spriteStars = [];
let xStars = [];
let yStars = [];


// List of possible enemy sprites
let possibleEnemies = [gfxEnemy1,gfxEnemy2,gfxEnemy3];

// Ingame rockets
let xRockets = [];
let yRockets = [];
let spriteRockets = [];

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
    xSpaceship = 10;
    ySpaceship = 32;

    // Pushing first wave  of enemies (3 enemies at the same time top)
    spriteEnemies[0]=possibleEnemies[Math.floor(Math.random()*3)];
    xEnemies[0]=(Math.floor(Math.random()*game.width+ game.width/2));
    yEnemies[0]=(Math.floor(Math.random()*game.height));

    spriteEnemies[1]=(possibleEnemies[Math.floor(Math.random()*3)]);
    xEnemies[1]=(Math.floor(Math.random()*game.width+ game.width/2));
    yEnemies[1]=(Math.floor(Math.random()*game.height));

    spriteEnemies[2]=(possibleEnemies[Math.floor(Math.random()*3)]);
    xEnemies[2]=(Math.floor(Math.random()*game.width+ game.width/2));
    yEnemies[2]=(Math.floor(Math.random()*game.height));

    // Starting game state
    playing = false;
    inIntro = true;
    inScoreScreen = false;
    introTimeout = 50;
    scoreTimeout = 50;
});

function generateStars(amount){
    for(let i =0; i<amount; i++){
        spriteStars.push(gfxStar);
        xStars.push(Math.floor(Math.random()*game.width));
        yStars.push(Math.random()*game.height);
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
        game.drawImage(gfxJsShip, xSpaceship, ySpaceship);

        // if the spaceship is inside the canvas height viewport handle up and down movements
        if(ySpaceship > 0 && ySpaceship < game.height){
            if ( game.buttonPressed('up')) {
                ySpaceship -= 1;
                if(ySpaceship<= 0)
                    ySpaceship = 1;
            }else if( game.buttonPressed('down') ){
                ySpaceship += 1;
                if(ySpaceship>= game.height)
                    ySpaceship = game.height-1;
            }
        }

        if(game.buttonPressed('space') && shootTimer <=0 ){
            shoot();
            shootTimer= 30;
        }

        //check if spaceship crashed
        spriteEnemies.forEach((enemySprite,idx) => {

            let crash = game.detectCollision(gfxJsShip, xSpaceship, ySpaceship,enemySprite, xEnemies[idx], yEnemies[idx], true);
            if(crash){
                spriteEnemies.splice(idx,1);
                xEnemies.splice(idx,1);
                yEnemies.splice(idx,1);
                gameOver();
            }

            spriteRockets.forEach((rocketSprite, rckIdx)=>{

                let isDead = game.detectCollision(rocketSprite, xRockets[rckIdx], yRockets[rckIdx], enemySprite, xEnemies[idx], yEnemies[idx], true);
                console.log(isDead);
                if(isDead){
                    spriteEnemies.splice(idx,1);
                    xEnemies.splice(idx,1);
                    yEnemies.splice(idx,1);

                    spriteEnemies.push(possibleEnemies[Math.floor(Math.random()*3)]);
                    xEnemies.push(game.width);
                    yEnemies.push(Math.floor(Math.random()*game.height));    

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
    spriteRockets.push(gfxRocket);
    xRockets.push(xSpaceship+14);
    yRockets.push(ySpaceship+4);
}

// Handle game over
function gameOver(){
    game.clear();
    spriteEnemies = [];
    xEnemies = [];
    yEnemies = [];

    spriteRockets =[];
    xRockets =[];
    yRockets =[];

    spriteStars =[];
    xStars =[];
    yStars =[];

    playing = false;
    inScoreScreen = true;
}

// Update enemies positions
function updateEnemies(){
    spriteEnemies
        .forEach((enemySprite,index)=>{
            if(xEnemies[index]<=0)
            {
                xEnemies[index] = game.width;
                spriteEnemies.splice(index,1);
                xEnemies.splice(index,1);
                yEnemies.splice(index,1);

                spriteEnemies.push(possibleEnemies[Math.floor(Math.random()*3)]);
                xEnemies.push(game.width);
                yEnemies.push(Math.floor(Math.random()*game.height));    

            }
            xEnemies[index]-=1;
            game.drawImage(enemySprite,xEnemies[index], yEnemies[index]);
        });
}

// Update enemies positions
function updateStars(){
    spriteStars
        .forEach((starSprite,index)=>{
            if(xStars[index]<=0)
            {
                xStars[index] = game.width;
                spriteStars.splice(index,1);
                xStars.splice(index,1);
                yStars.splice(index,1);

                spriteStars.push(gfxStar);
                xStars.push(game.width);
                yStars.push(Math.random()*game.height);
            }
            if(starsMovementTimer<=0){
                xStars[index]-=1
            }
            game.drawImage(starSprite,xStars[index],yStars[index]);
        });
    if(starsMovementTimer<=0){
        starsMovementTimer=10;
    };
}


// Update rockets positions
function updateRockets(){
    spriteRockets
        .forEach((rocketSprite,index)=>{
            if(xRockets[index]>=game.width)
            {
                spriteRockets.splice(index,1);
                xRockets.splice(index,1);
                yRockets.splice(index,1);
            }
            xRockets[index]+=1;
            game.drawImage(rocketSprite,xRockets[index],yRockets[index]);
        });
}