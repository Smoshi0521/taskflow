import React, { SetStateAction, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSession } from 'next-auth/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { collection, serverTimestamp, addDoc, getDocs, doc, query, getDoc, DocumentData, updateDoc, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import Loader from './Loader';
import { useRouter } from 'next/dist/client/router';
import { useCollection } from 'react-firebase-hooks/firestore';

type Props = {
  setShowEditBoard: React.Dispatch<SetStateAction<boolean>>
}

function BoardEdit({ setShowEditBoard }: Props) {
  // const [boardTitle, setBoardTitle] = useState('')
  // const [createWithoutTitle, setCreateWithoutTitle] = useState(false)
  // const [loading, setLoading] = useState(false)
  // const [handleColumns, setHandleColumns] = useState<any>([])
  // const [boardData, setBoardData] = useState<DocumentData>()
  // const { data: session } = useSession()
  // const router = useRouter()
  // const boardId = router.query.id

  // const [columns, isLoading, error] = useCollection(session && query(collection(
  //   db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns'
  // ), orderBy("createdAt", 'asc')
  // ))


  // useEffect(() => {
  //   columns?.docs.map((col) => {
  //     setHandleColumns([handleColumns, { id: col.id, title: col.data().title }])
  //   })

  // }, [])

  console.log("hello")

  // async function handleGetDocs() {
  //   try {
  //     const ref = doc(db, 'users', session?.user?.email!, 'board', `${boardId}`);
  //     const docSnapshot = await getDoc(ref);
  //     setBoardData(docSnapshot.data())

  //   }
  //   catch (err) {
  //     console.log('caugth an error! ', err)
  //   }
  // }

  // useEffect(() => {
  //   handleGetDocs()
  // }, [session])

  // async function handleEditBoard() {

  //   if (boardTitle !== '') {
  //     setLoading(true)
  //     await updateDoc(doc(db, 'users', session?.user?.email!, 'board', `${boardId}`), {
  //       title: boardTitle,

  //     }).then(() => {
  //       setLoading(false)
  //       setShowEditBoard(false)
  //     })
  //   }
  //   setCreateWithoutTitle(true)
  // }

  return (
    <div className='w-full flex justify-center h-full items-center'>
      {/* <motion.form
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
        className='w-11/12 md:w-[450px] bg-secondary rounded-lg h-auto flex flex-col items-center gap-5 justify-between py-5 px-5'>
        <p className='font-bold w-full text-start text-bw'>EDIT BOARD</p>

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
            <input onChange={(e) => setBoardTitle(e.target.value)} defaultValue={boardData?.title} type='text' className={`border ${boardTitle === '' && createWithoutTitle ? "border-red-500" : "border-gray-600"} bg-transparent rounded-md h-full pl-2 outline-none w-full text-bw`} />
          </div>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <button onClick={handleEditBoard} type='button' className='text-white w-full bg-paleGreen rounded-lg py-2 font-bold'>Save</button>
          <button onClick={() => setShowEditBoard(false)} type='button' className='text-white w-full bg-slate-300 rounded-lg py-2 font-bold'>Close</button>
        </div>
      </motion.form>

      {
        //Display loading while saving the created board
        loading && (
          <div className={`w-full h-screen bg-black/50 absolute left-0 top-0 z-10 flex items-center justify-center`}>
            <Loader />
          </div>
        )
      } */}
    </div>
  )
}

export default BoardEdit