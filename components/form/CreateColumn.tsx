import React, { SetStateAction } from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSession } from 'next-auth/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import Loader from '../loader/Loader';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'next/dist/client/router';
type Props = {
  setShowCreateColumn: React.Dispatch<SetStateAction<boolean>>
}
function CreateColumn({ setShowCreateColumn }: Props) {
  const [columnTitle, setColumnTitle] = useState('')
  const [clickedCreate, setClickedCreate] = useState(false)
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const boardId = router.query.id

  async function handleCreateColumn() {
    if (columnTitle !== '') {
      setLoading(true)
      const doc = await addDoc(collection(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns'), {
        title: columnTitle,
        createdAt: serverTimestamp()
      }).then(() => {
        setLoading(false)
        setShowCreateColumn(false)
      })
    }
    setClickedCreate(true)
  }
  return (
    <div className='w-full flex justify-center h-full items-center'>
      <motion.form
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
        className='w-11/12 md:w-[450px] bg-secondary rounded-lg h-auto flex flex-col items-center gap-5 justify-between py-5 px-5'>
        <p className='font-bold w-full text-start text-bw'>Create Column</p>

        <div className='w-full flex flex-col'>
          <div className='w-full flex items-center justify-between'>
            <label className='text-md text-bw font-semibold'>Column title</label>
            {
              columnTitle === '' && clickedCreate && (
                <div className='flex items-center gap-1'>
                  <AiOutlineExclamationCircle className="text-red-500 text-md" />
                  <p className='text-red-500 text-sm'>Column title is required</p>
                </div>
              )
            }
          </div>
          <div className={`w-full border ${clickedCreate && columnTitle === '' ? "border-red-500" : "border-gray-600"} focus-within:border-2 focus-within:border-dashed focus-within:border-green-500 h-10 rounded-md p-[2px]`}>
            <input onChange={(e) => setColumnTitle(e.target.value)} type='text' className={` bg-transparent rounded-md h-full pl-2 outline-none w-full text-bw`} />
          </div>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <button onClick={handleCreateColumn} type='button' className='text-white w-full bg-paleGreen rounded-lg py-2 font-bold'>Create Column</button>
          <button onClick={() => setShowCreateColumn(false)} type='button' className='text-white w-full bg-slate-300 rounded-lg py-2 font-bold'>Close</button>
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

export default CreateColumn