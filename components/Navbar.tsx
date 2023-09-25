import React, { SetStateAction, useEffect } from 'react'
import { FaColumns } from 'react-icons/fa'
import { BiChevronUp } from 'react-icons/bi'
import { useState } from 'react'
import Board from './Board'
import { motion } from 'framer-motion'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { db } from '@/firebase';
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { HiDotsVertical } from 'react-icons/hi'
import { AiTwotoneDelete } from 'react-icons/ai'
import { MdModeEdit } from 'react-icons/md'
import Loader from './loader/Loader'
import EditBoard from './form/EditBoard'
type Props = {
  closeSideBar: boolean
  setCloseSideBar: React.Dispatch<SetStateAction<boolean>>
  setCreateBoard: React.Dispatch<SetStateAction<boolean>>
}


function Navbar({ closeSideBar, setCloseSideBar, setCreateBoard }: Props) {
  const [showListAction, setShowListAction] = useState(false)
  const [showEditBoard, setShowEditBoard] = useState(false)
  const [showDeleteBoard, setShowDeleteBoard] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  const router = useRouter()
  const boardId = router.query.id
  const { data: session } = useSession()
  const [dateInfo, setDateInfo] = useState({ date: '', dayOfWeek: '', month: '' });

 
  const getDateInfo = (): { date: string; dayOfWeek: string; month: string } => {
    const currentDate = new Date();

    const date = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const month = currentDate.toLocaleDateString('en-US', { month: 'long' });

    return { date, dayOfWeek, month };
  };

  useEffect(() => {
    const { date, dayOfWeek, month } = getDateInfo()
    setDateInfo({ date: `${date}`, dayOfWeek: `${dayOfWeek}`, month: `${month}` })
  }, [])


  const [currentBoard] = useDocument(
    session && (
      doc(db, 'users', session.user?.email!, 'board', `${boardId}`)
    )
  )

  console.log("hello")

  async function handleDeleteBoard() {
    setShowLoading(true)
    try {
      const columnQuery = query(
        collection(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns')
      );
      const columnSnapshot = await getDocs(columnQuery);

      const deletePromises = [];

      for (const col of columnSnapshot.docs) {
        const colDocRef = doc(
          db,
          'users',
          session?.user?.email!,
          'board',
          `${boardId}`,
          'columns',
          col.id
        );
        deletePromises.push(deleteDoc(colDocRef));

        const taskQuery = query(
          collection(
            db,
            'users',
            session?.user?.email!,
            'board',
            `${boardId}`,
            'columns',
            col.id,
            'task'
          )
        );
        const taskSnapshot = await getDocs(taskQuery);

        for (const task of taskSnapshot.docs) {
          const taskDocRef = doc(
            db,
            'users',
            session?.user?.email!,
            'board',
            `${boardId}`,
            'columns',
            col.id,
            'task',
            task.id
          );
          deletePromises.push(deleteDoc(taskDocRef));

          const subtaskQuery = query(
            collection(
              db,
              'users',
              session?.user?.email!,
              'board',
              `${boardId}`,
              'columns',
              col.id,
              'task',
              task.id,
              'subtask'
            )
          );
          const subtaskSnapshot = await getDocs(subtaskQuery);

          for (const subtask of subtaskSnapshot.docs) {
            const subtaskDocRef = doc(
              db,
              'users',
              session?.user?.email!,
              'board',
              `${boardId}`,
              'columns',
              col.id,
              'task',
              task.id,
              'subtask',
              subtask.id
            );
            deletePromises.push(deleteDoc(subtaskDocRef));
          }
        }
      }

      // Wait for all delete operations to complete
      await Promise.all(deletePromises)

        .then(async () => {
          const borderQuery: any = doc(db, 'users', session?.user?.email!, 'board', `${boardId}`,)
          await deleteDoc(borderQuery);
        })
        .then(() => {
          setShowLoading(false)
          setShowDeleteAlert(false)
          setShowListAction(false)
        })
        router.push('/')
      console.log('All data deleted successfully');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  const minHeight = `clamp(2rem, 10.5vw, 5.125rem)`;

  return (
    <div style={{ minHeight }} className={`w-full bg-secondary flex justify-end md:justify-between items-center shadow-sm px-2 sm:border md:border-b-sideBorder border-transparent`}>
      <div className='w-full h-full flex items-center justify-between relative px-2'>

        <div className='md:flex items-center hidden w-full '>
          <h1 className='font-bold  md:text-[25px] text-bw'>{
            currentBoard?.data()?.title !== undefined ? currentBoard?.data()?.title
              : " "
          }</h1>
        </div>


        <div className='flex items-center w-full justify-end'>
          {
            boardId !== undefined && (
              <button onClick={() => setShowListAction(!showListAction)} className='text-white duration-300 rounded-full p-1'>
                <HiDotsVertical className="text-xl md:text-2xl text-bw" />
              </button>
            )
          }
          <div className='flex flex-col items-start  gap-0 ml-1 cursor-default'>
            <p className='text-xs md:text-[15px] font-bold text-paleGreen'>{`${dateInfo.dayOfWeek}`}</p>
            <p className='text-xs md:text-[15px] text-bw'>{dateInfo.date}</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {
          showListAction && (
            <motion.div
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className='absolute bg-secondary flex flex-col items-start right-5 md:right-32 top-20 rounded-lg w-[180px] h-auto z-0 px-2 py-3 gap-1' style={{ boxShadow: '0px 8px 15px 0px gray' }} >
              <div className='flex flex-col items-start w-full gap-2'>
                <div className='gap-2 px-2 flex items-center justify-between text-dropText  hover:text-bw duration-300'>
                  <MdModeEdit />
                  <button onClick={() => setShowEditBoard(!showEditBoard)} className='w-fit text-sm md:text-md'>Edit Board</button>
                </div>
                <div className=' gap-2 flex justify-between px-2 text-dropText hover:text-red-500 duration-300'>
                  <AiTwotoneDelete />
                  <button onClick={() => setShowDeleteAlert(!showDeleteBoard)} className='w-fit text-sm md:text-md'>Delete Board</button>
                </div>

              </div>
            </motion.div>
          )
        }
      </AnimatePresence>

      <AnimatePresence>
        {
          showDeleteAlert && (
            <div className='absolute h-screen flex justify-center items-center w-full bg-black/50 top-0 left-0 z-100 overflow-y-auto px-3'>
              {
                showLoading ? (
                  <Loader />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.25 }}
                    className='bg-white flex flex-col items-center relative top-[-50px] rounded-lg w-[400px] h-auto z-40 p-5 gap-3'>
                    <h3 className='text-red-500 w-full font-bold text-lg'>Delete Task?</h3>
                    <p className='text-sm text-gray-600 font-semibold'>{`Are you sure you want to delete this board? This action will remove all its column and task and cannot be recover.`}</p>
                    <div className='flex w-full justify-between mt-3 gap-2'>
                      <button onClick={handleDeleteBoard} className='bg-red-500 hover:bg-red-400 duration-300 rounded-xl text-white w-full font-semibold px-4 py-2 text-sm'>Delete</button>
                      <button onClick={() => setShowDeleteAlert(!showDeleteAlert)} className='bg-gray-500 hover:bg-gray-400 duration-300 rounded-xl text-white w-full font-semibold px-4 py-2 text-sm'>Cancel</button>
                    </div>
                  </motion.div>
                )
              }
            </div>
          )
        }
      </AnimatePresence>


      <AnimatePresence>
        {
          showEditBoard && (
            <div className='absolute h-screen flex justify-center items-center w-full bg-black/50 top-0 left-0 z-100 overflow-y-auto px-3'>
              <EditBoard setShowEditBoard={setShowEditBoard} setShowListAction={setShowListAction} />
            </div>
          )
        }
      </AnimatePresence>

    </div >
  )
}

export default Navbar