import React, { SetStateAction, useState } from 'react'
import { AnimatePresence, clamp, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { collection, doc, orderBy, query } from 'firebase/firestore';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { useSession } from 'next-auth/react';
import { db } from '@/firebase';
import { AiOutlinePlus } from 'react-icons/ai'
import { BiChevronUp } from 'react-icons/bi'
import Board from './Board';
import ToggleTheme from './ToggleTheme';
import SignOut from './Signout';
type Props = {
  closeSideBar: boolean
  setCreateBoard: React.Dispatch<SetStateAction<boolean>>
}
function Logo({ closeSideBar, setCreateBoard }: Props) {
  const router = useRouter()
  const boardId = router.query.id
  const { data: session } = useSession()
  const [showBoardList, setShowBoardList] = useState(false)
  const [hideBoard, setHideBoard] = useState(false)
  const [board, loading, error] = useCollection(
    session && query(
      collection(db, 'users', session.user?.email!, 'board'),
      orderBy("createdAt", 'desc')
    )
  )

  const [currentBoard] = useDocument(
    session && (
      doc(db, 'users', session.user?.email!, 'board', `${boardId}`)
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

  const minHeight = `clamp(4rem, 10.5vw, 6.125rem)`
  const boardLength = board?.docs.length;
  return (
    <AnimatePresence>
      <motion.div
        key={"dropDown"}
        initial={closeSideBar ? { width: "350px" } : { width: "500px" }}
        animate={closeSideBar ? { width: "350px" } : { width: "500px" }}
        transition={{ duration: 0.5 }}
        className={`w-3/6 md:w-[250px] min-h-[10px] max-w-[150px] md:min-w-[200px] md:max-w-[300px] flex items-center bg-secondary md:border-[1px] border-r-gray-500 border-transparent`}>
        <p className='font-bold text-[20px] md:text-[40px] text-bw text-start md:text-center w-full px-5 hidden  md:block'>TASKFLOW</p>
        <div className='flex items-center justify-center w-full ml-2 border-red-500 z-10  '>
          <p
            onClick={hideBoardList}
            className='flex items-center font-bold text-sm md:text-[40px] truncate text-ellipsis text-bw text-end md:hidden'>
            {
              currentBoard?.data()?.title === undefined ?
                "TaskFlow" :
                currentBoard?.data()?.title
            }
          </p>

          <div>
            <BiChevronUp className={`text-2xl text-bw md:hidden mx-1 w-5  ${!showBoardList ? "" : "rotate-180"}`} />
          </div>
        </div>
      </motion.div>

      {
        showBoardList && (
          <div className='absolute md:hidden w-full flex justify-center top-16 h-screen bg-black/50 overflow-y-auto'>
            <motion.div
              key={"boardListMenu"}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className={`${hideBoard ? "absolute" : "hidden"} flex flex-col md:hidden w-[300px] my-2 h-fit bg-secondary rounded-lg shadow-2xl py-5 px-3`}>
              <div className='flex items-center justify-between w-full'>
                <p className='text-bw font-semibold text-sm cursor-default px-2'>{`BOARDS (${boardLength === undefined ? "0" : boardLength})`}</p>
                <button onClick={() => setCreateBoard(true)} aria-label='Create-board' className='text-sm text-bw p-1  hover:text-white duration-300 text-emerald-500 font-semibold'>+Close</button>
              </div>
              <div className={`w-full ${hideBoard ? "flex" : "hidden"} flex-col flex-1 items-start py-2`}>
                {
                  board?.docs.map((boards, index) => (
                    <Board key={index} id={boards.id} title={boards.data().title} setShowBoardList={setShowBoardList} />
                  ))
                }
              </div>
              <div className='flex flex-col gap-2'>
                <ToggleTheme />
                <SignOut />
              </div>
            </motion.div>
          </div>
        )
      }
    </AnimatePresence>

  )
}

export default Logo