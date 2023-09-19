import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

type Props = {
  id: string,
  title: string
}
function Board({ id, title }: Props) {
  const router = useRouter()

  return (
    <>
      <Link href={`/board/${id}`} className='py-2 rounded-lg border-2 border-dotted hover:border-paleGreen border-transparent transition duration-200 w-11/12 cursor-pointer h-fit px-2'>
        <p className='font-semibold text-start truncate text-bw'>{title}</p>
      </Link>
    </>
  )
}

export default Board