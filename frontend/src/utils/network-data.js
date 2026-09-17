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

async function getHistory({ from, to }) {
  const params = new URLSearchParams({ from, to });

  try {
    const response = await fetchWithToken(`${BASE_URL}/history?${params.toString()}`);
    const responseJson = await response.json();

    if (!response.ok || responseJson.status !== 'success') {
      return { error: true, data: null };
    }

    return { error: false, data: responseJson.data };
  } catch {
    return { error: true, data: null };
  }
}

async function getAuraToday() {
  try {
    const response = await fetchWithToken(`${BASE_URL}/aura/today`);
    const responseJson = await response.json();
    if (!response.ok || responseJson.status !== 'success') return { error: true, data: null };
    return { error: false, data: responseJson.data };
  } catch {
    return { error: true, data: null };
  }
}

async function saveAuraToday(aura) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/aura/today`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aura }),
    });
    const responseJson = await response.json();
    if (!response.ok || responseJson.status !== 'success') return { error: true, data: null };
    return { error: false, data: responseJson.data };
  } catch {
    return { error: true, data: null };
  }
}

async function getPlanByDate(date) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/plans/${encodeURIComponent(date)}`);
    const responseJson = await response.json();

    if (!response.ok || responseJson.status !== 'success') {
      return { error: true, data: null };
    }

    return { error: false, data: responseJson.data };
  } catch {
    return { error: true, data: null };
  }
}

async function createManualPlan({ activities, foods }) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/plans/manual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activities, foods }),
    });
    const responseJson = await response.json();

    if (!response.ok || responseJson.status !== 'success') {
      return { error: true, data: null, message: responseJson.message || 'Rencana manual belum dapat disimpan.' };
    }

    return { error: false, data: responseJson.data };
  } catch {
    return { error: true, data: null, message: 'Tidak dapat menyimpan rencana. Periksa koneksi, lalu coba lagi.' };
  }
}

async function changePassword(currentPassword, newPassword) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/users/me/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
    const responseJson = await response.json();

    if (!response.ok || responseJson.status !== 'success') {
      return { error: true, message: responseJson.message || 'Kata sandi belum dapat diganti.' };
    }

    return { error: false };
  } catch {
    return { error: true, message: 'Tidak dapat mengganti kata sandi. Periksa koneksi, lalu coba lagi.' };
  }
}

async function updatePlanItem(itemId, fields) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/plan-items/${encodeURIComponent(itemId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const responseJson = await response.json();

    if (!response.ok || responseJson.status !== 'success') {
      return { error: true, data: null, message: responseJson.message || 'Butir belum dapat diubah.' };
    }

    return { error: false, data: responseJson.data };
  } catch {
    return { error: true, data: null, message: 'Tidak dapat mengubah butir. Periksa koneksi, lalu coba lagi.' };
  }
}

async function deletePlanItem(itemId) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/plan-items/${encodeURIComponent(itemId)}`, {
      method: 'DELETE',
    });
    const responseJson = await response.json();

    if (!response.ok || responseJson.status !== 'success') {
      return { error: true, data: null, message: responseJson.message || 'Butir belum dapat dihapus.' };
    }

    return { error: false, data: responseJson.data };
  } catch {
    return { error: true, data: null, message: 'Tidak dapat menghapus butir. Periksa koneksi, lalu coba lagi.' };
  }
}

async function updateUserProfile(profile) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const responseJson = await response.json();

    if (!response.ok || responseJson.status !== 'success') {
      return { error: true, data: null, message: responseJson.message || 'Profil belum dapat diperbarui.' };
    }

    return { error: false, data: responseJson.data };
  } catch {
    return { error: true, data: null, message: 'Tidak dapat menyimpan profil. Periksa koneksi, lalu coba lagi.' };
  }
}

export {
  getAccessToken,
  putAccessToken, 
  login,
  logout,
  register, 
  getUserLogged,
  getAIRecommendations,
  getHistory,
  getPlanByDate,
  createManualPlan,
  deletePlanItem,
  updatePlanItem,
  changePassword,
  updateUserProfile,
  getAuraToday,
  saveAuraToday,
}
