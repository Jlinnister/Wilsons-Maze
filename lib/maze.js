const width = 400;
const height = 400;
const size = 400;

const N = 1;
const E = 1;
const S = 1;
const W = 1;

const cell = 4;
const spacing = 4;

const cellWidth = Math.floor((size - spacing) / (cell + spacing));
const cellHeight = Math.floor((size - spacing) / (cell + spacing));

const cells = new Array(cellWidth * cellHeight);
const remainingCells = d3.range(cellWidth * cellHeight);
const previous = new Array(cellWidth * cellHeight);
let i0;
let x0;
let y0;

const maze = d3.select('.maze-container').append('canvas').attr('width', size).attr('height', size);
const context = maze.node().getContext('2d');

context.translate(Math.round((size - cellWidth * cell - (cellWidth + 1) * spacing) / 2), Math.round((size - cellHeight * cell - (cellHeight + 1) * spacing) / 2));

const generateMaze = () => {
  context.fillStyle = 'white';
  const start = remainingCells.shift();
  cells[start] = 0;
  drawCell(start);
  context.fillStyle = "magenta";
  const speed = document.getElementById("speedSlider").value;
  d3.timer(() => {
    for (let i = 0; i < speed; ++i) {
      if (loopErasedRandomWalk()) {
        return true;
      }
    }
  });
};

const loopErasedRandomWalk = () => {
  let i1;

  if (i0 == null) {
    do if ((i0 = remainingCells.shift()) == null) return true;
    while (cells[i0] >= 0);
    previous[i0] = i0;
    drawCell(i0);
    x0 = i0 % cellWidth;
    y0 = i0 / cellWidth | 0;
    return;
  }

  while (true) {
    i1 = Math.random() * 4 | 0;
    if (i1 === 0) { if (y0 <= 0) continue; --y0, i1 = i0 - cellWidth; }
    else if (i1 === 1) { if (y0 >= cellHeight - 1) continue; ++y0, i1 = i0 + cellWidth; }
    else if (i1 === 2) { if (x0 <= 0) continue; --x0, i1 = i0 - 1; }
    else { if (x0 >= cellWidth - 1) continue; ++x0, i1 = i0 + 1; }
    break;
  }

  if (previous[i1] >= 0) {
    eraseWalk(i0, i1);
  } else {
    previous[i1] = i0;
    drawCell(i1);
    if (i1 === i0 - 1) {
      fillEast(i1);
    } else if (i1 === i0 + 1) {
      fillEast(i0);
    } else if (i1 === i0 - cellWidth) {
      fillSouth(i1);
    } else {
      fillSouth(i0);
    }
  }

  if (cells[i1] >= 0) {
    context.save();
    context.fillStyle = '#fff';
    drawCell(i1);
    while ((i0 = previous[i1]) !== i1) {
      drawCell(i0);
      if (i1 === i0 + 1) {
        cells[i0] |= E;
        cells[i1] |= W;
        fillEast(i0);
      } else if (i1 === i0 - 1) {
        cells[i0] |= W;
        cells[i1] |= E;
        fillEast(i1);
      } else if (i1 === i0 + cellWidth) {
        cells[i0] |= S;
        cells[i1] |= N;
        fillSouth(i0);
      } else {
        cells[i0] |= N;
        cells[i1] |= S;
        fillSouth(i1);
      }
      previous[i1] = NaN;
      i1 = i0;
    }
    context.restore();
    previous[i1] = NaN;
    i0 = null;
  } else {
    i0 = i1;
  }
};

const eraseWalk = (i0, i2) => {
  var i1;
  context.save();
  context.globalCompositeOperation = "destination-out";
  do {
    i1 = previous[i0];
    if (i1 === i0 - 1) fillEast(i1);
    else if (i1 === i0 + 1) fillEast(i0);
    else if (i1 === i0 - cellWidth) fillSouth(i1);
    else fillSouth(i0);
    drawCell(i0);
    previous[i0] = NaN;
    i0 = i1;
  } while (i1 !== i2);
  context.restore();
};

function drawCell(i) {
  var x = i % cellWidth, y = i / cellWidth | 0;
  context.fillRect(x * cell + (x + 1) * spacing, y * cell + (y + 1) * spacing, cell, cell);
}

function fillEast(i) {
  var x = i % cellWidth, y = i / cellWidth | 0;
  context.fillRect((x + 1) * (cell + spacing), y * cell + (y + 1) * spacing, spacing, cell);
}

function fillSouth(i) {
  var x = i % cellWidth, y = i / cellWidth | 0;
  context.fillRect(x * cell + (x + 1) * spacing, (y + 1) * (cell + spacing), cell, spacing);
}

function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
      // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
  }

d3.select(self.frameElement).style("height", size + "px");
