import { getAccessToken } from './network-data';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function authHeader() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAccessToken()}`,
  };
}

export async function loadProgress() {
  const kosong = { completedActivityIds: [], consumedFoodIds: [], streak: 0 };
  try {
    const res = await fetch(`${BASE_URL}/today`, { headers: authHeader() });
    if (!res.ok) return { ok: false, ...kosong };

    const json = await res.json();
    if (json.status !== 'success') return { ok: false, ...kosong };

    return { ok: true, ...kosong, ...json.data };
  } catch {
    return { ok: false, ...kosong };
  }
}

// Penyimpanan progres mengembalikan { ok, streak }.
//
// Sebelumnya fungsi ini mengembalikan null baik ketika penyimpanan gagal maupun
// ketika tanggapan tidak memuat streak, sehingga pemanggil tidak dapat
// membedakan keduanya dan selalu memperlakukan hasilnya sebagai keberhasilan.
// Galat jaringan juga ditelan blok catch tanpa diteruskan.
//
// Status HTTP diperiksa lebih dulu; tanpa itu tanggapan 401 atau 500 tetap
// terbaca sebagai berhasil selama badannya dapat diurai.
export async function savePlanItemProgress(itemId, completed) {
  try {
    const res = await fetch(`${BASE_URL}/plan-items/${encodeURIComponent(itemId)}/progress`, {
      method: 'PUT',
      headers: authHeader(),
      body: JSON.stringify({ completed }),
    });

    if (!res.ok) return { ok: false, streak: null };

    const json = await res.json();
    if (json.status !== 'success') return { ok: false, streak: null };

    return { ok: true, streak: json.data?.streak ?? null };
  } catch {
    return { ok: false, streak: null };
  }
}
