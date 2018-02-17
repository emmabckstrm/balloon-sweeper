import React, { Component } from 'react';
import './Game.css';

class Square extends Component {
  render () {
    return (
      <div className="square" onClick={this.props.onClick}>{this.props.value}</div>
    )
  }
}

class Board extends Component {

  renderSquare(i,j,totalSquares) {
    //console.log(this.props.squares);
    return (
      <Square
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

    const s = this.createBoardArray(props.rows, props.cols);

    const boardInfo = this.createBoardArray(props.rows, props.cols);
    boardInfo[0][1] = '*';
    console.log(boardInfo);

    /*
    open
    flagged
    */
    this.state = {
      boardInfo: boardInfo,
      boardValues: s,
      isPlaying: true,
      squares: s,
    }
  }

  createBoardArray(rows, cols) {
    const s = new Array(Number(rows));
    for (var i=0; i<rows; i++) {
      s[i] = new Array(Number(cols)).fill(null);
    }
    return s;
  }

  // Handles the click of a square
  handleClick(row, col, t) {
    console.log("Hello, click. Row ", row, " col ", col, t);
    const sq = this.state.boardValues.slice();
    /*sq[0][0] = '-';
    this.setState({
      boardValues: sq,
    })*/
  }



  render () {
    const rows = this.props.rows;
    const cols = this.props.cols;
    return (
      <div className="game">

        <h1>This is a game</h1>
        <Board
          boardValues={this.state.boardValues}
          rows={rows}
          cols={cols}
          onClick={(r,c,t) => this.handleClick(r,c,t)}/>
      </div>
    )
  }
}



export default Game;
