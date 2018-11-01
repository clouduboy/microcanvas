/*global MicroCanvas */

/**

 Made with ♥ @ NodeConfAr 2018 Workshop
 ======================================

 Art @NickoArias and @maxisalazar
 Programming @Webox @aderenzis and @nahue086
 **/

'use strict';

let game = new MicroCanvas();

/**
 Amazing Sprites Section!
 ========================
 **/

let gfxJsShip;
let gfxEnemy1;
let gfxEnemy2;
let gfxEnemy3;
let gfxRocket;
let gfxStar;
let gfxIntro;

const MAX_ENEMIES = 3;
const MAX_STARS = 20;
const MAX_ROCKETS= 10;

// Game variables
let shootTimer = 10;
let xSpaceship = 0;
let ySpaceship = 0;

// Current enemies
let spriteEnemies = new Array(MAX_ENEMIES);
let xEnemies = new Array(MAX_ENEMIES);
let yEnemies = new Array(MAX_ENEMIES);

// BG
let spriteStars = new Array(MAX_STARS);
let xStars = new Array(MAX_STARS);
let yStars = new Array(MAX_STARS);


// List of possible enemy sprites
let possibleEnemies = new Array(MAX_ENEMIES);

// Ingame rockets
let xRockets = new Array(MAX_ROCKETS);
let yRockets = new Array(MAX_ROCKETS);
let spriteRockets = new Array(MAX_ROCKETS);
let isAliveRocket = new Array(MAX_ROCKETS);
isAliveRocket.fill(0);

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
    gfxJsShip= game.loadGraphics(`
    ! node_invaders 16x9@#ffffff
    ...########.....
    .###########....
    ...##########...
    ..############..
    ###############4
    ..############..
    ...##########...
    .###########....
    ...########.....
    `);


    // Graphics
    gfxEnemy1 = game.loadGraphics(`
    ! sprite 13x9@#ffffff
    ..##.........
    .####........
    ##..##......
    ##.....#...#.
    ##....###.###
    ##.....#...#.
    ##..##.......
    .####........
    ..##.........
    `);

    // Graphics
    gfxEnemy2 = game.loadGraphics(`
    ! sprite 14x9@#ffffff
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

    gfxEnemy3= game.loadGraphics(`
    ! sprite 9x10@#ffffff
    ...#.....
    ..#..#...
    .#..#....
    ..#..#...
    .....#...
    ######.#.
    ........#
    .#####.#.
    .....#...
    ..###....
    `);



    gfxRocket = game.loadGraphics(`
    ! node_invaders 5x1@#ffffff
    33#######22
    `);

    gfxStar = game.loadGraphics(`
    ! node_invaders 1x1@#ffffff
    #
    `);


    gfxIntro = game.loadGraphics(`
    ! intro 96x27@#ffffff
    .....................................................#..........................................
    .....................................................##.........................................
    .....................................................###........................................
    .....................................................####.......................................
    .....................................................####.......................................
    .....................................................####.......................................
    .........................###...........#.............####.......###.............................
    ........................#####..........#.............####......#####............................
    .......................#######........###........########.....#######...........................
    ......................#########......#####......#########....#########..........................
    .....................#####.#####....#######....##########...#####.#####.........................
    ....................#####...#####..#########..#####.#####..#####...#####........................
    ....................####.....####..#########..####...####..####......###........................
    ....................####.....####..#########..###.....###..####..##...##........................
    ....................####.....####..#########..###.....###..####..##....#........................
    ....................####.....####..#########..####...####..#####................................
    ....................###.......###..#########..#####.#####...#####...............................
    ....................##.........##..#########...##########....######.............................
    ....................#...........#..##.###.##....########......######............................
    ....................................#.###.#......######........#####............................
    ....................................#..#..#.....................................................
    ................................................................................................
    ..............................................####.###..###.#..#.#####.####.###..#..............
    ..............................................#.....#..#....#..#...#...#....#..#.#..............
    ..............................................###...#..#.##.####...#...###..###..#..............
    ..............................................#.....#..#..#.#..#...#...#....#.#.................
    ..............................................#....###..##..#..#...#...####.#..#.#..............
    `);
    possibleEnemies[0] = 0;
    possibleEnemies[1] = 1;
    possibleEnemies[2] = 2;
    generateStars(MAX_STARS);
    score = 0;

    //setup the spaceship initial position in the canvas
    xSpaceship = 10;
    ySpaceship = 32;

    // Pushing first wave  of enemies (3 enemies at the same time top)
    spriteEnemies[0]=possibleEnemies[Math.floor(Math.random()%MAX_ENEMIES)];
    xEnemies[0]=(Math.floor(Math.random()%game.width+ game.width/2));
    yEnemies[0]=(Math.floor(Math.random()%game.height));

    spriteEnemies[1]=(possibleEnemies[Math.floor(Math.random()%MAX_ENEMIES)]);
    xEnemies[1]=(Math.floor(Math.random()%game.width+ game.width/2));
    yEnemies[1]=(Math.floor(Math.random()%game.height));

    spriteEnemies[2]=(possibleEnemies[Math.floor(Math.random()%MAX_ENEMIES)]);
    xEnemies[2]=(Math.floor(Math.random()%game.width+ game.width/2));
    yEnemies[2]=(Math.floor(Math.random()%game.height));

    // Starting game state
    playing = false;
    inIntro = true;
    inScoreScreen = false;
    introTimeout = 50;
    scoreTimeout = 50;
});

function generateStars(amount){
    for(let i =0; i<amount; i++){
        spriteStars[i] = (gfxStar);
        xStars[i] = (Math.floor(Math.random()%game.width));
        yStars[i] = (Math.random()%game.height);
    }
}

// Main Loop!
game.loop(() => {
    game.clear();
    // Drawing stars behind everything

    // Replaced Function UpdateStars()
    for(let index = 0; index< spriteStars.length; index ++)
    {
        if(xStars[index]<=0)
        {
            xStars[index] = game.width;
            yStars[index] = (Math.random()%game.height);
        }
        if(starsMovementTimer<=0){
            xStars[index]-=1
        }
        game.drawImage(gfxStar,xStars[index],yStars[index]);
    }
    if(starsMovementTimer<=0){
        starsMovementTimer=10;
    };

    // Checking game state..
    if(introTimeout>0)introTimeout --;
    if(inIntro){
        game.drawImage(gfxIntro, 0,10);
        game.drawText(`[A] to fight!`, 10, Math.floor(game.height/2) +20);
        starsMovementTimer-=2;

        if( game.buttonPressed('space') && introTimeout <= 0){
            inIntro = false;
            playing = true;
        }
    }
    else if(inScoreScreen){
        if(scoreTimeout>0) scoreTimeout --;
        game.drawText('Final Score:', xOffset, Math.floor(game.height/2));
        game.drawText(score, xOffset+ 80, Math.floor(game.height/2));
        game.drawText(`[A] to restart!`, 10, Math.floor(game.height/2) + 20);
        if( game.buttonPressed('space') && scoreTimeout <= 0){
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
        for(let idx = 0; idx< spriteEnemies.length; idx ++)
        {
            let crash = false;
            let enemySprite = spriteEnemies[idx];
            // This is 100% hacky, to catch a few frames where gfxJsShip is undefined for some reason
            if(gfxJsShip){
                if(enemySprite === 0)
                    crash = game.detectCollision(gfxJsShip, xSpaceship, ySpaceship,gfxEnemy1, xEnemies[idx], yEnemies[idx], true);
                else if(enemySprite === 1)
                    crash = game.detectCollision(gfxJsShip, xSpaceship, ySpaceship,gfxEnemy2, xEnemies[idx], yEnemies[idx], true);
                else if(enemySprite === 2)
                    crash = game.detectCollision(gfxJsShip, xSpaceship, ySpaceship,gfxEnemy3, xEnemies[idx], yEnemies[idx], true);
            }
            if(crash){gameOver();}

            for(let rckIdx = 0; rckIdx<spriteRockets.length; rckIdx++)
            {
                if(isAliveRocket[rckIdx]) {
                    let isDead = false;
                    if(enemySprite === 0)
                        isDead = game.detectCollision(gfxRocket, xRockets[rckIdx], yRockets[rckIdx], gfxEnemy1, xEnemies[idx], yEnemies[idx], true);
                    else if(enemySprite === 1)
                        isDead = game.detectCollision(gfxRocket, xRockets[rckIdx], yRockets[rckIdx], gfxEnemy2, xEnemies[idx], yEnemies[idx], true);
                    else if(enemySprite === 2)
                        isDead = game.detectCollision(gfxRocket, xRockets[rckIdx], yRockets[rckIdx], gfxEnemy3, xEnemies[idx], yEnemies[idx], true);
                    console.log(isDead);
                    if (isDead) {
                        xEnemies[idx] = game.width;
                        isAliveRocket[rckIdx] = 0;
                        spriteEnemies[idx] = (possibleEnemies[Math.floor(Math.random() % 3)]);
                        yEnemies[idx] = (Math.floor(Math.random() % game.height));
                        score++;
                    }
                }
            }

        }
        starsMovementTimer--;

        // Replaced Function UpdateEnemies()
        for(let index = 0; index< spriteEnemies.length; index ++)
        {
            let enemySprite = spriteEnemies[index];
            if(xEnemies[index]<=0)
            {
                xEnemies[index] = game.width;
                spriteEnemies[index] = (possibleEnemies[Math.floor(Math.random()%3)]);
                yEnemies[index]=(Math.floor(Math.random()%game.height));
            }
            xEnemies[index]-=1;
            if(enemySprite === 0)
                game.drawImage(gfxEnemy1,xEnemies[index], yEnemies[index]);
            else if(enemySprite === 1)
                game.drawImage(gfxEnemy2,xEnemies[index], yEnemies[index]);
            else if(enemySprite === 2)
                game.drawImage(gfxEnemy3,xEnemies[index], yEnemies[index]);
        }

        // Replaced Function UpdateRockets()
        for(let index = 0; index<spriteRockets.length; index++)
        {
            if(isAliveRocket[index]){
                if(xRockets[index]>=game.width)
                    isAliveRocket[index] = 0;
                else {
                    xRockets[index] += 1;
                    game.drawImage(gfxRocket, xRockets[index], yRockets[index]);
                }
            }
        }
        game.drawText('Score', 0, 0);
        game.drawText(score, 50, 0);
    }
});

// On spacebar press
function shoot(){
    let idx=0; // isAliveRocket.findIndex((isNAlv)=> isNAlv ==0 );
    while(isAliveRocket[idx] && idx< isAliveRocket.length) idx++;
    spriteRockets[idx] = (gfxRocket);
    xRockets[idx] = (xSpaceship+14);
    yRockets[idx] = (ySpaceship+4);
    isAliveRocket[idx] = 1;
}

// Handle game over
function gameOver(){
    game.clear();
    playing = false;
    inScoreScreen = true;
}
