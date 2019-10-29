import { fetchAuth } from '../services/authApiService';
import { 
  AUTH_SUCCESS, 
  AUTH_LOGOUT,
  AUTH_ERROR 
} from '../actions/actionTypes';

export function auth(email, password, isLogin, history) {
  return dispatch => {
    const authData = {
      email,
      password,
      returnSecureToken: true
    }

      fetchAuth(authData, isLogin, history).then(token => {
        dispatch(authSuccess(token));
      }).catch(e => {
        if (isLogin) {
          dispatch({
            type: AUTH_ERROR,
            error: 'Invalid email or password'
          })
        } else {
          dispatch({
            type: AUTH_ERROR,
            error: 'The email address is already in use by another account'
          })
        }
      })
  }
}

export function autoLogout(time, history){
  return dispatch => {
    setTimeout(() => {
      dispatch(logout(history))
    }, time)
  }
} 

export function autoLogin(history) {

  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout(history));
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if(expirationDate <= new Date()) {
        dispatch(logout(history));
      } else {
        dispatch(authSuccess(token));
        const time = expirationDate.getTime() - new Date().getTime();
        dispatch(autoLogout(time, history));
      }
    }
  }
}

export function authSuccess(token) {
  return {
    type: AUTH_SUCCESS,
    token
  }
}

export function logout(history) {

  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('expirationDate');
  history.push({
    pathname: '/auth'
  });
  return {
    type: AUTH_LOGOUT
  }
}





