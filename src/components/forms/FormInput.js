import React from 'react';

const FormInput = (props) => {
  const {
    name, type, placeholder, value, handleChange, handleBlur, error, touched
  } = props;
  return (
    <div className='form__group'>
      <input 
        className='form__input'
        type={type || 'text'}
        placeholder={placeholder}
        id={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        autoComplete="off"
      />
      {
        error[name] && touched ? 
        <div className="error-field">{error[name]}</div> : 
        <label htmlFor={`${name}`} className='form__label'>{placeholder}</label>
      }
    </div>
  );
}

export default FormInput;
