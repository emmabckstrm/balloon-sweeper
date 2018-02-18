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
      boardIsFlagged: this.createMultiArray(props.rows, props.cols, false),
      boardIsOpen: this.createMultiArray(props.rows, props.cols, false),
      boardIsMine: boardIsMine,
      boardValues: s,
      isPlaying: true,
      openedSquares: 0,
      squares: s,
      squaresToOpen: (Number(props.rows) * Number(props.cols) - Number(props.mines)),
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

				var surroundingPos = this.getSurroundingPos(r,c, boardIsMine);

				var mineCount = this.countAdjacentMines(r, c, surroundingPos[0], surroundingPos[1], boardIsMine);

        boardAdj[r][c] = mineCount;
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

				if (adjacent[currentRow][currentCol] === 0) {
					this.openSquare(currentRow,currentCol);
					this.openSurrounding(currentRow,currentCol);
				} else {
					this.openSquare(currentRow,currentCol);
				}

			}

		}
	}

  openSquare(row, col) {
    console.log("heu", row, col);
    const isOpen = this.state.boardIsOpen.slice();
    const isMine = this.state.boardIsMine.slice();
    const adjacent = this.state.boardAdjacent.slice();
    const values = this.state.boardValues.slice();
    let openedSquares2 = this.state.openedSquares;
    const squaresToOpen = this.state.squaresToOpen;
    if (isOpen[row][col] === false) {

      // if the opened tile is a mine
      if (isMine[row][col]) {
        // lose game
        this.setState({
          isPlaying: false,
        })
      } else {
        isOpen[row][col] = true;


        // if the opened square is 0
        if (adjacent[row][col] === 0) {
          values[row][col] = '';
          this.openSurrounding(row, col);
        } else {
          values[row][col] = adjacent[row][col];
        }
        let test = openedSquares2;
        test += 1;
        console.log(test, "test", row, col);
        this.setState({
          boardIsOpen: isOpen,
          boardValues: values,
          openedSquares: test,
        })

      }


    }
  }


  // Handles the click of a square
  handleClick(row, col, t) {
    if (this.state.isPlaying) {
      this.openSquare(row, col);

    }

  }
  handleRightClick(row, col, e) {
    // prevents the context menu
    e.preventDefault();
    if (this.state.isPlaying) {
      const isOpen = this.state.boardIsOpen.slice();
      const isFlagged = this.state.boardIsFlagged.slice();
      const values = this.state.boardValues.slice();
      console.log("right lcick");
      if (isOpen[row][col] === false) {
        if (isFlagged[row][col] === false) {

  				isFlagged[row][col] = true;
  				values[row][col] = 'F';

  			} else if (isFlagged[row][col] === true) {

  				isFlagged[row][col] = false;
  				values[row][col] = '';

  			}
        this.setState({
          boardIsFlagged: isFlagged,
          boardValues: values,
        })
      }
    }
  }



  render () {
    const rows = this.props.rows;
    const cols = this.props.cols;
    const status = this.state.isPlaying ? '' : 'You lost!';
    return (
      <div className="game">

        <h1>This is a game</h1>

        <Board
          boardIsOpen={this.state.boardIsOpen}
          boardValues={this.state.boardValues}
          rows={rows}
          cols={cols}
          onClick={(r,c,t) => this.handleClick(r,c,t)}
          onRightClick={(r,c,e) => this.handleRightClick(r,c,e)}
          />
        <h4>{status}</h4>
      </div>
    )
  }
}



export default Game;
