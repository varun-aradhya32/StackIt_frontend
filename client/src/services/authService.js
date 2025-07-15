import axios from 'axios';

const API_URL = '${process.env.REACT_APP_API_URL}api/auth/';

const register = (username, email, password) => {
  return axios.post(API_URL + 'register', { username, email, password });
};

const login = (email, password) => {
  return axios.post(API_URL + 'login', { email, password });
};

export default { register, login };
