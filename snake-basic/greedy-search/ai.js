var BLANK = 0;
var WALL = 1;
var SNAKE = 2;
var VISITED = 3;

function Node(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
}

var rows = 30;
var cols = 34;

function BreadthFirstSearch(cols, rows) {
    var unvisited = new Queue();
    var nodes = [];

    for (let i = 0; i < cols; i++) {
        nodes[i] = [];
        for (let j = 0; j < rows; j++) {
            nodes[i][j] = new Node(i, j, 0);
        }
    }

    this.findPath = function(snake, head, food) {
        var node;
        if (unvisited) {
            unvisited.clear()
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    node = nodes[i][j];
                    if (node.value === VISITED || node.value === SNAKE) {
                        node.previous = undefined;
                        node.value = BLANK;
                    }
                }
            }
        }
        else {
            unvisited = new Queue();
        }

        for (let i = 0; i < snake.segments.length; i++) {
            var x = snake.segments[i].x;
            var y = snake.segments[i].y;
            console.log(x + " " + y);
            nodes[x][y].value = SNAKE;
        }

        unvisited.enqueue(head);

        // main loop
        while (!unvisited.isEmpty()) {
            node = unvisited.dequeue();
            if (node) {
                if (node.x === food.x && node.y === food.y) {
                    return getSolution(node);
                }
                genMove(node);
            }
            else
                break;
        }
        return null;
    }

    function genMove(node) {
        if (node.x < cols - 2) addMove(node.x + 1, node.y, node);
        if (node.y < rows + 6) addMove(node.x, node.y + 1, node);
        if (node.x > 2) addMove(node.x - 1, node.y, node);
        if (node.y > 6) addMove(node.x, node.y - 1, node);
    }

    function addMove(x, y, previous) {
        var node = nodes[x][y];
        if (node.value === BLANK) {
            node.value = VISITED;
            node.previous = previous;
            unvisited.enqueue(node);
        }
    }

    function getSolution(sol) {
        var nodes = [];
        nodes.push(sol);
        while (sol.previous) {
            nodes.push(sol.previous);
            sol = sol.previous;
        }
        return nodes;
    }
}