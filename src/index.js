import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game';
import registerServiceWorker from './registerServiceWorker';



ReactDOM.render(
  <Game
    cols="5"
    rows="4"
    mines="2"
  />,
  document.getElementById('root'));
registerServiceWorker();
