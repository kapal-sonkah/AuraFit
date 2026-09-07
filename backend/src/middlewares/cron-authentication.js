import crypto from 'crypto';
import response from '../utils/response.js';

// Titik akhir cron dipanggil penjadwal, bukan pengguna, sehingga tidak dapat
// memakai token akses. Penjadwal Vercel mengirimkan header
// "Authorization: Bearer <CRON_SECRET>" apabila variabel lingkungan
// CRON_SECRET tersedia.
//
// Bila CRON_SECRET belum disetel, permintaan ditolak. Titik akhir ini
// mengubah data seluruh pengguna, sehingga tidak boleh terbuka ketika
// konfigurasi belum lengkap.
function bandingkanAman(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  if (x.length !== y.length) return false;
  return crypto.timingSafeEqual(x, y);
}

function authenticateCron(req, res, next) {
  const rahasia = process.env.CRON_SECRET;

  if (!rahasia) {
    console.error('CRON_SECRET belum disetel; permintaan cron ditolak.');
    return response(res, 503, 'Cron belum dikonfigurasi', null);
  }

  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return response(res, 401, 'Unauthorized', null);
  }

  if (!bandingkanAman(header.slice('Bearer '.length), rahasia)) {
    return response(res, 401, 'Unauthorized', null);
  }

  return next();
}

export default authenticateCron;
