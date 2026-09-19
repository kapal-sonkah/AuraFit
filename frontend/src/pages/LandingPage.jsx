import { Link } from "react-router-dom";
import '../landing.css';

const CONTRIBUTORS = [
  {
    name: "Susena Yudha Wijaya",
    role: "Project Manager",
    username: "susenayw",
  },
  {
    name: "Josh Peter Pardosi",
    role: "Database & Deployment",
    username: "joshpeterpardosi",
  },
  {
    name: "Luthfi Zahran Panggabean",
    role: "Frontend Developer",
    username: "BlueElectric05",
  },
  {
    name: "Edwin Jonatan Purba",
    role: "Backend & Integration",
    username: "clunckyboy",
  },
  {
    name: "Michael Valent Satrio Munthe",
    role: "QA & Documentation",
    username: "michaelmunthe123",
  },
].map((c) => ({
  ...c,
  github: `https://github.com/${c.username}`,
  // Avatar diambil langsung dari GitHub agar tidak ada berkas gambar yang
  // perlu disimpan dan tidak ada tautan rusak ketika akun berganti foto.
  image: `https://github.com/${c.username}.png?size=128`,
}));

function ContributorCard({ contributor }) {
  return (
    /* Added `h-full` to make the card stretch to match its grid item wrapper.
      Changed `gap-3` to `gap-4` to handle spacing, and used `mt-auto` on the 
      GitHub button to push it perfectly to the bottom of shorter text cards.
    */
    <article className="landing-contributor">
      {/* Profile Picture Image */}
      <div className="landing-contributor__avatar">
        <img
          src={contributor.image}
          alt={`${contributor.name}'s profile`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Name & username */}
      <div>
        <p className="landing-contributor__name">{contributor.name}</p>
        <p className="landing-contributor__username">@{contributor.username}</p>
      </div>

      {/* Role badge */}
      <p className="landing-contributor__role">
        {contributor.role}
      </p>

      {/* GitHub button — forced to stick to the card base using mt-auto */}
      <a
        href={contributor.github}
        target="_blank"
        rel="noopener noreferrer"
        className="landing-contributor__link"
      >
        GitHub ↗
      </a>
    </article>
  );
}

function LandingPage({ loggedIn = false }) {
  return (
    <div className="landing-shell">
      <header className="landing-header">
        <Link to="/" className="landing-wordmark">AuraFit</Link>
        <nav className="landing-nav" aria-label="Navigasi utama">
          {/* Tombol utama ada di hero; tombol header dibuat sekunder agar
              keduanya tidak bersaing. Pengguna yang sudah masuk diarahkan
              langsung ke dasbor, bukan ke halaman Masuk. */}
          {loggedIn
            ? <Link to="/dashboard" className="landing-button landing-button--secondary">Buka dasbor</Link>
            : <Link to="/login" className="landing-button landing-button--secondary">Masuk</Link>}
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero__main">
          <p className="landing-hero__kicker">Personal digital health coach</p>
          <h1 className="landing-hero__title">Rencana sehat yang bisa kamu jalani.</h1>
          <p className="landing-hero__copy">
            Rencana aktivitas dan asupan harian yang disesuaikan dengan profil tubuhmu, tersimpan rapi dan dapat ditelusuri.
          </p>
          {/* Pengunjung baru sebelumnya hanya menemukan tombol Masuk. */}
          <div className="landing-hero__actions">
            {loggedIn
              ? <Link to="/dashboard" className="landing-button landing-button--primary">Lanjutkan rencana hari ini</Link>
              : <Link to="/signup" className="landing-button landing-button--primary">Mulai sekarang</Link>}
          </div>
        </div>
        <div className="landing-hero__side" aria-label="Cara kerja AuraFit">
          <article className="landing-tile landing-tile--accent">
            <p className="landing-tile__label">01 · Atur</p>
            <h2 className="landing-tile__title">Mulai dari profilmu.</h2>
            <p className="landing-tile__copy">Masukkan data dasar dan tujuan yang ingin kamu capai.</p>
          </article>
          <article className="landing-tile">
            <p className="landing-tile__label">02 · Jalani</p>
            <h2 className="landing-tile__title">Satu langkah setiap hari.</h2>
            <p className="landing-tile__copy">Lihat aktivitas dan asupanmu dalam satu rencana yang tersimpan.</p>
          </article>
        </div>
      </section>

      <section aria-label="Tim AuraFit" className="landing-section">
        <div className="landing-section__panel">
          <div className="landing-section__head">
            <h2 className="landing-section__title">Dibangun bersama.</h2>
            <p className="landing-section__copy">Tim AuraFit mengembangkan SmartFit menjadi proyek perangkat lunak yang lebih terstruktur.</p>
          </div>

            {/* Grid items (`<li>`) implicitly stretch to match the height of their row. 
              By targetting the children properly, they line up effortlessly.
            */}
            <ul className="landing-team" role="list">
              {CONTRIBUTORS.map((c) => (
                <li key={c.username}>
                  <ContributorCard contributor={c} />
                </li>
              ))}
            </ul>
        </div>
      </section>

      <footer className="landing-footer">
        <p>
          © 2026 AuraFit Team. Proyek Perangkat Lunak.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
