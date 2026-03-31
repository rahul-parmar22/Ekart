import React from 'react'
import { Button } from './ui/button'

const Hero = () => {
  return (
    <section className='bg-linear-to-r from-blue-600 to-purple-600 text-white py-16'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex flex-col-reverse md:flex-row gap-8 items-center '>
            <div>
                 <h1 className='text-4xl md:text-6xl font-bold mb-4'>Latest Electronics at Best Price</h1>
                 <p className='text-xl mb-6 text-blue-100'>Discover cutting-edge technology with unbeatable deals on smartphones,laptops and more.</p>
                 <div className='flex flex-col sm:flex-row gap-4'>
                    <Button  className='bg-white text-blue-600 hover:bg-gray-100'>Shop Now</Button>
                    <Button variant='outline' className='border-white text-white hover:bg-white hover:text-blue-600 bg-transparent '>View Deals</Button>
                 </div>
           </div> 
           <div className='relative '>
            <img src="phone.png" alt="" width={500} height={400} className='rounded-lg shadow-2xl' />
           </div>  
        </div>
      </div>
    </section>
  )
} 

export default Hero


//public folder vite ma root thi hamesha hoy chhe... to eni image game tyare use karo kyay pan to hamesha '/image' aagal slash lagavine j img na src ma apvi...
//means what ke  http://localhost:5173/phone.png karo to open thay browser ma ane image run thay bhale / nathi aapyu karan url ma http://localhost:5173/ chhe ane image direict access thay... pan profilevala ma src ma jo / slash vina src aapvi to e no chale. karan ke profile valu page http://localhost:5173/profile/:userId ma khule chhe to tya image joiti hoy to / karine src ma aapvi pade... 