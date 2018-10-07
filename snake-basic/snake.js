const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const tile = 16;

const boardImg = new Image();
const foodImg = new Image();
boardImg.src = "imgs/gameboard.png";
foodImg.src = "imgs/apple.png";

let snake = [];
snake[0] = {x: 9 * tile, y: 10 * tile};

let food = {
    x: Math.floor(Math.random() * 34 + 2) * tile,
    y: Math.floor(Math.random() * 30 + 6) * tile
}

let score = 0;
let dir;

document.addEventListener("keydown", direction);

function direction(event) {
    
    let key = event.keyCode;

    if(key == 37 && dir != "right") {
        dir = "left";
    } else if(key == 38 && dir != "down") {
        dir = "up";
    } else if(key == 39 && dir != "left") {
        dir = "right";
    } else if(key == 40 && dir != "up") {
        dir = "down";
    }
}

function collision(head, snake) {
    for(let i = 0; i < snake.length; i++) {
        if(head.x == snake[i].x && head.y == snake[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    context.drawImage(boardImg, 0, 0);

    for(let i = 0; i < snake.length; i++) {
        context.fillStyle = (i == 0) ? "firebrick" : "darkred";
        context.fillRect(snake[i].x, snake[i].y, tile, tile);
        context.strokeStyle = "darkgoldenrod";
        context.strokeRect(snake[i].x, snake[i].y, tile, tile);
    }

    context.drawImage(foodImg, food.x, food.y);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(dir == "left") snakeX -= tile;
    if(dir == "up") snakeY -= tile;
    if(dir == "right") snakeX += tile;
    if(dir == "down") snakeY += tile;

    if(snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 34 + 2) * tile,
            y: Math.floor(Math.random() * 30 + 6) * tile
        }
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    if(snakeX < 2 * tile || snakeX > 35 * tile || 
        snakeY < 6 * tile || snakeY > 35 * tile || collision(newHead, snake)) {
        clearInterval(game);
    }

    snake.unshift(newHead);
    
    context.fillStyle = "white";
    context.font = "45px Changa one";
    context.fillText(score, 6 * tile, 4 * tile);
}
let game = setInterval(draw, 100);