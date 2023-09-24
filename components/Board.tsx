import React, { SetStateAction } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
type Props = {
  id: string,
  title: string
  setShowBoardList: React.Dispatch<SetStateAction<boolean>>
}
function Board({ id, title, setShowBoardList }: Props) {
  const router = useRouter()
  const currentBoard = router.query.id
  return (
    <>
      <Link href={`/board/${id}`}
        onClick={() => setShowBoardList(false)}
        className={`${currentBoard === id && ("bg-paleGreen text-gray-800")} text-gray-400 mt-1 hover:text-boardTitle flex items-center gap-1 py-2 rounded-full px-2 border-2 hover:border-paleGreen border-transparent transition duration-200 w-10/12 cursor-pointer h-fit`}>
        <MdOutlineSpaceDashboard className="text-2xl" />
        <p className='font-semibold text-start truncate text-sm sm:text-md'>{title}</p>
      </Link>
    </>
  )
}

export default Board