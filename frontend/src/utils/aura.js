export const AURA_OPTIONS = [
  { value: 'redup', label: 'Redup', detail: 'Energi rendah', suggestion: 'Ambil langkah paling ringan hari ini—konsistensi kecil sudah cukup.' },
  { value: 'tenang', label: 'Tenang', detail: 'Ingin pelan', suggestion: 'Pilih ritme yang nyaman dan fokus pada satu aktivitas terlebih dahulu.' },
  { value: 'seimbang', label: 'Seimbang', detail: 'Kondisi normal', suggestion: 'Kamu berada di ritme yang pas untuk menjalani rencana hari ini.' },
  { value: 'bersemangat', label: 'Bersemangat', detail: 'Siap bergerak', suggestion: 'Manfaatkan energimu dengan menuntaskan satu aktivitas utama hari ini.' },
  { value: 'menyala', label: 'Menyala', detail: 'Energi tinggi', suggestion: 'Energi tinggi itu bagus—tetap jaga tempo agar tubuh punya ruang untuk pulih.' },
];

export function getAuraOption(value) {
  return AURA_OPTIONS.find((option) => option.value === value) ?? null;
}
