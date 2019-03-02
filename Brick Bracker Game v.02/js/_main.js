'use strict';
/**
 * This game, "Brick Braker Game", is a derivative of "2D breakout game using pure JavaScript"
 * by wbamberg, jswisher, jolosan, cristianvnica, chrisdavidmills, Twoteka, Jeremie, end3r, fscholz, rabimba,
 * (each contributor's MDN page is referenced in the game's MDN page at the link below under "Source", at the bottom of that page)
 * used under CC-BY-SA 2.5. 
 * "Brick Braker Game" is licensed under CC-BY-SA 2.5 by Stefano Marcolini.
 * 
 * Title:           2D breakout game using pure JavaScript
 * Source:          https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
 * Contributors:    wbamberg, jswisher, jolosan, cristianvnica, chrisdavidmills, Twoteka, Jeremie, end3r, fscholz, rabimba
 *                  (each contributor's MDN page is referenced by the link above, at the bottom of that page)
 * Licensed under:  CC-BY-SA 2.5. (https://creativecommons.org/licenses/by/2.0/)
 * 
 * 
 * Title:           Brick Braker Game
 * Author:          Stefano Marcolini
 * year:            2018
 * Licensed under:  CC-BY-SA 2.5. (https://creativecommons.org/licenses/by/2.0/)
*/


/* JavaScript */

//  =====  //
//  TO-DO  //
//  =====  //

/*
 *  - SOUND (ROW => C, D#, G, B)
 *  - CONTROLLERS
 *  - ACCELERATION (PADDLE RED AREA: GRIP PHISYCS)
 *  - CACHE BRICKS IF STILL ALIVE AFTER LOSING 1 LIFE
 *  - MENU
 *  - SPLIT CODE INTO CLASSES
 */


//  =========   //
//  VARIABLES   //
//  =========   //

// container
var cont;

//  canvas
var canvas;// = document.getElementById("myCanvas");
var canWidth;
var canHeight;
var ctx;// = canvas.getContext("2d");

//  game state
var state;// = true;

//  score
var score;// = 0;
var bricksToBrake;// = 0;
var stepScore = 1;

//  lives
var lives;
const DELTA_SCORE = 144;
var deltaScore = DELTA_SCORE;

//  ball
var ballRadius;// = 10;
var x;// = canvas.width / 2;
var y;// = canvas.height - 30;
var dx;// = 1;
var dy;// = -1;
const MAX_SPEED_FACTOR = 3;
var ballSpeed;

//  paddle
var paddleHeight;// = 10;
var paddleWidth;// = 75;
var paddleX;// = (canvas.width - paddleWidth) / 2;
var border;
var offset;
var rightPressed;// = false;
var leftPressed;// = false;

//  brick
var brickRowCount;// = 4;
var brickColumnCount;// = 5;
var brickWidth;// = 75;
var brickHeight;// = 20;
var brickPaddingX;// = 10;
var brickPaddingY;// = 10;
var brickOffsetTop;// = 30;
var brickOffsetLeft;// = 30;

//  bricks array
var bricks;// = [];

//  keyboard event listners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//  mouse event listners
document.addEventListener("mousemove", mouseMoveHandler, false);

//  =========   //
//  FUNCTIONS   //
//  =========   //


function init(){
    cont = document.getElementById("myContainer");
    canvas = document.getElementById("myCanvas");
    canvas.width = cont.clientWidth;
    canvas.height = cont.clientHeight;
    canWidth = canvas.width;
    canHeight = canvas.height;
    ctx = canvas.getContext("2d");
    //  game
    state = true;
    score = 0;
    bricksToBrake = 0;
    lives = 3;
    //  ball
    ballRadius = Math.round(Math.sqrt(canWidth*canHeight*0.0003));
    var speed = Math.sqrt((Math.pow(canWidth, 2)+Math.pow(canHeight, 2)))*0.0021;
    ballSpeed = speed;
    dx = speed;//1;
    dy = -speed;//-1;
    //  paddle
    paddleHeight = Math.round(Math.sqrt(canWidth*canHeight*0.0007));
    paddleWidth = Math.round(Math.sqrt(canWidth*canHeight*0.034));
    paddleX = (canvas.width - paddleWidth) / 2;
    rightPressed = false;
    leftPressed = false;
    //  bricks
    brickRowCount = 4;
    brickColumnCount = 5;
    
    brickPaddingX = Math.round(canWidth*0.0618);
    brickPaddingY = Math.round(canWidth*0.055);

    brickWidth = Math.round(canWidth*0.12);
    brickHeight = Math.round(canHeight*0.05);

    brickOffsetTop = Math.round(canHeight*0.145);
    brickOffsetLeft = Math.round((canWidth-(brickWidth*brickColumnCount)-(brickPaddingX*(brickColumnCount - 1)))/2);

    bricks = [];
};

function keyDownHandler(e) {
    if (e.keyCode == 39){
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
};

function keyUpHandler(e) {
    if (e.keyCode == 39){
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
};

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
};

function setBallInitialPosition(){
    x = canvas.width / 2;
    y = canvas.height - Math.round(Math.sqrt(canWidth*canHeight*0.03));
};

function setBricksInitialStatus(){
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = {
                x: 0,
                y: 0,
                status: r === 0 ? 4 : r === 1 ? 3 : r === 2 ? 2 : 1, 
                points: r === 0 ? 8 : r === 1 ? 4 : r === 2 ? 2 : 1
            }
            bricksToBrake++;
        }
    }
};

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "ivory";
    ctx.fillText("Score: " + score, 8, 20);
};

function extraLives() {
    if (score / deltaScore >= 1) {
        deltaScore += DELTA_SCORE;
        ++lives;
    }
}

function drawLives() {
    extraLives();
    ctx.font = "16px Arial";
    ctx.fillStyle = "ivory";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
};

function drawTheEnd() {
    var txt = "GAME OVER";
    var len = txt.length;
    fontSize = 16;
    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = "chartreuse";
    ctx.fillText(txt, canWidth*0.5 - len*fontSize*0.5,  brickOffsetTop - fontSize);
};

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2*Math.PI);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
};

function drawPaddle() {
    var paddleY = canHeight - paddleHeight;
    //  border
    border = Math.round(paddleWidth*0.0314);//3;
    offset = Math.round(paddleWidth*0.13);//7;
    var sideColor = '#01235d';
    //  center
    var centerWidth = Math.round(paddleWidth*0.34);
    var centerHeight = Math.round(paddleHeight*0.34);
    var centerX = Math.round(paddleWidth*0.5 - centerWidth*0.5);
    //  paddle
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fill();
    ctx.closePath();
    //  left border
    ctx.beginPath();
    ctx.rect(paddleX + offset, paddleY, border, paddleHeight);
    ctx.fillStyle = sideColor;
    ctx.fill();
    ctx.closePath();
    //  center
    ctx.beginPath();
    ctx.rect(paddleX + centerX, paddleY + 0.5, centerWidth, centerHeight);
    ctx.fillStyle = 'crimson';
    ctx.fill();
    ctx.closePath();
    //  right border
    ctx.beginPath();
    ctx.rect(paddleX + paddleWidth - offset - border, paddleY, border, paddleHeight);
    ctx.fillStyle = sideColor;
    ctx.fill();
    ctx.closePath();
};

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status > 0) {
                var brickX = c*(brickWidth+brickPaddingX) + brickOffsetLeft;
                var brickY = r*(brickHeight+brickPaddingY) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                var s = bricks[c][r].status;
                switch (s) {
                    case 4:
                        ctx.fillStyle = '#ff9900';
                        break;
                    case 3:
                        ctx.fillStyle = '#ddcc00';
                        break;
                    case 2:
                        ctx.fillStyle = '#44bb11';
                        break;
                    default:
                        ctx.fillStyle = '#0072ff';
                        break;
                }
                ctx.fill();
                ctx.closePath();
            }
        }
    }
};

function brickCollisionDetection() {
    var ball = {
        x1: dx > 0 ? x + dx + ballRadius : x + dx - ballRadius,
        y1: dy > 0 ? y + dy + ballRadius : y + dy - ballRadius
    }
    //  brick
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status >= 1) {
                var collision = false;
                //  collision
                if (ball.x1 >= b.x - Math.cos(ball.x1 - b.x) && ball.x1 <= b.x + brickWidth + Math.cos(ball.x1 - b.x + brickWidth)
                 && ball.y1 >= b.y - Math.sin(ball.y1 - b.y) && ball.y1 <= b.y + brickHeight + Math.sin(ball.y1 + b.y + brickHeight)){
                    dy = -dy;
                    if (ball.x1 <= b.x + Math.cos(ball.x1 - b.x) || ball.x1 >= b.x + brickWidth - Math.cos(ball.x1 - b.x + brickWidth)){
                        dx = -dx;
                    }
                    collision = true;
                }
                if (collision){
                    --b.status;
                    score += b.points;
                    if (b.status === 0){
                        bricksToBrake--;
                    }
                    if (bricksToBrake === 0){
                        //  You Win!!! - Reload Game - Next Level
                        dy = -Math.abs(dy);
                        setBallInitialPosition();
                        setBricksInitialStatus();
                    }
                }
            }
        }
    }
};

function ballCollisionDetection() {
    //  horizontal ball collision
    if (x + dx + ballRadius >= canWidth || x + dx - ballRadius <= 0) {
        dx = -dx;
    }
    //  vertical ball collision
    if (y + dy - ballRadius <= 0) {
        dy = -dy;
    } else if (y + dy + ballRadius + paddleHeight > canHeight) {
        if (x + dx + ballRadius >= paddleX && x + dx - ballRadius <= paddleX + paddleWidth) {
            dy = -dy;
            //  reverse ball dir. at paddle border
            if ((dx > 0 && x + dx + ballRadius <= paddleX + offset + border) || (dx < 0 && x + dx - ballRadius >= paddleX + paddleWidth - offset - border)){
                dx = -dx;
            }
        } else {
            if (lives > 0)
                lives--;
            if (!lives){
                //  Game Over!!!
                state = false;
            } else {
                //  One more chance/life
                dy = -Math.abs(dy);
                setBallInitialPosition();
                setBricksInitialStatus();
            }
        }
    }
};

function movePaddle() {
    //  paddle
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 5;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 5;
    }
};

function ballDeltaSpeed() {
    if (stepScore < MAX_SPEED_FACTOR) {
        stepScore = score * 0.01;
        ballSpeed = Math.floor(stepScore);
    }
}

function moveBall() {
    //  ball move
    ballDeltaSpeed();
    var deltaX = dx > 0 ? dx + ballSpeed : dx - ballSpeed;
    var deltaY = dy > 0 ? dy + ballSpeed : dy - ballSpeed;
    x += dx + deltaX;
    y += dy + deltaY;
};

function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    brickCollisionDetection();
    ballCollisionDetection();
    if (state) {
        movePaddle();
        moveBall();
    } else {
        drawTheEnd();
    }
};

function game() {
    init();
    setBricksInitialStatus();
    setBallInitialPosition();
    draw();
    // setInterval(draw, 10);
};


//  =================   //
//  BRICK BRAKER GAME   //
//  =================   //

game();

//  ========= //
//   THE END  //
//  ========= //