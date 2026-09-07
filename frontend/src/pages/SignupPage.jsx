import { Link } from "react-router-dom";
import Logo from '../assets/images/SFMonoLight.svg';
import React from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../utils/network-data";

function SignupPage() {
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

  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!sex) {
      alert('Please select a gender');
      return;
    }

    if (!goal) {
      alert('Please select a goal');
      return;
    }

    const response = await register({ username, email, password, firstName, lastName, sex, weight, height, goal, age });
    if (!response.error) {
      alert('Registered Successfully');
      navigate('/login');
    }
  }

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      <Link to="/" className="absolute top-0 left-0 ml-6 mt-6 sm:ml-10 sm:mt-10 z-20">
        <button className="py-2 px-1 w-20 rounded-lg bg-[#293F2A] text-white font-semibold cursor-pointer transition-all duration-300 hover:shadow-lg">
          Home
        </button>
      </Link>

      {/* form section */}
      <section className="flex flex-col w-full md:w-3/5 items-center pt-24 pb-12 px-6 sm:px-10 overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-center w-full max-w-xl mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-special-gothic-expanded-one">Create Account</h1>
        </div>

        <form onSubmit={onSubmitHandler} className="w-full max-w-sm flex flex-col items-center justify-center space-y-3">
          <fieldset className="border-none p-0 m-0 space-y-3">
            <legend className="text-xl font-montserrat font-bold mb-5 block">Credentials</legend>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex flex-col flex-1">
                <label htmlFor="signup-firstname">First Name</label>
                <input
                  id="signup-firstname"
                  type="text"
                  className="border border-black px-2 py-1 rounded-lg shadow-md"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor="signup-lastname">Last Name</label>
                <input
                  id="signup-lastname"
                  type="text"
                  className="border border-black px-2 py-1 rounded-lg shadow-md"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="signup-username">Username</label>
              <input
                id="signup-username"
                type="text"
                className="border border-black px-2 py-1 rounded-lg shadow-md"
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
                placeholder="example@gmail.com"
                className="border border-black px-2 py-1 rounded-lg shadow-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="6 characters minimum"
                className="border border-black px-2 py-1 rounded-lg shadow-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="signup-sex">Sex</label>
              <select
                id="signup-sex"
                className="border border-black px-2 py-1 rounded-lg shadow-md"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                required
              >
                <option value="" disabled>Select a gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="signup-age">Age</label>
              <input
                id="signup-age"
                type="number"
                placeholder="in years"
                className="border border-black px-2 py-1 rounded-lg shadow-md"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
          </fieldset>

          <fieldset className="border-none p-0 mt-6 space-y-3">
            <legend className="text-xl font-montserrat font-bold mb-5 mt-6 block">Health Info</legend>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex flex-col flex-1">
                <label htmlFor="signup-weight">Weight</label>
                <input
                  id="signup-weight"
                  type="number"
                  placeholder="in kilograms"
                  className="border border-black px-2 py-1 rounded-lg shadow-md"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor="signup-height">Height</label>
                <input
                  id="signup-height"
                  type="number"
                  placeholder="in centimeters"
                  className="border border-black px-2 py-1 rounded-lg shadow-md"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="signup-goal">Goal</label>
              <select
                id="signup-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="border border-black px-2 py-1 rounded-lg shadow-md"
                required
              >
                <option value="" disabled>Select a goal</option>
                <option value="lose_weight">Lose Weight</option>
                <option value="maintain_weight">Maintain Weight</option>
                <option value="gain_weight">Gain Weight</option>
              </select>
            </div>
          </fieldset>

          <div className="flex justify-center">
            <button
              type="submit"
              className="mt-4 py-2 px-1 w-40 rounded-lg bg-[#293F2A] text-white font-semibold cursor-pointer transition-all duration-300 hover:shadow-lg"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* login link shown only on mobile */}
        <p className="mt-8 text-sm md:hidden">
          Already have an account?{" "}
          <Link to="/login" className="text-green-800 font-semibold hover:underline">Login</Link>
        </p>
      </section>

      {/* decorative aside — hidden on mobile */}
      <aside
        className="hidden md:flex w-2/5 flex-col h-screen bg-cover bg-center relative justify-center items-center text-center text-white sticky top-0"
        style={{ backgroundImage: "url('/images/signup-background.png')" }}
      >
        <div className="absolute inset-0 bg-green-700/60 backdrop-blur-xs" aria-hidden="true" />

        <div className="relative z-10 h-full flex flex-col items-center justify-between py-10 px-8 text-white text-center">
          <div>
            <h2 className="text-5xl font-special-gothic-expanded-one">SmartFit</h2>
            <p className="font-montserrat">Your Personal Digital Health Coach.</p>
          </div>

          <div>
            <img src={Logo} alt="SmartFit Logo" className="w-80 h-80" />
          </div>

          <div>
            <p>Already have an account?{" "}
              <Link to="/login" className="text-yellow-400 font-semibold cursor-pointer hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </aside>
    </main>
  );
}

export default SignupPage;