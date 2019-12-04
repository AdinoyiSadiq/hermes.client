import React, { Component } from 'react';
import { Mutation } from '@apollo/react-components';
import FormInput from '../forms/FormInput';
import SIGNUP_MUTATION from '../../mutations/signup';
import Button from '../Button';
import validateAuth from '../../lib/validation';

const fieldNames = ['firstname', 'lastname', 'username', 'location', 'email', 'password', 'confirmPassword'];

class SignupForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstname: '',
      lastname: '',
      username: '',
      location: '',
      email: '',
      password: '',
      confirmPassword: '',
      touched: {
        firstname: false,
        lastname: false,
        username: false,
        location: false,
        email: false,
        password: false,
        confirmPassword: false,
      },
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleBlur = (field) => () => {
    const { touched } = this.state;
    this.setState({
      touched: { ...touched, [field]: true },
    });
  }

  changeTouchState = (fields, state) => {
    const touchState = {};
    fields.forEach((field) => {
      touchState[field] = state;
    });
    return touchState;
  }

  async handleSubmit(event, signup) {
    event.preventDefault(); 
    const {
      firstname, lastname, username, location, email, password, confirmPassword
    } = this.state;

    const validationError = validateAuth({
      firstname, lastname, username, location, email, password, confirmPassword
    }, fieldNames);
    this.changeTouchState(fieldNames, true);
    if (!validationError.status) {
      const res = await signup();
      localStorage.setItem('authToken', res.token)
      this.props.history.push('/home');
    }
  }

  render() {
    const {
      firstname, lastname, username, location, email, password, confirmPassword, touched
    } = this.state;

    const validationError = validateAuth({
      firstname, lastname, username, location, email, password, confirmPassword
    }, fieldNames);
    return (
      <Mutation 
        mutation={SIGNUP_MUTATION}
        variables={{
          firstname: firstname.toLowerCase().trim(), 
          lastname: lastname.toLowerCase().trim(), 
          username: username.toLowerCase().trim(), 
          location: location.toLowerCase().trim(), 
          email: email.toLowerCase().trim(), 
          password }}
      >
        {(signup, { loading, error }) => (
          <form className='form u-margin-bottom-4'
            onSubmit={event => {
            this.handleSubmit(event, signup)
          }}>
            <div className='form__row'>
              <FormInput 
                error={validationError}
                touched={touched}
                value={firstname}
                handleChange={this.handleChange}
                handleBlur={this.handleBlur('firstname')}
                name='firstname'
                placeholder='First Name'
              />
              <FormInput 
                error={validationError}
                touched={touched}
                value={lastname}
                handleChange={this.handleChange}
                handleBlur={this.handleBlur('lastname')}
                name='lastname'
                placeholder='Last Name'
              />
            </div>
            <div className='form__row'>
              <FormInput
                error={validationError} 
                touched={touched}
                value={username}
                handleChange={this.handleChange}
                handleBlur={this.handleBlur('username')}
                name='username'
                placeholder='User Name'
              />
              <FormInput 
                error={validationError}
                touched={touched}
                value={location}
                handleChange={this.handleChange}
                handleBlur={this.handleBlur('location')}
                name='location'
                placeholder='Location'
              />
            </div>
            <FormInput 
              error={validationError}
              touched={touched}
              value={email}
              handleChange={this.handleChange}
              handleBlur={this.handleBlur('email')}
              name='email'
              placeholder='Email'
            />
            <div className='form__row'>
              <FormInput 
                error={validationError}
                touched={touched}
                value={password}
                handleChange={this.handleChange}
                handleBlur={this.handleBlur('password')}
                type="password"
                name='password'
                placeholder='Password'
              />
              <FormInput 
                error={validationError}
                touched={touched}
                value={confirmPassword}
                handleChange={this.handleChange}
                handleBlur={this.handleBlur('confirmPassword')}
                type="password"
                name='confirmPassword'
                placeholder='Confirm Password'
              />
            </div>
            <Button
              type='submit'
              disabled={
                loading || 
                !firstname.trim() || 
                !lastname.trim() || 
                !username.trim() || 
                !location.trim() || 
                !email.trim() || 
                !password.trim() || 
                !confirmPassword.trim()
              }
            >
              Sign Up
            </Button>
            {error && <div>{error.message}</div>}
          </form>
        )}
      </Mutation>
    );
  }
}

export default SignupForm;
