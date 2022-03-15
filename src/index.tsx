import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import D3_Play from './d3_play';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<D3_Play />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
