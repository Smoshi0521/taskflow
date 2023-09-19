import React, { SetStateAction, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Loader from './Loader'
import 'firebase/firestore';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/firebase';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { VscPreview } from 'react-icons/vsc'
import { ImParagraphLeft } from 'react-icons/im'
import { BsCheck2Square, BsThreeDots } from 'react-icons/bs'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { CiCircleRemove } from 'react-icons/ci'
import { MdModeEdit } from 'react-icons/md'
import { HiDotsVertical } from 'react-icons/hi'
import { AiOutlineArrowRight, AiOutlineClose } from 'react-icons/ai'
import { AiTwotoneDelete } from 'react-icons/ai'
import Loader2 from './Loader2';
type Props = {
  id: string
  columnId: string
  columnTitle: string
  setShowTaskView: React.Dispatch<SetStateAction<boolean>>
}
function TaskView({ id, columnId, columnTitle, setShowTaskView }: Props) {
  const router = useRouter()
  const boardId = router.query.id
  const { data: session } = useSession()

  const [task, loading, error] = useDocument(
    session && (
      doc(db, 'users', session.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id)
    )
  )
  const [column] = useCollection(
    session && (
      collection(db, 'users', session.user?.email!, 'board', `${boardId}`, 'columns')
    )
  )
  const [sub, loading2, error2] = useCollection(
    session && (
      collection(db, 'users', session.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id, 'subtask')
    )
  )

  const [subCheckCount, setSubCheckCount] = useState(0)
  const [progressBar, setProgressBar] = useState('')
  const [newDescription, setNewDescription] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newSubTask, setNewSubTask] = useState('')
  const [clickedAdd, setClickedAdd] = useState(false)
  const [clickedAddTitle, setClickedAddTitle] = useState(false)
  const [savingTaskTitle, setSavingTaskTitle] = useState(false)
  const [savingDescription, setSavingDescription] = useState(false)
  const [showAddSubTask, setShowAddSubTask] = useState(false)
  const [editTitle, setEditTitle] = useState(false)
  const [editDescription, setEditDescription] = useState(false)
  const [showListAction, setShowListAction] = useState(false)
  const [showMoveTask, setShowMoveTask] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [moveColId, setMoveColId] = useState(`${columnId}`)
  const [showLoading, setShowLoading] = useState(false)
  async function handleSubTaskValue(subid: string, status: boolean) {
    await updateDoc(doc(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id, 'subtask', subid), {
      status: status ? false : true
    })
  }
  async function handleAddSubtask() {
    const uniqueId = uuidv4()
    if (newSubTask !== '') {
      await addDoc(collection(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id, 'subtask'), {
        id: uniqueId,
        title: newSubTask,
        time: new Date().toLocaleDateString(),
        status: false

      })
      setClickedAdd(false)
      setNewSubTask('')
    }
    else {
      setClickedAdd(true)
    }
  }

  async function handleSubtask(subid: string) {
    await deleteDoc(doc(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id, 'subtask', subid))
  }

  async function handleUpdateTaskTitle() {
    if (newTaskTitle !== '') {
      setSavingTaskTitle(true)
      await updateDoc(doc(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id), {
        title: newTaskTitle
      }).then(() => {
        setSavingTaskTitle(false)
        setClickedAddTitle(false)
        setEditTitle(false)
      })
    }
    else {
      setClickedAddTitle(true)
    }
  }

  async function handleUpdateDescription() {
    setSavingDescription(true)
    await updateDoc(doc(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id), {
      description: newDescription
    }).then(() => {
      setSavingDescription(false)
      setEditDescription(false)
    })
  }

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

  useEffect(() => {
    setProgressBar(`${subCheckCount}%`)
  }, [subCheckCount]);

  async function moveTask(moveToColId: string) {
    const moveTask: any = task?.data()
    moveTask.createdAt = serverTimestamp()
    setShowLoading(true)
    await addDoc(collection(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', moveToColId, 'task'), {
      ...moveTask
    }).then((doc) => {
      sub?.docs.map(async (subTask) => {
        const subTaskDocRef = collection(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', moveToColId, 'task', doc.id, 'subtask')
        await addDoc(subTaskDocRef, {
          ...subTask.data()
        })
      })
    }).then(() => {
      sub?.docs.forEach(async (subTask) => {
        const subTaskDocRef = doc(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id, 'subtask', subTask.id)
        console.log("deletesubtask")
        await deleteDoc(subTaskDocRef)
      })
    })
      .then(async () => {
        const taskDocRef = doc(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id)
        await deleteDoc(taskDocRef)
      })
      .then(() => {
        setShowLoading(false)
        setShowDeleteAlert(false)
        setShowTaskView(false)
      })
  }

  async function handleDeleteTask() {
    setShowLoading(true)
    const deleteSub: any = sub?.docs.map(async (subTask) => {
      const subTaskDocRef = doc(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id, 'subtask', subTask.id)
      return deleteDoc(subTaskDocRef)
    })

    await Promise.all(deleteSub);
    const taskDocRef = doc(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', columnId, 'task', id)
    await deleteDoc(taskDocRef)
      .then(() => {
        setShowLoading(false)
        setShowDeleteAlert(false)
        setShowTaskView(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className='w-full flex justify-center h-fit relative cursor-default'>
      <AnimatePresence>
        {showMoveTask && (
          <div className='absolute h-screen flex justify-center items-center w-full bg-black/50 top-0 left-0 z-40 overflow-y-auto px-3'>
            {
              showLoading ? (
                <Loader />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                  className='bg-white flex flex-col items-center relative top-[-50px] rounded-lg w-[300px] h-auto z-0 px-3 py-3 gap-2'>
                  <div className='flex justify-center relative w-full'>
                    <h3 className='text-black font-bold'>Move Task</h3>
                    <button onClick={() => setShowMoveTask(!showMoveTask)} className='text-black absolute right-2'>
                      <AiOutlineClose />
                    </button>
                  </div>
                  <div className='flex flex-col w-full gap-1'>
                    <h3 className='text-gray-500 text-sm font-semibold'>Select destination</h3>
                    <div className='relative w-full'>
                      <label
                        htmlFor={"selectDestination"}
                        className='group text-gray-500 rounded-md cursor-pointer text-xs mt-2 absolute px-2'>
                        Column
                      </label>
                      <select id="selectDestination"
                        onChange={(e) => setMoveColId(e.target.value)}
                        defaultValue={columnId}
                        className='w-full pt-5 pb-2 px-2 appearance-none rounded-lg bg-gray-200 hover:bg-gray-300 duration-300 decoration text-black outline-none  cursor-pointer'>
                        <option value={columnId}>{columnTitle}</option>
                        {
                          column?.docs.map((column) => (
                            column.id === columnId ? null :
                              <option value={column.id}>{column.data().title}</option>
                          ))
                        }
                      </select>
                    </div>

                  </div>
                  <div className='w-full'>
                    <button onClick={() => moveTask(moveColId)} className='bg-blue-600 hover:bg-blue-500 duration-300 rounded-md text-white font-semibold px-4 py-2 text-sm'>Move</button>
                  </div>
                </motion.div>
              )
            }
          </div>
        )
        }
        {
          showDeleteAlert && (
            <div className='absolute h-screen flex justify-center items-center w-full bg-black/50 top-0 left-0 z-40 overflow-y-auto px-3'>
              {
                showLoading ? (
                  <Loader />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.25 }}
                    className='bg-white flex flex-col items-center relative top-[-50px] rounded-lg w-[400px] h-auto z-0 p-5 gap-3'>
                    <h3 className='text-red-500 w-full font-bold text-lg'>Delete Task?</h3>
                    <p className='text-xs text-gray-600 font-semibold'>{`Are you sure you want to delete this task? This action is irreversible and cannot be change.`}</p>
                    <div className='flex w-full justify-between mt-3 gap-2'>
                      <button onClick={() => handleDeleteTask()} className='bg-red-500 hover:bg-red-400 duration-300 rounded-xl text-white w-full font-semibold px-4 py-2 text-sm'>Delete</button>
                      <button onClick={() => setShowDeleteAlert(!showDeleteAlert)} className='bg-gray-500 hover:bg-gray-400 duration-300 rounded-xl text-white w-full font-semibold px-4 py-2 text-sm'>Cancel</button>
                    </div>
                  </motion.div>
                )
              }
            </div>
          )
        }
      </AnimatePresence >

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
        className='w-11/12 md:w-[600px] bg-secondary rounded-xl h-auto flex flex-col items-center justify-between py-5 px-6 relative my-10'>
        <div className='w-full flex items-center justify-between'>
          <h2 className='font-bold text-[20px]'>{task?.data()?.title}</h2>
          <button onClick={() => setShowListAction(!showListAction)} className='hover:bg-gray-300 hover:text-black duration-300 rounded-full p-1'>
            <HiDotsVertical className="" />
          </button>
        </div>
        <AnimatePresence>
          {
            showListAction && (
              <motion.div
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className='absolute bg-primary flex flex-col items-start right-5 md:right-10 top-12 rounded-lg w-[180px] h-auto z-0 px-2 py-3 gap-1' style={{ boxShadow: '0px 10px 20px 0px white' }} >
                <div className='flex flex-col items-start w-full gap-2'>
                  <div className=' gap-2 flex items-center justify-between px-2 text-gray-400 hover:text-white duration-300'>
                    <AiTwotoneDelete />
                    <button onClick={() => setShowDeleteAlert(!showDeleteAlert)} className='w-fit text-sm md:text-md'>Delete</button>
                  </div>
                  <div className='gap-2 px-2 flex items-center justify-between text-gray-400 hover:text-white duration-300'>
                    <AiOutlineArrowRight />
                    <button onClick={() => setShowMoveTask(!showMoveTask)} className='w-fit text-sm md:text-md'>Move</button>
                  </div>
                </div>
              </motion.div>
            )
          }
        </AnimatePresence>
        <div className='w-full flex items-start space-x-1 mt-3'>
          <VscPreview className="text-xl mt-2" />
          <div className='flex flex-col gap-0 w-full'>
            <div className='flex w-full gap-1 items-center'>
              {
                editTitle ? (
                  <input type="text" defaultValue={task?.data()?.title} disabled={!editTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className={`font-bold w-full ${clickedAddTitle && newTaskTitle === '' ? "border border-red-500" : "border border-gray-600 focus:border-dashed focus:border-green-500"}  rounded-md p-1 outline-none text-start text-bw text-sm md:text-md bg-transparent`} />
                ) : (
                  <h3 className='font-bold w-fit text-start text-bw text-sm md:text-md'>{task?.data()?.title}</h3>
                )
              }

              {
                !editTitle && (
                  <button onClick={() => { setEditTitle(!editTitle), setNewTaskTitle(task?.data()?.title) }}
                    className='hover:bg-white/50 rounded-full w-7 h-7 flex justify-center items-center duration-300' type='button'>
                    <MdModeEdit className="text-bw" />
                  </button>
                )
              }
            </div>
            {
              clickedAddTitle && newTaskTitle === '' && editTitle && (
                <p className='text-red-500 text-xs'>The task title should not be empty</p>
              )
            }
            {
              editTitle && (
                <div className='flex items-center gap-2 mt-2'>
                  <button onClick={handleUpdateTaskTitle} type='button' className='p-1 bg-blue-500 text-sm font-semibold px-2'>
                    {
                      savingTaskTitle ? (
                        <p className='animate-pulse'>Saving...</p>
                      ) : (
                        <p className=''>Save</p>
                      )
                    }
                  </button>
                  {
                    !savingTaskTitle && (
                      <button onClick={() => { setEditTitle(!editTitle), setClickedAddTitle(false) }} type='button' className='p-1 bg-gray-500 text-white text-sm font-semibold px-2'>Close</button>
                    )
                  }
                </div>
              )
            }
            {
              !editTitle && (
                <p className='font-bold w-full text-start text-bw text-xs md:text-sm text-gray-400 px-2'>Column title</p>
              )
            }
          </div>
        </div>


        <div className='w-full flex space-x-1 mt-5'>
          <div className='h-full'>
            <ImParagraphLeft className="text-md mt-2" />
          </div>
          <div className='flex flex-col w-full'>
            <div className='flex items-center gap-1'>
              <h3 className='text-sm md:text-md text-bw font-semibold p-1 w-fit'>Description</h3>
              {
                !editDescription && (
                  <button className='hover:bg-white/50 rounded-full w-7 h-7 flex justify-center items-center duration-300'
                    onClick={() => { setEditDescription(!editDescription), setNewDescription(task?.data()?.description) }}
                    type='button'>
                    <MdModeEdit className="text-bw" />
                  </button>
                )
              }
            </div>
            <div className={`w-full focus-within:border-2 border-dashed focus-within:border-green-500 rounded-md p-[2px]`}>
              {
                editDescription ? (
                  <textarea
                    disabled={!editDescription}
                    spellCheck={false}
                    defaultValue={task?.data()?.description} // Replace 'yourValue' with the value you want to display
                    className={`min-h-[50px] h-[200px] border border-gray-600 bg-transparent rounded-md pl-2 outline-none w-full text-bw resize-none p-2`}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                ) : (
                  <p className={`${task?.data()?.description === '' || task?.data()?.description === undefined ? "text-gray-500" : "text-bw"}`}>
                    {task?.data()?.description === '' || task?.data()?.description === undefined ? "No description created." : task?.data()?.description}
                  </p>
                )
              }
            </div>
            {
              editDescription && (
                <div className='flex items-center gap-2 mt-2'>
                  <button onClick={handleUpdateDescription} type='button' className='p-1 bg-blue-500 text-sm font-semibold px-2'>
                    {
                      savingDescription ? (
                        <p className='animate-pulse'>Saving...</p>
                      ) : (
                        <p>Save</p>
                      )
                    }
                  </button>
                  {
                    !savingDescription && (
                      <button onClick={() => setEditDescription(!editDescription)} type='button' className='p-1 bg-gray-500 text-white text-sm font-semibold px-2'>Close</button>
                    )
                  }
                </div>
              )
            }
          </div>
        </div>


        <div className='flex flex-col w-full gap-1 mt-5'>
          <div className='flex items-center gap-1'>
            <BsCheck2Square className="text-lg" />
            <h3 className='text-md text-bw font-semibold text-lg p-1'>Subtask</h3>
          </div>
          {
            sub?.size === 0 ? (
              <div className='flex items-center gap-3'>
                <p>No subtask created</p>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <p className='text-xs'>{`${subCheckCount}%`}</p>
                <div className='w-full bg-gray-500 rounded-full'>
                  <div className={`bg-blue-500 transition-width duration-700 h-1 rounded-full`} style={{ width: `${progressBar}` }}></div>
                </div>
              </div>
            )
          }
          <div className='flex flex-col gap-2'>
            {
              sub?.docs.map((subTask) => (
                <div className='flex items-center justify-between w-full'>
                  <label className='flex items-center gap-5 w-full'>
                    <input
                      type='checkbox'
                      className='apperance-none w-4 h-4 accent-green-400'
                      checked={subTask.data().status}
                      onChange={() => handleSubTaskValue(subTask.id, subTask.data().status)}
                    />
                    <div className='flex justifyu-between w-full py-1 rounded-lg hover:bg-gray-500 cursor-pointer px-2 transition duration-300'>
                      <p className={`w-full ${subTask.data().status === true ? "line-through" : ""}`}>{subTask.data().title}</p>
                      <button name='delete'
                        onClick={() => handleSubtask(subTask.id)}
                        type="button"
                        className='z-20'>
                        <CiCircleRemove className="hover:text-red-500 text-2xl transition duration-300" />
                      </button>
                    </div>
                  </label>

                </div>
              ))
            }
            {
              showAddSubTask ? (
                <div className='flex flex-col gap-0'>
                  <div className='w-full bg-white rounded-md flex flex-col gap-2'>
                    <input type='text'
                      onChange={(e) => setNewSubTask(e.target.value)} value={newSubTask}
                      className={`w-full bg-white  ${newSubTask === '' && clickedAdd ? "border-2 border-red-500" : "border border-gray-500"} rounded-md outline-none p-1 text-black text-sm`}
                      placeholder='Add subtask'
                    />
                  </div>
                  {
                    newSubTask === '' && clickedAdd && (
                      <p className='text-red-500 text-xs'>The title should not be empty</p>
                    )
                  }
                  <div className='flex items-center gap-2 mt-2'>
                    <button onClick={handleAddSubtask} type='button' className='p-1 bg-blue-500 text-sm font-semibold px-2'>Add</button>
                    <button onClick={() => { setShowAddSubTask(false), setClickedAdd(false) }} type='button' className='p-1 bg-gray-500 text-white text-sm font-semibold px-2'>Close</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowAddSubTask(true)} type='button' className='text-sm w-fit p-2 rounded-md bg-gray-500 hover:bg-gray-400 duration-300 mt-2'>
                  <p>Add subtask</p>
                </button>
              )
            }

          </div>

        </div>
        <div className='flex flex-col gap-2 w-full mt-5'>
          {/* <button type='button' className='text-white w-full bg-emerald-500 hover:bg-emerald-400 transition duration-300 rounded-xl py-2 font-bold text-sm'>Create Task</button> */}
          <button type='button' onClick={() => setShowTaskView(false)} className='text-green-600 w-full bg-slate-300 rounded-xl py-2 font-bold text-sm'>Close</button>
        </div>
      </motion.div>
      {
        //Display loading while saving the created board
        loading && (
          <div className={`w-full h-screen bg-black/50 absolute left-0 top-0 z-10 flex items-center justify-center`}>
            <Loader />
          </div>
        )
      }

    </div >
  )
}

export default TaskView