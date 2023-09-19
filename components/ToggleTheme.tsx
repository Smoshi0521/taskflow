import React from 'react'
import { useEffect, useState } from 'react';
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
function ToggleTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Apply the 'dark' class to the 'html' element when dark mode is enabled
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');

    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  return (
    <>
      <div className='flex items-center justify-center gap-5 py-2 w-full bg-primary md:py-4 border-black rounded-lg'>
        <p className={` transition duration-300 font-medium text-sm`}><BsFillSunFill className={`text-2xl ${isDarkMode ? "text-orange-400" : "text-gray-500"}`}/></p>
        <label className='relative inline-block w-[45px] py-1 h-[24px] bg-[#032856] rounded-full cursor-pointer'>
          <input type='checkbox' className='bg-black h-0 w-0 opacity-0' checked={isDarkMode} onChange={toggleTheme} />
          <span className={`${!isDarkMode ? "before:translate-x-[22px]" : "translate-x-[-0px]"} absolute top-1 left-[-5px] right-0 bottom-0 before:absolute before:h-[16px] before:w-[15px] before:rounded-full before:left-2 before:transition before:duration-300 before:bg-[#ccc]`}></span>
        </label>
        <p className={` transition duration-300 font-medium text-sm`}><BsFillMoonStarsFill className={`text-xl ${!isDarkMode ? "text-stone-300" : "text-gray-500"}`} /></p>
      </div>
    </>
  )
}

export default ToggleTheme