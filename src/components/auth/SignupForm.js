import React, { useState }  from 'react';
import { useMutation } from '@apollo/react-hooks';
import FormInput from '../forms/FormInput';
import SIGNUP_MUTATION from '../../mutations/signup';
import Button from '../buttons/Button';
import validateAuth from '../../lib/validation';

const fieldNames = ['firstname', 'lastname', 'username', 'location', 'email', 'password', 'confirmPassword'];

const SignupForm = (props) => {
  const [touchedInput, setTouchedInput] = useState({});
  const [inputValue, setInputValue] = useState({
    firstname: '',
    lastname: '',
    username: '',
    location: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [signup, { loading, error, data, client }] = useMutation(SIGNUP_MUTATION);

  const handleChange = (event) => {
    setInputValue({ ...inputValue, [event.target.id]: event.target.value });
  }

  const handleBlur = (field) => () => {
    setTouchedInput({ ...touchedInput, [field]: true })
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    const {
      firstname, lastname, username, location, email, password, confirmPassword
    } = inputValue;

    const validationError = validateAuth({
      firstname, lastname, username, location, email, password, confirmPassword
    }, fieldNames);

    if (!validationError.status) {
      await signup({
        variables: {
          firstname: firstname.toLowerCase().trim(), 
          lastname: lastname.toLowerCase().trim(), 
          username: username.toLowerCase().trim(), 
          location: location.toLowerCase().trim(), 
          email: email.toLowerCase().trim(), 
          password
        }
      });
    }
  }

  if (data && data.signup && data.signup.token) {
    client.writeData({ data: { isAuth: true } });
    localStorage.setItem('authToken', data.signup.token);
    props.history.push('/home');
  }

    const validationError = validateAuth({
      firstname: inputValue.firstname, 
      lastname: inputValue.lastname, 
      username: inputValue.username, 
      location: inputValue.location,
      email: inputValue.email, 
      password: inputValue.password, 
      confirmPassword: inputValue.confirmPassword
    }, fieldNames);

    return (
      <form className='form u-margin-bottom-4'
        onSubmit={event => {
        handleSubmit(event)
      }}>
        <div className='form__row'>
          <FormInput 
            error={validationError}
            touched={touchedInput.firstname}
            value={inputValue.firstname}
            handleChange={handleChange}
            handleBlur={handleBlur('firstname')}
            name='firstname'
            placeholder='First Name'
          />
          <FormInput 
            error={validationError}
            touched={touchedInput.lastname}
            value={inputValue.lastname}
            handleChange={handleChange}
            handleBlur={handleBlur('lastname')}
            name='lastname'
            placeholder='Last Name'
          />
        </div>
        <div className='form__row'>
          <FormInput
            error={validationError} 
            touched={touchedInput.username}
            value={inputValue.username}
            handleChange={handleChange}
            handleBlur={handleBlur('username')}
            name='username'
            placeholder='User Name'
          />
          <FormInput 
            error={validationError}
            touched={touchedInput.location}
            value={inputValue.location}
            handleChange={handleChange}
            handleBlur={handleBlur('location')}
            name='location'
            placeholder='Location'
          />
        </div>
        <FormInput 
          error={validationError}
          touched={touchedInput.email}
          value={inputValue.email}
          handleChange={handleChange}
          handleBlur={handleBlur('email')}
          name='email'
          placeholder='Email'
        />
        <div className='form__row'>
          <FormInput 
            error={validationError}
            touched={touchedInput.password}
            value={inputValue.password}
            handleChange={handleChange}
            handleBlur={handleBlur('password')}
            type="password"
            name='password'
            placeholder='Password'
          />
          <FormInput 
            error={validationError}
            touched={touchedInput.confirmPassword}
            value={inputValue.confirmPassword}
            handleChange={handleChange}
            handleBlur={handleBlur('confirmPassword')}
            type="password"
            name='confirmPassword'
            placeholder='Confirm Password'
          />
        </div>
        <Button
          type='submit'
          disabled={
            loading || 
            !inputValue.firstname.trim() || 
            !inputValue.lastname.trim() || 
            !inputValue.username.trim() || 
            !inputValue.location.trim() || 
            !inputValue.email.trim() || 
            !inputValue.password.trim() || 
            !inputValue.confirmPassword.trim()
          }
        >
          Sign Up
        </Button>
        {error && <div>{error.message}</div>}
      </form>
    );
}

export default SignupForm;
