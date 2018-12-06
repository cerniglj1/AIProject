The "greedy-search" files contain a playable version of the Snake game in the browser written in Javascript. The game has two modes: human player and bot player.

To launch the game, simply open the `alt-index.html` file in a browser.
Controls may be found at the bottom of the game screen.

Controls:
	Action				Key(s)
- To move the snake		Arrow Keys or WASD
- To start/restart the game	Space Bar
- To quit the game		Q


||======================================================================================||
To play the bot mode, click the Start button the left side of the game screen.

This snake bot uses a version of a Best-first greedy algorithm to make its decisions about which direction to take to reach the food.

What the snake knows?

The snake has limited knowledge of the game state and the environment at any time.
The snake knows the x/y for its head and the x/y for the food. The snake moves towards the row and column of the food based on the difference between it and the head x/y.
  (If the snake.x is 10 and the food.x is 15, the food is "right" of the snake)
  (0,0 upper left corner) 

How the snake moves itself?

During each move the snake examines if the head is "facing" a segment of itself and if there are any body segments to its immediate north, south, east, west of one square away. In this way the snake does not have full understanding of where its tail is but is only partially aware of the "visible" adjacent segments to the head at any moment. The snake will try to take the most direction route to the same row or column as the fruit and then continue straight until it crosses the fruit. Any deviation it makes can come only when it is about to collide with itself. It cannot make more complexing pathing with forethought for the position of its tail. 
When the snake is confronted with facing itself, it will try to turn 90 degrees from its current direction. (traveling left --> would turn either up or down, etc.)


* This section was completed by Sam Zierler * 
