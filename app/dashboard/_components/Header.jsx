"use client"
import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

export default function Header() {
  return (
    <div className='flex p-4 items-center justify-between'>
      <Image src={'/logo.svg'} width={160} height={100} alt='logo'/>
      <ul className='flex gap-6'>
        <li>Dashboard</li>
        <li>Questions</li>
        <li>Upgrade</li>
        <li>How it works?</li>
      </ul>
      <UserButton/>
    </div>
  )
}
