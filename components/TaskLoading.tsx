import React from 'react'

function TaskLoading() {
  return (
    <div className="animate-pulse flex flex-col items-center gap-4 w-60">
      <div className="h-10 bg-white w-full rounded-md"></div>
      <div className="h-8 bg-white w-full rounded-md"></div>
    </div>
  )
}

export default TaskLoading