import Layout from '@/components/Layout';
import Sidebar from '@/components/Sidebar';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { GoSidebarCollapse } from 'react-icons/go';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { db } from '@/firebase';
import Loader from '@/components/loader/Loader';
export default function Home({ session }: any) {
  const [closeSideBar, setCloseSideBar] = useState(false);
  const [showList, setShowList] = useState(false)
  const [hideBoard, setHideBoard] = useState(false)
  const [themeColor, setThemeColor] = useState(false)
  const [board, loading, error] = useCollection(
    session && query(
      collection(db, 'users', session.user?.email!, 'board'),
      orderBy("createdAt", 'desc')
    )
  )

  return (
    <Layout session={session}>
      <div className='w-full h-full flex items-center justify-center relative top-[-50px] px-5'>
        {
          loading ? (
            <Loader />
          ) : (
            <div>
              {
                board?.size !== 0 && (
                  <p className='font-bold text-bw text-lg md:text-2xl opacity-25 text-center'>{
                    `Head over to one of your board to start create and manage your task.`
                  }</p>
                )
              }
              {
                board?.size === 0 && (
                  <div className='flex flex-col'>
                    <p className='font-bold text-bw text-lg md:text-2xl opacity-25 text-center'>{
                      `No board created`
                    }</p>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    </Layout>
  );

}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
