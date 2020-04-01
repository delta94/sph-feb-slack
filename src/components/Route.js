import React from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';

import { setUser } from '../actions';
//Components
import App from './App';
import Spinner from './Spinner';
import Login from './Auth/Login';
import Register from './Auth/Register';

class RootRouter extends React.Component {
  componentDidMount(){
    console.log(this.props.isLoading)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user)
        this.props.history.push('/');
      }
    })
  }
  
  render() {
    return this.props.isLoading ? <Spinner /> : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    )
  }
}

const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
}); 

const RootWithAuth = withRouter(connect(mapStateFromProps , { setUser })(RootRouter));

export default RootWithAuth;