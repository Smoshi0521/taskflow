import React from 'react'
import { Session } from 'next-auth'
import { SessionProvider as Provider } from 'next-auth/react'

type Props = {
  children: React.ReactNode,
  session: Session | null
}
function NextAuthProvider({ children, session }: Props) {
  return (
    <Provider>
      {children}
    </Provider>
  )
}

export default NextAuthProvider