import React, { Component } from 'react';
import accept__call__icon from '../../images/accept-call-icon.svg'

class Button extends Component {
  render() {
    const { disabled, buttonClick } = this.props;
    return (
      <button 
        className='action-call-button action-call-button--accept'
        disabled={disabled}
        onClick={buttonClick}
      >
        <img src={accept__call__icon} alt='accept call' />
      </button>
    );
  }
}

export default Button;