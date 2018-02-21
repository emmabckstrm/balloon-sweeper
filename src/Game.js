import React, { Component } from 'react';
import './Game.css';
import Board from './Board.js';


class Game extends Component {
  constructor(props) {
    super(props);

    const s = this.createMultiArray(props.rows, props.cols);

    const boardIsMineTemp = this.createMultiArray(props.rows, props.cols);
    const boardIsMine = this.createBoardData(boardIsMineTemp, props.mines);
    var boardAdj = this.createMultiArray(props.rows, props.cols);
    boardAdj = this.updateSurroundingMineCount(boardAdj,boardIsMine);
    console.log(boardAdj);

    this.state = {
      boardAdjacent: boardAdj,
      boardData: boardAdj,
      boardIsFlagged: this.createMultiArray(props.rows, props.cols, false),
      boardIsOpen: this.createMultiArray(props.rows, props.cols, false),
      boardIsMine: boardIsMine,
      boardValues: s,
      flags: 0,
      isPlaying: true,
      loss: false,
      openedSquares: 0,
      squares: s,
      squaresToOpen: (Number(props.rows) * Number(props.cols) - Number(props.mines)),
      win: false,
    }
  }
  // Creates an array with specified data
  createMultiArray(rows, cols, value=null) {
    const s = new Array(Number(rows));
    for (var i=0; i<rows; i++) {
      s[i] = new Array(Number(cols)).fill(value);
    }
    return s;
  }
  createBoardData(boardArray, mines) {
    const rows = boardArray.length;
    const cols = boardArray[0].length;
    var bd = boardArray.slice();
    for (var k=0;k<Number(mines);k++) {
      var row = this.randomIntFromInterval(0, rows);
      var col = this.randomIntFromInterval(0, cols);
      while(bd[row][col] === true) {
        row = this.randomIntFromInterval(0, rows);
        col = this.randomIntFromInterval(0, cols);
      }
      bd[row][col] = true;

    }
    return bd;
  }
  randomIntFromInterval(min,max) {
      var num = Math.floor(Math.random()*(max-min)+min);
      return num;
  }

  // get the indexes of surrounding squares
  getSurroundingPos(r, c, board) {
		var rAround;
		var cAround;
		if (r === 0) { // first row
			if (c === 0) {
				rAround = [0, 1, 1];
				cAround = [1, 0, 1];
			} else if (c === board[0].length-1) {
				rAround = [0, 1, 1];
				cAround = [-1, -1, 0];
			} else {
				rAround = [0, 1, 1, 1, 0];
				cAround = [-1, -1, 0, 1, 1];
			}
		} else if (r === board.length-1) { // last row
			if (c === 0) {
				rAround = [-1, -1, 0];
				cAround = [0, 1, 1];
			} else if (c === board[0].length-1) {
				rAround = [0, -1, -1];
				cAround = [-1, -1, 0];
			} else {
				rAround = [0, -1, -1, -1, 0];
				cAround = [-1, -1, 0, 1, 1];
			}
		} else { // the other rows
			if (c === 0) {
				rAround = [-1, -1, 0, 1, 1];
				cAround = [0, 1, 1, 0, 1];
			} else if (c === board[0].length-1) {
				rAround = [-1, -1, 0, 1, 1];
				cAround = [-1, 0, -1, -1, 0];
			} else {
				rAround = [-1, -1, -1, 0, 0, 1, 1, 1];
				cAround = [-1, 0, 1, -1, 1, -1, 0, 1];
			}
		}

		return [rAround, cAround];

	}

  // counts how many of the adjacent tiles that are mines
  countAdjacentMines(r, c, rowPos, colPos, boardIsMine) {
		var mineCount = 0;

		for (var i = 0; i < rowPos.length; i++) {
			if ( boardIsMine[r+rowPos[i]][c+colPos[i]] === true ) {
				mineCount += 1;
			}
		}

		return mineCount;
	}
  // updates the data of the squares to say how many adjacent mines there are
  updateSurroundingMineCount(boardAdjacent, boardIsMine) {
		var boardAdj = boardAdjacent;

		for (var r = 0; r < boardAdj.length; r++) {

			for (var c = 0; c < boardAdj[0].length; c++) {
        // if the current square contains a mine
        if (boardIsMine[r][c]) {
          boardAdj[r][c] = '*';
        } else {
          // if no mine, count surrounding mines
          var surroundingPos = this.getSurroundingPos(r,c, boardIsMine);
  				var mineCount = this.countAdjacentMines(r, c, surroundingPos[0], surroundingPos[1], boardIsMine);
          if (mineCount>0) {
              boardAdj[r][c] = mineCount;
          }
        }

			}

		}
    return boardAdj;
	}
  // gets clicked tile, if it's empty, open it
  // checks surrounding tiles, if a surrounding tile is empty, check its surrounding
  openSurrounding(r, c) {
    const isOpen = this.state.boardIsOpen.slice();
    const isFlagged = this.state.boardIsFlagged.slice();
    const isMine = this.state.boardIsMine.slice();
    const adjacent = this.state.boardAdjacent.slice();

		var surroundingPos = this.getSurroundingPos(r, c, adjacent);
		var rAround = surroundingPos[0];
		var cAround = surroundingPos[1];

		for (var i = 0; i < rAround.length; i++) {
			var currentRow = r+rAround[i];
			var currentCol = c+cAround[i];

      // the square is not opened, not flagged and not a mine, open it
			if (isOpen[currentRow][currentCol] === false && isFlagged[currentRow][currentCol] === false && isMine[currentRow][currentCol] !== true) {

				if (adjacent[currentRow][currentCol] === 0 || adjacent[currentRow][currentCol] === null) {
					this.openSquare(currentRow,currentCol);
					this.openSurrounding(currentRow,currentCol);
				} else {
					this.openSquare(currentRow,currentCol);
				}

			}

		}
	}

  openSquare(row, col) {
    const isOpen = this.state.boardIsOpen.slice();
    const isMine = this.state.boardIsMine.slice();
    const adjacent = this.state.boardAdjacent.slice();
    const values = this.state.boardValues.slice();
    if (isOpen[row][col] === false) {
      // if the opened tile is a mine
      if (isMine[row][col]) {
        // lose game
        this.loseGame();
        this.openAllSquares();
      } else {
        isOpen[row][col] = true;
        // if the opened square is 0 or null, open surrounding squares
        if (adjacent[row][col] === 0 || adjacent[row][col] === null) {
          values[row][col] = '';
          this.openSurrounding(row, col);
        } else {
          values[row][col] = adjacent[row][col];
        }
        // syntax for updating state when it's calculated based on prev state
        this.setState((state) => ({
          boardIsOpen: isOpen,
          boardValues: values,
          openedSquares: state.openedSquares +1,
        }));
      }
    }
  }
  resetGame() {
    const s = this.createMultiArray(this.props.rows, this.props.cols);

    const boardIsMineTemp = this.createMultiArray(this.props.rows, this.props.cols);
    const boardIsMine = this.createBoardData(boardIsMineTemp, this.props.mines);
    var boardAdj = this.createMultiArray(this.props.rows, this.props.cols);
    boardAdj = this.updateSurroundingMineCount(boardAdj,boardIsMine);

    this.setState({
      boardAdjacent: boardAdj,
      boardData: boardAdj,
      boardIsFlagged: this.createMultiArray(this.props.rows, this.props.cols, false),
      boardIsOpen: this.createMultiArray(this.props.rows, this.props.cols, false),
      boardIsMine: boardIsMine,
      boardValues: s,
      flags: 0,
      isPlaying: true,
      loss: false,
      openedSquares: 0,
      squares: s,
      squaresToOpen: (Number(this.props.rows) * Number(this.props.cols) - Number(this.props.mines)),
      win: false,
    })
  }
  winGame() {
    this.setState({
      isPlaying: false,
      win: true,
    })
  }
  loseGame() {
    this.setState({
      isPlaying: false,
      loss: true,
    })
  }
  openAllSquares() {
    const isOpenOriginal = this.state.boardIsOpen.slice();
    const adjacent = this.state.boardAdjacent.slice();
    let isOpen = [];
    for (var i=0; i<isOpenOriginal.length; i++) {
      let isOpenArray = isOpenOriginal[i].map(x => true);
      isOpen.push(isOpenArray);
    }
    this.setState({
      boardIsOpen: isOpen,
      boardValues: adjacent,
    })
  }
  // on component update
  // checks if the number of oopened squares is equal to squares to open
  componentDidUpdate(prevProps, prevState) {
    // only changes the state if the game is playing
    if (this.state.isPlaying) {
      if (this.state.openedSquares === this.state.squaresToOpen) {
        this.winGame();
      }
    }
  }
  // Handles the click of a square
  handleClick(row, col, t) {
    if (this.state.isPlaying) {
      this.openSquare(row, col);
    };
  }
  // handles a right click, flagging a square
  handleRightClick(row, col, e) {
    // prevents the context menu
    e.preventDefault();
    if (this.state.isPlaying) {
      const isOpen = this.state.boardIsOpen.slice();
      const isFlagged = this.state.boardIsFlagged.slice();
      const values = this.state.boardValues.slice();
      if (isOpen[row][col] === false) {
        if (isFlagged[row][col] === false && this.state.flags < this.props.mines) {

  				isFlagged[row][col] = true;
  				values[row][col] = 'F';
          this.setState((state) => ({
            flags: state.flags + 1,
          }));

  			} else if (isFlagged[row][col] === true) {

  				isFlagged[row][col] = false;
  				values[row][col] = '';
          this.setState((state) => ({
            flags: state.flags -1,
          }));
  			}
        this.setState((state) => ({
          boardIsFlagged: isFlagged,
          boardValues: values,
        }));
      }
    }
  }



  render () {
    const rows = this.props.rows;
    const cols = this.props.cols;
    const flags = this.state.flags;
    let status = "";//!this.state.isPlaying && !this.state.loss ? '' : 'You lost!';
    //status = !this.state.isPlaying && this.state.win ? '' : 'You won!';
    if (!this.state.isPlaying) {
      if (this.state.loss) {
        status = "You lost!";
      }
      else if (this.state.win) {
        status = "You won!";
      }
    }
    return (
      <div className="game">

        <h1>This is a game</h1>
        <p>Flags: {flags}</p>
        <Board
          boardIsMine={this.state.boardIsMine}
          boardIsOpen={this.state.boardIsOpen}
          boardValues={this.state.boardValues}
          rows={rows}
          cols={cols}
          onClick={(r,c,t) => this.handleClick(r,c,t)}
          onRightClick={(r,c,e) => this.handleRightClick(r,c,e)}
          />
        <h4>{status}</h4>
        <button onClick={() => this.resetGame()} className="btn">New game</button>
      </div>
    )
  }
}



export default Game;
