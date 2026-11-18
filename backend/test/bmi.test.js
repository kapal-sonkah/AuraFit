import test from 'node:test';
import assert from 'node:assert/strict';
import { hitungBmi, kategoriBmi } from '../src/services/recommendations/recommendation-service.js';

// TC-006: nilai batas kategori BMI.
test('kategori BMI pada nilai batas', () => {
  const kasus = [
    [18.49, 'Underweight'], [18.5, 'Normal'], [24.99, 'Normal'],
    [25, 'Overweight'], [29.99, 'Overweight'], [30, 'Obese'],
  ];
  for (const [bmi, kategori] of kasus) assert.equal(kategoriBmi(bmi), kategori, `BMI ${bmi}`);
});

// TC-007: jalur independen hitungBmi.
test('hitungBmi menolak tinggi dan berat nol', () => {
  assert.throws(() => hitungBmi(70, 0));
  assert.throws(() => hitungBmi(0, 170));
  assert.equal(hitungBmi(70, 170).toFixed(2), '24.22');
});

// D-03 (temuan UAT 18 Nov 2026): 64 kg / 160 cm menghasilkan 24.999999999999996
// karena galat pecahan biner, sehingga BMI tampil 25.00 tetapi berkategori Normal.
test('kategori mengikuti BMI yang ditampilkan dua desimal', () => {
  assert.equal(kategoriBmi(hitungBmi(64, 160)), 'Overweight');
  assert.equal(kategoriBmi(hitungBmi(76.8, 160)), 'Obese');
  assert.equal(kategoriBmi(hitungBmi(47.3, 160)), 'Underweight');
  assert.equal(kategoriBmi(hitungBmi(47.4, 160)), 'Normal');
});
