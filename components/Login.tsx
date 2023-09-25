import React from 'react'
import { signIn } from 'next-auth/react'
import { AiFillGoogleCircle } from 'react-icons/ai'
function Login() {
  return (
    <div className='bg-emerald-400 h-screen flex items-center w-full justify-center'>
      <div className='h-[400px]  w-[400px] flex flex-col items-center rounded-lg gap-10 justify-center'>
        <h1 className='font-bold text-[40px] cursor-default'>TASKFLOW</h1>
        <button onClick={() => signIn('google')} className=' transition duration-300 group hover:bg-white w-8/12 rounded-lg bg-slate-800 py-5 text-center flex items-center justify-center space-x-2'>
          <AiFillGoogleCircle className="text-xl sm:text-2xl text-white group-hover:text-black transition duration-300 animate-pulse" />
          <span className='font-semibold text-md sm:text-lg text-white group-hover:text-black transition duration-300 animate-pulse'>LOGIN WITH GOOGLE</span>
        </button>
      </div>
    </div>
  )
}

export default Login