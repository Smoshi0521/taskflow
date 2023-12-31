import Layout from '@/components/Layout'
import React, { useEffect } from 'react'
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import Columns from '@/components/Columns';
import { AiOutlinePlus } from 'react-icons/ai'
import CreateColumn from '@/components/form/CreateColumn';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase';
import Loader from '@/components/loader/Loader';
import { FiArrowDownCircle } from 'react-icons/fi'
import { motion } from 'framer-motion';
import SignOut from '@/components/Signout';
import Board from '@/components/Board';
import ToggleTheme from '@/components/ToggleTheme';

type Props = {
  session: any
}

function BoardPage({ session }: Props) {
  const [showCreateColumn, setShowCreateColumn] = useState(false)
  const router = useRouter()
  const boardId = router.query.id

  const [board, loading2, error2] = useCollection(
    session && query(
      collection(db, 'users', session.user?.email!, 'board'),
      orderBy("createdAt", 'desc')
    )
  )
  const [columns, loading, error] = useCollection(
    session && query(
      collection(db, 'users', session.user?.email!, 'board', `${boardId}`, 'columns'),
      orderBy("createdAt", 'asc')
    )
  )

  useEffect(() => {
    if (board?.size === 0) {
      router.push('/')
      console.log("here")
    }
  }, [board, router])

  return (
    <Layout session={session}>
      {loading ? (
        <div className=' h-full flex items-center justify-center'>
          <Loader />
        </div>
      ) : (
        <div className='flex text-bw h-full px-2 pt-3'>
          {
            columns?.size === 0 ? (
              <div className='flex justify-center w-full'>
                <div className='w-full flex flex-col items-center relative  border-red-500 gap-5'>
                  <div className='flex flex-col items-center relative top-20 gap-5'>
                    <p className='text-[25px] text-gray-500/50 font-bold text-center relative'>This board is empty. Create a new column to get started</p>
                    <FiArrowDownCircle className="text-2xl rotate-180 animate-bounce" />
                    <div onClick={() => setShowCreateColumn(!showCreateColumn)} className='flex justify-center items-center gap-1 w-fit px-5 py-2 cursor-pointer bg-column rounded-xl h-auto shadow-lg'>
                      <AiOutlinePlus className="text-bw" />
                      <p className='text-bw font-semibold'>Add Column</p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className='flex items-center gap-2 w-auto'>
                {
                  columns?.docs.map((column) => (
                    <Columns key={column.id} id={column.id} title={column.data().title} />
                  ))
                }
                <div className='h-full '>
                  <div onClick={() => setShowCreateColumn(!showCreateColumn)} className='flex hover:bg-emerald-500 hover:text-white justify-center items-center gap-1 min-w-[150px] px-2 w-full py-2 cursor-pointer bg-column rounded-xl h-auto shadow-lg'>
                    <AiOutlinePlus className="" />
                    <p className='font-semibold text-sm w-full'>Add Column</p>
                  </div>
                </div>

              </div>
            )
          }
          <AnimatePresence>
            {
              showCreateColumn && (
                <div className='absolute h-screen w-full bg-black/50 top-0 left-[0px] z-20 flex items-center overflow-x-hidden'>
                  <CreateColumn setShowCreateColumn={setShowCreateColumn} />
                </div>
              )
            }
          </AnimatePresence>
        </div>
      )
      }
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

export default BoardPage