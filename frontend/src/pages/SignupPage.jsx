import { Link } from "react-router-dom";
import Logo from '../assets/images/aurafit-mark.svg';
import React from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../utils/network-data";
import { LATAR_AUTENTIKASI } from '../utils/backgrounds';

const KELAS_INPUT = "border border-black px-2 py-1 rounded-lg shadow-md";

// Pendaftaran dibagi menjadi dua langkah.
//
// Sebelumnya sepuluh medan tampil sekaligus, sehingga pengguna harus mengisi
// seluruhnya sebelum melihat apa pun. Pembagian ini memperpendek layar yang
// dihadapi sekali waktu, dan memisahkan data akun dari data tubuh.
//
// Akun tetap dibuat sekali kirim pada akhir langkah kedua, karena backend
// mewajibkan seluruh kolom terisi. Memisahkan pembuatan akun dari pengisian
// profil memerlukan perubahan skema, dan itu keputusan tersendiri.
function SignupPage() {
  const [langkah, setLangkah] = React.useState(1);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [age, setAge] = React.useState('');
  const [sex, setSex] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [height, setHeight] = React.useState('');
  const [goal, setGoal] = React.useState('');

  const [galat, setGalat] = React.useState('');
  const [sedangKirim, setSedangKirim] = React.useState(false);

  const navigate = useNavigate();

  function keLangkahDua(event) {
    event.preventDefault();
    setGalat('');

    if (!firstName || !username || !email || !password) {
      setGalat('Lengkapi seluruh isian pada langkah ini.');
      return;
    }
    if (password.length < 6) {
      setGalat('Kata sandi minimal 6 karakter.');
      return;
    }
    setLangkah(2);
  }

  function kembali() {
    setGalat('');
    setLangkah(1);
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setGalat('');

    if (!sex) return setGalat('Pilih jenis kelamin terlebih dahulu.');
    if (!goal) return setGalat('Pilih tujuan terlebih dahulu.');

    setSedangKirim(true);
    const response = await register({ username, email, password, firstName, lastName, sex, weight, height, goal, age });
    setSedangKirim(false);

    if (response.error) {
      // Bentrok nama pengguna atau surel berasal dari langkah pertama, sehingga
      // pengguna dikembalikan ke sana untuk memperbaikinya.
      const pesan = String(response.message || '');
      if (/username|email|sudah|exists|duplicate/i.test(pesan)) setLangkah(1);
      setGalat(pesan);
      return;
    }
    navigate('/login', { state: { baruMendaftar: true } });
  }

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      <Link to="/" className="absolute top-0 left-0 ml-6 mt-6 sm:ml-10 sm:mt-10 z-20">
        <button className="py-2 px-1 w-20 rounded-lg bg-[#293F2A] text-white font-semibold cursor-pointer transition-all duration-300 hover:shadow-lg">
          Beranda
        </button>
      </Link>

      {/* form section */}
      <section className="flex flex-col w-full md:w-3/5 items-center pt-24 pb-12 px-6 sm:px-10 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center justify-center w-full max-w-xl mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-special-gothic-expanded-one">Buat Akun</h1>
          <p className="mt-2 text-sm text-gray-600">Langkah {langkah} dari 2</p>
          <div className="mt-3 flex gap-2 w-40" aria-hidden="true">
            <span className="h-1.5 flex-1 rounded-full bg-[#293F2A]" />
            <span className={`h-1.5 flex-1 rounded-full ${langkah === 2 ? 'bg-[#293F2A]' : 'bg-gray-300'}`} />
          </div>
        </div>

        <form
          onSubmit={langkah === 1 ? keLangkahDua : onSubmitHandler}
          className="w-full max-w-sm flex flex-col space-y-3"
        >
          {langkah === 1 ? (
            <fieldset className="border-none p-0 m-0 space-y-3">
              <legend className="text-xl font-montserrat font-bold mb-2 block">Akun</legend>
              <p className="text-sm text-gray-600 mb-4">
                Dipakai untuk masuk ke AuraFit.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex flex-col flex-1">
                  <label htmlFor="signup-firstname">Nama Depan</label>
                  <input
                    id="signup-firstname"
                    type="text"
                    className={KELAS_INPUT}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label htmlFor="signup-lastname">Nama Belakang</label>
                  <input
                    id="signup-lastname"
                    type="text"
                    className={KELAS_INPUT}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="signup-username">Nama Pengguna</label>
                <input
                  id="signup-username"
                  type="text"
                  className={KELAS_INPUT}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="nama@contoh.com"
                  className={KELAS_INPUT}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="signup-password">Kata Sandi</label>
                <input
                  id="signup-password"
                  type="password"
                  className={KELAS_INPUT}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  aria-describedby="bantuan-sandi"
                />
                <p id="bantuan-sandi" className="text-xs text-gray-600 mt-1">Minimal 6 karakter.</p>
              </div>
            </fieldset>
          ) : (
            <fieldset className="border-none p-0 m-0 space-y-3">
              <legend className="text-xl font-montserrat font-bold mb-2 block">Data Tubuh</legend>
              <p className="text-sm text-gray-600 mb-4">
                Dipakai untuk menghitung BMI dan menyusun rencana harianmu. Data ini
                hanya terlihat olehmu.
              </p>

              <div className="flex flex-col">
                <label htmlFor="signup-sex">Jenis Kelamin</label>
                <select
                  id="signup-sex"
                  className={KELAS_INPUT}
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  required
                >
                  <option value="" disabled>Pilih jenis kelamin</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="signup-age">Umur (tahun)</label>
                <input
                  id="signup-age"
                  type="number"
                  min={10}
                  max={120}
                  className={KELAS_INPUT}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex flex-col flex-1">
                  <label htmlFor="signup-weight">Berat Badan (kg)</label>
                  <input
                    id="signup-weight"
                    type="number"
                    min={20}
                    max={400}
                    className={KELAS_INPUT}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label htmlFor="signup-height">Tinggi Badan (cm)</label>
                  <input
                    id="signup-height"
                    type="number"
                    min={80}
                    max={250}
                    className={KELAS_INPUT}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="signup-goal">Tujuan</label>
                <select
                  id="signup-goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className={KELAS_INPUT}
                  required
                >
                  <option value="" disabled>Pilih tujuan</option>
                  <option value="lose_weight">Menurunkan berat badan</option>
                  <option value="maintain_weight">Mempertahankan berat badan</option>
                  <option value="gain_weight">Menambah berat badan</option>
                </select>
              </div>
            </fieldset>
          )}

          {galat ? (
            <p role="alert" className="w-full rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
              {galat}
            </p>
          ) : null}

          <div className="flex justify-center gap-3">
            {langkah === 2 ? (
              <button
                type="button"
                onClick={kembali}
                className="mt-4 py-2 px-1 w-32 rounded-lg bg-gray-200 hover:bg-gray-300 text-black font-semibold cursor-pointer transition-all duration-300"
              >
                Kembali
              </button>
            ) : null}

            <button
              type="submit"
              disabled={sedangKirim}
              aria-busy={sedangKirim}
              className="mt-4 py-2 px-1 w-40 rounded-lg bg-[#293F2A] text-white font-semibold cursor-pointer transition-all duration-300 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {langkah === 1 ? 'Lanjut' : sedangKirim ? 'Mendaftarkan…' : 'Daftar'}
            </button>
          </div>
        </form>

        {/* login link shown only on mobile */}
        <p className="mt-8 text-sm md:hidden">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-green-800 font-semibold hover:underline">Masuk</Link>
        </p>
      </section>

      {/* decorative aside — hidden on mobile */}
      <aside
        className="hidden md:flex w-2/5 flex-col h-screen bg-cover bg-center relative justify-center items-center text-center text-white sticky top-0"
        style={{ backgroundImage: LATAR_AUTENTIKASI }}
      >
        <div className="absolute inset-0 bg-green-700/60 backdrop-blur-xs" aria-hidden="true" />

        <div className="relative z-10 h-full flex flex-col items-center justify-between py-10 px-8 text-white text-center">
          <div>
            <h2 className="text-5xl font-special-gothic-expanded-one">AuraFit</h2>
            <p className="font-montserrat">Your Personal Digital Health Coach.</p>
          </div>

          <div>
            <img src={Logo} alt="" aria-hidden="true" className="w-56 h-56" />
          </div>

          <div>
            <p>Sudah punya akun?{" "}
              <Link to="/login" className="text-yellow-400 font-semibold cursor-pointer hover:underline">Masuk</Link>
            </p>
          </div>
        </div>
      </aside>
    </main>
  );
}

export default SignupPage;
