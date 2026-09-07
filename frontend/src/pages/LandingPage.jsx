import LoginButtons from "../components/Button";
import { Link } from "react-router-dom";
import { LATAR_UTAMA } from '../utils/backgrounds';

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

const ROLE_COLORS = {
  "Project Manager":       "bg-amber-100/80 text-amber-700",
  "Database & Deployment": "bg-blue-100/80 text-blue-700",
  "Frontend Developer":    "bg-purple-100/80 text-purple-700",
  "Backend & Integration":  "bg-emerald-100/80 text-emerald-700",
  "QA & Documentation":    "bg-rose-100/80 text-rose-700",
};

function ContributorCard({ contributor }) {
  return (
    /* Added `h-full` to make the card stretch to match its grid item wrapper.
      Changed `gap-3` to `gap-4` to handle spacing, and used `mt-auto` on the 
      GitHub button to push it perfectly to the bottom of shorter text cards.
    */
    <article className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center gap-4 shadow-sm hover:scale-105 hover:shadow-lg transition-all duration-200 h-full">
      {/* Profile Picture Image */}
      <div className="w-16 h-16 rounded-full bg-white/80 border border-black/10 overflow-hidden flex items-center justify-center shadow-sm flex-shrink-0">
        <img
          src={contributor.image}
          alt={`${contributor.name}'s profile`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Name & username */}
      <div className="text-center">
        <p className="text-black font-bold text-base leading-snug break-words">{contributor.name}</p>
        <p className="text-gray-600 text-xs mt-0.5">@{contributor.username}</p>
      </div>

      {/* Role badge */}
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${ROLE_COLORS[contributor.role]}`}>
        {contributor.role}
      </span>

      {/* GitHub button â€” forced to stick to the card base using mt-auto */}
      <a
        href={contributor.github}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto rounded-lg w-full text-center px-6 py-2 bg-gray-300 hover:bg-white text-black font-semibold transition-all duration-200 text-sm"
      >
        GitHub â†—
      </a>
    </article>
  );
}

function LandingPage() {
  return (
    // bg-fixed menahan latar pada ukuran viewport, sehingga bagian halaman di
    // bawah layar pertama tidak ikut terwarnai dan tampil hitam. Latar
    // dibiarkan menggulung bersama halaman dan direntangkan menutupinya.
    <div
      className="w-full min-h-screen bg-center bg-no-repeat"
      style={{ backgroundImage: LATAR_UTAMA, backgroundSize: 'cover', backgroundColor: '#0b1f16' }}
    >
      {/* Nav â€” Fixed double class bug from prior snippet */}
      <header className="fixed top-0 right-0 p-4 sm:p-6 z-20">
        <nav className="flex gap-2 sm:gap-3" aria-label="Main Navigation">
          <Link to="/signup">
            <LoginButtons name="Sign up" />
          </Link>
          <Link to="/login">
            <LoginButtons name="Login" />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative w-full min-h-screen flex items-center">
        <div className="w-full border-y border-white/10 bg-black/45 backdrop-blur-md py-10 sm:py-16 px-6 sm:px-12 z-10">
          <h1 className="font-special-gothic-expanded-one text-5xl sm:text-6xl md:text-8xl text-white mb-3 transition-all duration-700 opacity-100 translate-y-0">
            AuraFit
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-300 mb-3 transition-all duration-700 delay-150 opacity-100 translate-y-0">
            Meet AuraFit: Your Personal Digital Health Coach.
          </h2>
          <p className="text-sm sm:text-base font-medium text-white/70 max-w-2xl transition-all duration-700 delay-300 opacity-100 translate-y-0">
            Rencana aktivitas dan asupan harian yang disesuaikan dengan profil tubuhmu, tersimpan rapi dan dapat ditelusuri.
          </p>
        </div>
      </section>

      {/* Contributors */}
      <section aria-label="Contributors" className="w-full px-6 sm:px-12 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-black/35 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-10">
            <h2 className="text-white font-bold text-2xl sm:text-3xl text-center mb-2">
              Meet the Team
            </h2>
            <p className="text-white/60 font-medium text-sm sm:text-base text-center mb-8">
              The people who built AuraFit
            </p>

            {/* Grid items (`<li>`) implicitly stretch to match the height of their row. 
              By targetting the children properly, they line up effortlessly.
            */}
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              role="list"
            >
              {CONTRIBUTORS.map((c) => (
                <li key={c.username}>
                  <ContributorCard contributor={c} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/35 backdrop-blur-md py-6 px-6 sm:px-12">
        <p className="text-center text-white/55 font-medium text-sm">
          Â© 2026 AuraFit Team. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;