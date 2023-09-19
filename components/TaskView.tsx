import React, { SetStateAction, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Loader from './Loader'
import firebase from 'firebase/app';
import 'firebase/firestore';
import { addDoc, collection, doc, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { IoIosRemoveCircleOutline } from 'react-icons/io'
import { AiOutlinePlus, AiOutlineExclamationCircle } from 'react-icons/ai'
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/firebase';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { VscPreview } from 'react-icons/vsc'
import { ImParagraphLeft } from 'react-icons/im'
import { BsCheck2Square, BsThreeDots } from 'react-icons/bs'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
type Props = {
  id: string
  columnId: string
  setShowTaskView: React.Dispatch<SetStateAction<boolean>>
}
function TaskView({ id, columnId, setShowTaskView }: Props) {
  const router = useRouter()
  const boardId = router.query.id
  const { data: session } = useSession()
  const [task, loading, error] = useDocument(
    session && (
      doc(db, 'users', session.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id)
    )
  )
  const [sub, loading2, error2] = useCollection(
    session && (
      collection(db, 'users', session.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id, 'subtask')
    )
  )
  const [taskTitle, setTaskTitle] = useState('')
  const [clickedCreate, setClickedCreate] = useState(false)
  const [update, setUpdate] = useState(true)
  const [subTask, setSubTask] = useState<{ id: string, status: boolean }[]>([])
  const [subCheckCount, setSubCheckCount] = useState(0)
  const [textareaRows, setTextareaRows] = useState(task?.data()?.description.split('\n ').length);


  async function handleSubTaskValue(subid: string, status: boolean) {
    await updateDoc(doc(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id, 'subtask', subid), {
      status: status ? false : true
    })
    // console.log(id)
  }

  console.log(subTask)

  useEffect(() => {
    let count = 0
    let subSize: number | any = sub?.size
    sub?.docs.map((subTask) => {
      if (subTask.data().status === true) {
        count++
      }
    })
    setSubCheckCount(Math.round(count * (100 / subSize)))
  }, [sub])
  return (
    <div className='w-full flex justify-center h-fit relative my-10 cursor-default'>
      <motion.form
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
        className='w-11/12 md:w-[600px] bg-secondary rounded-xl h-auto flex flex-col items-center gap-5 justify-between py-5 px-6'>
        <div className='w-full flex items-start space-x-1'>
          <VscPreview className="text-xl mt-2" />
          <div className='flex flex-col gap-0 '>
            <div className='w-full focus-within:border-2 border-dashed focus-within:border-green-500 h-10 rounded-md p-[2px]'>
              <input type="text" defaultValue={task?.data()?.title} disabled={!update} className={update ? "font-bold w-full border border-gray-600 rounded-md p-1 outline-none text-start text-bw text-lg bg-transparent"
                : "font-bold w-full border-gray-600 rounded-md p-1 outline-none text-start text-bw text-lg bg-transparent"} />
            </div>
            <p className='font-bold w-full text-start text-bw text-sm text-gray-400 px-2'>Column title</p>
          </div>
        </div>


        <div className='w-full flex space-x-1'>
          <div className='h-full'>
            <ImParagraphLeft className="text-md mt-2" />
          </div>
          <div className='flex flex-col w-full'>
            <h3 className='text-md text-bw font-semibold text-lg p-1'>Description</h3>
            <div className={`w-full focus-within:border-2 border-dashed focus-within:border-green-500 rounded-md p-[2px]`}>
              <textarea
                disabled={!update}
                spellCheck={false}
                defaultValue={task?.data()?.description} // Replace 'yourValue' with the value you want to display
                rows={textareaRows}
                className={`${update ? "border" : ""} border-gray-600 bg-transparent rounded-md h-full pl-2 outline-none w-full text-bw resize-none p-2`}
                onChange={(e) => {
                  // Handle changes to the textarea value here
                  // You can update 'yourValue' in your component state or use another state variable
                  setTextareaRows(e.target.value.split('\n ').length)
                }}
              />
            </div>
          </div>
        </div>


        <div className='flex flex-col w-full gap-1'>
          <div className='flex items-center gap-1'>
            <BsCheck2Square className="text-lg" />
            <h3 className='text-md text-bw font-semibold text-lg p-1'>Subtask</h3>
          </div>
          <div className='flex items-center gap-3'>
            <p className='text-xs'>{`${subCheckCount}%`}</p>
            <div className='bg-green-500 w-full h-1 rounded-full'></div>
          </div>
          <div className='flex flex-col gap-2'>
            {/* {
              subTask.map((value, index) => (
                <div className='flex items-center gap-2 w-full'>
                  <input
                    key={index}
                    type='text'
                    value={value.title}
                    className='text-black w-full outline-none bg-transparent border border-gray-500 rounded-lg text-bw p-2 focus:border-dashed focus:border-green-500'
                    onChange={(e) => handleInputChange(e, index, value.id)}
                  />
                  <button onClick={() => handleDeleteSubTask(value.id)} type='button'><IoIosRemoveCircleOutline className="hover:text-red-500 text-lg transition duration-200" /></button>
                </div>
              ))
            } */}
            {
              sub?.docs.map((subTask) => (
                <div className='flex items-center justify-between'>
                  <label className='flex items-center gap-5 '>
                    <input
                      type='checkbox'
                      className='apperance-none w-4 h-4'
                      checked={subTask.data().status}
                      onChange={() => handleSubTaskValue(subTask.id, subTask.data().status)}
                    />
                    <p>{subTask.data().title}</p>
                  </label>
                  <button type="button" className=''> <BsThreeDots /></button>
                </div>
              ))
            }
          </div>

        </div>
        <div className='flex flex-col gap-2 w-full'>
          <button type='button' className='text-white w-full bg-emerald-500 hover:bg-emerald-400 transition duration-300 rounded-xl py-2 font-bold text-sm'>Create Task</button>
          <button type='button' onClick={() => setShowTaskView(false)} className='text-green-600 w-full bg-slate-300 rounded-xl py-2 font-bold text-sm'>Close</button>
        </div>
      </motion.form>
      {
        //Display loading while saving the created board
        loading && (
          <div className={`w-full h-screen bg-black/50 absolute left-0 top-0 z-10 flex items-center justify-center`}>
            <Loader />
          </div>
        )
      }

    </div>
  )
}

export default TaskView