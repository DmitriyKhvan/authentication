import React from 'react';

const isInvalid = (valid, touched, shouldValidate) => {
  return !valid && shouldValidate && touched;
}

const isValid = (valid, touched, shouldValidate) => {
  return valid && shouldValidate && touched;
}

const Input = (props) => {
  
  const {
        valid, 
        shouldValidate, 
        touched,
        label,
        type,
        value,
        onChange,
        errorMessage,
        errorFeedbackServer
      } = props;

  const inputType = type || 'text';
  const htmlFor = `${inputType}-${Math.random()}`;
  const cls = ['form-control'];
  
  if (isInvalid(valid, shouldValidate, touched)) {
    cls.push('is-invalid');
  } 
  
  if(isValid(valid, shouldValidate, touched)) {
    cls.push('is-valid');
  }
  
  return (
    <div className={'form-group'}>
      <label htmlFor={htmlFor}>{label}</label>
      <input
        className={cls.join(' ')}
        id={htmlFor}
        type={inputType}
        value={value}
        onChange={onChange}
        required
      />

      {
        isInvalid(valid, shouldValidate, touched, errorFeedbackServer) 
        ? <div className="invalid-feedback">{errorMessage || 'Введите верное значение'}</div>
        : null
      }

    </div>
  ) 
}

export default Input;