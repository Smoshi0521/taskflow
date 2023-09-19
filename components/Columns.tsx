import React from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import Task from './Task'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import CreateTask from './CreateTask'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase';
import { useSession } from 'next-auth/react';
import TaskLoading from './TaskLoading'
import TaskView from './TaskView'
type Props = {
  id: string,
  title: string
}
function Columns({ id, title }: Props) {
  const [showCreateTask, setShowCreateTask] = useState(false)
  const router = useRouter()
  const boardId = router.query.id
  const { data: session } = useSession()
  const [showTaskView, setShowTaskView] = useState(false)
  const [openTaskId, setOpenTaskId] = useState('')
  const [columnId, setColumnId] = useState('')

  const [task, loading, error] = useCollection(
    session && query(
      collection(db, 'users', session.user?.email!, 'board', `${boardId}`, 'columns', id, 'task'),
      orderBy("createdAt", 'desc')
    )
  )

  function dragOver(e: React.DragEvent) {
    e.preventDefault();
    console.log("You drop something1")
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    console.log("You drop something2")
  }

  function handleTaskView(columnId: string, taskId: string, viewStatus: boolean) { //Create a callback function to fetch the id of column and task
    setShowTaskView(viewStatus)
    setColumnId(taskId)
    setOpenTaskId(columnId)
  }

  return (
    <>
      <div onDrop={handleDrop} onDragOver={(e) => dragOver(e)} className='h-full w-[270px]'>
        <div className='flex flex-col gap-2 w-full px-2 py-2 bg-column rounded-md h-auto shadow-lg'>
          <h3 className='text-bw cursor-default font-semibold'>{title}</h3>
          {
            loading ? (
              <TaskLoading />
            ) : (
              task?.docs.map((task) => (
                <Task key={task.id} id={task.id} columnId={id} title={task.data().title} description={task.data().description} subtask={task.data().subtask} handleTaskView={handleTaskView}/>
              ))
            )
          }
          <div onClick={() => setShowCreateTask(!showCreateTask)} className='w-full gap-2 px-2 flex items-center hover:bg-task transition duration-300 py-2 rounded-lg cursor-pointer'>
            <AiOutlinePlus className="text-bw" />
            <p className='text-bw'>Add Task</p>
          </div>
        </div>
        <AnimatePresence>
          {
            showCreateTask && (
              <div className='absolute h-screen w-full bg-black/50 top-0 left-0 z-20 overflow-y-auto'>
                <CreateTask setShowCreateTask={setShowCreateTask} columnId={id} />
              </div>
            )
          }
        </AnimatePresence>

        <AnimatePresence>
          {
            showTaskView && (
              <div className='absolute h-screen w-full bg-black/20 top-0 left-0 z-20 overflow-y-auto'>
                <TaskView id={openTaskId} columnId={columnId} setShowTaskView={setShowTaskView} />
              </div>
            )
          }
        </AnimatePresence>
      </div>
    </>
  )
}

export default Columns