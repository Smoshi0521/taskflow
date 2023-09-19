import React, { SetStateAction } from 'react'
import { GoCheckbox } from 'react-icons/go'
import { BsTextParagraph } from 'react-icons/bs'
import { useState } from 'react'
import { useDrag } from 'react-dnd/dist/hooks'
import TaskView from './TaskView'
import { AnimatePresence } from 'framer-motion'
type Props = {
  id: string
  columnId: string,
  title: string,
  description: string,
  subtask: [{
    id: string,
    time: string,
    title: string
  }]
  handleTaskView: (taskId:string,columnId:string,viewStatus:boolean) => void
}
function Task({ id, columnId, title, description, subtask, handleTaskView }: Props) {
  const [draggin, setDraggin] = useState(null)
  function draggStarted({ e }: any) {
    // e.dataTransfer.setDragging("todId", id)
    console.log("drag started", id)
  }

  return (
    <div draggable onDragStart={draggStarted} onClick={() => { handleTaskView(id, columnId, true) }} className='flex flex-col gap-1 bg-task shadow-xl rounded-md px-2 py-2 cursor-pointer'>
      <p className='text-bw '>{title}</p>
      <div className='flex items-center gap-2'>
        {
          description !== '' && (
            <BsTextParagraph className="text-bw text-sm" />
          )
        }
        {
          subtask.length < 1 ? (
            <p className='text-bw text-xs'>No Subtask</p>
          ) : (
            <div className='flex w-full gap-1 items-center'>
              <GoCheckbox className="text-bw text-sm" />
              <p className='text-bw text-sm'>{`0/${subtask.length}`}</p>
            </div>
          )
        }
      </div>

    </div>
  )
}

export default Task