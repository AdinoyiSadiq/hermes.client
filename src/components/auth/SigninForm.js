import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import FormInput from '../forms/FormInput';
import SIGNIN_QUERY from '../../queries/signin';
import Button from '../buttons/Button';
import validateAuth from '../../lib/validation';

const fieldNames = ['email', 'password'];

const SigninForm = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [signin, { loading, error, data, client }] = useLazyQuery(SIGNIN_QUERY);

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationError = validateAuth({ email, password }, fieldNames);
    if (!validationError.status) {
      signin({ variables: { 
        email: email.toLowerCase().trim(), 
        password 
      }});
    }
  }

  if (data && data.signin) {
    client.writeData({ data: { isAuth: true } });
    localStorage.setItem('authToken', data.signin.token);
    props.history.push('/home');
  }

  const validationError = validateAuth({ email, password }, fieldNames);

  return (
    <form className='form u-margin-bottom-4'
      onSubmit={event => {
      handleSubmit(event)
    }}>
      <FormInput
        error={validationError}
        touched={touchedEmail} 
        value={email}
        handleChange={event => setEmail(event.target.value)}
        handleBlur={() => setTouchedEmail(true)}
        name='email'
        placeholder='Email'
      />
      <FormInput 
        error={validationError}
        touched={touchedPassword}
        value={password}
        handleChange={event => setPassword(event.target.value)}
        handleBlur={() => setTouchedPassword(true)}
        type="password"
        name='password'
        placeholder='Password'
      />
      {
        error && 
        error.graphQLErrors && 
        error.graphQLErrors[0].message && 
        <div className='error-field error-bottom'>{error.graphQLErrors[0].message}</div>
      }
      <Button
        type='submit'
        disabled={
          loading ||
          !email.trim() || 
          !password.trim()
        }
      >
        Sign In
      </Button>
    </form>
  );
}

export default SigninForm;
