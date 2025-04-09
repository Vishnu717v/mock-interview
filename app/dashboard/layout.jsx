import React from 'react'
import Header from './_components/Header'

export default function DashBoardlayout({children}) {
  return (
    <div>
     <Header/>
      {children}
    </div>
  )
}
