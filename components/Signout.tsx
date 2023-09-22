import React from 'react'
import { signOut } from 'next-auth/react'
function SignOut() {
  return (
    <>
      <button onClick={() => signOut()} className='w-full bg-white py-2 md:py-3 cursor-pointer hover:bg-emerald-300 transition duration-200 rounded-lg text-sm sm:text-md'>Sign Out</button>
    </>
  )
}

export default SignOut