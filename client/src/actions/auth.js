import axios from "axios";
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_PROFILE } from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

//  Load user
export const loadUser = () => async dispatch => {
  if(localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('http://localhost:5000/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
    console.error(err);
  }
}

//Register user
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
      const res = await axios.post('http://localhost:5000/api/user', {name, email, password}, config);
      dispatch({
          type: REGISTER_SUCCESS,
          payload: await res.data
      })
      dispatch(loadUser());
  } catch (err) {
      const errors = err.response.data.errors
      if(errors){
          errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
          type: REGISTER_FAIL,
      });
  }
};

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post("http://localhost:5000/api/auth", {email, password}, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: await res.data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors
    if(errors){
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({
    type: LOGOUT
  })
  dispatch({
    type: CLEAR_PROFILE
  })
}