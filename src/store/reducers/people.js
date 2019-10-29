import {
  PEOPLE_LIST_SUCCESS,
  PEOPLE_LIST_START,
  PEOPLE_LIST_ERROR
} from '../../actions/actionTypes';

const initialState = {
  people: [],
  loader: false,
  error: null
}

export default function peopleListReducer(state = initialState, action) {
  switch (action.type) {
    case PEOPLE_LIST_START:
      return {
        ...state,
        loader: true
      }
    case PEOPLE_LIST_SUCCESS:
      return {
        ...state,
        loader: false,
        people: [...action.peopleList]
      }
    case PEOPLE_LIST_ERROR:
      return {
        ...state,
        error: action.error
      }
    default: 
      return state;
  }
}