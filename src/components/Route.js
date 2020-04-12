import React from 'react';
import firebase from '../firebase';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';

import { setUser, clearUser } from '../actions';
//Components
import App from './App';
import Spinner from './Spinner';
import Login from './Auth/Login';
import Register from './Auth/Register';

class RootRouter extends React.Component {
  
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user)
        this.setState({ isLoading: false });
        this.props.history.push('/');
      }else {
        this.props.history.push('/register');
        this.setState({ isLoading: false });
      }
    })
  }
  
  render() {
    return this.state.isLoading ? <Spinner /> : (
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

const RootWithAuth = withRouter(
  connect(
    mapStateFromProps,
    { setUser, clearUser }
  )
  (RootRouter)
);

export default RootWithAuth;