import InvariantError from "../../../exceptions/invariant-error.js";
import response from "../../../utils/response.js";
import UserRepositories from "../repositories/user-repositories.js";
import { isAcceptablePassword } from '../../../security/password.js';

export const createUser = async (req, res, next) => {
  try {
    const { username, email, password, first_name, last_name, sex, weight, height, goal, age } = req.body ?? {};

    if (!username || !email || !first_name || !last_name || !sex || !goal || !isAcceptablePassword(password)) {
      return next(new InvariantError('Lengkapi data pendaftaran. Kata sandi minimal 8 karakter.'));
    }

    // Aturannya sama dengan ubah profil, agar akun yang lolos pendaftaran
    // tidak tertolak saat pertama kali menyimpan profil.
    const weightNumber = Number(weight);
    const heightNumber = Number(height);
    const ageNumber = Number(age);
    if (!Number.isFinite(weightNumber) || weightNumber < 20 || weightNumber > 400
      || !Number.isFinite(heightNumber) || heightNumber < 80 || heightNumber > 250
      || !Number.isInteger(ageNumber) || ageNumber < 10 || ageNumber > 120) {
      return next(new InvariantError('Data tubuh tidak valid.'));
    }
    if (!['male', 'female'].includes(sex) || !['lose_weight', 'maintain_weight', 'gain_weight'].includes(goal)) {
      return next(new InvariantError('Pilihan jenis kelamin atau tujuan tidak valid.'));
    }

    const emailBersih = String(email).trim().toLowerCase();
    const bentrok = await UserRepositories.findRegistrationConflict(username, emailBersih);
    if (bentrok.username) return next(new InvariantError('Nama pengguna sudah dipakai.'));
    if (bentrok.email) return next(new InvariantError('Email sudah terdaftar.'));

    const user = await UserRepositories.createUser(
      username, emailBersih, password, first_name, last_name, sex, weight, height, goal, age
    );

    if (!user) return next(new InvariantError('Failed to create user'));

    return response(res, 201, 'Pengguna berhasil dibuat', user);
  } catch (error) {
    // Dua pendaftaran bersamaan dapat lolos pemeriksaan di atas; kendala unik
    // di basis data menahan yang kedua.
    if (error.code === '23505') {
      return next(new InvariantError('Nama pengguna atau email sudah terdaftar.'));
    }
    return next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body ?? {};
    if (typeof current_password !== 'string' || !current_password) {
      return next(new InvariantError('Masukkan kata sandi saat ini.'));
    }
    if (!isAcceptablePassword(new_password)) {
      return next(new InvariantError('Kata sandi baru minimal 8 karakter.'));
    }

    const berhasil = await UserRepositories.changePassword(req.user.id, current_password, new_password);
    // 400, bukan 401: pengguna sudah terautentikasi, yang salah hanya isian
    // borang. 401 lazim dibaca klien sebagai sesi habis lalu memaksa keluar.
    if (!berhasil) return next(new InvariantError('Kata sandi saat ini salah.'));

    return response(res, 200, 'Kata sandi berhasil diganti', null);
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (req, res, next) => {
  const { id } = req.user;

  const user = await UserRepositories.getUserById(id);

  if (!user) return next(new InvariantError('Failed to retrieve user'));

  return response(res, 201, 'User retrieved successfully', user);
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const { first_name, last_name, gender, weight, height, goal, age } = req.body ?? {};
    const textFields = [first_name, last_name, gender, goal];
    if (textFields.some((value) => typeof value !== 'string' || !value.trim())) {
      return next(new InvariantError('Lengkapi data profil.'));
    }

    const weightNumber = Number(weight);
    const heightNumber = Number(height);
    const ageNumber = Number(age);
    if (!Number.isFinite(weightNumber) || weightNumber < 20 || weightNumber > 400
      || !Number.isFinite(heightNumber) || heightNumber < 80 || heightNumber > 250
      || !Number.isInteger(ageNumber) || ageNumber < 10 || ageNumber > 120) {
      return next(new InvariantError('Data tubuh tidak valid.'));
    }
    if (!['male', 'female'].includes(gender) || !['lose_weight', 'maintain_weight', 'gain_weight'].includes(goal)) {
      return next(new InvariantError('Pilihan profil tidak valid.'));
    }

    const user = await UserRepositories.updateProfile(req.user.id, {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      gender,
      weight: weightNumber,
      height: heightNumber,
      goal,
      age: ageNumber,
    });

    if (!user) return next(new InvariantError('Profil tidak ditemukan.'));
    return response(res, 200, 'Profil berhasil diperbarui', user);
  } catch (error) {
    return next(error);
  }
};
