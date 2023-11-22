// import axios from 'axios';
import { showAlert } from './alerts.mjs';

export const login = async (email, password) => {
  try {
    const res = await axios.post('/api/v1/users/login', {
      email,
      password,
    });
    if (res.data.status === 'success')
      showAlert('success', 'Logged in successfully');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.msg);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get('/api/v1/users/logout');
    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

export const signup = async (
  username,
  email,
  password,
  passwordConfirm,
) => {
  try {
    const res = await axios.post('/api/v1/users/signup', {
      username,
      email,
      password,
      passwordConfirm,
    });
    if (res.data.status === 'success')
      showAlert('success', 'New account created! Log in!');
    window.setTimeout(() => {
      location.assign('/login');
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.msg);
  }
};
