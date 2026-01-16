// src/hooks/useGoogleAuth.js
import { useState, useEffect } from 'react';

const CLIENT_ID = "abc123-xxxx.apps.googleusercontent.com";

export const useGoogleAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  const signIn = async () => {
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: window.location.origin + '/callback',
        response_type: 'token',
        scope: 'https://www.googleapis.com/auth/drive'
      });
    window.location.href = authUrl;
  };

  const handleCallback = () => {
    const hash = window.location.hash;
    const token = hash.split('access_token=')[1].split('&')[0];
    localStorage.setItem('access_token', token);
    setToken(token);
  };

  const fetchUserInfo = async () => {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const data = await res.json();
    setUser(data);
  };

  return { user, token, signIn, handleCallback, fetchUserInfo };
};
