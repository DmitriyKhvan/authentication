О проекте
---
Этот проект был сделан с помощью [Create React App](https://github.com/facebook/create-react-app).

В каталоге проекта вы можете запустить:

### `npm start`
Запускает приложение в режиме разработки.<br />
Откроется проект в браузере по адресу [http://localhost:3000](http://localhost:3000)

В проекте реализована авторизация/регистрация пользователя<br />
Форма авторизация/регистрация состоит из поля `email` и `password`<br />
Валидация полей осуществляется на сторое клиента
***

Используемые библиотеки:
---
* [redux](https://redux.js.org/)
* [redux-thunk](https://github.com/reduxjs/redux-thunk)
* [react-redux](https://react-redux.js.org/)
* [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start)
* [axios](https://github.com/axios/axios)
***

Установка библиотек
---
```bash
npm install redux redux-thunk react-redux react-router-dom axios
```

Backend
---
Используется сервис облачного СУБД [**Firebase**](https://firebase.google.com/).
***

Методы Action Creator
---
### `auth()` - авторизации/регистрации пользователей.
**Принемает параметры:**<br />
***email*** - email пользователя<br />
***password*** - пароль пользователя<br />
***isLogin*** - bollean значение. Пользователь зарегистрирован или нет<br />
***history*** - метод `React Router`

```js
const auth = (email, password, isLogin, history) => {
  return dispatch => {
    const authData = {
      email,
      password,
      returnSecureToken: true
    }
      //Метод запроса к базе данных
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
```

### `autoLogin()` - автоматическая проверка регистрации пользователя.
```js
const autoLogin = (history) => {

  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) { 
      dispatch(logout(history)); //Выход из сайта
    } else {
      //Проверка на актуальность token'a
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if(expirationDate <= new Date()) {
        dispatch(logout(history));
      } else {
        dispatch(authSuccess(token));
        const time = expirationDate.getTime() - new Date().getTime(); //Обновление времени жизни token'a
        dispatch(autoLogout(time, history)); //Метод автоматического выхода из сайта
      }
    }
  }
}

const authSuccess = (token) => {
  return {
    type: AUTH_SUCCESS,
    token
  }
}
```

### `autoLogout()` - автоматический выход из сайта
```js
const autoLogout = (time, history) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout(history))
    }, time)
  }
}
```

### `logout()` - выход из сайта
```js
const logout = (history) => {
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
```
***

Методы работы с облачным сервисом [**Firebase**](https://firebase.google.com/)
---
Запросы к серверу осуществлялись с использованием библиотеки [**axios**](https://github.com/axios/axios)

### `fetchAuth()` - запрос на авторизацию/регистрацию пользователя
```js
const fetchAuth = async (authData, isLogin, history) => {
  let sign = 'signUp';
  
  //Проверка на регистрацию пользователя
  if (isLogin) {
    sign = 'signInWithPassword';
  }

  const url = `${AUTH_URL}${sign}?key=${API_KEY}`;
 
  const response = await axios.post(url, authData); //Запрос
  const data = response.data;
  
  //Сохранения параметров ответа сервера в localStorage
  safeTokenData(data); 

  //Переадресация на главную страницу
  history.push({
    pathname: '/'
  })

  return data.idToken;
}
```

### `safeTokenData()` - сохранение праметров ответа сервера
```js
const safeTokenData = (data) => {
  const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000); //Время в млс
  localStorage.setItem('token', data.idToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('expirationDate', expirationDate);
}
```

### `getRequest()` - любой запрос к серверу
**Принемает параметры:**<br />
***url*** - адрес ресурса<br />
***method*** - метод запроса(get, post, delete, и т.д.)<br />
***history*** - метод `React Router`<br />
***body*** - парметры запроса

```js
const getRequest = async (url, method, history, body = {}) => {
  //Проверка на сущестование token'a
  if (checkToken(history)) {
    //Запрос
    const response = await axios({ 
      method,
      url: `${API_URL}${url}`,
      body
    });
    return response.data;

  } else {
    //Переадресация на страницу авторизации/регистрации
    history.push({
      pathname: '/auth'
    })
  }
}
```

### `checkToken()` - проверка token'a
```js
const checkToken = (history) => {
  const token = localStorage.getItem('token');
  if (token) {
    refreshToken(history); // Обновление token, refreshToken, expiresIn
    return true;
  }
  return false;
}
```

### `refreshToken()` - обновление token, refreshToken, expiresIn. Для продления времени регистрации пользователя
```js
const refreshToken = async (history) => {
  const refreshToken = localStorage.getItem('refreshToken');
  const data = `grant_type=refresh_token&refresh_token=${refreshToken}`;

  try {
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
      data
    )
  
    const responseData = {
      idToken: response.data.id_token,            
      refreshToken: response.data.refresh_token,  //необходим для обновелния expiresIn
      expiresIn: response.data.expires_in         //время действии регистрации
    }
    safeTokenData(responseData);

  } catch (e) {
    history.push({
      pathname: '/auth'
    })
  }
}
```

