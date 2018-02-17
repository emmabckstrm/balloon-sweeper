import React, { Component } from 'react';
import './Game.css';

class Game extends Component {
  constructor(props) {
    super(props);
  }
  render () {
    const rows = this.props.rows;
    const cols = this.props.cols;
    return (
      <div className="game">

        <h1>This is a game</h1>
        <Board rows={rows} cols={cols}/>
      </div>
    )
  }
}

class Board extends Component {
  render () {
    var rows = [];
    var cols = [];
    var totalSquares = 0;
    for (var i = 0; i < this.props.rows; i++) {
      cols = [];
      for (var j=0; j<this.props.cols; j++) {
        totalSquares += 1;
        cols.push(<Square value={totalSquares} row={i} col={j} key={totalSquares} />);
      }
      rows.push(<div key={i}>{cols}</div>);
    }
    return (
      <h3>Hello {rows}</h3>
    );
  }
}

class Square extends Component {
  render () {
    return (
      <div className="square">{this.props.value}</div>
    )
  }
}

export default Game;
