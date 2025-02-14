
// Gameboard function
function Gameboard(domBoard) {
  // Board dimensions
  const rows = 3;
  const columns = 3;
  const board = [];

  // create 2D array for state of the game board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = Tile();
    }
  }

  const getBoard = () => board;

  const getDimensions = () => [rows, columns];

  const printBoard = () => {
    // const boardWithValues = board.map((row) => row.map((tile) => tile.getTileValue()));
    // console.log(boardWithValues);
    const kids = domBoard.children;
    // console.log(gameBoard);
    let index=0;
    for (let i = 0; i<rows; i++) {
      for (let j = 0; j<columns; j++) {
        let tileValue = board[i][j].getTileValue();
        if (tileValue === 1) {
          kids[index].innerHTML = 'X';
        } else if (tileValue === 2) {
          kids[index].innerHTML = 'O';
        }

        index++;
      }
    }
  }

  const selectTile = (r, c, player) => {
    if (board[r][c].getTileValue()) {
      return 0;
    }

    board[r][c].claimTile(player);

    return 1;
  }

  return {
    getBoard,
    getDimensions,
    printBoard,
    selectTile,
  };
}


// Cell function representing each square
function Tile() {
  let value = 0;

  const claimTile = (player) => {
    value = player.id;
  }

  const getTileValue = () => value;

  return {
    claimTile,
    getTileValue,
  };
}



// Function for controlling the game flow
function GameControl(
  playerOneName = "P1",
  playerTwoName = "P2"
  ) {
  
  const domBoard = document.querySelector('.gameboard');

  const board = Gameboard(domBoard);
  
  const players = [
    {
      name: playerOneName,
      id: 1,
    },
    {
      name: playerTwoName,
      id: 2,
    }
  ];

  let currentPlayer = players[0];

  const changePlayerTurn = () => {
    currentPlayer = currentPlayer === players[0] ? players[1]: players[0];
  };

  const getCurrentPlayer = () => currentPlayer;
  
  const printNewTurn = () => {
    board.printBoard();
    console.log(`${currentPlayer.name}'s turn!`);
  }

  const checkWin = () => {
    const winValue = currentPlayer.id;
    const b = board.getBoard();

    let row;
    let col = [0,0,0];
    let diag = [0,0];

    let draw = 0;

    for (let i = 0; i < 3; i++) {
      row = 0;
      for (let j = 0; j < 3; j++) {
        let curr = b[i][j].getTileValue();
        // Check winvalue
        if (curr === 1 || curr === 2) {
          draw++;
        }

        if (curr === winValue) {
          // row
          row++;

          // col
          col[j]++;

          if (i === j) {
            diag[0]++;
          }
          
          if (i + j === 2) {
            diag[1]++;
          }
        }
        // console.log(`Checking? row: ${row}, col: ${col}, diag: ${diag}`);
        if (row === 3 || col[j] === 3 || diag[0] === 3 || diag[1] === 3) {
          gameOver('win');
        } else if (draw === 9) {
          gameOver('draw');
        }
      }
    }
  }

  const gameOver = (type) => {
    if (type === 'win') {
      console.log(`${currentPlayer.name} wins!`);
    } else {
      console.log("Draw");
    }
  }

  const playTurn = (row, column) => {
    console.log(row,column);
    if (board.selectTile(row, column, currentPlayer)) {
      checkWin();
      changePlayerTurn();
    } else {
      console.log("That tile has already been selected");
    }    

    printNewTurn();
  }

  const getDomBoard = () => domBoard;

  printNewTurn();

  return {
    playTurn,
    getCurrentPlayer,
    getDomBoard,
  };

};

(function interact() {
  console.log("Penis")
  const game = GameControl("J", "I");
  const domBoard = game.getDomBoard();

  // Start game button
  

  // Set up tile event listeners
  const kids = domBoard.children;

  for (let i = 0; i < 9; i++) {
    kids[i].addEventListener('click', () => {
      game.playTurn(Math.floor(i/3), i%3);
    })
  }


})();
