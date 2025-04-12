"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

export default function Header() {

  const path=usePathname();
  useEffect(()=>{
    console.log(path);
  },[])
  return (
    <div className='flex p-4 items-center justify-between'>
      <Image src={'/logo.svg'} width={160} height={100} alt='logo'/>
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard'&&'text-purple-600 font-bold'}`}>Dashboard</li>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/question'&&'text-purple-600 font-bold'}`}>Questions</li>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/upgrade'&&'text-purple-600 font-bold'}`}>upgrade</li>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/how'&&'text-purple-600 font-bold'}`}>How it works?</li>
      </ul>
      <UserButton/> 
    </div>
  )
}
