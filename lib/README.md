## Maze-Generator
Creates a perfect maze using Wilson's Algorithm

There are many variations and ways to draw a maze. A subset of mazes called 'perfect' mazes, are defined as those that have no loops or closed circuits and no enclosed areas.

However, perfect maze generation algorithms are not all equal. Several characteristics that differentiate them include the algorithm type, the memory and time that it requires, whether it is bias-free and uniformity.

This simulation uses Wilson's Algorithm, a tree type algorithm that is one of the few ways to create a bias free and uniform maze.

### Functionality and MVP
The maze generator will allow users to:
- [ ] Input the size of the maze they wish to generate
- [ ] Change the speed in which the maze is generated
- [ ] Utilize D3.js to illustrate the maze
- [ ] Visualize the algorithm tree with a chosen color set
- [ ] A descriptive modal about Wilson's Algorithm
- [ ] Production readme

### Wireframes
<img src="https://cloud.githubusercontent.com/assets/15305961/18424438/81eaaf2e-7864-11e6-92f8-8033a22d2322.png">

### Architecture and Technologies
This project will be implemented with the following technologies:
- JavaScript ES6 for overall structure and logic
- `D3.js` with `HTML5 Canvas` for DOM manipulation and rendering
- Webpack to transpile

### Implementation Timeline
Day 1: Initialize setup with webpack and `D3.js`. Goals for day 1 include getting familiar with `D3.js` and experiment with rendering elements.

Day 2: Begin research and coding of Wilson's Algorithm in basic JavaScript. Goal for the end of the day is to be able to generate a small fixed-sized maze.

Day 3: Create the visualization logic using `D3.js` and `HTML Canvas` to visualize the algorithm tree.

Day 4: Include frontend optionality to change the size of the maze, the speed that it is generated, the color palette and overall looks.

### Bonus Features
Additional features that may be included:
- [ ] Option for other maze generation algorithms
- [ ] Including maze-solving algorithms
