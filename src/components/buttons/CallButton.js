import React, { Component } from 'react';

class Button extends Component {
  render() {
    const { image, buttonStatus, disabled, buttonClick } = this.props;
    return (
      <button 
        className={`call-button ${buttonStatus && 'call-button--active'} ${disabled && 'call-button--disabled'}`}
        onClick={buttonClick}
        disabled={disabled}
      >
        <img src={image} alt='end call' />
      </button>
    );
  }
}

export default Button;