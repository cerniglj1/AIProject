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

let fps = 10;

function init() {
    isRunning = false;
    draw();
}

/*
 * function to begin a new game of snake
 * sets `isRunning` to true, resets `score`, initializes snake and food and begins loop()
 */

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

/*
 * function when game ends
 * sets `isRunning` to false, resets fps
 */

function gameOver() {
  var element = document.getElementById("game-mode-div");
  element.innerHTML = "Game Mode:"
  message = "GAME OVER - PRESS SPACE TO PLAY AGAIN";
  fps = 10;
  isRunning = false;
  isAIGame = false;
}

/*
 * function to begin bot game
 */

function aiStart() {

  if (isRunning) {
      //handle error
  } else {
    var element = document.getElementById("game-mode-div");
    element.innerHTML = "Game Mode: Bot"
    isRunning = true;
    isAIGame = true;
    score = 0;
    snake.init();
    food.set();
    loop();
  }
}

document.addEventListener("keydown", keyPressed);

/*
 * keyPressed handles keyboard listener
 * arrow keys or WASD manipulate the snake when player is human, space bar restarts the game, q to quit
 */

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

/*
 * snake object
 * has an array of segments and a direction, default is down
 */

snake = {
    segments: [],
    direction: 'down',

    init: function() {
        snake.segments = [];
        snake.segments[0] = { x: 9 * tile, y: 10 * tile };
        snake.direction = 'down';
    },

    /*
     * function to move the snake
     * gets position of first segment as head, adjusts for +/- tile based on snake.direction
     * calls .checkEat on head position to see if snake is on tile with food object
     * calls .checkCollision on head position to see if snake has hit a wall or itself
     */

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

    /*
     * function to check if snake has "eaten" the food
     * increase score if snake and food at same tile, if score % 5 is 0, increase fps, set new food
     * if snake has not eaten, remove "old" head segment (from previous tile location before this check)
     */

    checkEat: function(snake_x, snake_y) {
        if (snake_x == food.x && snake_y == food.y) {
            score++;
            if (score % 5 === 0) {
                fps += 5;
                console.log("fps increased, " + fps);
            }
            food.set();
        } else {
            snake.segments.pop();
        }
    },

    /*
     * function to check if snake has collided
     * calls helper .hasCollided on snake head position
     * calls gameOver() if .hasCollided returns true
     */

    checkCollision: function(snake_x, snake_y) {
        if (snake.hasCollided(snake_x, snake_y) === true) {
            gameOver();
        }
    },

    /*
     * checks if snake x/y is outside tile boundaries of the board
     * calls helper .selfCollision on snake head and .segments array
     */

    hasCollided: function(x, y) {
        if (x < 2 * tile ||
            x > 35 * tile ||
            y < 6 * tile ||
            y > 35 * tile ||
            this.selfCollision(x, y, snake.segments)) {
          return true;
        }
    },

    /*
     * loops through .segments array to confirm head position does not match any positions of body
     * if it does, returns true meaning self-collision found; otherwise returns false
     */

    selfCollision: function(head_x, head_y, body) {

        for (let i = 0; i < body.length; i++) {
            if (head_x == body[i].x && head_y == body[i].y) {
                console.log("self collision");
              return true;
            }
        }
        return false;
    },

    /*
     * function to draw the snake to canvas
     */

    draw: function() {
        for (let i = 0; i < snake.segments.length; i++) {
            context.fillStyle = i == 0 ? "firebrick" : "darkred";
            context.fillRect(snake.segments[i].x, snake.segments[i].y, tile, tile);
            context.strokeStyle = "darkgoldenrod";
            context.strokeRect(snake.segments[i].x, snake.segments[i].y, tile, tile);
        }
    },

    /*
     * returns head position of snake object from .segments[] index 0
     */

    getHead: function() {
        return this.segments[0];
    }
}

/*
 * food object
 * has x/y position and source image
 */

food = {
    x: null,
    y: null,
    src: foodImg,

    /*
     * function to draw the food to canvas
     */

    draw: function() {
        context.drawImage(food.src, food.x, food.y);
    },

    /*
     * function to set the random food location
     * assigns random position for new food, however will not let food spawn under current snake segment tile
     * randomizes location again if a clash is found with setting food position
     */

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

/*
 * ai snake object
 * makes move decisions based on greedy-search and limited observable environment
 * bot knows:
 *  - its x/y position
 *  - food x/y position
 *  the snake finds the difference between these two positions and points its direction towards the row/col
 *  that contains the food. if any cycle the snake examines if a segment is in front of its current direction,
 *  meaning it was facing itself, and whether there are segments to its immediate north, south, east, and west
 *  of only one square away; in this way the snake does not have full understanding of where its trail is but
 *  only partially aware of segments adjacent to the head at any moment
 *  the snake will try to take the most direct route to the same row and column as the fruit and then continue
 *  in a straight direction until its picks up the fruit; any deviation it makes can come only when it is about
 *  to collide with itself; it cannot make more complex pathing with forethought for the tails position.
 *  when the snake is confronted with facing itself, it will try to turn 90 degrees to its current direction
 *  (i.e. direction is left and the snake is facing itself, it will turn either up or down, etc.)
*/

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
                snakesouth = true;
            }
            if ((temp.x - tile) == snake.segments[i].x) {
                snakeleft = true;
            }
            if ((temp.x + tile) == snake.segments[i].x) {
                snakeright = true;
            }
            if ((temp.y - tile) == snake.segments[i].y) {
                snakenorth = true;
            }
        }

        switch(direction) {
        	case 'up':
        		if (facingself) {
		       		if (!snakeleft) {
        				direction = "left";
        			} else {
        				direction = "right";
        			}
        		} else {
        			direction = direction;
        		}
        		break;
        	case 'down':
        		if (facingself) {
        			if (!snakeleft) {
        				direction = "left";
        			} else {
        				direction = "right";
        			}
        		} else {
        			direction = direction;
        		}  
        		break;
        	case 'left':
        		if (facingself) {
        			if (!snakenorth) {
        				direction = "up";
        			} else {
        				direction = "down";
        			}
        		} else {
        			direction = direction;
        		}
        		break;
        	case 'right':
        		if (facingself) {
        			if (!snakenorth) {
        				direction = "up";
        			} else {
        				direction = "down";
        			}
        		} else {
        			direction = direction;
        		}
        		break;
         }
 
        if (!facingself) {
            if (food.x > snake.segments[0].x && direction !== "left") {
                direction = "right";
            } else if (food.x < snake.segments[0].x && direction !== "right") {
                direction = "left";
            } else if (food.y > snake.segments[0].y && direction !== "up") {
                direction = "down";
            } else if (food.y < snake.segments[0].y && direction !== "down") {
                direction = "up";
            } else if (food.x == snake.segments[0].x && direction === "down" && !rightwall) {
                direction = "right";
            } else if (food.x == snake.segments[0].x && direction === "up" && !rightwall) {
                direction = "right";
            } else if (food.x == snake.segments[0].x && direction === "down" && rightwall) {
                direction = "left";
            } else if (food.x == snake.segments[0].x && direction === "up" && rightwall) {
                direction = "left";
            } else if (food.y == snake.segments[0].y && direction === "left") {
                direction = "down";
            } else if (food.y == snake.segments[0].y && direction === "right") {
                direction = "down";
            }
        }
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

/*
 * main draw function
 * uses either ai move function or main snake.move based on game type
 */

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

/*
 * draws score and game messages to canvas
 */

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

/*
 * resets interval after fps increase
 */

function updateFPS(fps) {
    clearInterval(game);
    game = setInterval(loop, 1000 / fps);
}

/*
 * main game loop
 */
function loop() {
    draw();
    updateFPS(fps);
}


