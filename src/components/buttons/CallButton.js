import React, { Component } from 'react';

class Button extends Component {
  render() {
    const { image, disabled, buttonClick } = this.props;
    return (
      <button 
        className={`call-button ${disabled && 'call-button--active'}`}
        onClick={buttonClick}
      >
        <img src={image} alt='end call' />
      </button>
    );
  }
}

export default Button;