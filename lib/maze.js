const generateMaze = () => {
const size = document.getElementById('size').value;

const N = 1;
const E = 1;
const S = 1;
const W = 1;

const cell = 4;
const spacing = 4;

const cellSize = Math.floor((size - spacing) / (cell + spacing));

const cells = new Array(cellSize * cellSize);
const remainingCells = d3.range(cellSize * cellSize);
const previous = new Array(cellSize * cellSize);
let i0;
let x0;
let y0;

if (d3.select('canvas')) {
  d3.select("canvas").remove();
}

const maze = d3.select('.maze-container').append('canvas').attr('width', size).attr('height', size);
const context = maze.node().getContext('2d');

context.translate(Math.round((size - cellSize * cell - (cellSize + 1) * spacing) / 2), Math.round((size - cellSize * cell - (cellSize + 1) * spacing) / 2));

  context.fillStyle = 'white';
  const start = remainingCells.shift();
  cells[start] = 0;
  drawCell(start);
  context.fillStyle = "#00BCD4";
  const speed = document.getElementById('speedSlider').value;
  d3.timer(() => {
    for (let i = 0; i < speed; ++i) {
      if (loopErasedRandomWalk()) {
        return true;
      }
    }
  });

const loopErasedRandomWalk = () => {
  let i1;

  if (i0 == null) {
    do if ((i0 = remainingCells.shift()) == null) return true;
    while (cells[i0] >= 0);
    previous[i0] = i0;
    drawCell(i0);
    x0 = i0 % cellSize;
    y0 = i0 / cellSize | 0;
    return;
  }

  while (true) {
    i1 = Math.random() * 4 | 0;
    if (i1 === 0) { if (y0 <= 0) continue; --y0, i1 = i0 - cellSize; }
    else if (i1 === 1) { if (y0 >= cellSize - 1) continue; ++y0, i1 = i0 + cellSize; }
    else if (i1 === 2) { if (x0 <= 0) continue; --x0, i1 = i0 - 1; }
    else { if (x0 >= cellSize - 1) continue; ++x0, i1 = i0 + 1; }
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
    } else if (i1 === i0 - cellSize) {
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
      } else if (i1 === i0 + cellSize) {
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
    else if (i1 === i0 - cellSize) fillSouth(i1);
    else fillSouth(i0);
    drawCell(i0);
    previous[i0] = NaN;
    i0 = i1;
  } while (i1 !== i2);
  context.restore();
};

function drawCell(i) {
  var x = i % cellSize, y = i / cellSize | 0;
  context.fillRect(x * cell + (x + 1) * spacing, y * cell + (y + 1) * spacing, cell, cell);
}

function fillEast(i) {
  var x = i % cellSize, y = i / cellSize | 0;
  context.fillRect((x + 1) * (cell + spacing), y * cell + (y + 1) * spacing, spacing, cell);
}

function fillSouth(i) {
  var x = i % cellSize, y = i / cellSize | 0;
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
};
