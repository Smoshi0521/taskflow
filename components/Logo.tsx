import React, { SetStateAction, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import {doc} from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useSession } from 'next-auth/react';
import { db } from '@/firebase';
import { BiChevronUp } from 'react-icons/bi'
type Props = {
  closeSideBar: boolean
  showList:boolean
  setShowList: React.Dispatch<SetStateAction<boolean>>

}
function Logo({ closeSideBar,setShowList,showList }: Props) {
  const router = useRouter()
  const boardId = router.query.id
  const [sample, setSample] = useState(false)
  const { data: session } = useSession()

  const [currentBoard] = useDocument(
    session && (
      doc(db, 'users', session.user?.email!, 'board', `${boardId}`)
    )
  )
  function showBoard() {
    setShowList(!showList)
  }

  return (
    <AnimatePresence>
      <motion.div
        key={"dropDown"}
        initial={closeSideBar ? { width: "350px" } : { width: "500px" }}
        animate={closeSideBar ? { width: "350px" } : { width: "500px" }}
        transition={{ duration: 0.5 }}
        className={`w-3/6 md:w-[250px] min-h-[10px] max-w-[150px] md:min-w-[200px] md:max-w-[300px] flex items-center bg-secondary border md:border-r-sideBorder border-transparent ${closeSideBar && ("sm:border-b-sideBorder  sm:border-transparent")} `}>

        <p className='font-bold text-[20px] md:text-[40px] text-bw text-start md:text-center w-full px-5 hidden  md:block'>TASK<span className='text-emerald-400'>FLOW</span></p>

        <div onClick={showBoard} className='flex items-center w-fit max-w-[170px] ml-2 h-full border-red-500 z-10 '>
          <p className='flex font-bold text-md md:text-[40px] truncate text-ellipsis text-bw md:hidden text-center'>
            {
              currentBoard?.data()?.title === undefined ?
                "TaskFlow" :
                currentBoard?.data()?.title
            }
          </p>

          <div>
            <BiChevronUp className={`text-2xl text-bw md:hidden mx-1 w-5 duration-200  ${!showList ? "" : "-rotate-180"}`} />
          </div>
        </div>

      </motion.div>

      {/* {
        showBoardList && (
          <div className='absolute md:hidden w-full flex justify-center top-0 h-screen bg-black/50 overflow-y-auto'>
            <motion.div
              key={"boardListMenu"}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className={`${hideBoard ? "absolute" : "hidden"} flex flex-col md:hidden w-[300px] my-2 h-fit bg-secondary rounded-lg shadow-2xl py-5 px-3`}>
              <div className='flex items-center justify-between w-full'>
                <p className='text-bw font-semibold text-sm cursor-default px-2'>{`BOARDS (${boardLength === undefined ? "0" : boardLength})`}</p>
                <button onClick={() => setCreateBoard(true)} aria-label='Create-board' className='text-sm text-bw p-1  hover:text-white duration-300 text-emerald-500 font-semibold'>+Create</button>
              </div>
              <div className={`w-full ${hideBoard ? "flex" : "hidden"} flex-col flex-1 items-start py-2`}>
                {
                  board?.docs.map((boards, index) => (
                    <Board key={index} id={boards.id} title={boards.data().title} setShowBoardList={setShowBoardList} />
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
      } */}
    </AnimatePresence>
  )
}

export default Logo