var c = document.getElementsByTagName("canvas")[0];
var ctx = c.getContext("2d");
var w = 608;
var h = 608;
var ROWS = 38;
var COLS = 38;
var BLOCK_W = Math.floor(w / COLS);
var BLOCK_H = Math.floor(h / ROWS);
var gameOver = false;

var SearchChosen = "";
var score = 0;
var highscore = 0;

// size of grid nxn
var size = ROWS;

// Initialize grid based on numbers given
var grid_aStar = grid(size);

// Starts at center of Rows and Columns given
var start_x = Math.floor(ROWS / 2);
var start_y = Math.floor(COLS / 2);
var currentPath = new Array();

// get the starting point of the item (apple)
do {
  var item_x = Math.floor(Math.random() * size);
  var item_y = Math.floor(Math.random() * size);
} while (grid_aStar[item_y][item_x].block == true);

// array for where the elements of the snake will be
var snake = new Array();
snake.push(grid_aStar[start_y][start_x]);
grid_aStar[start_y][start_x].block = true;

function Node(x, y) {
  this.block = false;
  this.x = x;
  this.y = y;
  this.path = false;
  this.parent = null;
  this.gScore = -1; // score of getting from start to this node
  this.fScore = -1; // score of gScore plus hueristic value
  this.heuristicCalc = function(x_final, y_final) {
    return Math.floor(Math.abs(x_final - this.x) + Math.abs(y_final - this.y));
  };
}

// create 2D grid of of nxn where n = size
function grid(size) {
  // create array
  var grid = new Array(size);
  for (var i = 0; i < size; i++) {
    grid[i] = new Array(size);
  }

  // associate each element with a node object
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      if (grid[i][j] != "-") {
        grid[i][j] = new Node(j, i);
      }
    }
  }

  return grid;
}

// used to sort open set according to fScore values
function fScoreSort(a, b) {
  if (a.fScore < b.fScore) return -1;
  if (a.fScore > b.fScore) return 1;
  return 0;
}

// checks to see if the currentNode should be looked at
function inBoundsCheck(currentNode, i, j) {
  // out of bounds
  if (
    currentNode.x + j < 0 ||
    currentNode.x + j > size - 1 ||
    currentNode.y + i < 0 ||
    currentNode.y + i > size - 1
  ) {
    return false;
  }

  // check to see if block is within the grid
  if (grid_aStar[currentNode.y + i][currentNode.x + j].block) {
    return false;
  }

  // skip the current node
  if (
    (currentNode.y + i == currentNode.y &&
      currentNode.x + j == currentNode.x) ||
    (i == -1 && j == -1) ||
    (i == -1 && j == 1) ||
    (i == 1 && j == -1) ||
    (i == 1 && j == 1)
  ) {
    return false;
  }

  // if it passed all possible checks
  return true;
}

function aStar() {
  // ending values
  var end_x = item_x;
  var end_y = item_y;

  // set of nodes that have already been looked at
  var closedSet = [];

  // set of nodes that are known but not looked at
  var openSet = [];

  // add the starting element to the open set
  openSet.push(grid_aStar[start_y][start_x]);
  grid_aStar[start_y][start_x].gScore = 0;
  grid_aStar[start_y][start_x].fScore = grid_aStar[start_y][
    start_x
  ].heuristicCalc(end_x, end_y); // just the heuristic

  // while open set is not empty
  while (openSet.length > 0) {
    openSet.sort(fScoreSort);
    var currentNode = openSet[0];

    if (currentNode.x == end_x && currentNode.y == end_y) {
      return reconstruct_path(grid_aStar, currentNode, start_x, start_y); // return path
    }

    // remove current node from open set
    var index = openSet.indexOf(currentNode);
    openSet.splice(index, 1);

    closedSet.push(currentNode);

    // looking at all of the node's neighbours
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (!inBoundsCheck(currentNode, i, j)) {
          continue;
        }

        var neighbour = grid_aStar[currentNode.y + i][currentNode.x + j];

        // if node is within the closed set, it has already
        // been looked at - therefore skip it
        if (closedSet.indexOf(neighbour) != -1) {
          continue;
        }

        // set tentative score to gScore plus distance from current to neighbour
        // in this case, the weight is equal to 1 everywhere
        var tScore = neighbour.gScore + 1;

        // if neighbour is not in open set, add it
        if (openSet.indexOf(neighbour) == -1) {
          openSet.push(neighbour);
        }

        // this is a better path so set node's new values
        neighbour.parent = currentNode;
        neighbour.gScore = tScore;
        neighbour.fScore =
          neighbour.gScore + neighbour.heuristicCalc(end_x, end_y);
      }
    }
  }

  // the node was not found or could not be reached
  return false;
}

function BFS() {
  // ending values
  var end_x = item_x;
  var end_y = item_y;

  // set of nodes that have already been looked at
  var closedSet = [];

  // set of nodes that are known but not looked at
  var openSet = [];

  // add the starting element to the open set
  openSet.push(grid_aStar[start_y][start_x]);
  grid_aStar[start_y][start_x].gScore = 0;
  grid_aStar[start_y][start_x].fScore = grid_aStar[start_y][
    start_x
  ].heuristicCalc(end_x, end_y); // just the heuristic

  // while open set is not empty
  while (openSet.length > 0) {
    openSet.sort(fScoreSort);
    var currentNode = openSet[0];

    if (currentNode.x == end_x && currentNode.y == end_y) {
      return reconstruct_path(grid_aStar, currentNode, start_x, start_y); // return path
    }

    // remove current node from open set
    var index = openSet.indexOf(currentNode);
    openSet.splice(index, 1);

    closedSet.push(currentNode);

    // looking at all of the node's neighbours
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (!inBoundsCheck(currentNode, i, j)) {
          continue;
        }

        var neighbour = grid_aStar[currentNode.y + i][currentNode.x + j];

        // if node is within the closed set, it has already
        // been looked at - therefore skip it
        if (closedSet.indexOf(neighbour) != -1) {
          continue;
        }

        // set tentative score to gScore plus distance from current to neighbour
        // in this case, the weight is equal to 1 everywhere
        var tScore = neighbour.gScore + 1;

        // if neighbour is not in open set, add it
        if (openSet.indexOf(neighbour) == -1) {
          openSet.push(neighbour);
        }

        // this is a better path so set node's new values
        neighbour.parent = currentNode;
        neighbour.gScore = tScore;
        neighbour.fScore =
          neighbour.gScore + neighbour.heuristicCalc(end_x, end_y);
      }
    }
  }
}

function DFS() {
  // ending values
  var end_x = item_x;
  var end_y = item_y;

  // set of nodes that have already been looked at
  var closedSet = [];

  // set of nodes that are known but not looked at
  var openSet = [];

  // add the starting element to the open set
  openSet.push(grid_aStar[start_y][start_x]);
  grid_aStar[start_y][start_x].gScore = 0;
  grid_aStar[start_y][start_x].fScore = grid_aStar[start_y][
    start_x
  ].heuristicCalc(end_x, end_y); // just the heuristic

  // while open set is not empty
  while (openSet.length > 0) {
    openSet.sort(fScoreSort);
    var currentNode = openSet[0];

    if (currentNode.x == end_x && currentNode.y == end_y) {
      return reconstruct_path(grid_aStar, currentNode, start_x, start_y); // return path
    }

    // remove current node from open set
    var index = openSet.indexOf(currentNode);
    openSet.splice(index, 1);

    closedSet.push(currentNode);

    // looking at all of the node's neighbours
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (!inBoundsCheck(currentNode, i, j)) {
          continue;
        }

        var neighbour = grid_aStar[currentNode.y + i][currentNode.x + j];

        // if node is within the closed set, it has already
        // been looked at - therefore skip it
        if (closedSet.indexOf(neighbour) != -1) {
          continue;
        }

        // set tentative score to gScore plus distance from current to neighbour
        // in this case, the weight is equal to 1 everywhere
        var tScore = neighbour.gScore + 1;

        // if neighbour is not in open set, add it
        if (openSet.indexOf(neighbour) == -1) {
          openSet.push(neighbour);
        }

        // this is a better path so set node's new values
        neighbour.parent = currentNode;
        neighbour.gScore = tScore;
        neighbour.fScore =
          neighbour.gScore + neighbour.heuristicCalc(end_x, end_y);
      }
    }
  }
}

function reconstruct_path(grid_aStar, current, start_x, start_y) {
  var currentNode = current;
  var totalPath = [current];

  // go through the parents to find how the route
  while (currentNode.parent != null) {
    totalPath.push(currentNode.parent);
    currentNode.path = true;
    currentNode = currentNode.parent;
  }

  return totalPath;
}

const foodImg = new Image();
foodImg.src = "imgs/apple.png";

// draws the board and the moving shape
function draw() {
  var openSet = [];
  var tail;
  document.addEventListener("keydown", direction);
  openSet.push(grid_aStar[start_y][start_x]);

  var currNode = openSet[0];
  if (!gameOver) {
    for (var x = 0; x < COLS; ++x) {
      for (var y = 0; y < ROWS; ++y) {
        if (y == item_y && x == item_x) {
          // ctx.fillStyle = "red";
        } else if (currNode.x == x && currNode.y == y) {
          ctx.fillStyle = "red";
          // console.log("head");
          // } else if (path[y][x].block) {
          //   ctx.fillStyle = "blue";
          //   console.log("path");
        } else if (grid_aStar[y][x].block) {
          ctx.fillStyle = "green";
        } else if (grid_aStar[y][x].path) {
          ctx.fillStyle = "blue";
        } else {
          ctx.strokeStyle = "black";
          ctx.lineWidth = "1";
          ctx.fillStyle = "black";
        }

        ctx.drawImage(foodImg, item_x * 16, item_y * 16);
        ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);
        ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);
      }
    }
  }
}

// get the next node for the snake to move
function getNextMove(end_x, end_y) {
  var nextLoc;
  var lowestfScore = -1;
  var lowestfScoreNode = null;
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      if (!inBoundsCheck(snake[0], i, j)) {
        continue;
      }

      var neighbour = grid_aStar[snake[0].y + i][snake[0].x + j];

      // pathScore = fScore + pathLength
      var pathScore =
        neighbour.gScore +
        neighbour.heuristicCalc(end_x, end_y) +
        pathLength(neighbour) +
        1;

      // find the largest pathScore
      if (pathScore > lowestfScore) {
        lowestfScore = pathScore;
        lowestfScoreNode = neighbour;
      }
    }
  }

  return lowestfScoreNode;
}

// determine how many spaces are available to move given the currentNode
function pathLength(currentNode) {
  var currNode = currentNode;
  var numOfNodes = 0;

  var longestPathArray = new Array();

  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      if (!inBoundsCheck(currNode, i, j)) {
        continue;
      }

      currNode = grid_aStar[currNode.y + i][currNode.x + j];

      // increment the number of nodes and reset the check to looking at the top node
      numOfNodes++;
      i = -1;
      j = -1;

      longestPathArray.push(currNode);

      // check if no where else to go
      if (
        (!(currNode.x + 1 >= 0 && currNode.x + 1 < size) ||
          grid_aStar[currNode.y][currNode.x + 1] == undefined ||
          grid_aStar[currNode.y][currNode.x + 1].block) &&
        (!(currNode.x - 1 >= 0 && currNode.x - 1 < size) ||
          grid_aStar[currNode.y][currNode.x - 1] == undefined ||
          grid_aStar[currNode.y][currNode.x - 1].block) &&
        (!(currNode.y + 1 >= 0 && currNode.y + 1 < size) ||
          grid_aStar[currNode.y + 1][currNode.x] == undefined ||
          grid_aStar[currNode.y + 1][currNode.x].block) &&
        (!(currNode.y - 1 >= 0 && currNode.y - 1 < size) ||
          grid_aStar[currNode.y - 1][currNode.x] == undefined ||
          grid_aStar[currNode.y - 1][currNode.x].block)
      ) {
        // house keeping - reset blocks to false
        for (var i = 0; i < longestPathArray.length - 1; i++) {
          longestPathArray[i].block = false;
        }

        return numOfNodes;
      }
      currNode.block = true;
    }
  }
}
function tick() {
  // keep track of where the trail is
  var tail;
  var path;
  if (!gameOver) {
    if (SearchChosen == "A*") {
      path = aStar();
    } else if (SearchChosen == "BFS") {
      path = BFS();
    } else if (SearchChosen == "DFS") {
      path = DFS();
    }
  }

  // clear the grid to perform the next set of calculations
  for (var j = 0; j < path.length - 1; j++) {
    path[j].parent = null;
    path[j].gScore = -1;
    path[j].fScore = -1;
  }

  for (var i = 0; i < grid_aStar.length; i++) {
    for (var j = 0; j < grid_aStar.length; j++) {
      grid_aStar[i][j].parent = null;
      grid_aStar[i][j].gScore = -1;
      grid_aStar[i][j].fScore = -1;
    }
  }

  // if there is a path using A* to the item, go to the first node
  if (path) {
    var nextLoc = path[path.length - 2];
  } else {
    // otherwise, attempt to find the next best movement
    var nextNode = getNextMove(item_x, item_y);
    if (nextNode == null) {
      gameOver = true;
      document.getElementById("gameover").innerHTML = "Game Over";
      return;
    } else {
      nextLoc = nextNode;
    }
  }

  // set next location
  snake.unshift(nextLoc);
  nextLoc.block = true;
  start_x = nextLoc.x;
  start_y = nextLoc.y;

  // if not at the item, pop the tail
  if (!(nextLoc.x == item_x && nextLoc.y == item_y)) {
    tail = snake.pop();
    tail.path = false;
    tail.block = false;
    tail.gScore = -1;
    tail.fScore = -1;
  } else {
    // if at the item, set a new item location
    do {
      item_x = Math.floor(Math.random() * ROWS);
      item_y = Math.floor(Math.random() * ROWS);
      grid_aStar[item_y][item_x].path = false;
    } while (grid_aStar[item_y][item_x].block == true);
    score++;
    document.getElementById("score").innerHTML = score;
    if (score >= highscore) {
      localStorage.setItem("highscore", score);
      document.getElementById("highscore").innerHTML = score;
    }
  }
}

var dir = "up";

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

function control() {
  // keep track of where the trail is
  // set of nodes that are known but not looked at
  var openSet = [];
  var tail;
  document.addEventListener("keydown", direction);
  openSet.push(grid_aStar[start_y][start_x]);

  var currNode = openSet[0];

  if (!gameOver) {
    if (dir == "left") {
      grid_aStar[currNode.y][currNode.x - 1].block = true;

      console.log("left2");
    }
    if (dir == "up") {
      grid_aStar[currNode.y + 1][currNode.x].block = true;
      console.log("up2");
    }
    if (dir == "right") {
      grid_aStar[currNode.y][currNode.x + 1].block = true;
      console.log("right2");
    }
    if (dir == "down") {
      grid_aStar[currNode.y - 1][currNode.x].block = true;
      console.log("down2");
    }

    // if not at the item, pop the tail
    if (!(currNode.x == item_x && currNode.y == item_y)) {
      tail = snake.pop();
      tail.block = false;
      tail.gScore = -1;
      tail.fScore = -1;
    } else {
      // if at the item, set a new item location
      do {
        item_x = Math.floor(Math.random() * ROWS);
        item_y = Math.floor(Math.random() * ROWS);
      } while (grid_aStar[item_y][item_x].block == true);
    }
  }
}

function change_search() {
  var message = new Object();
  message.do = "set_search";
  message.search = document.getElementById("search").value;
  search = message.search;
  SearchChosen = search;
  console.log("current search: " + message.search);
}

function start() {
  draw();
  if ((highscore = localStorage.getItem("highscore", score) >= 0)) {
    highscore = localStorage.getItem("highscore", score);
  } else {
    highscore = 0;
  }
  setInterval(tick, 25);
  setInterval(draw, 25);
}

function play() {
  draw();
  setInterval(control, 50);
  setInterval(draw, 50);
}

change_search();

// startGame();
