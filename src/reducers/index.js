import * as actionTypes from '../actions/types';
import { combineReducers } from 'redux';

const initialUserState = {
  user: null
};

const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
      }
    default: 
      return state;
  }
}

const rootReducer = combineReducers({
  user: user_reducer
});

export default rootReducer;