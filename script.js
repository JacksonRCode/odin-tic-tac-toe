
function Board() {
  const rows = 3;
  const cols = 3;
  let board = [];
  const kiddos = document.querySelector('.control').children;

  const resetBoard = () => {
    board = [];
    let count = 0
    for ( let i = 0 ; i < rows ; i++ ) {
      board[i] = [];
      for ( let j = 0 ; j < cols ; j++ ) {
        board[i][j] = Tile();
        kiddos[count].innerHTML = '';
        count++;
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
    
    for ( let i = 0 ; i < rows ; i++ ) {
      for ( let j = 0 ; j < cols ; j++ ) {
        let v = board[i][j].getValue();
        if (v===1) {
          kiddos[count].innerHTML = 'X';
        } else if (v===2) {
          kiddos[count].innerHTML = 'O';
        } else {
          kiddos[count].innerHTML = '';
        }
        count++;
      }
    } 
    document.querySelector('.playByPlay').innerHTML = `${player.name}'s turn`;
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
          return 'win';
        } else if (draw === 9) {
          return 'draw';
        }
      }
    }
    return 0;
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
    { name: pOneName, id: 1, wins: 0 },
    { name: pTwoName, id: 2, wins: 0 },
    { name: "Draws", id: null, wins: 0 },
  ];

  let currentPlayer = players[0];

  const board = Board();

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
      const res = board.checkWin(currentPlayer);
      if (res) {
        gameOver(res);
      } else {
        switchCurrentPlayer();
        printNewRound();
      }
    } else {
      console.log("That tile has already been selected");
    } 
  };

  const victory = (draw) => {
    if (!draw) {
      currentPlayer.wins++;
    } else {
      players[2].wins++;
    }
  };

  const gameOver = (res) => {
    board.printBoard(currentPlayer);
    document.querySelector('.control').setAttribute('disabled', 'True');
    // alert(`${currentPlayer.name} has been declared victorius!`);
    // console.log(`${currentPlayer.name} has been declared victorius!`);
    if (res==='win'){
      document.querySelector('.playByPlay').innerHTML = `${currentPlayer.name} wins!!!!`;
      victory(0);
    } else {
      document.querySelector('.playByPlay').innerHTML = 'Tie game!';
      victory(1);
    }
    document.querySelector('.postOp').classList.remove('invisible');
    // Loser / person who didn't start this game starts the next game
    updateScore();
    switchCurrentPlayer();
  };

  const updateScore = () => {
    document.querySelector('.xScore').innerHTML = `${players[0].name}: ${players[0].wins}`; 
    document.querySelector('.oScore').innerHTML = `${players[1].name}: ${players[1].wins}`;
    document.querySelector('.drawScore').innerHTML = `${players[2].name}: ${players[2].wins}`;
  };

  return { playRound, setNames, printNewRound, resetBoard: board.resetBoard, updateScore };
}

(function ScreenPlay() {
  let game = GameController();  
  // game.board.resetBoard();

  const gameBoard = document.querySelector('.control');
  const options = document.querySelector('.options');
  const postOp = document.querySelector('.postOp');
  const referee = document.querySelector('.referee');

  // Start game button
  options.querySelector('.startGame').addEventListener('click', () => {
    let xName = options.querySelector('#x').value !== '' ? options.querySelector('#x').value : 'X';
    let yName = options.querySelector('#o').value !== '' ? options.querySelector('#o').value : 'O';

    options.querySelector('#x').value = '';
    options.querySelector('#o').value = '';

    game.setNames(
      xName,
      yName
    );

    start();
  });
  

  // Select tile
  const kiddos = gameBoard.children;
  for (let i = 0; i < kiddos.length; i++) {
    kiddos[i].addEventListener('click', () => {
      game.playRound(Math.floor(i / 3), i % 3);
    });
  }

  // Play again
  postOp.querySelector('.playAgain').addEventListener('click', () => {
    document.querySelector('.postOp').classList.add('invisible');
    start();
  });

  // Quit
  postOp.querySelector('.restart').addEventListener('click', () => {
    game = GameController();

    document.querySelector('.playByPlay').innerHTML = ''; 
    document.querySelector('.postOp').classList.add('invisible');
    gameBoard.classList.add('invisible');
    referee.classList.add('invisible');
    options.classList.remove('invisible');

    game.resetBoard();
    game.updateScore();
  });

  const start = () => {
    gameBoard.removeAttribute('disabled');
    gameBoard.classList.remove('invisible');
    options.classList.add('invisible');
    referee.classList.remove('invisible');
    
    game.resetBoard();
    game.printNewRound();
    game.updateScore();
  }
})();


// const game = GameController();