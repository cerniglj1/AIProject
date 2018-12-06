const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const tile = 16;

const boardImg = new Image();
const foodImg = new Image();
boardImg.src = "../imgs/gameboard.png";
foodImg.src = "../imgs/apple.png";

let score;
let search;
let message = "PRESS SPACE TO PLAY";
let isRunning = false;

let isAIGame = false;

let fps = 20;

function init() {
    isRunning = false;
    draw();
}

function startGame() {
  var element = document.getElementById("game-mode-div");
  if (isAIGame) element.innerHTML = "Game Mode: Bot"; 
  else element.innerHTML = "Game Mode: Human";
  isRunning = true;
  score = 0;
  snake.init();
  food.set();
  loop();
}

function gameOver() {
  var element = document.getElementById("game-mode-div");
  element.innerHTML = "Game Mode:"
  message = "GAME OVER - PRESS SPACE TO PLAY AGAIN";
  fps = 10;
  isRunning = false;
  isAIGame = false;
}

/** Starts the snake by itself without human input */
function aiStart() {

  if (isRunning) {
      //handle error
  } else {
    // procede as bot game --> get algorithm type --> play
    var element = document.getElementById("game-mode-div");
    element.innerHTML = "Game Mode: Bot"
    isRunning = true;
    isAIGame = true;
    score = 0;
    snake.init();
    food.set();
    // begin ai loop here
    loop();
  }
}

/** Allows us to change the search method we want to use later on in the project. */
function change_search() {
  var message = new Object();
  message.do = "set_search";
  message.search = document.getElementById("search").value;
  search = message.search;
  console.log("current search: " + message.search);
}

document.addEventListener("keydown", keyPressed);

function keyPressed(event) {
  let key = event.keyCode;

  if ((key == 37 || key == 65) && snake.direction != "right" && isRunning && !isAIGame) {
    snake.direction = "left";
  } else if ((key == 38 || key == 87) && snake.direction != "down" && isRunning && !isAIGame) {
    snake.direction = "up";
  } else if ((key == 39 || key == 68) && snake.direction != "left" && isRunning && !isAIGame) {
    snake.direction = "right";
  } else if ((key == 40 || key == 83) && snake.direction != "up" && isRunning && !isAIGame) {
    snake.direction = "down";
  } else if (key == 32) {
    startGame();
  } else if (key == 81 && isRunning) {
    gameOver();
  }
}

snake = {
    segments: [],
    direction: 'down',

    init: function() {
        snake.segments = [];
        snake.segments[0] = { x: 9 * tile, y: 10 * tile };
        console.log("x " + snake.segments[0].x + " y " + snake.segments[0].y);
        snake.direction = 'down';
    },

    move: function() {

        newhead = {
            x: snake.segments[0].x,
            y: snake.segments[0].y
        };
        switch (snake.direction) {
            case 'up':
            newhead.y -= tile;
                break;
            case 'down':
            newhead.y += tile;
                break;
            case 'left':
            newhead.x -= tile;
                break;
            case 'right':
            newhead.x += tile;
                break;
        }
        snake.checkEat(newhead.x, newhead.y);
        snake.checkCollision(newhead.x, newhead.y);
        snake.segments.unshift(newhead);
    },

    checkEat: function(snake_x, snake_y) {
        if (snake_x == food.x && snake_y == food.y) {
            score++;
            if (score % 5 === 0) {
                fps += 5;
                console.log("fps increased, " + fps);
            }
            // increase fps over time ?
            food.set();
        } else {
            snake.segments.pop();
        }
    },

    checkCollision: function(snake_x, snake_y) {
        if (snake.hasCollided(snake_x, snake_y) === true) {
            gameOver();
        }
    },

    hasCollided: function(x, y) {
        if (x < 2 * tile ||
            x > 35 * tile ||
            y < 6 * tile ||
            y > 35 * tile ||
            this.selfCollision(x, y, snake.segments)) {
          return true;
        }
    },

    selfCollision: function(head_x, head_y, body) {

        for (let i = 0; i < body.length; i++) {
            if (head_x == body[i].x && head_y == body[i].y) {
                console.log("self collision");
              return true;
            }
        }
        return false;
    },

    draw: function() {
        for (let i = 0; i < snake.segments.length; i++) {
            context.fillStyle = i == 0 ? "firebrick" : "darkred";
            context.fillRect(snake.segments[i].x, snake.segments[i].y, tile, tile);
            context.strokeStyle = "darkgoldenrod";
            context.strokeRect(snake.segments[i].x, snake.segments[i].y, tile, tile);
        }
    },

    getHead: function() {
        return this.segments[0];
    }
}

food = {
    x: null,
    y: null,
    src: foodImg,

    draw: function() {
        context.drawImage(food.src, food.x, food.y);
    },

    set: function() {
        

        foodSet = false;
        clashFound = false;

        while (!foodSet) {

            clashFound = false;
            new_x = Math.floor(Math.random() * 34 + 2) * tile,
            new_y = Math.floor(Math.random() * 30 + 6) * tile

            for (let i = 0; i < snake.segments.length; i++) {
                if (new_x === snake.segments[i].x && new_y === snake.segments[i].y) {
                    console.log("clash found. re-randoming fruit location");
                    clashFound = true;
                }
            };
            if (!clashFound) {
                food.x = new_x;
                food.y = new_y;
                foodSet = true;
            }
        }
    }
}

 

ai = {
    nextMove: function() {
        
        var direction = snake.direction;
        var leftwall   = (snake.segments[0].x - 1) < 2 * tile;
        var rightwall  = (snake.segments[0].x + 1) > 35 * tile;
        var topwall    = (snake.segments[0].y - 1) < 6 * tile;
        var bottomwall = (snake.segments[0].y + 1) > 35 * tile;

        var facingself = false;
        var snakesouth = false;
        var snakeleft = false;
        var snakeright = false;
        var snakenorth = false;

        var specialcase = false;

        var temp = {
            x: snake.segments[0].x,
            y: snake.segments[0].y
        };

        if (direction === "up")    temp.y -= tile;
        if (direction === "down")  temp.y += tile;
        if (direction === "left")  temp.x -= tile;
        if (direction === "right") temp.x += tile;

        for (let i = 1; i < snake.segments.length; i++) {

            if (temp.x == snake.segments[i].x && temp.y == snake.segments[i].y) {
                facingself = true;
            }
            if ((temp.y + tile) == snake.segments[i].y) {
                console.log("snakesouth true");
                snakesouth = true;
            }
            if ((temp.x - tile) == snake.segments[i].x) {
                console.log("snakeleft true");
                snakeleft = true;
            }
            if ((temp.x + tile) == snake.segments[i].x) {
                console.log("snakeright true");
                snakeright = true;
            }
            if ((temp.y - tile) == snake.segments[i].y) {
                console.log("snakenorth true");
                snakenorth = true;
            }
        }

        if (snakesouth) {
            console.log("snakesouth: direction, " + direction);
            direction = direction;
        }
        if (snakeleft) {
            console.log("snakeleft: direction, " + direction);
            direction = direction;
        }
        if (snakeright) {
            console.log("snakeright: direction, " + direction);
            direction = direction;
        }
        if (snakeleft && direction === "down" || snakeleft && direction === "up") {
            console.log("snakeleft catch " + direction);
            direction = direction;
            //specialcase = true;
        }
        if (snakeleft && snakesouth && direction === "right") {
            console.log("snakeleft snakesouth " + direction);
            direction = direction;
            specialcase = true;
        }
        if (facingself) {
            console.log("facingself true - turning?");
            if (rightwall) {
                console.log("if case - routed to left");
                direction = "left";
            } else if (leftwall) {
                console.log("else if case - routed to right");
                direction = "right";
            } else if (snakeleft) {
                if (snakeright) {
                    if (snakesouth) {
                        console.log("snakeleft snakeright snakesouth - routed to up");
                        direction = "up";
                    } else {
                        console.log("snakeleft snakeright - routed to down");
                        direction = "down";
                    }
                } else {
                    if (direction === "down") {
                        console.log("else if `snakeleft` case - dir, down - kept");
                        direction = direction;
                    } else if (direction === "up") {
                        console.log("else if `snakeleft` case - dir, up - kept");
                        direction = direction;
                    } else {
                        if (snakeright) {
                            console.log("snakeleft, else, snakeright - routed up");
                            direction = "up";
                        } else if (snakesouth) {
                            console.log("snakeleft, else, snakedown - routed up");
                            direction = "up";
                        } else {
                            console.log("snakeleft, else - routed down");
                            direction = "down";
                        }
                    }
                }
                
            } else {
                console.log("facingself else case");
                if (snakeright) {
                    console.log("snake right - routed to down");
                    direction = "down";
                } else if (snakesouth) {
                    console.log("snake down - routed to right");
                    direction = "right";
                } else {
                    console.log("else case - routed to left");
                    direction = "left";
                }
            }
        }  
        else if (!facingself && !specialcase) {
            console.log("!facingself - " + direction);
            if (food.x > snake.segments[0].x && direction !== "left") {
                direction = "right";
            } else if (food.x < snake.segments[0].x && direction !== "right") {
                direction = "left";
            } else if (food.y > snake.segments[0].y && direction !== "up") {
                direction = "down";
            } else if (food.y < snake.segments[0].y && direction !== "down") {
                direction = "up";
            } else if (food.x == snake.segments[0].x && direction === "down" && !rightwall) {
                console.log("food in same col, above - routed to right");
                direction = "right";
            } else if (food.x == snake.segments[0].x && direction === "up" && !rightwall) {
                console.log("food in same col, below - routed to right");
                direction = "right";
            } else if (food.x == snake.segments[0].x && direction === "down" && rightwall) {
                console.log("food in same col, above - routed to left");
                direction = "left";
            } else if (food.x == snake.segments[0].x && direction === "up" && rightwall) {
                console.log("food in same col, above - routed to left");
                direction = "left";
            } else if (food.y == snake.segments[0].y && direction === "left") {
                console.log("food in same row, right - routed to down");
                direction = "down";
            } else if (food.y == snake.segments[0].y && direction === "right") {
                console.log("food in same row, left - routed to down")
                direction = "down";
            }
        }
        console.log("============================");
        snake.direction = direction;

        var newhead = {
            x: snake.segments[0].x,
            y: snake.segments[0].y
        };

        if (direction === "right") {
            newhead.x += tile;
        }
        if (direction === "left") {
            newhead.x -= tile;
        }
        if (direction === "down") {
            newhead.y += tile;
        }
        if (direction === "up") {
            newhead.y -= tile;
        }

        snake.checkEat(newhead.x, newhead.y);
        snake.checkCollision(newhead.x, newhead.y);
        snake.segments.unshift(newhead);
    }


}

function draw() {
  context.drawImage(boardImg, 0, 0);
  
  if (!isRunning) {
    drawMessage();
  }
  else if (isAIGame) {
      ai.nextMove();
      food.draw();
      snake.draw();
      updateScore();
  }
  else {
    snake.move();
    food.draw();
    snake.draw();
    updateScore();
  }
  
}

function drawMessage() {
  context.fillStyle = '#FAA';
  context.strokeStyle = '#FFF';
  context.textAlign = 'center';

  if (score >= 0) {
    context.font = (canvas.height / 25) + 'px Impact';
    context.fillText("Score: " + score, canvas.width / 2, canvas.height / 2.5);
    context.strokeText("Score: " + score, canvas.width / 2, canvas.height / 2.5);
  }

  context.font = (canvas.height / 20) + 'px Impact';
  context.fillText(message, canvas.width / 2, canvas.height / 2);
  context.strokeText(message, canvas.width / 2, canvas.height / 2);
}

function updateScore() {
    context.fillStyle = "white";
    context.font = "45px Changa one";
    context.fillText(score, 6 * tile, 4 * tile);
}

//let game = setInterval(loop, 1000 / fps);

function updateFPS(fps) {
    clearInterval(game);
    game = setInterval(loop, 1000 / fps);
}

function loop() {
    draw();
    updateFPS(fps);
}


