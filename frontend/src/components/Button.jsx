function LoginButtons({ name }) {
  return (
    <button className="rounded-lg smooth-rounded-lg w-30 px-6 py-2 bg-gray-300 hover:bg-white text-black font-semibold transition-all duration-200 cursor-pointer">
          {name}
    </button>
  )
}

export default LoginButtons