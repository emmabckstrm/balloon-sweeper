import React, { Component } from 'react';

class Square extends Component {
  render () {
    const classN = this.props.isOpen ? "square open" : "square";
    return (
      <div
        className={classN}
        onClick={this.props.onClick}
        onContextMenu={this.props.onRightClick}
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
        onRightClick={() => this.props.onRightClick(i,j)}
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
      <div>{rowArray}</div>
    );
  }
}

export default Board;
