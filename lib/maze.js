// Get the modal
var modal = document.getElementById('modal');

// Get the button that opens the modal
var button = document.getElementById("modal-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
button.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const generateMaze = () => {
const size = document.getElementById('size').value;

const N = 1 << 0;
const E = 1 << 1;
const S = 1 << 2;
const W = 1 << 3;

const cell = 4;
const spacing = 1;

const cellSize = Math.floor((size - spacing) / (cell + spacing));

const cells = new Array(cellSize * cellSize);
const remainingCells = d3.range(cellSize * cellSize);
const previous = new Array(cellSize * cellSize);
let i0;
let x0;
let y0;

if (d3.select('canvas')) {
  d3.select('canvas').remove();
}

const maze = d3.select('.maze-container').append('canvas').attr('width', size).attr('height', size);
let context = maze.node().getContext('2d');

context.translate(Math.round((size - cellSize * cell - (cellSize + 1) * spacing) / 2), Math.round((size - cellSize * cell - (cellSize + 1) * spacing) / 2));

  context.fillStyle = 'green';
  const start = remainingCells.shift();
  cells[start] = 0;
  drawCell(start);
  context.fillStyle = "#00BCD4";
  const speed = document.getElementById('speedSlider').value;
  let t = d3.timer(() => {
    for (let i = 0; i < speed; ++i) {
      if (loopErasedRandomWalk()) {
        if (remainingCells.length === 0) {
          t.stop();
          colorMaze(cells, context);
        }
        return true;
      }
    }
  });


function loopErasedRandomWalk() {
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

function eraseWalk(i0, i2) {
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

d3.select(self.frameElement).style("height", size + "px");

};

const colorMaze = (cells, context) => {
  const size = document.getElementById('size').value;

  const N = 1 << 0;
  const E = 1 << 1;
  const S = 1 << 2;
  const W = 1 << 3;

  const cell = 4;
  const spacing = 1;

  const cellSize = Math.floor((size - spacing) / (cell + spacing));

  let distance = 0;
  let visited = new Array(cellSize * cellSize);
  let frontier = [(cellSize - 1) * cellSize];

  let t = d3.timer(function() {
    if (!(n0 = frontier.length)) return true;

    let colorOne = hexToRgb(document.getElementById('gradient-color-one').value);
    let colorTwo = hexToRgb(document.getElementById('gradient-color-two').value);

    distance++;
    context.fillStyle = d3.rgb((colorOne.r + ((distance % 255) * ((colorTwo.r - colorOne.r) / 255))), (colorOne.g + ((distance % 255) * ((colorTwo.g - colorOne.g) / 255))), (colorOne.b + ((distance % 255) * ((colorTwo.b - colorOne.b) / 255))));
    if (distance & 1) {
      for (var i = 0; i < n0; ++i) {
        fillCell(frontier[i]);
      }
    } else {
      var frontier1 = [],
          i0,
          i1,
          n0;

      for (var i = 0; i < n0; ++i) {
        i0 = frontier[i];
        if (cells[i0] & E && !visited[i1 = i0 + 1]) visited[i1] = true, fillEast(i0), frontier1.push(i1);
        if (cells[i0] & W && !visited[i1 = i0 - 1]) visited[i1] = true, fillEast(i1), frontier1.push(i1);
        if (cells[i0] & S && !visited[i1 = i0 + cellSize]) visited[i1] = true, fillSouth(i0), frontier1.push(i1);
        if (cells[i0] & N && !visited[i1 = i0 - cellSize]) visited[i1] = true, fillSouth(i1), frontier1.push(i1);
      }

      frontier = frontier1;
    }
  });

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

  function fillCell(i) {
    let x = i % cellSize, y = i / cellSize | 0;
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
}
