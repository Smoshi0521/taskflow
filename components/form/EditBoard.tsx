import React, { SetStateAction, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSession } from 'next-auth/react';
import { AiOutlineClose, AiOutlineExclamationCircle } from 'react-icons/ai'
import { collection, getDocs, doc, query, getDoc, DocumentData, updateDoc, orderBy, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import Loader from '../loader/Loader';
import { useRouter } from 'next/dist/client/router';
import { useCollection } from 'react-firebase-hooks/firestore';

type Props = {
  setShowEditBoard: React.Dispatch<SetStateAction<boolean>>
  setShowListAction: React.Dispatch<SetStateAction<boolean>>
}

function EditBoard({ setShowEditBoard, setShowListAction }: Props) {
  const [boardTitle, setBoardTitle] = useState('')
  const titleRef = useRef<any>(null)
  const [invalidBoardTitle, setInvalidBoardTitle] = useState(false)
  const [invalidColumnTitle, setInvalidColumnTitle] = useState(false)
  const [loading, setLoading] = useState(false)
  const [handleColumns, setHandleColumns] = useState<any>([])
  const [deletedId, setDeletedId] = useState<any>([])
  const [boardData, setBoardData] = useState<DocumentData>()
  const [newColumnName, setNewColumnName] = useState<any>([])
  const [noColumnName, setNoColumnName] = useState<any>([])
  const [showSaveButton, setShowSaveButton] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const boardId = router.query.id

  const [columns, isLoading, error] = useCollection(session && query(collection(
    db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns'
  ), orderBy("createdAt", 'asc')
  ))


  useEffect(() => {
    setHandleColumns([])
    columns?.docs.map((col) => {
      setHandleColumns((prev: any) => [...prev, { id: col.id, title: col.data().title }])
    })

  }, [columns])

  console.log(handleColumns, "here")

  async function handleGetDocs() {
    try {
      const ref = doc(db, 'users', session?.user?.email!, 'board', `${boardId}`);
      const docSnapshot = await getDoc(ref);
      setBoardData(docSnapshot.data())

    }
    catch (err) {
      console.log('caugth an error! ', err)
    }
  }
  useEffect(() => {
    handleGetDocs()
  }, [session])

  async function handleDeleteColumns() {
    //delete the selected columns all its task and subtask
    try {
      const columnQuery = query(
        collection(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns')
      );
      const columnSnapshot = await getDocs(columnQuery);

      const deletePromises = [];

      for (const col of deletedId) {
        const colDocRef = doc(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', col.id);
        deletePromises.push(deleteDoc(colDocRef));

        const taskQuery = query(
          collection(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', col.id, 'task')
        );
        const taskSnapshot = await getDocs(taskQuery);

        for (const task of taskSnapshot.docs) {
          const taskDocRef = doc(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', col.id, 'task', task.id);
          deletePromises.push(deleteDoc(taskDocRef));

          const subtaskQuery = query(
            collection(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', col.id, 'task', task.id, 'subtask')
          );
          const subtaskSnapshot = await getDocs(subtaskQuery)

          if (subtaskSnapshot.size !== 0) {
            for (const subTask of subtaskSnapshot.docs) {
              const subTaskDocRef = doc(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', col.id, 'task', task.id, 'subtask', subTask.id);
              deletePromises.push(deleteDoc(subTaskDocRef));
            }
          }
        }
      }
      await Promise.all(deletePromises)
    } catch (err) {
      console.log("Error found", err)
    }
  }

  async function handleRenameColumn() {
    if (newColumnName.length !== 0) {
      setLoading(true)
      const update: any = []
      newColumnName.map(async (col: any) => {
        const colRef = doc(db, 'users', session?.user?.email!, 'board', `${boardId}`, 'columns', col.id)
        update.push(updateDoc(colRef, {
          title: col.title
        }))
      })
      await Promise.all(update)
        .then(() => {
          setLoading(false)
          setShowEditBoard(false)
        })
    }
  }


  async function handleEditBoard() {
    const existingEntryIndex = newColumnName.findIndex((entry: any) => entry.title === '');
    const boardTitleNotEmpty = boardTitle !== '' || titleRef.current.value !== ''
    const boardTitleIsEmpty = boardTitle === '' && titleRef.current.value === ''

    if (existingEntryIndex !== -1) {
      const noColumnName = newColumnName.filter((column: any) => column.title === '')
      setNoColumnName(noColumnName)
      setBoardTitle(titleRef.current.value)
      setInvalidColumnTitle(true)
    }
    else if (boardTitleIsEmpty) {
      setInvalidBoardTitle(true)
    }
    else if (boardTitleNotEmpty && deletedId.length !== 0 && newColumnName.length !== 0) {
      setLoading(true)
      await updateDoc(doc(db, 'users', session?.user?.email!, 'board', `${boardId}`), {
        title: boardTitle === '' ? titleRef.current.value : boardTitle,
      })
        .then(async () => {
          handleDeleteColumns()
        })
        .then(async () => {
          handleRenameColumn()
        })
        .then(() => {
          setLoading(false)
          setShowEditBoard(false)
          setShowListAction(false)
        })
    }
    else if (boardTitleNotEmpty && deletedId.length !== 0) {
      setLoading(true)
      await updateDoc(doc(db, 'users', session?.user?.email!, 'board', `${boardId}`), {
        title: boardTitle === '' ? titleRef.current.value : boardTitle,
      })
        .then(async () => {
          handleDeleteColumns()
        })
        .then(() => {
          setLoading(false)
          setShowEditBoard(false)
          setShowListAction(false)
        })
    }
    else if (boardTitleNotEmpty && newColumnName.length !== 0) { // if new 
      setLoading(true)
      await updateDoc(doc(db, 'users', session?.user?.email!, 'board', `${boardId}`), {
        title: boardTitle === '' ? titleRef.current.value : boardTitle,
      })
        .then(async () => {
          handleRenameColumn()
        })
        .then(() => {
          setLoading(false)
          setShowEditBoard(false)
          setShowListAction(false)
        })

    }
    else if (deletedId.length !== 0 && newColumnName.length !== 0) { //If there was a deleted column and renamed column
      setLoading(true)
      await handleDeleteColumns()
        .then(async () => {
          handleRenameColumn()
        })
        .then(() => {
          setLoading(false)
          setShowEditBoard(false)
          setShowListAction(false)
        })
    }
    else if (deletedId.length !== 0 && newColumnName.length !== 0) { //If there was a deleted column and renamed column
      setLoading(true)
      await handleDeleteColumns()
        .then(async () => {
          handleRenameColumn()
        })
        .then(() => {
          setLoading(false)
          setShowEditBoard(false)
          setShowListAction(false)
        })
    }
  }


  function renameColumn(id: string, newName: string) {
    // Check if an entry with the same id already exists in the array
    const existingEntryIndex = newColumnName.findIndex((entry: any) => entry.id === id);
    //Check if the entry have empty title
    const emptyTitle = newColumnName.findIndex((entry: any) => entry.title === '');

    if (existingEntryIndex !== -1) {
      // If an entry with the same id exists, update its title
      setNewColumnName((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[existingEntryIndex].title = newName;
        return updatedArray;
      });
    } else {
      // If no entry with the same id exists, add a new entry
      setNewColumnName((prev: any) => [...prev, { id: id, title: newName }]);
    }
    setShowSaveButton(true)
  }

  useEffect(() => {
    if(invalidColumnTitle){
      const existingEntryIndex = newColumnName.filter((entry: any) => entry.title === '');
      setNoColumnName([...existingEntryIndex])
    }
  },[invalidColumnTitle,newColumnName])

  const removeColumn = (id: string) => {
    //Remove the column that has the same value of parameter
    const newColumn = handleColumns.filter((col: any) => col.id !== id)
    setHandleColumns(newColumn)
    //Remove the column that has removed its name and suddenly delete it from the column list.
    const hasTitle = newColumnName.filter((col: any) => col.title !== '')
    setNewColumnName(hasTitle)

    setDeletedId((prev: any) => [...prev, { id: id }])
    setShowSaveButton(true)
  }

  return (
    <div className='w-full flex justify-center h-full items-center'>
      <motion.form
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
        className='w-11/12 md:w-[450px] bg-secondary rounded-lg h-auto flex flex-col items-center gap-5 justify-between py-5 px-5'>
        <p className='font-bold w-full text-start text-bw text-md sm:text-lg'>EDIT BOARD</p>

        <div className='w-full flex flex-col'>
          <div className='w-full flex items-center justify-between'>
            <label className='text-sm sm:text-md text-bw font-semibold'>Board title:</label>
            {
              boardTitle === '' && invalidBoardTitle && (
                <div className='flex items-center gap-1'>
                  <AiOutlineExclamationCircle className="text-red-500 text-md" />
                  <p className='text-red-500 text-xs sm:text-sm'>Board title is required</p>
                </div>
              )
            }
          </div>
          <div className={`w-full flex items-center border ${boardTitle === '' && invalidBoardTitle ? "border-red-500" : "border-gray-600"} focus-within:border-dashed focus-within:border-2 focus-within:border-green-500 h-10 rounded-md p-2`}>
            <input ref={titleRef} onChange={(e) => { setBoardTitle(e.target.value), setShowSaveButton(true) }} defaultValue={boardData?.title} type='text' className={`bg-transparent rounded-md h-full pl-2 outline-none w-full text-bw`} />
          </div>
        </div>


        <div className='flex flex-col w-full gap-1'>
          <div className='w-full flex items-center justify-between'>
            <label className='text-sm sm:text-md text-white font-semibold'>Columns</label>

            {
              noColumnName.length !== 0 && invalidColumnTitle && (
                <div className='flex items-center gap-1'>
                  <AiOutlineExclamationCircle className="text-red-500 text-md" />
                  <p className='text-red-500 text-xs sm:text-sm'>Title should not be empty</p>
                </div>
              )
            }

          </div>
          {
            handleColumns.length === 0 && (
              <p className='text-gray-500 text-sm relative left-0'>{`No column(s)`}</p>
            )
          }
          {
            handleColumns && handleColumns?.map((col: any, index: number) => {

              const hasEmptyTitle = noColumnName.some((noTitle: any) => noTitle.id === col.id && noTitle.title === '');

              return (
                (
                  <div key={col.id} className={`w-full flex items-center border ${hasEmptyTitle ? "border-red-500" : "border-gray-600"} focus-within:border-dashed focus-within:border-2 focus-within:border-green-500 h-10 rounded-md p-2`}>
                    <input type='text' defaultValue={col.title} onChange={(e) => renameColumn(col.id, e.target.value)}
                      className={`bg-transparent rounded-md h-full pl-2 outline-none w-full text-bw`}
                    />
                    <button onClick={() => removeColumn(col.id)} type='button' className='hover:text-red-500 text-white'>
                      <AiOutlineClose />
                    </button>
                  </div>
                )
              )
            })
          }

        </div>
        <div className='bg-red-100 w-full rounded-md h-auto p-2'>
          <p className='text-xs font-semibold text-black'>Note: Removing column that contains tasks and subtasks will also be remove and cannot be recover.</p>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          {
            showSaveButton && (
              < button onClick={handleEditBoard} type='button' className='text-white w-full bg-paleGreen rounded-lg py-2 font-bold'>Save change</button>
            )
          }
          <button onClick={() => setShowEditBoard(false)} type='button' className='text-white w-full bg-slate-300 rounded-lg py-2 font-bold'>Close</button>
        </div>
      </motion.form >

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

export default EditBoard