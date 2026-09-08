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
  // Kegagalan jaringan ditangkap di sini. Tanpa penangkapan ini, fetch yang
  // menolak membuat promise gagal sebelum pemanggil sempat mengembalikan
  // tombol ke keadaan semula, sehingga formulir terkunci tanpa pesan apa pun.
  let response;
  try {
    response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username_email, password }),
    });
  } catch {
    return { error: true, data: null, message: 'Tidak dapat menghubungi server. Periksa koneksi, lalu coba lagi.' };
  }

  let responseJson;
  try {
    responseJson = await response.json();
  } catch {
    return { error: true, data: null, message: 'Tanggapan server tidak dapat dibaca. Coba lagi beberapa saat.' };
  }

  // Sama seperti pendaftaran, pesan dikembalikan kepada pemanggil agar dapat
  // ditampilkan di dalam formulir, bukan lewat alert yang menghentikan halaman.
  if (!response.ok || responseJson.status !== 'success') {
    return { error: true, data: null, message: responseJson.message || 'Gagal masuk. Periksa kembali data Anda.' };
  }

  localStorage.setItem('refreshToken', responseJson.data.refreshToken);

  return { error: false, data: responseJson.data };
}

async function register({ username, email, password, firstName, lastName, sex , weight, height, goal, age }) {
  let response;
  try {
    response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, first_name: firstName, last_name: lastName, sex, weight, height, goal, age }),
    });
  } catch {
    return { error: true, message: 'Tidak dapat menghubungi server. Periksa koneksi, lalu coba lagi.' };
  }

  let responseJson;
  try {
    responseJson = await response.json();
  } catch {
    return { error: true, message: 'Tanggapan server tidak dapat dibaca. Coba lagi beberapa saat.' };
  }

  // Pesan dikembalikan kepada pemanggil, bukan ditampilkan lewat alert.
  // alert menghentikan seluruh halaman, tidak dapat dibaca pembaca layar
  // sebagai bagian formulir, dan tidak menunjukkan medan mana yang bermasalah.
  if (!response.ok || responseJson.status !== 'success') {
    return { error: true, message: responseJson.message || 'Pendaftaran gagal. Coba lagi.' };
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