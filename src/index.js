import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { BrowserRouter as Router } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';

//Components
import rootReducer from './reducers';
import RootWithAuth from './components/Route';

const store = createStore(rootReducer ,composeWithDevTools());

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById('root')
);