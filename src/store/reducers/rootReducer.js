import { combineReducers } from 'redux';
import authReducer from './auth';
import peopleListReducer from './people';

export default combineReducers({
  auth: authReducer,
  people: peopleListReducer
})