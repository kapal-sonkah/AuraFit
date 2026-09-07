import LoginButtons from "../components/Button";
import { Link } from "react-router-dom";

const CONTRIBUTORS = [
  {
    name: "Luthfi Zahran Panggabean",
    role: "Full Stack Developer",
    username: "BlueElectric05",
    github: "https://github.com/BlueElectric05",
    image: "/images/contributors/arka.jpg", 
  },
  {
    name: "Edwin Jonatan Purba",
    role: "Full Stack Developer",
    username: "clunckyboy",
    github: "https://github.com/clunckyboy",
    image: "/images/contributors/senna.jpg",
  },
  {
    name: "Susena Yudha Wijaya",
    role: "Data Scientist",
    username: "susenayw",
    github: "https://github.com/susenayw",
    image: "/images/contributors/rizky.jpg",
  },
  {
    name: "Josh Peter Pardosi",
    role: "Data Scientist",
    username: "JoshPardosi-231401031",
    github: "https://github.com/JoshPardosi-231401031",
    image: "/images/contributors/hana.jpg",
  },
  {
    name: "Muhammad Alif Akbar Harahap",
    role: "AI Engineer",
    username: "AlifAkbar99",
    github: "https://github.com/AlifAkbar99",
    image: "/images/contributors/daffa.jpg",
  },
  {
    name: "Muhammad Thomi Dzakwan Nasution",
    role: "AI Engineer",
    username: "Thomidz",
    github: "https://github.com/Thomidz",
    image: "/images/contributors/lila.jpg",
  },
];

const ROLE_COLORS = {
  "Full Stack Developer": "bg-blue-100/80 text-blue-700",
  "Data Scientist":       "bg-purple-100/80 text-purple-700",
  "AI Engineer":          "bg-green-100/80 text-green-700",
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
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = `https://github.com/${contributor.username}.png`;
          }}
        />
      </div>

      {/* Name & username */}
      <div className="text-center">
        <p className="text-black font-bold text-base leading-snug break-words">{contributor.name}</p>
        <p className="text-gray-400 text-xs mt-0.5">@{contributor.username}</p>
      </div>

      {/* Role badge */}
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${ROLE_COLORS[contributor.role]}`}>
        {contributor.role}
      </span>

      {/* GitHub button — forced to stick to the card base using mt-auto */}
      <a
        href={contributor.github}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto rounded-lg w-full text-center px-6 py-2 bg-gray-300 hover:bg-white text-black font-semibold transition-all duration-200 text-sm"
      >
        GitHub ↗
      </a>
    </article>
  );
}

function LandingPage() {
  return (
    <div
      className="w-full min-h-screen bg-fixed bg-center bg-no-repeat bg-slate-100"
      style={{ backgroundImage: "url('/images/landing-page-background.png')" }}
    >
      {/* Nav — Fixed double class bug from prior snippet */}
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
        <div className="w-full bg-white/60 backdrop-blur-sm py-8 sm:py-12 px-6 sm:px-12 z-10">
          <h1 className="font-special-gothic-expanded-one text-5xl sm:text-6xl md:text-8xl text-black mb-3 transition-all duration-700 opacity-100 translate-y-0">
            SmartFit
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-2 transition-all duration-700 delay-150 opacity-100 translate-y-0">
            Meet SmartFit: Your Personal Digital Health Coach.
          </h2>
          <p className="text-sm sm:text-base font-semibold text-black/75 transition-all duration-700 delay-300 opacity-100 translate-y-0">
            Tailored nutrition and fitness plans powered by AI, designed to adapt as you grow.
          </p>
        </div>
      </section>

      {/* Contributors */}
      <section aria-label="Contributors" className="w-full px-6 sm:px-12 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-10">
            <h2 className="text-black font-bold text-2xl sm:text-3xl text-center mb-2">
              Meet the Team
            </h2>
            <p className="text-black/60 font-semibold text-sm sm:text-base text-center mb-8">
              The people who built SmartFit
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
      <footer className="w-full bg-white/60 backdrop-blur-sm py-5 px-6 sm:px-12">
        <p className="text-center text-black/70 font-semibold text-sm">
          © 2026 SmartFit Team. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;