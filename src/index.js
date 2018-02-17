import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game';
import registerServiceWorker from './registerServiceWorker';



ReactDOM.render(
  <Game
    cols="7"
    rows="6"
    mines="6"
  />,
  document.getElementById('root'));
registerServiceWorker();
