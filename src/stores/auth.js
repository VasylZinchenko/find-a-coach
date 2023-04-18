import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

let timer;

export const useAuthStore = defineStore('auth', () => {
  const userId = ref(null);
  const token = ref(null);
  const tokenExpiration = ref(null);

  const didAutoLogout = ref(false);

  const isAuthenticated = computed(() => {
    return !!token.value;
  });

  const email = ref('');
  const password = ref('');

  function setUser(tok, uId, tokenEsp) {
    token.value = tok;
    userId.value = uId;
    tokenExpiration.value = tokenEsp;
    didAutoLogout.value = false;
  }

  async function auth(payload) {
    const mode = payload;
    let url =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAt3RtJmZGbhK_4u7mrZ-reDL5-vyv_Lsw';

    if (mode === 'signup') {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAt3RtJmZGbhK_4u7mrZ-reDL5-vyv_Lsw';
    }
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        returnSecureToken: true,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to authenticate. Check your login data'
      );
      throw error;
    }

    const expiresIn = +responseData.expiresIn * 1000;
    const expirationDate = new Date().getTime() + expiresIn;

    localStorage.setItem('token', responseData.idToken);
    localStorage.setItem('userId', responseData.localId);
    localStorage.setItem('tokenExpiration', expirationDate);

    timer = setTimeout(function () {
      autoLogout();
    }, expiresIn);

    setUser(responseData.idToken, responseData.localId, expirationDate);
  }

  async function login() {
    await auth('login');
  }

  async function signup() {
    await auth('signup');
  }

  function tryLogin() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    timer = setTimeout(function () {
      autoLogout();
    }, expiresIn);

    if (token && userId) {
      setUser(token, userId);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');

    clearTimeout(timer);

    setUser(null, null, null);
  }

  function autoLogout() {
    logout();
    didAutoLogout.value = true;
  }

  return {
    userId,
    email,
    password,
    token,
    isAuthenticated,
    didAutoLogout,
    signup,
    login,
    logout,
    tryLogin,
  };
});
