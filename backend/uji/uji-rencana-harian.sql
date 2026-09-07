-- Verifikasi kendala pada migrasi rencana harian.
-- Seluruh pekerjaan dibungkus transaksi dan dibatalkan di akhir, sehingga
-- basis data kembali ke keadaan semula.

BEGIN;

\echo '--- menyiapkan satu pengguna uji ---'
INSERT INTO users (id, username, email, password, first_name, last_name,
                   gender, weight_kg, height_cm, goal, age)
VALUES ('uji-user-1', 'ujicoba', 'uji@contoh.test', 'rahasia',
        'Uji', 'Coba', 'male', 70, 175, 'Weight Loss', 21);

\echo ''
\echo '--- 1. rencana pertama untuk 2026-09-07 harus berhasil ---'
INSERT INTO daily_plans (id, user_id, plan_date, source)
VALUES ('uji-plan-1', 'uji-user-1', '2026-09-07', 'recommendation');
SELECT 'BERHASIL: rencana tersimpan' AS hasil;

\echo ''
\echo '--- 2. rencana kedua pada tanggal sama harus DITOLAK ---'
\echo '    tanpa baris ERROR di bawah ini, kendala tidak bekerja'
\echo '    (inilah kendala yang menjamin rencana sama di semua perangkat)'
SAVEPOINT s1;
INSERT INTO daily_plans (id, user_id, plan_date, source)
VALUES ('uji-plan-2', 'uji-user-1', '2026-09-07', 'manual');
ROLLBACK TO SAVEPOINT s1;

\echo ''
\echo '--- 3. butir dengan item_type tak dikenal harus DITOLAK ---'
\echo '    tanpa baris ERROR di bawah ini, kendala tidak bekerja'
SAVEPOINT s2;
INSERT INTO daily_plan_items (id, plan_id, item_type, position, name)
VALUES ('uji-item-x', 'uji-plan-1', 'minuman', 1, 'Teh');
ROLLBACK TO SAVEPOINT s2;

\echo ''
\echo '--- 4. butir sah harus berhasil ---'
INSERT INTO daily_plan_items (id, plan_id, item_type, position, source_ref, name, description)
VALUES ('uji-item-1', 'uji-plan-1', 'activity', 1, 1, 'Morning Stretching', 'Peregangan 15 menit'),
       ('uji-item-2', 'uji-plan-1', 'activity', 2, 3, 'Chair Yoga', 'Yoga ringan'),
       ('uji-item-3', 'uji-plan-1', 'food', 1, 2, 'Oatmeal', 'Sarapan serat tinggi');
SELECT COUNT(*) AS jumlah_butir FROM daily_plan_items WHERE plan_id = 'uji-plan-1';

\echo ''
\echo '--- 5. posisi ganda pada tipe sama harus DITOLAK ---'
\echo '    tanpa baris ERROR di bawah ini, kendala tidak bekerja'
SAVEPOINT s3;
INSERT INTO daily_plan_items (id, plan_id, item_type, position, name)
VALUES ('uji-item-y', 'uji-plan-1', 'activity', 1, 'Duplikat');
ROLLBACK TO SAVEPOINT s3;

\echo ''
\echo '--- 6. progres melekat pada butir, satu lawan satu ---'
INSERT INTO plan_item_progress (id, plan_item_id, completed, completed_at)
VALUES ('uji-prog-1', 'uji-item-1', TRUE, NOW());
SELECT 'BERHASIL: progres tersimpan' AS hasil;

SAVEPOINT s4;
INSERT INTO plan_item_progress (id, plan_item_id, completed)
VALUES ('uji-prog-2', 'uji-item-1', FALSE);
ROLLBACK TO SAVEPOINT s4;

\echo ''
\echo '--- 7. pembacaan rencana beserta status tiap butir ---'
SELECT i.item_type, i.position, i.name, COALESCE(p.completed, FALSE) AS selesai
FROM daily_plan_items i
LEFT JOIN plan_item_progress p ON p.plan_item_id = i.id
WHERE i.plan_id = 'uji-plan-1'
ORDER BY i.item_type, i.position;

\echo ''
\echo '--- 8. menghapus pengguna harus menghapus rencana, butir, dan progres ---'
DELETE FROM users WHERE id = 'uji-user-1';
SELECT (SELECT COUNT(*) FROM daily_plans        WHERE user_id = 'uji-user-1') AS sisa_rencana,
       (SELECT COUNT(*) FROM daily_plan_items   WHERE plan_id = 'uji-plan-1') AS sisa_butir,
       (SELECT COUNT(*) FROM plan_item_progress WHERE plan_item_id = 'uji-item-1') AS sisa_progres;

\echo ''
\echo '--- membatalkan seluruh perubahan uji ---'
ROLLBACK;

\echo 'selesai. Nomor 2, 3, 5, dan 6 lulus apabila masing-masing menghasilkan baris ERROR.'
\echo 'Tidak adanya ERROR pada nomor tersebut berarti kendala tidak bekerja.'
