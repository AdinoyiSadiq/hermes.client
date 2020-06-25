import React, { Component } from 'react';
import end__call__icon from '../../images/end-call-icon.svg'
import end__call__alt__icon from '../../images/end-call-alt-icon.png'

class Button extends Component {
  render() {
    const { disabled, buttonClick } = this.props;
    return (
      <button 
        className='action-call-button action-call-button--end'
        disabled={disabled}
        onClick={buttonClick}
      >
        <img src={end__call__icon} alt='end call' onError={(e)=>{e.target.onerror = null; e.target.src=end__call__alt__icon}}/>
      </button>
    );
  }
}

export default Button;
