// const axios = require('axios');
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
    const test = document.getElementById('forgotP');
    if (!test) {
      const forgotP = document.createElement('a');
      forgotP.id = 'forgotP';
      forgotP.innerHTML = 'Forgot Password?';
      forgotP.className = 'form_btn';
      forgotP.href = '/forgot-password';
      document
        .getElementById('formholder')
        .appendChild(forgotP);
    }
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
      showAlert('success', 'New account created!');

    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.msg);
  }
};

export const forgotPasswordSendCode = async (email) => {
  try {
    const res = await axios.post(
      '/api/v1/users/forgotPassword',
      {
        email,
      },
    );
    if (res.data.status === 'success')
      showAlert('success', 'Code has been sent');
    window.setTimeout(() => {
      location.assign(`/password-reset?email=${email}`);
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.msg);
  }
};

export const resetPasswordUsingCode = async (
  token,
  password,
  passwordConfirm,
) => {
  try {
    const res = await axios.patch(
      '/api/v1/users/resetPassword',
      {
        token,
        password,
        passwordConfirm,
      },
    );
    if (res.data.status === 'success')
      showAlert('success', 'Password updated successfully');
    window.setTimeout(() => {
      location.assign('/');
    }, 3000);
  } catch (err) {
    showAlert('error', err.response.data.msg);
  }
};
