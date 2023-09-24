import React, { SetStateAction, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Loader from './Loader'
import firebase from 'firebase/app';
import 'firebase/firestore';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { IoIosRemoveCircleOutline } from 'react-icons/io'
import { AiOutlinePlus, AiOutlineExclamationCircle } from 'react-icons/ai'
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/firebase';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
type Props = {
  setShowCreateTask: React.Dispatch<SetStateAction<boolean>>
  columnId: string
}
function CreateTask({ setShowCreateTask, columnId }: Props) {
  const [taskTitle, setTaskTitle] = useState('')
  const [description, setDescription] = useState('')
  const [clickedCreate, setClickedCreate] = useState(false)
  const [subTask, setSubTask] = useState<{ title: string, time: any, id: string, status: boolean }[]>([])
  const [subNoTitle, setSubNoTitle] = useState<any>([])
  const [subTitleEmpty, setSubTitleEmpty] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data: session } = useSession()
  const router = useRouter()
  const boardId = router.query.id


  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>, index: number, id: string, status: boolean) {
    const existingEntryIndex = subTask.findIndex((entry: any) => entry.title === '');
    const noSubName = subTask.filter((sub: any) => sub.title === '')
    setSubNoTitle([...noSubName])
    const newValue = e.target.value;
    const uniqueId = uuidv4()
    if(existingEntryIndex === -1){
      setSubTitleEmpty(true)
    }
    else if(existingEntryIndex !== -1){
      setSubTitleEmpty(true)
    }
    setSubTask((prev) => {
      const updatedSubTask = [...prev];
      updatedSubTask[index] = { title: newValue, time: new Date().toLocaleDateString(), id: id, status: status };
      return updatedSubTask;
    });
  }
  function handleDeleteSubTask(id: string) {
    const updatedSubTask = subTask.filter((data) => data.id !== id)
    const noSubName = subTask.filter((sub: any) => sub.title === '')
    setSubNoTitle(noSubName)
    setSubTask(updatedSubTask)
  }

  async function handleCreateTask() {
    const subTaskNoTitle = subTask.filter((sub) => sub.title === '')
    if (subTaskNoTitle.length !== 0) {
      setSubNoTitle([...subTaskNoTitle])
      setSubTitleEmpty(true)
    }

    if (taskTitle !== '' && subTaskNoTitle.length === 0) {
      setLoading(true)
      const doc = await addDoc(collection(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task'), {
        title: taskTitle,
        description: description,
        createdAt: serverTimestamp(),
      }).then(async (doc) => {
        subTask.map(async (sub) => {
          await addDoc(collection(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', doc.id, 'subtask'), {
            ...sub
          })
        })
      })
        .then(() => {
          setLoading(false)
          setShowCreateTask(false)
        })
    }
    setClickedCreate(true)
  }

  // useEffect(() => {
  //   const getSubTitleStatus = subTask.filter((sub: any) => sub.title === '')
  // }, [subTask])

  function handleAddSubtask() {
    const uniqueId = uuidv4()
    setSubTask([...subTask, { title: '', time: '', id: uniqueId, status: false }])
  }

  return (
    <div className='w-full flex justify-center h-fit relative my-10'>
      <motion.form
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
        className='w-11/12 md:w-[450px] bg-secondary rounded-xl h-auto flex flex-col items-center gap-5 justify-between py-5 px-6'>
        <p className='font-bold w-full text-start text-bw'>ADD TASK</p>

        <div className='w-full flex flex-col'>
          <div className='w-full flex items-center justify-between'>
            <label className='text-md text-bw font-semibold text-sm'>Task title</label>
            {
              taskTitle === '' && clickedCreate && (
                <div className='flex items-center gap-1'>
                  <AiOutlineExclamationCircle className="text-red-500 text-md" />
                  <p className='text-red-500 text-sm'>This field is required</p>
                </div>
              )
            }
          </div>
          <div className='w-full focus-within:border-2 border-dashed focus-within:border-green-500 h-10 rounded-md p-[2px]'>
            <input onChange={(e) => setTaskTitle(e.target.value)} type='text' className={`border border-gray-600 bg-transparent rounded-md h-full pl-2 outline-none w-full text-bw`} />
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <div className='w-full flex items-center justify-between'>
            <label className='text-md text-bw font-semibold text-sm'>Description</label>
            {/* {
              taskTitle === '' && createTask && (
                <div className='flex items-center gap-1'>
                  <AiOutlineExclamationCircle className="text-red-500 text-md" />
                  <p className='text-red-500 text-sm'>This field is required</p>
                </div>
              )
            } */}
          </div>
          <div className='w-full  focus-within:border-2 border-dashed focus-within:border-green-500 h-40 rounded-md p-[2px]'>
            <textarea onChange={(e) => setDescription(e.target.value)} className='border border-gray-600 bg-transparent rounded-md h-full pl-2 outline-none w-full text-bw resize-none p-2' />
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <div className='flex items-center w-full justify-between'>
            <label className='text-sm text-bw'>Subtask</label>
            {
              subNoTitle.length !== 0 && subTitleEmpty && (
                <div className='flex items-center gap-1'>
                  <AiOutlineExclamationCircle className="text-red-500 text-sm md:text-md" />
                  <p className='text-red-500 text-sm md:text-md'>title must not empty</p>
                </div>
              )
            }
          </div>
          <div className='flex flex-col gap-2'>
            {
              subTask.map((value, index) => {
                const hasEmptyTitle = subNoTitle.some((noTitle: any) => noTitle.id === value.id && noTitle.title === '');
                console.log(hasEmptyTitle)
                return (
                  <div key={index} className='flex items-center gap-2 w-full'>
                    <input
                      type='text'
                      value={value.title}
                      className={`text-black w-full outline-none bg-transparent border ${hasEmptyTitle && subTitleEmpty ? "border-red-500" : "border-gray-500"} rounded-lg text-bw p-2 focus:border-dashed focus:border-green-500`}
                      onChange={(e) => handleInputChange(e, index, value.id, false)}
                    />
                    <button onClick={() => handleDeleteSubTask(value.id)} type='button'><IoIosRemoveCircleOutline className="hover:text-red-500 text-lg transition duration-200" /></button>
                  </div>
                )
              })
            }
            <button onClick={handleAddSubtask} type='button' className='bg-slate-300 text-emerald-800 w-full rounded-xl text-sm flex items-center gap-1 py-2 justify-center'>
              <AiOutlinePlus className="" />
              <p>Add subtask</p>
            </button>
          </div>

        </div>
        <div className='flex flex-col gap-2 w-full'>
          <button type='button' onClick={handleCreateTask} className='text-white w-full bg-emerald-500 hover:bg-emerald-400 transition duration-300 rounded-xl py-2 font-bold text-sm'>Create Task</button>
          <button onClick={() => setShowCreateTask(false)} type='button' className='text-green-600 w-full bg-slate-300 rounded-xl py-2 font-bold text-sm'>Close</button>
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

export default CreateTask