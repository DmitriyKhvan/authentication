import { getRequest } from '../services/authApiService';
import { 
  PEOPLE_LIST_ERROR,
  PEOPLE_LIST_START,
  PEOPLE_LIST_SUCCESS
 } from '../actions/actionTypes';

export function getAllPeople(url, method, history) {
  
  return dispatch => {
    try {
      dispatch({
        type: PEOPLE_LIST_START
      })

      getRequest(url, method, history).then(res => {
 
        dispatch({
          type: PEOPLE_LIST_SUCCESS,
          peopleList: res 
        })
      })
  
    } catch (error) {
      dispatch({
        type: PEOPLE_LIST_ERROR,
        error
      })
    }
  }
}