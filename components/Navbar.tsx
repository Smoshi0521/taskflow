import React, { SetStateAction } from 'react'
import { FaColumns } from 'react-icons/fa'
import { BiChevronUp } from 'react-icons/bi'
import { useState } from 'react'
import Board from './Board'
import { motion } from 'framer-motion'
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { db } from '@/firebase';
import { AnimatePresence } from 'framer-motion'
type Props = {
  closeSideBar: boolean
  setCloseSideBar: React.Dispatch<SetStateAction<boolean>>
  setCreateBoard: React.Dispatch<SetStateAction<boolean>>
}
function Navbar({ closeSideBar, setCloseSideBar, setCreateBoard }: Props) {
  const [showBoardList, setShowBoardList] = useState(false)
  const [hideBoard, setHideBoard] = useState(false)
  const { data: session } = useSession()
  const [board, loading, error] = useCollection(
    session && query(
      collection(db, 'users', session.user?.email!, 'board'),
      orderBy("createdAt", 'desc')
    )
  )
  function hideBoardList() {
    if (!showBoardList) {
      setShowBoardList(true)
      setHideBoard(true)
    }
    else {
      setShowBoardList(false)
      setTimeout(() => {
        setHideBoard(false)
      }, 300)
    }
  }
  console.log(showBoardList,hideBoard ," here")
  return (
    <div className={`w-full h-full bg-secondary flex justify-center items-center shadow-sm px-2`}>
      <div className='w-full flex justify-end md:hidden'>
        <button onClick={hideBoardList} className='flex items-center gap-1'>
          <FaColumns className="text-xl text-bw" />
          <BiChevronUp className={`text-lg text-bw ${!showBoardList ? "" : "rotate-180"}`} />
        </button>
      </div>
        {
            <motion.div
              initial={showBoardList ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
              animate={showBoardList ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className={`${hideBoard ? "absolute" : "hidden"} flex flex-col md:hidden w-[300px] h-auto bg-secondary top-20 right-3 rounded-lg shadow-2xl py-5 px-3`}>
              <p className='text-bw font-semibold text-md cursor-default py-2'>Board List</p>
              <div className={`w-full ${hideBoard ? "flex" : "hidden"} flex-col flex-1 items-center py-5`}>
                {
                  board?.docs.map((board) => (
                    <Board key={board.id} id={board.id} title={board.data().title} />
                  ))
                }
              </div>
              <button onClick={() => setCreateBoard(true)} disabled={!hideBoard} className='bg-paleGreen hover:bg-emerald-300 transition duration-300 rounded-lg font-semibold py-1 text-sm'>+Create Board</button>
            </motion.div>
        }
    </div >
  )
}

export default Navbar