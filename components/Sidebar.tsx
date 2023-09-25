import React, { SetStateAction, useState } from 'react'
import ToggleTheme from './ToggleTheme'
import SignOut from './Signout'
import Board from './Board'
import { AiOutlinePlus } from 'react-icons/ai';
import { GoSidebarExpand } from 'react-icons/go';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { db } from '@/firebase';
type Props = {
  closeSideBar: boolean
  handleHideSideBar: () => void
  hideSideBar: boolean
  themeColor: boolean
  setCreateBoard: React.Dispatch<SetStateAction<boolean>>
  setThemeColor: React.Dispatch<SetStateAction<boolean>>
}
function Sidebar({ closeSideBar, handleHideSideBar, hideSideBar, setCreateBoard, setThemeColor, themeColor }: Props) {
  const { data: session } = useSession()
  const [dummy, setDummy] = useState(false)
  const [board, loading, error] = useCollection(
    session && query(
      collection(db, 'users', session.user?.email!, 'board'),
      orderBy("createdAt", 'desc')
    )
  )
  const boardLength = board?.docs.length
  
  return (
    <motion.div
      initial={closeSideBar ? { marginLeft: "-300px", opacity: 0 } : { marginLeft: "0px", opacity: 1 }}
      animate={closeSideBar ? { marginLeft: "-300px", opacity: 0 } : { marginLeft: "0px", opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={closeSideBar ? `hidden md:flex flex-col justify-between h-screen min-w-[300px] max-w-[300px] w-full px-2 border-[1px] py-5 border-r-sideBorder  border-transparent`
        : "hidden md:flex flex-col  justify-between h-screen bg-secondary min-w-[300px] max-w-[300px] w-[100%]  px-2 border-[1px] border-r-sideBorder py-5 shadow-md border-transparent"
      } style={{ backgroundColor: 'var(--sideColor)' }}>

      <div className='h-20 opacity-0 z-0'>
        <Logo  closeSideBar={closeSideBar} setShowList={setDummy} showList={dummy} />
      </div>

      <div className='flex items-center justify-between px-2'>
        <p className='cursor-default text-gray-400 text-sm'>{`BOARDS (${boardLength === undefined ? "0" : boardLength})`}</p>
        <button onClick={() => setCreateBoard(true)} aria-label='Create-board' className='text-bw p-1  hover:text-bw duration-300 text-emerald-500 font-semibold'>+Create</button>
      </div>
      <div className='flex flex-col flex-1 overflow-y-auto py-2'>
        {
    
          loading ? (
            <p className='text-bw cursor-default animate-pulse text-lg'>Loading...</p>
          ) : (
            board?.docs.map((board) => (
              <Board key={board.id} id={board.id} title={board.data().title} setShowList={setDummy} />
            ))
          )
        }
      </div>
      <div className='flex flex-col items-center space-y-2'>
        <div className='flex items-center justify-between gap-2 relative w-full px-2'>
          <div className='flex items-center gap-2'>
            <button aria-label='Close' onClick={handleHideSideBar} className='flex justify-start gap-2 h-full items-center'>
              <GoSidebarExpand className="text-[30px] text-bw" />
            </button>
            <p className='font-semibod text-bw text-md cursor-default'>Hide Sidebar</p>
          </div>
        </div>
        <ToggleTheme themeColor={themeColor} setThemeColor={setThemeColor} />
        <SignOut />
      </div>

    </motion.div >

  )
}

export default Sidebar