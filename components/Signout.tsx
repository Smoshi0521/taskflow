import React from 'react'
import { signOut } from 'next-auth/react'
function SignOut() {
  return (
    <>
      <button onClick={() => signOut()} className='w-full bg-paleGreen md:py-3 cursor-pointer hover:bg-emerald-300 transition duration-200 rounded-lg'>Sign Out</button>
    </>
  )
}

export default SignOut