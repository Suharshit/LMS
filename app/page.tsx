import React from 'react'
import { UserButton } from '@clerk/nextjs'

const page = () => {
  return (
    <div>
        this is a protected page
        <UserButton/>
    </div>
  )
}

export default page