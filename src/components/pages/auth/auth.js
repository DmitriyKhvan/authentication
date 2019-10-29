import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { auth } from '../../../actions/auth';
import Input from '../../UI/input/input';
import Button from '../../UI/button/button';
import { createControl, validate, validateForm } from '../../form/formFramework';

import classes from './auth.module.css';


function createFormControls() {
  return {
    email: createControl({
              type: 'email',
              label: 'Email',
              errorMessage: 'Введите корректный email'
            },
            {
              required: true,
              email: true
            }),
    
    password: createControl({
              type: 'password',
              label: 'Пароль',
              errorMessage: 'Введите корректный пароль'
            },
            {
              required: true,
              minLength: 6
            })
  }
}

class Auth extends Component {

  state = {
    isFormValid: false,
    formControls: createFormControls()
  }
 
  submitHandler = (event) => {
    event.preventDefaut();
  }

  loginHandler = () => {
    this.props.auth(
      this.state.formControls.email.value,
      this.state.formControls.password.value,
      true,
      this.props.history
    )
  }

  registerHandler = () => {
    this.props.auth(
      this.state.formControls.email.value,
      this.state.formControls.password.value,
      false,
      this.props.history
    )
  }

  onChangeHandler = (event, controlName) => {
    const formControls = {...this.state.formControls};
    const control = {...formControls[controlName]};

    control.value = event.target.value;
    control.touched = true;
    control.valid = validate(control.value, control.validation);

    formControls[controlName] = control;

    const isFormValid = validateForm(formControls);

    this.setState({
      formControls,
      isFormValid
    })
  }

  renderInputs() {
    return Object.keys(this.state.formControls).map((controlName, index) =>{
      const control = this.state.formControls[controlName];
      return (
        <Input
          key={controlName + index}
          type={control.type}
          value={control.value}
          valid={control.valid}
          touched={control.touched}
          label={control.label}
          shouldValidate={!!control.validation}
          errorMessage={control.errorMessage}
          // errorFeedbackServer={this.props.error}
          onChange={(event) => this.onChangeHandler(event, controlName)}
        />
      )
    })
  }

  render() {
    //console.log(this.props.error);
    return (
      <div className={classes.auth}>
        <div>
          <h1>Авторизация</h1>
          <form onSubmit={ this.submitHandler }>
            { this.renderInputs() }
            
            <div className={classes.buttons}>
              <Button
                type="success"
                onClick={this.loginHandler}
                disabled={!this.state.isFormValid}
              >
                Войти
              </Button>

              <Button
                type="primary"
                onClick={this.registerHandler}
                disabled={!this.state.isFormValid}
              >
                Зарегистрироваться
              </Button>
            </div>
          </form>

          {
            !!this.props.error 
            ? <div className={classes.invalid_feedback_server}>{this.props.error}</div>
            : null
          }

        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    error: state.auth.error
  }
}

function mapDispatchToProps(dispatch) {
  return {
    auth: (email, password, isLogin, history) => dispatch(auth(email, password, isLogin, history))
  }
} 

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Auth));