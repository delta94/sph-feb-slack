import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';

import '../App.css';
import firebase from '../../firebase';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: [],
      loading: false,
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }


  isFormValid = () => {
    const { email, password } = this.state;

    return email.length || password.length;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {

        }).catch(err =>{
          this.setState({errors: this.state.errors.concat(err), loading: false })
        })
    }
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
    const { email, password, errors, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 465}}>
          <Header as="h2" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet">
              Login to Awesome Chat
            </Icon>
          </Header>
          <Form onSubmit={ this.handleSubmit } size="large">
            <Segment>
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

              <Button
                disabled={loading}
                className={ loading ? 'loading' : ''}
                color="violet"
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
            Don't have account? <Link to="/register">Sign Up</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login;