const modal = document.getElementById('modal');
const button = document.getElementById("modal-button");
const span = document.getElementsByClassName("close")[0];

button.onclick = () => {
  modal.style.display = 'block';
};

span.onclick = () => {
  modal.style.display = 'none';
};

window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

const generateMaze = () => {
  const size = document.getElementById('size').value;

  const above = 1 << 0;
  const left = 1 << 1;
  const below = 1 << 2;
  const right = 1 << 3;

  const cell = 4;
  const spacing = 1;

  const cellSize = Math.floor((size - spacing) / (cell + spacing));

  const cells = new Array(Math.pow(cellSize, 2));
  const remainingCells = d3.range(Math.pow(cellSize, 2));
  const previous = new Array(Math.pow(cellSize, 2));
  let index0;
  let x0;
  let y0;

  if (d3.select('canvas')) {
    d3.select('canvas').remove();
  }

  const maze = d3.select('.maze-container').append('canvas').attr('width', size).attr('height', size);
  let context = maze.node().getContext('2d');
  const grid = Math.round((size - cellSize * cell - (cellSize + 1) * spacing) / 2)
  context.translate(grid, grid);
  context.fillStyle = 'green';
  const start = remainingCells.shift();
  cells[start] = 0;
  drawCell(start);
  context.fillStyle = '#00BCD4';

  const speed = document.getElementById('speedSlider').value;
  const t = d3.timer(() => {
    for (let i = 0; i < speed; ++i) {
      if (randomWalk()) {
        if (remainingCells.length === 0) {
          t.stop();
          colorMaze(cells, context);
        }
        return true;
      }
    }
  });

  function randomWalk() {
    let index1;
    if (index0 == null) {
      do {
        if ((index0 = remainingCells.shift()) == null) {
          return true;
        }
      } while (cells[index0] >= 0);
      previous[index0] = index0;
      drawCell(index0);
      x0 = index0 % cellSize;
      y0 = index0 / cellSize | 0;
    }

    while (true) {
      index1 = Math.random() * 4 | 0;
      if (index1 === 0) {
        if (y0 <= 0) {
          continue;
        }
        --y0, index1 = index0 - cellSize;
      } else if (index1 === 1) {
        if (y0 >= cellSize - 1) {
          continue;
        }
        ++y0, index1 = index0 + cellSize;
      } else if (index1 === 2) {
        if (x0 <= 0) {
          continue;
        }
        --x0, index1 = index0 - 1;
      } else {
        if (x0 >= cellSize - 1) {
          continue;
        }
        ++x0, index1 = index0 + 1;
      }
      break;
    }

    if (previous[index1] >= 0) {
      eraseWalk(index0, index1);
    } else {
      previous[index1] = index0;
      drawCell(index1);
      if (index1 === index0 - 1) {
        drawRight(index1);
      } else if (index1 === index0 + 1) {
        drawRight(index0);
      } else if (index1 === index0 - cellSize) {
        drawBelow(index1);
      } else {
        drawBelow(index0);
      }
    }

    if (cells[index1] >= 0) {
      context.save();
      context.fillStyle = '#fff';
      drawCell(index1);
      while ((index0 = previous[index1]) !== index1) {
        drawCell(index0);
        if (index1 === index0 + 1) {
          cells[index0] |= left;
          cells[index1] |= right;
          drawRight(index0);
        } else if (index1 === index0 - 1) {
          cells[index0] |= right;
          cells[index1] |= left;
          drawRight(index1);
        } else if (index1 === index0 + cellSize) {
          cells[index0] |= below;
          cells[index1] |= above;
          drawBelow(index0);
        } else {
          cells[index0] |= above;
          cells[index1] |= below;
          drawBelow(index1);
        }
        previous[index1] = NaN;
        index1 = index0;
      }
      context.restore();
      previous[index1] = NaN;
      index0 = null;
    } else {
      index0 = index1;
    }
  }

  function eraseWalk(index0, index2) {
    let index1;
    context.save();
    context.globalCompositeOperation = 'destination-out';
    do {
      index1 = previous[index0];
      if (index1 === index0 - 1) drawRight(index1);
      else if (index1 === index0 + 1) drawRight(index0);
      else if (index1 === index0 - cellSize) drawBelow(index1);
      else drawBelow(index0);
      drawCell(index0);
      previous[index0] = NaN;
      index0 = index1;
    } while (index1 !== index2);
    context.restore();
  }

  function drawCell(i) {
    const x = i % cellSize;
    const y = i / cellSize | 0;
    context.fillRect(x * cell + (x + 1) * spacing, y * cell + (y + 1) * spacing, cell, cell);
  }

  function drawRight(i) {
    const x = i % cellSize;
    const y = i / cellSize | 0;
    context.fillRect((x + 1) * (cell + spacing), y * cell + (y + 1) * spacing, spacing, cell);
  }

  function drawBelow(i) {
    const x = i % cellSize;
    const y = i / cellSize | 0;
    context.fillRect(x * cell + (x + 1) * spacing, (y + 1) * (cell + spacing), cell, spacing);
  }

  d3.select(self.frameElement).style('height', size + 'px');
};

const colorMaze = (cells, context) => {
  const size = document.getElementById('size').value;

  const above = 1 << 0;
  const left = 1 << 1;
  const below = 1 << 2;
  const right = 1 << 3;

  const cell = 4;
  const spacing = 1;

  const cellSize = Math.floor((size - spacing) / (cell + spacing));

  let distance = 0;
  let visited = new Array(Math.pow(cellSize, 2));
  let edge = [(cellSize - 1) * cellSize];

  let t = d3.timer(function() {
    if (!(n0 = edge.length)) return true;

    let colorOne = hexToRgb(document.getElementById('gradient-color-one').value);
    let colorTwo = hexToRgb(document.getElementById('gradient-color-two').value);

    distance++;
    context.fillStyle = d3.rgb((colorOne.r + ((distance % 255) * ((colorTwo.r - colorOne.r) / 255))), (colorOne.g + ((distance % 255) * ((colorTwo.g - colorOne.g) / 255))), (colorOne.b + ((distance % 255) * ((colorTwo.b - colorOne.b) / 255))));
    if (distance & 1) {
      for (let i = 0; i < n0; ++i) {
        fillCell(edge[i]);
      }
    } else {
      var edge1 = [],
          index0,
          index1,
          n0;

      for (let i = 0; i < n0; ++i) {
        index0 = edge[i];
        if (cells[index0] & left && !visited[index1 = index0 + 1]) visited[index1] = true, drawRight(index0), edge1.push(index1);
        if (cells[index0] & right && !visited[index1 = index0 - 1]) visited[index1] = true, drawRight(index1), edge1.push(index1);
        if (cells[index0] & below && !visited[index1 = index0 + cellSize]) visited[index1] = true, drawBelow(index0), edge1.push(index1);
        if (cells[index0] & above && !visited[index1 = index0 - cellSize]) visited[index1] = true, drawBelow(index1), edge1.push(index1);
      }

      edge = edge1;
    }
  });

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }

  function fillCell(i) {
    const x = i % cellSize;
    const y = i / cellSize | 0;
    context.fillRect(x * cell + (x + 1) * spacing, y * cell + (y + 1) * spacing, cell, cell);
  }

  function drawRight(i) {
    const x = i % cellSize;
    const y = i / cellSize | 0;
    context.fillRect((x + 1) * (cell + spacing), y * cell + (y + 1) * spacing, spacing, cell);
  }

  function drawBelow(i) {
    const x = i % cellSize;
    const y = i / cellSize | 0;
    context.fillRect(x * cell + (x + 1) * spacing, (y + 1) * (cell + spacing), cell, spacing);
  }
};
