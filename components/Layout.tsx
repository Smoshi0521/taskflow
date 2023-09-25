import React, { useState, SetStateAction, useEffect } from 'react';
import Logo from '@/components/Logo';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { GoSidebarCollapse } from 'react-icons/go';
import NextAuthProvider from './SessionProvider';
import Login from './Login';
import { AnimatePresence } from 'framer-motion';
import CreateBoard from './form/CreateBoard';
import { useRouter } from 'next/router'
import { motion } from 'framer-motion';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase';
import Board from './Board';
import ToggleTheme from './ToggleTheme';
import SignOut from './Signout';
type Props = {
  children: any
  session: any
}
function Layout({ children, session}: Props) {
  const [createBoard, setCreateBoard] = useState(false)
  const [closeSideBar, setCloseSideBar] = useState(false);
  const [hideSideBar, setHideSideBar] = useState(false)
  const [showList, setShowList] = useState(false)
  const [hideBoard, setHideBoard] = useState(false)
  const [themeColor, setThemeColor] = useState(false)
  const [renderOnce, setRenderOnce] = useState(false)
  const router = useRouter()

  const [board, loading2, error2] = useCollection(
    session && query(
      collection(db, 'users', session.user?.email!, 'board'),
      orderBy("createdAt", 'desc')
    )
  )

  function handleHideSideBar() {
    setCloseSideBar(!closeSideBar)
    setTimeout(() => {
      setHideSideBar(true)
    }, 500)
  }


  return (
    <NextAuthProvider session={session}>
      {!session ? (
        <Login />
      ) : (
        <div className="flex flex-col h-screen bg-primary relative overflow-y-hidden z-0">
          <header className="flex absolute top-0 w-full min-h-[60px] z-10 border border-b-sideBorder border-transparent md:border-transparent">
            <Logo closeSideBar={closeSideBar} setShowList={setShowList} showList={showList} />
            <Navbar closeSideBar={closeSideBar} setCloseSideBar={setCloseSideBar} setCreateBoard={setCreateBoard} />
          </header>
          <div className='flex gap-0 max-w-screen h-full'>
            <Sidebar closeSideBar={closeSideBar} themeColor={themeColor} setThemeColor={setThemeColor} handleHideSideBar={handleHideSideBar} hideSideBar={hideSideBar} setCreateBoard={setCreateBoard} />
            {
              closeSideBar && (
                <button
                  aria-label="Open"
                  onClick={() => { setCloseSideBar(!closeSideBar), setHideSideBar(false) }}
                  disabled={!closeSideBar}
                  className={`hidden md:flex justify-start gap-2 h-12 items-center z-10 transition-opacity duration-500 bottom-[132px] ml-[17px] absolute`}
                >
                  <GoSidebarCollapse className="text-[30px] text-bw" />
                </button>
              )
            }
            <div className={`flex flex-col w-full h-full transition-transform ease-in-out duration-300 overflow-x-auto`}>
              <div className="w-full min-h-[60px] opacity-0">
                <Navbar closeSideBar={closeSideBar} setCloseSideBar={setCloseSideBar} setCreateBoard={setCreateBoard} />
              </div>
              <div className=" border-red-500 h-full w-full overflow-y-auto my-0 sm:my-2">
                {children}
              </div>
            </div>
          </div>
          <AnimatePresence>
            {
              //Display the create board
              createBoard && (
                <div className={`w-full h-screen bg-black/50 absolute left-0 top-0 z-10 flex items-center justify-center`}>
                  <CreateBoard setCreateBoard={setCreateBoard} />
                </div>
              )
            }
          </AnimatePresence>
          <AnimatePresence>
            {
              showList && (
                <div className='absolute md:hidden w-full flex justify-center sm:justify-start top-0 left-0 h-screen bg-black/50 overflow-y-auto px-4'>
                  <motion.div
                    key={"boardListMenu"}
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className={`${true ? "absolute" : "hidden"} flex flex-col md:hidden w-[300px] top-20 my-2 h-fit bg-secondary rounded-lg shadow-2xl py-5 px-3`}>
                    <div className='flex items-center justify-between w-full'>
                      <p className='text-bw font-semibold text-sm cursor-default px-2'>{`BOARDS (${board?.size === undefined ? "0" : board.size})`}</p>
                      <button onClick={() => setCreateBoard(true)} aria-label='Create-board' className='text-sm text-bw p-1  hover:text-white duration-300 text-emerald-500 font-semibold'>+Create</button>
                    </div>
                    <div className={`w-full flex-col flex-1 items-start py-2`}>
                      {
                        board?.docs.map((boards, index) => (
                          <Board key={index} id={boards.id} title={boards.data().title} setShowList={setShowList} />
                        ))
                      }
                    </div>
                    <div className='flex flex-col gap-2 mt-3'>
                      <ToggleTheme setThemeColor={setThemeColor} themeColor={themeColor} />
                      <SignOut />
                    </div>
                  </motion.div>
                </div>
              )
            }
          </AnimatePresence>
        </div>
      )}
    </NextAuthProvider>
  );
}


export default Layout;
