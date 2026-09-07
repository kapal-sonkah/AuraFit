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


async function getAIRecommendations() {
  // Rekomendasi kini disusun backend dari aturan berbasis BMI, bukan dari
  // layanan klasifikasi terpisah. Data pengguna diambil backend dari basis
  // data, sehingga tidak perlu dikirim ulang dari sini.
  try {
    const response = await fetch(`${BASE_URL}/recommendations/today`, {
      headers: { 'Authorization': `Bearer ${getAccessToken()}` },
    });

    if (!response.ok) {
      return { error: true, data: null };
    }

    const responseJson = await response.json();
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error('Gagal mengambil rencana harian:', error);
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