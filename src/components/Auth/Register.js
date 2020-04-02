import React from 'react';
import md5 from 'md5';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';

import '../App.css';
import firebase from '../../firebase';

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: [],
      loading: false,
      usersRef: firebase.database().ref('users')
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty()) {
      error = { message: 'Fill in all fields'};
      this.setState({ errors: errors.concat(error) });

      return false;
    } else if (!this.isPasswordValid()) {
      error = { message: 'Password Invalid'};
      this.setState({ errors: errors.concat(error) });

      return false;
    }else {
      return true;
    }
  }

  isFormEmpty = () => {
    const { username, email, password, passwordConfirmation } = this.state;

    return !username.length || !email.length || !password.length || !passwordConfirmation.length;
  }

  isPasswordValid = () => {
    const { password, passwordConfirmation } = this.state;

    return password === passwordConfirmation 
           && (passwordConfirmation.length > 6 && passwordConfirmation.length > 6);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          createdUser.user.updateProfile({
            displayName: this.state.username,
            photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
          }).then(() =>{
            this.saveUser(createdUser).then(() => {
              console.log("user saved");
              this.setState({ loading: false });
            }).catch(err =>{
              console.log(err)
            })
          }).catch( err => {
            this.setState({ errors: this.state.errors.concat(err), loading: false });
          })
        }).catch( err => {
          this.setState({ errors: this.state.errors.concat(err), loading: false });
        })
    }
  }


  saveUser = createdUser => {
    console.log(createdUser.user)
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  }

  displayErrors = errors => errors.map((err, i) => <p key={i}>{err.message}</p>);

  handleInputErrors = (errors, inputName) => {
    return errors.some(err => 
      err.message.toLowerCase().includes(inputName)
      )
    ? "error"
    : ""
  }

  render() {
    const { username, email, password, passwordConfirmation, errors, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 465}}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange">
              Register for Awesome Chat
            </Icon>
          </Header>
          <Form onSubmit={ this.handleSubmit } size="large">
            <Segment>
              <Form.Input  
                name="username" 
                icon="user" 
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                type="text"
                value={username}
                fluid
              >
              </Form.Input>

              <Form.Input  
                name="email" 
                icon="mail" 
                iconPosition="left"
                placeholder="Emaill Adress"
                onChange={this.handleChange}
                type="email"
                value={email}
                className={this.handleInputErrors(errors, 'email')}
                fluid
              >
              </Form.Input>

              <Form.Input  
                name="password" 
                icon="lock" 
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
                value={password}
                className={this.handleInputErrors(errors, 'password')}
                fluid
              >
              </Form.Input>

              <Form.Input  
                name="passwordConfirmation" 
                icon="repeat" 
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                type="password"
                value={passwordConfirmation}
                className={this.handleInputErrors(errors, 'password')}
                fluid
              >
              </Form.Input>

              <Button
                disabled={loading}
                className={ loading ? 'loading' : ''}
                color="orange"
                size="large"
                fluid
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Errors</h3>
              { this.displayErrors(errors) }
            </Message>
          )}
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register;