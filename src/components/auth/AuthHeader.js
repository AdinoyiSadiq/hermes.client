import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AuthHeader extends Component {
  renderAuthHeader() {
    const { pathname } = this.props.children.props.location;
    if (pathname === '/signup') {
      return (
        <div className='header__link'>
          <span>Have an account already?</span>
          <span className='u-text-bold'><Link to='/signin'>Sign In</Link></span>
        </div>
      );
    }
    return (
      <div className='header__link'>
        <span>You new here?</span>
        <span className='u-text-bold'><Link to='/signup'>Create an account</Link></span>
      </div>
    );
  } 

  render() {
    return (
      <div className='header'>
        <div className='header__logo-box'>
          <div className='header__logo'>Hermes</div>
        </div>
        {this.renderAuthHeader()}
      </div>
    );
  }
}

export default AuthHeader;
