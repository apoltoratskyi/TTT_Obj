function Game (gameOver = null, grid = []) {
  this.gameOver = gameOver; // 1 - win; 2 - draw
  this.grid = grid; // array of squares obj
  this.checkWin = function (square, turn) {
    for (let i = 0; i < 3; i++) {
      if (square[i*3].mark === square[i*3+1].mark && square[i*3].mark === square[i*3+2].mark // check rows
        || square[i].mark === square[i+3].mark && square[i].mark === square[i+6].mark  // check columns
        || square[0].mark === square[4].mark && square[0].mark === square[8].mark // check diagonals
        || square[2].mark === square[4].mark && square[2].mark === square[6].mark)
      {
        this.gameOver = 1;
      }
    }
    if (square.every(function(element) {return typeof element === 'string';})) {
      this.gameOver = 2;
    }
  }

  this.switchTurn = function (turn) {
    return turn === 'X' ? 'O' : 'X';
  }

  this.newGame = function () {
    let grid = document.getElementById("grid");
    for (let i = 0; i < 9; i++) {
      let div = document.createElement("div");
      div.setAttribute("class", "cell");
      div.setAttribute("id", i);
      if (i < 2) {
        div.style.borderStyle = "none solid none none";
      } else if (i === 5 || i === 8) {
        div.style.borderStyle = "solid none none none";
      } else if (i === 2) {
        div.style.borderStyle = "none none none none";
      } else {
        div.style.borderStyle = "solid solid none none";
      }
      grid.appendChild(div);

      // create an array of square objects
      this.grid.push(new Square(i));
    }
  }

  this.restart = function () {
    location.reload();
  }
}

function Square (mark= '') {
  this.mark = mark; // X or O
  this.placeMark = function (position, turn) {
    if (turn === 'O') {
      document.getElementById(position).innerHTML = '⭕';
      this.mark = 'O';
    }
    if (turn === 'X') {
      document.getElementById(position).innerHTML = '❌';
      this.mark = 'X';
    }
    this.isEmpty = false;
  }
  this.showMark = function (turn, position){
    let cell = document.getElementById(position);
    cell.innerHTML = turn;
  }
  this.hideMark = function (position){
    document.getElementById(position).innerHTML = "";
  }
  this.isEmpty = true;
}


window.onload = function (){
  let turn = 'X'; // default value = X
  let game = new Game();

  // set who's doing the first move
  document.getElementById('buttons').addEventListener('click', function (e){
    turn =  e.target.id;
  })
  document.getElementById('reset').addEventListener('click', function (e){
    game.restart();
  })
  // create board
  game.newGame();

  // show what's next X or O
  document.getElementById('grid').addEventListener('mouseover', function (e){
    if (e.target.className === 'cell') {
      let position = e.target.id;
      if (game.grid[position].isEmpty) {
        game.grid[position].showMark(turn, position);
      }
    }
  })

  document.getElementById('grid').addEventListener('mouseout', function (e){
    if (e.target.className === 'cell') {
      let position = e.target.id;
      if (game.grid[position].isEmpty) {
        game.grid[position].hideMark(position);
      }
    }
  })

  document.getElementById('grid').addEventListener('click', function clickGrid (e){
    let position = e.target.id;
    let square  = game.grid[position];
    if (square.isEmpty) {
      square.placeMark(position, turn);
    }
    game.checkWin(game.grid, turn);
    if (game.gameOver === 1){
      document.getElementById('message').innerHTML = (turn+" Win");
      document.getElementById('grid').removeEventListener('click', clickGrid);
      return
    } else if (game.gameOver === 2) {
      document.getElementById('message').innerHTML = ("Draw");
      document.getElementById('grid').removeEventListener('click', clickGrid);
      return
    }
    turn = game.switchTurn(turn);
  })
}
