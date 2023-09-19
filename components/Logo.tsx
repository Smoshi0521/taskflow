import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
type Props = {
  closeSideBar: boolean
}
function Logo({ closeSideBar }: Props) {
  const router = useRouter()
  return (
    <motion.div
      initial={closeSideBar ? { width: "200px" } : { width: "500px" }}
      animate={closeSideBar ? { width: "200px" } : { width: "500px" }}
      transition={{ duration: 0.5 }}
      onClick={ () => router.push('/')}
      className={`h-full flex items-center min-w-[250px] max-w-[300px] md:border-[1px] border-r-gray-500 border-transparent shadow-r-xl bg-secondary cursor-pointer`}>
      <p className='font-bold text-[20px] md:text-[40px] text-bw text-start md:text-center w-full px-5'>TASKFLOW</p>
    </motion.div>

  )
}

export default Logo