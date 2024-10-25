import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

function Layout({user,setUser,baseUrl}) {
  return (
    <>
        <Header user={user} setUser={setUser} baseUrl = {baseUrl} />
        <Outlet />
        <Footer />
    </>
  )
}

export default Layout