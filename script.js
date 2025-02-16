
function Board() {
  const rows = 3;
  const cols = 3;
  let board = [];

  const resetBoard = () => {
    for ( let i = 0 ; i < rows ; i++ ) {
      board[i] = [];
      for ( let j = 0 ; j < cols ; j++ ) {
        board[i][j] = Tile();
      }
    }
  }
  // for ( let i = 0 ; i < rows ; i++ ) {
  //   board[i] = [];
  //   for ( let j = 0 ; j < cols ; j++ ) {
  //     board[i][j] = Tile();
  //   }
  // }

  const printBoard = (player) => {
    //console
    // const boardWithValues = board.map((row) => row.map((tile) => tile.getValue()));
    // console.log(boardWithValues);

    // ui  
    let count = 0;
    const kiddos = document.querySelector('.control').children;
    for ( let i = 0 ; i < rows ; i++ ) {
      for ( let j = 0 ; j < cols ; j++ ) {
        let v = board[i][j].getValue();
        if (v===1) {
          kiddos[count].innerHTML = 'X';
        } else if (v===2) {
          kiddos[count].innerHTML = 'O';
        }
        count++;
      }
    } 
    document.querySelector('.playByPlay').innerHTML = `It is ${player.name}'s turn`;
  }

  const selectTile = (player, r, c) => {
    return board[r][c].claimTile(player);
  }

  const checkWin = (player) => {
    const winValue = player.id;

    let row;
    let col = [0,0,0];
    let diag = [0,0];

    let draw = 0;

    for (let i = 0; i < 3; i++) {
      row = 0;
      for (let j = 0; j < 3; j++) {
        let curr = board[i][j].getValue();
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
          return 1;
        } else if (draw === 9) {
          return 0;
        }
      }
    }
  }

  return { printBoard, selectTile, checkWin, resetBoard }
}

function Tile() {
  let value = 0;

  // Need functions to:
  // 1. claim tile
  // 2. return tile value

  const claimTile = (player) => {
    if (!value) {
      value = player.id;
      return value;
    }
    return 0;
  }

  const getValue = () => value;

  return { claimTile, getValue };

}

function GameController(pOneName = "X", pTwoName = "O") {
  let players = [
    { name: pOneName, id: 1 },
    { name: pTwoName, id: 2 }
  ];

  let currentPlayer = players[0];

  const board = Board();
  board.resetBoard();

  const setNames = (xName, oName) => {
    players[0].name = xName;
    players[1].name = oName;
  }

  const switchCurrentPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  const getCurrentPlayer = () => currentPlayer;

  const printNewRound = () => {
    board.printBoard(currentPlayer);
  };

  const playRound = (r,c) => {
    if (board.selectTile(currentPlayer, r, c)) {
      if (board.checkWin(currentPlayer)) {
        console.log("here");
        gameOver();
      } else {
        switchCurrentPlayer();
        printNewRound();
      }
    } else {
      console.log("That tile has already been selected");
    }
    
    // win condition
    
      
  };

  const gameOver = () => {
    board.printBoard(currentPlayer);
    document.querySelector('.control').setAttribute('disabled', 'True');
    // alert(`${currentPlayer.name} has been declared victorius!`);
    // console.log(`${currentPlayer.name} has been declared victorius!`);
    document.querySelector('.playByPlay').innerHTML = `${currentPlayer.name} wins!!!!`;

  };


  return { switchCurrentPlayer, getCurrentPlayer, playRound, setNames, printNewRound };
}

(function ScreenPlay() {
  const game = GameController();  
  // game.board.resetBoard();

  const gameBoard = document.querySelector('.control');
  const options = document.querySelector('.options');

  // Start game button
  options.querySelector('.startGame').addEventListener('click', () => {
    gameBoard.removeAttribute('disabled');
    options.setAttribute('disabled', 'True');
    options.classList.add('invisible');

    game.setNames(
      options.querySelector('#x').value,
      options.querySelector('#o').value
    );
    game.printNewRound();
  });


  // Select tile
  const kiddos = gameBoard.children;
  for (let i = 0; i < kiddos.length; i++) {
    kiddos[i].addEventListener('click', () => {
      game.playRound(Math.floor(i / 3), i % 3);
    });
  }


})();


// const game = GameController();