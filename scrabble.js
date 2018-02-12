function scrabble() {
  const _ = require('lodash');
  const fs = require('fs');
  //Retrieve board and tiles
  const file = process.argv.slice(2);
  const input = fs.readFileSync(file[0]).toString('utf-8').trim();
  const inputArray = input.replace(/\n/g, ',').split(',');
  const tiles = inputArray.pop().toLowerCase().split('');
  const board = inputArray.map(each => {
    return each.toLowerCase().split('');
  });
  //Store dictionary in array
  const dictFile = process.argv.slice(3);
  const dict = fs.readFileSync(dictFile[0]).toString('utf-8').trim();
  const dictArray = dict.replace(/\n/g, ',').split(',');
  //Scores
  const scores = [{1: 'eaionrtlsu'}, {2: 'dg'}, {3: 'bcmp'}, {4: 'fhvwy'}, {5: 'k'}, {8: 'jx'}, {10: 'qz'}];

  const tilesOnBoard = [];
  const tilesCoords = []
  findTilesOnBoard();
  findWordsOnBoard();

  function findTilesOnBoard() {
    //Board size is 15. Create an array of objects with the letter as key and the coords of the tile as value. Eg.[{S:[3,8]}]
    for (let i = 0; i <= 14; i ++ ) {
      for (let j = 0; j <= 14; j ++) {
        if (board[i][j] !== '-') {
          const letter = {};
          letter[board[i][j]] = [j, i];
          tilesOnBoard.push(letter);
          tilesCoords.push([j, i]);
        }
      }
    }
  }

  function findWordsOnBoard() {
    const wordsOnBoard = [];
    //Get array of coords of tiles on board.
    const wordsOnBoardCoords = tilesOnBoard.map(each => {
      const array = _.values(each);
      return _.flatten(array);
    });
    for (var i = 0; i < tilesOnBoard.length; i ++) {
      const coords = _.values(tilesOnBoard[i])[0];
      const right = [coords[0] + 1, coords[1]];
      const left = [coords[0] -1, coords[1]];
      const above = [coords[0], coords[1] - 1];
      const below = [coords[0], coords[1] + 1];
      if (_.includes(JSON.stringify(tilesCoords), right)) {
        console.log('I have a tile on my right', _.keys(tilesOnBoard[i]));
      } else if (right[0] < 15) {
        console.log('A tile can be placed on the right', coords);
      }
    }
    // }
  }



}

scrabble();
