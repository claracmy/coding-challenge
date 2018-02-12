function init() {
  //Extract text from file
  const fs = require('fs');
  const file = process.argv.slice(2);
  const text = fs.readFileSync(file[0]).toString('utf-8').trim();
  const _ = require('lodash');
  let mapMatrix = [];

  //Extract coordinates into an array.
  const textArray = text.replace(/\n/g, '').split(',');
  const charsArray = textArray.map(coords => {
    return coords.split('').map(chars => {
      return _.toNumber(chars);
    });
  });
  const coordsArray = charsArray.map(chars => {
    return _.without(chars, NaN);
  });
  const obstacleArray = coordsArray.slice(1, -1);

  //Calculate starting and ending points and map size
  const xcoords = coordsArray.map(coords => {
    return coords[0];
  });
  const ycoords = coordsArray.map(coords => {
    return coords[1];
  });
  const maxX = Math.max(...xcoords);
  const maxY = Math.max(...ycoords);
  const minX = Math.min(...xcoords);
  const minY = Math.min(...ycoords);
  const startX = coordsArray[0][0];
  const startY = coordsArray[0][1];
  const endX = _.last(coordsArray)[0];
  const endY = _.last(coordsArray)[1];

  drawMap();
  findPath();

  function drawMap() {
    //iterate through all coords and push 0 for sailable tiles and 1 for obstacles.
    for (let i = 0; i <= maxY; i++) {
      for (let j = 0; j <= maxX; j++) {
        const gridCoords = JSON.stringify([minX + j, minY + i]);
        if (_.includes(JSON.stringify(obstacleArray),gridCoords)) {
          mapMatrix.push(1);
        } else {
          mapMatrix.push(0);
        }
      }
    }
    //split array of 0 and 1 into grid format
    mapMatrix = _.chunk(mapMatrix, maxX + 1);
  }

  function findPath(){
    const easystarjs = require('easystarjs');
    const easystar = new easystarjs.js();
    easystar.setGrid(mapMatrix);
    easystar.setAcceptableTiles([0]);
    easystar.findPath(startX, startY, endX, endY, function(path) {
      if (path === null) {
        console.log('Error, path not found');
        fs.writeFileSync(file + '.answer', 'error');
      } else {
        console.log(`Shortest path found with ${path.length} steps`);
        for (let i = 0; i < path.length; i++) {
          // Mark the path with 'O' on the matrix
          mapMatrix[path[i].y][path[i].x] = 'O';
          // To allow path to be marked before answer is drawn
          if (i === path.length - 1) {
            drawAnswer();
          }
        }
      }
    });
    easystar.calculate();
  }

  function drawAnswer(){
    let answerMatrix = mapMatrix;
    //Set starting and ending points
    answerMatrix[coordsArray[0][1]][coordsArray[0][0]] = 'S';
    answerMatrix[_.last(coordsArray)[1]][_.last(coordsArray)[0]] = 'E';
    // Mark obstacles with x and sailable tiles with .
    answerMatrix = answerMatrix.map(rows => {
      const newRows = rows.toString().replace(/1/g,'x').replace(/0/g,'.').replace(/,/g, '');
      const replacedRows = _.toArray(newRows);
      return _.join(replacedRows, '');
    });
    const answer = answerMatrix.toString().replace(/,/g, '\n');
    fs.writeFileSync(file + '.answer', answer);
    console.log(`Answer Exported to ${file + '.answer'}.`);
  }
}

init();
