import React from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { collection, serverTimestamp, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useSession } from 'next-auth/react';
import Loader from './Loader'
import { Create } from '@/crud'
type Props = {
  setCreateBoard: React.Dispatch<React.SetStateAction<boolean>>
}

function CreateBoard({ setCreateBoard }: Props) {
  const [boardTitle, setBoardTitle] = useState('')
  const [createWithoutTitle, setCreateWithoutTitle] = useState(false)
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  async function handleCreateBoard() {
    if (boardTitle !== '') {
      setLoading(true)
      const create: any = await Create(collection(db, 'users', session?.user?.email!, 'board'), {
        userId: session?.user?.email!,
        title: boardTitle,
        createdAt: serverTimestamp(),
      }).then(() => {
        setLoading(false)
        setCreateBoard(false)
      })
      console.log(create)
      // const doc = await addDoc(collection(db, 'users', session?.user?.email!, 'board'), {
      //   userId: session?.user?.email!,
      //   title: boardTitle,
      //   createdAt: serverTimestamp(),

      // }).then(() => {
      //   setLoading(false)
      //   setCreateBoard(false)
      // })
    }
    setCreateWithoutTitle(true)
  }

  return (
    <div className='w-full flex justify-center h-full items-center'>
      <motion.form
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
        className='w-11/12 md:w-[450px] bg-secondary rounded-lg h-auto flex flex-col items-center gap-5 justify-between py-5 px-5'>
        <p className='font-bold w-full text-start text-bw'>CREATE NEW BOARD</p>

        <div className='w-full flex flex-col'>
          <div className='w-full flex items-center justify-between'>
            <label className='text-md text-bw font-semibold'>Board title:</label>
            {
              boardTitle === '' && createWithoutTitle && (
                <div className='flex items-center gap-1'>
                  <AiOutlineExclamationCircle className="text-red-500 text-md" />
                  <p className='text-red-500 text-sm'>Board title is required</p>
                </div>
              )
            }
          </div>
          <div className='w-full  focus-within:border-2 border-dashed focus-within:border-green-500 h-10 rounded-md p-[2px]'>
            <input onChange={(e) => setBoardTitle(e.target.value)} type='text' className={`border ${boardTitle === '' && createWithoutTitle ? "border-red-500":"border-gray-600"} bg-transparent rounded-md h-full pl-2 outline-none w-full text-bw`} />
          </div>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <button onClick={handleCreateBoard} type='button' className='text-white w-full bg-paleGreen rounded-lg py-2 font-bold'>Create Board</button>
          <button onClick={() => setCreateBoard(false)} type='button' className='text-white w-full bg-slate-300 rounded-lg py-2 font-bold'>Close</button>
        </div>
      </motion.form>

      {
        //Display loading while saving the created board
        loading && (
          <div className={`w-full h-screen bg-black/50 absolute left-0 top-0 z-10 flex items-center justify-center`}>
            <Loader />
          </div>
        )
      }
    </div>
  )
}

export default CreateBoard