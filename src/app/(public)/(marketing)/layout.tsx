import Footer from '@/components/layout/public/Footer'
import Header from '@/components/layout/public/Header'
import React, { ReactNode } from 'react'

export default function layout({children}: {children: ReactNode}) {
  return (
    <div className='flex flex-col min-h min-h-screen'>
        <Header/>
        <main className='flex-1'>
            {children}
        </main>
        <Footer/>
    </div>
  )
}
