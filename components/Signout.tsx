import React from 'react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react';
function SignOut() {
  const { data: session } = useSession()
  return (
    <>
      <button onClick={() => signOut()} className='w-full bg-gray-500 py-2 text-white md:py-3 cursor-pointer hover:bg-emerald-300 transition duration-200 rounded-lg'>
        <p className='text-md truncate font-bold'>
          Sign Out
        </p>
      </button>
    </>
  )
}

export default SignOut