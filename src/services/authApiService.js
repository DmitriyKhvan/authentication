import axios from 'axios';

import {
  API_KEY,
  AUTH_URL,
  API_URL
} from './apiTypes'; 

export const fetchAuth = async (authData, isLogin, history) => {
  let sign = 'signUp';
  
  if (isLogin) {
    sign = 'signInWithPassword';
  }

  const url = `${AUTH_URL}${sign}?key=${API_KEY}`;
 
  const response = await axios.post(url, authData);
  const data = response.data;
  
  safeTokenData(data); 

  history.push({
    pathname: '/'
  })

  return data.idToken;
}

export const getRequest = async (url, method, history, body = {}) => {
  if (checkToken(history)) {

    const response = await axios({
      method,
      url: `${API_URL}${url}`,
      body
    });
    return response.data;

  } else {
    history.push({
      pathname: '/auth'
    })
  }
} 

export const checkToken = (history) => {
  const token = localStorage.getItem('token');
  if (token) {
    refreshToken(history);
    return true;
  }
  return false;
}

export const refreshToken = async (history) => {
  const refreshToken = localStorage.getItem('refreshToken');
  const data = `grant_type=refresh_token&refresh_token=${refreshToken}`;

  try {
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
      data
    )
  
    const responseData = {
      idToken: response.data.id_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in
    }
    safeTokenData(responseData);

  } catch (e) {
    history.push({
      pathname: '/auth'
    })
  }

}

export const safeTokenData = (data) => {
  const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000);
  localStorage.setItem('token', data.idToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('expirationDate', expirationDate);
}
