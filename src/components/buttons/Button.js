import React, { Component } from 'react';

class Button extends Component {
  render() {
    const { type, disabled, buttonClick } = this.props;
    return (
      <button 
        className='btn btn-orange btn-animated u-margin-bottom-2'
        type={type}
        disabled={disabled}
        onClick={buttonClick}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
