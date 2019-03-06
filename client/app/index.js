import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import App from './components/App/App';
import Routes from "./config/routes";

import './styles/styles.scss';

render((
  <Router>
    <App>
      <Switch>
        <Routes/>
      </Switch>
    </App>
  </Router>
), document.getElementById('app'));
