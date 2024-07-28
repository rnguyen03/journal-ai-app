import '../style.css'

import React from 'react'
// import { kv } from '@vercel/kv'
import Sidebar from 'components/sidebar'
import AuthButton from 'components/auth-button'
import ParentComponent from 'components/login'


export default async function loginPage(){

  return (
    <ParentComponent/>
  )
}