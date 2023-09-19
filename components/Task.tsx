import React, { SetStateAction, useEffect } from 'react'
import { FiCheckSquare } from 'react-icons/fi'
import { BsTextParagraph } from 'react-icons/bs'
import { useState } from 'react'
import { useDrag } from 'react-dnd/dist/hooks'
import TaskView from './TaskView'
import { AnimatePresence } from 'framer-motion'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '@/firebase'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import { collection } from 'firebase/firestore'
type Props = {
  id: string
  columnId: string,
  title: string,
  description: string,
  handleTaskView: (taskId: string, columnId: string, viewStatus: boolean) => void
}
function Task({ id, columnId, title, description, handleTaskView }: Props) {
  const [draggin, setDraggin] = useState(null)
  const { data: session } = useSession()
  const [subChecked, setSubChecked] = useState(0)
  const router = useRouter()
  const boardId = router.query.id

  function draggStarted({ e }: any) {
    // e.dataTransfer.setDragging("todId", id)
    console.log("drag started", id)
  }
  const [sub, loading2, error2] = useCollection(
    collection(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id, 'subtask')
  )
  useEffect(() => {
    let count = 0
    let subSize: number | any = sub?.size
    sub?.docs.map((subTask) => {
      if (subTask.data().status === true) {
        count++
      }
    })
    setSubChecked(count)
  }, [sub])
  return (

    <div draggable onDragStart={draggStarted} onClick={() => { handleTaskView(id, columnId, true) }} className='flex flex-col gap-1 bg-task shadow-xl rounded-md px-2 py-2 cursor-pointer'>
      <p className='text-bw '>{title}</p>
      {
        sub && (
          <div className='flex items-center gap-2'>
            {
              description !== '' && (
                <BsTextParagraph className="text-bw text-sm" />
              )
            }
            {
              sub.size < 1 ? (
                <p className='text-bw text-xs'>No Subtask</p>
              ) : (
                <div className={`flex w-fit px-1 gap-1 items-center ${subChecked === sub?.size && sub.size !== 0 ? "bg-green-600 text-white" : "text-bw"}`}>
                  <FiCheckSquare className="text-sm" />
                  <p className={`text-sm `}>{`${subChecked}/${sub?.size}`}</p>
                </div>
              )
            }
          </div>
        )
      }

      {/* <div className='absolute w-full h-screen top-0 left-0 bg-black/10'>

      </div> */}
    </div>

  )
}

export default Task