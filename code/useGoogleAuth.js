// src/hooks/useGoogleAuth.js
import { useState, useCallback } from 'react';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "abc123-xxxx.apps.googleusercontent.com";
const REDIRECT_URI = window.location.origin + '/callback';

export const useGoogleAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [error, setError] = useState(null);

  const signIn = useCallback(() => {
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'token',
      scope: 'https://www.googleapis.com/auth/drive',
      state: state
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }, []);

  const handleCallback = useCallback(() => {
    try {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const stateReceived = params.get('state');

      if (stateReceived !== sessionStorage.getItem('oauth_state')) {
        throw new Error('State mismatch');
      }

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        setToken(accessToken);
        sessionStorage.removeItem('oauth_state');
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchUserInfo = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Fetch failed');
      setUser(await res.json());
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  return { user, token, error, signIn, handleCallback, fetchUserInfo };
};
