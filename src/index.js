import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game';
import registerServiceWorker from './registerServiceWorker';



ReactDOM.render(
  <Game
    cols="4"
    rows="4"
  />,
  document.getElementById('root'));
registerServiceWorker();
