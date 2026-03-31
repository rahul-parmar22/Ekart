import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='flex '>
      <Sidebar/>
      <div className=' flex-1'>
                  {/* aapane andat badhi jagyae je pl ke ml-350 aapi e abadhu setting aapane ahi outlet mathi j kari nakhvani jarur hati ..ahi niche ek div ma badhi responsiveness nakhine like md:pl-[350] evu badhu karine tema outlet nakhvo etale dar vakhte outlet aave to e aa layout apply thay evi rite j aave... */}
          <Outlet/>   
      
      </div>
    </div>
  )
}

export default Dashboard
