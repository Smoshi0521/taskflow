import Layout from '@/components/Layout';
import Sidebar from '@/components/Sidebar';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { GoSidebarCollapse } from 'react-icons/go';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { db } from '@/firebase';
export default function Home({ session }: any) {
  const [closeSideBar, setCloseSideBar] = useState(false);
  const [board, loading, error] = useCollection(
    session && query(
      collection(db, 'users', session.user?.email!, 'board'),
      orderBy("createdAt", 'desc')
    )
  )

  return (
    <Layout session={session}>
      <div className='w-full h-full flex items-center justify-center'>
        {
          board?.size === 0 ?
            <p className='font-bold text-bw text-2xl opacity-25'>No board created.</p>
            :
            <p className='font-bold text-bw text-2xl opacity-25 text-center'>Head over to one of your board now to start create and manage your tasks.</p>
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
