import Layout from '@/components/Layout';
import Sidebar from '@/components/Sidebar';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { GoSidebarCollapse } from 'react-icons/go';
export default function Home({ session }: any) {
  const [closeSideBar, setCloseSideBar] = useState(false);
  
  return (
    <Layout session={session}>
      <div className='w-full h-full flex items-center justify-center'>
        <p className='font-bold text-bw text-[40px] opacity-25'>No Board Created</p>
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
