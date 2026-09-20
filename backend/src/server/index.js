import routes from '../routes/index.js';
import express from 'express';
import cors from 'cors';
import ErrorHandler from '../middlewares/error.js';
import 'dotenv/config';

const app = express();

app.use(express.json());
// Token dikirim lewat header Authorization, bukan cookie, jadi CORS bukan
// pertahanan utama di sini. Pembatasan ini memastikan hanya frontend AuraFit
// dan server pengembangan lokal yang dapat memanggil API dari peramban.
// Permintaan tanpa header Origin (curl, server lain) tidak terpengaruh.
const ALLOWED_ORIGINS = [
  'https://aurafit-wheat.vercel.app',
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/,
];

app.use(cors({ origin: ALLOWED_ORIGINS }));
// Seluruh tanggapan memuat data pribadi yang berubah setiap saat. Tanpa ini
// Vercel menandainya "public" dan peramban memakai ulang tanggapan lama,
// termasuk header CORS untuk origin lain, sehingga permintaan dari origin
// yang sah pun ditolak.
app.set('etag', false);
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use(routes);
app.use(ErrorHandler);

export default app;