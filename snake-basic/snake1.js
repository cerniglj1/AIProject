const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const tile = 16;

const boardImg = new Image();
const foodImg = new Image();
boardImg.src = "imgs/gameboard.png";
foodImg.src = "imgs/apple.png";

let highscore = 0;
highscore = document.getElementById(
  "highscore"
).innerHTML = localStorage.getItem("highscore");

let snake = [];
snake[0] = {
  x: Math.floor(Math.random() * 34 + 2) * tile,
  y: Math.floor(Math.random() * 30 + 6) * tile
};

let food = {
  x: Math.floor(Math.random() * 34 + 2) * tile,
  y: Math.floor(Math.random() * 30 + 6) * tile
};

let score = 0;
let dir;
let search;

document.addEventListener("keydown", direction);

/** Starts the snake by itself without human input */
function start() {
  init();
  stats.moves = 0;
  stats.food = 0;
  stats.count = 0;
}

/** Allows us to change the search method we want to use later on in the project. */
function change_search() {
  var message = new Object();
  message.do = "set_search";
  message.search = document.getElementById("search").value;
  search = message.search;
  console.log("current search: " + message.search);
}

function direction(event) {
  let key = event.keyCode;

  // 37=left
  // 38=up
  // 39=right
  // 40=down

  if (key == 37 && dir != "right") {
    dir = "left";
  } else if (key == 38 && dir != "down") {
    dir = "up";
  } else if (key == 39 && dir != "left") {
    dir = "right";
  } else if (key == 40 && dir != "up") {
    dir = "down";
  } else if (key == 80) {
    dir = "pause";
  }
}
function isDownClear(snake) {
  if (dir != "up" && snake[0].y < 35 * tile) {
    for (i = 0; i < snake.length; i++) {
      if (snake[0].y + 1 * tile == snake[i].y) {
        document.getElementById("downgood").innerHTML = "no";
        return false;
      }
    }
    document.getElementById("downgood").innerHTML = "yes";
    return true;
  } else {
    document.getElementById("downgood").innerHTML = "no";
    return false;
  }
}
function isUpClear(snake) {
  if (dir != "down" && snake[0].y > 6 * tile) {
    for (i = 0; i < snake.length; i++) {
      if (snake[0].y - 1 * tile == snake[i].y) {
        document.getElementById("upgood").innerHTML = "no";
        return false;
      }
    }
    document.getElementById("upgood").innerHTML = "yes";
    return true;
  } else {
    document.getElementById("upgood").innerHTML = "no";
    return false;
  }
}
function isLeftClear(snake) {
  if (dir != "right" && snake[0].x > 2 * tile) {
    for (i = 0; i < snake.length; i++) {
      if (snake[0].x - tile == snake[i].x) {
        document.getElementById("leftgood").innerHTML = "no";
        return false;
      }
    }
    document.getElementById("leftgood").innerHTML = "yes";
    return true;
  } else {
    document.getElementById("leftgood").innerHTML = "no";
    return false;
  }
}
function isRightClear(snake) {
  if (dir != "left" && snake[0].x < 35 * tile) {
    for (i = 0; i < snake.length; i++) {
      if (snake[0].x + tile == snake[i].x) {
        document.getElementById("rightgood").innerHTML = "no";
        return false;
      }
    }
    document.getElementById("rightgood").innerHTML = "yes";

    return true;
  } else {
    document.getElementById("rightgood").innerHTML = "no";
    return false;
  }
}
function collision(head, snake) {
  for (let i = 0; i < snake.length; i++) {
    if (head.x == snake[i].x && head.y == snake[i].y) {
      return true;
    }
  }
  return false;
}
function draw() {
  context.drawImage(boardImg, 0, 0);

  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = i == 0 ? "firebrick" : "darkred";
    context.fillRect(snake[i].x, snake[i].y, tile, tile);
    context.strokeStyle = "darkgoldenrod";
    context.strokeRect(snake[i].x, snake[i].y, tile, tile);
  }

  context.drawImage(foodImg, food.x, food.y);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  isRightClear(snake);
  isUpClear(snake);
  isDownClear(snake);
  isLeftClear(snake);

  if (dir == "left") snakeX -= tile;
  if (dir == "up") snakeY -= tile;
  if (dir == "right") snakeX += tile;
  if (dir == "down") snakeY += tile;

  if (snakeX == food.x && snakeY == food.y) {
    score++;
    if (score >= highscore) {
      localStorage.setItem("highscore", score);
      document.getElementById("highscore").innerHTML = score;
    }
    food = {
      x: Math.floor(Math.random() * 34 + 2) * tile,
      y: Math.floor(Math.random() * 30 + 6) * tile
    };
  } else {
    snake.pop();
  }

  let newHead = {
    x: snakeX,
    y: snakeY
  };

  if (
    snakeX < 2 * tile ||
    snakeX > 35 * tile ||
    snakeY < 6 * tile ||
    snakeY > 35 * tile ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
  }

  snake.unshift(newHead);

  context.fillStyle = "white";
  context.font = "45px Changa one";
  context.fillText(score, 6 * tile, 4 * tile);
}

function getPoint(pos_x, pos_y) {
  this.x = pos_x;
  this.y = pos_y;
}

// So what needs to happen is the snake needs to make sure it doesnt collide with itself and secondly, it needs to check where the food is

let game = setInterval(draw, 100);
