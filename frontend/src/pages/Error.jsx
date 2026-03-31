import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { useLocation } from 'react-router-dom'


const Error = () => {

const location = useLocation(); 
const pathname= location.pathname; 

  return (
    <div className='min-h-screen  flex  flex-col justify-center items-center bg-linear-to-r from-purple-100 to-pink-100 '>
        <div className='space-y-3'>
       <div className='flex items-center text-pink-500 font-bold '> <ShoppingCart className='size-20'/><span className='text-3xl'>KART</span></div>
       <div> <b>404.</b> That's an error. </div>
       <p>The requested URL {pathname} was not found on this server. </p>

        </div>
    </div>
  )
}

export default Error
