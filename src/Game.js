import React, { Component } from 'react';
import './Game.css';

class Square extends Component {
  render () {
    const classN = this.props.isOpen ? "square open" : "square";
    return (
      <div
        className={classN}
        onClick={this.props.onClick}
        >
          {this.props.value}
      </div>
    )
  }
}

class Board extends Component {

  renderSquare(i,j,totalSquares) {
    //console.log(this.props.squares);
    return (
      <Square
        isOpen={this.props.boardIsOpen[i][j]}
        value={this.props.boardValues[i][j]}
        row={i}
        col={j}
        key={totalSquares}
        onClick={() => this.props.onClick(i,j,totalSquares)}
      />
    )
  }

  render () {
    var rowArray = [];
    var colArray = [];
    var totalSquares = 0;
    for (var i = 0; i < this.props.rows; i++) {
      colArray = [];
      for (var j=0; j<this.props.cols; j++) {
        totalSquares += 1;
        colArray.push(this.renderSquare(i,j,totalSquares));
      }
      rowArray.push(<div key={i}>{colArray}</div>);
    }
    return (
      <h3>Hello {rowArray}</h3>
    );
  }
}


class Game extends Component {
  constructor(props) {
    super(props);

    const s = this.createMultiArray(props.rows, props.cols);

    const boardDataTemp = this.createMultiArray(props.rows, props.cols);
    const boardData = this.createBoardData(boardDataTemp, props.mines);
    console.log(boardData);

    /*
    open
    flagged
    */
    this.state = {
      boardIsFlagged: this.createMultiArray(props.rows, props.cols, false),
      boardIsOpen: this.createMultiArray(props.rows, props.cols, false),
      boardData: boardData,
      boardValues: s,
      isPlaying: true,
      squares: s,
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
      var run = true;
      var row = this.randomIntFromInterval(0, rows);
      var col = this.randomIntFromInterval(0, cols);
      while(bd[row][col] === '*') {
        row = this.randomIntFromInterval(0, rows);
        col = this.randomIntFromInterval(0, cols);
      }
      bd[row][col] = '*';

    }
    return bd;
  }
  randomIntFromInterval(min,max) {
      var num = Math.floor(Math.random()*(max-min)+min);
      return num;
  }


  // Handles the click of a square
  handleClick(row, col, t) {
    console.log("Hello, click. Row ", row, " col ", col, t);
    const sq = this.state.boardValues.slice();
    const isOpen = this.state.boardIsOpen.slice();
    isOpen[row][col] = true;
    //sq[0][0] = '-';
    this.setState({
      boardIsOpen: isOpen,
    })
  }



  render () {
    const rows = this.props.rows;
    const cols = this.props.cols;
    return (
      <div className="game">

        <h1>This is a game</h1>
        <Board
          boardIsOpen={this.state.boardIsOpen}
          boardValues={this.state.boardValues}
          rows={rows}
          cols={cols}
          onClick={(r,c,t) => this.handleClick(r,c,t)}/>
      </div>
    )
  }
}



export default Game;
