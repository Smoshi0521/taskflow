import React, { useState, useEffect } from 'react';
import Logo from '@/components/Logo';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { GoSidebarCollapse } from 'react-icons/go';
import NextAuthProvider from './SessionProvider';
import Login from './Login';
import { AnimatePresence } from 'framer-motion';
import CreateBoard from './CreateBoard';
function Layout({ children, session }: any) {
  const [createBoard, setCreateBoard] = useState(false)
  const [closeSideBar, setCloseSideBar] = useState(false);
  const [hideSideBar, setHideSideBar] = useState(false)

  function handleHideSideBar() {
    setCloseSideBar(!closeSideBar)
    setTimeout(() => {
      setHideSideBar(true)
    }, 500)
  }
  console.log(session?.user?.name)
  return (
    <NextAuthProvider session={session}>
      {!session ? (
        <Login />
      ) : (
        <div className="flex flex-col h-screen bg-primary relative overflow-y-hidden z-0">
          <header className="flex absolute top-0 w-full h-20 z-10">
            <Logo closeSideBar={closeSideBar} />
            <Navbar closeSideBar={closeSideBar} setCloseSideBar={setCloseSideBar} setCreateBoard={setCreateBoard} />
          </header>
          <div className='flex gap-0 max-w-screen h-full'>
            <Sidebar closeSideBar={closeSideBar} handleHideSideBar={handleHideSideBar} hideSideBar={hideSideBar} setCreateBoard={setCreateBoard} />
            <button
              aria-label="Open"
              onClick={() => { setCloseSideBar(!closeSideBar), setHideSideBar(false) }}
              disabled={!closeSideBar}
              className={`hidden md:flex justify-start gap-2 h-12 items-center transition-opacity duration-500 bottom-[140px] ml-[10px] absolute z-0 ${closeSideBar ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <GoSidebarCollapse className="text-[30px] text-bw" />
            </button>
            <div className={`flex flex-col w-full h-full transition-transform ease-in-out duration-300 overflow-x-auto`}>
              <div className="w-full h-20 opacity-0">
                <Navbar closeSideBar={closeSideBar} setCloseSideBar={setCloseSideBar} setCreateBoard={setCreateBoard} />
              </div>
              <div className=" border-red-500 h-full w-full overflow-y-auto my-2">
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

        </div>
      )}
    </NextAuthProvider>
  );
}


export default Layout;
