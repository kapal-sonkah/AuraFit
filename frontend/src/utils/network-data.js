const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function putAccessToken(accessToken) {
  return localStorage.setItem('accessToken', accessToken);
}

async function fetchWithToken(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
}

async function login({ username_email, password }) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username_email, password }),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true, data: null };
  }

  localStorage.setItem('refreshToken', responseJson.data.refreshToken);

  return { error: false, data: responseJson.data };
}

async function register({ username, email, password, firstName, lastName, sex , weight, height, goal, age }) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, first_name: firstName, last_name: lastName, sex, weight, height, goal, age }),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true };
  }

  return { error: false };
}

async function getUserLogged() {
  const response = await fetchWithToken(`${BASE_URL}/users`);
  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function logout() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken) {
    await fetchWithToken(`${BASE_URL}/logout`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
  }

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

const AI_MODEL_URL = import.meta.env.VITE_AI_MODEL_URL || 'http://127.0.0.1:8000';

async function getAIRecommendations(user) {

  const formattedGoal = (user.goal).replace('-', '_');

  // Mapping data user dari database ke format yang diminta FastAPI
  const payload = {
    gender: user.gender, // Pastikan formatnya sesuai (misal: 'male' / 'female')
    weight_kg: parseFloat(user.weight_kg),
    height_cm: parseFloat(user.height_cm),
    goal: formattedGoal,
    age: parseInt(user.age)
  };

  try {
    const response = await fetch(`${AI_MODEL_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { error: true, data: null };
    }

    const data = await response.json();
    return { error: false, data };
  } catch (error) {
    console.error('Gagal mengambil data dari API Model:', error);
    return { error: true, data: null };
  }
}

export {
  getAccessToken,
  putAccessToken, 
  login,
  logout,
  register, 
  getUserLogged,
  getAIRecommendations
}