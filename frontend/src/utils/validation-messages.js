// Pesan validasi bawaan peramban mengikuti bahasa peramban, sehingga pengguna
// dapat melihat "Value must be greater than or equal to 10" di tengah antarmuka
// berbahasa Indonesia (N-03). Satu pendengar di tingkat dokumen menggantinya
// untuk seluruh formulir tanpa mengubah aturan validasi tiap kolom.
function pesanUntuk(el) {
  const v = el.validity;
  if (v.valueMissing) return 'Kolom ini wajib diisi.';
  if (v.typeMismatch && el.type === 'email') return 'Masukkan alamat email yang valid, misalnya nama@contoh.com.';
  if (v.badInput) return 'Masukkan angka yang valid.';
  if (v.rangeUnderflow) return `Nilai minimal ${el.min}.`;
  if (v.rangeOverflow) return `Nilai maksimal ${el.max}.`;
  if (v.stepMismatch) return 'Nilai ini tidak sesuai kelipatan yang diizinkan.';
  if (v.tooShort) return `Minimal ${el.minLength} karakter.`;
  if (v.tooLong) return `Maksimal ${el.maxLength} karakter.`;
  if (v.patternMismatch) return el.title || 'Format isian belum sesuai.';
  return 'Isian ini belum valid.';
}

export function installValidationMessages(doc = document) {
  doc.addEventListener('invalid', (event) => {
    const el = event.target;
    if (typeof el.setCustomValidity !== 'function') return;
    el.setCustomValidity('');
    if (!el.validity.valid) el.setCustomValidity(pesanUntuk(el));
  }, true);

  // Pesan kustom harus dihapus begitu isian berubah; jika tidak, kolom tetap
  // dianggap tidak valid walaupun isinya sudah benar.
  doc.addEventListener('input', (event) => {
    if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
  }, true);
}
