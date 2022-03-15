import React from 'react';
import ReactDOM from 'react-dom';
import D3_Play from './d3_play';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<D3_Play />, div);
  ReactDOM.unmountComponentAtNode(div);
});
