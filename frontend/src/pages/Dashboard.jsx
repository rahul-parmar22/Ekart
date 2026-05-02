import Sidebar from '@/components/Sidebar'
import React, { useState } from 'react'
import { Outlet,useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'

const Dashboard = () => {

  // ✅ ADDED
  const [open, setOpen] = useState(false);
   const location = useLocation();  //useLocation ek object aape jema hoy ke tame kya path par chho currently , search vagere location.search to  query aape etc.  

     // ✅ jitne routes pe sidebar nahi chahiye yaha add karo// order table vagerema sidebar  space roke , to tabel small thai jay mate tya sidebar ni jarur nathi em 
  const noSidebarRoutes = [
    '/dashboard/orders',
  ];

    // ✅ check karega current route match ho raha hai ya nahi
    //current routes ne according koi style apply karvi hoy to mate aa trick chhe
  const hideSidebarOnThisPage = noSidebarRoutes.some(route =>    //.some() method 👉 Agar array me ek bhi element condition pass kare, to .some() → true return karega  .....👉 Agar koi bhi pass na kare, to → false  // Real-life use:  1.Check karo ki user list me koi active user hai ya nahi     2.Validate karo ki koi value invalid to nahi     3.Quickly condition match karne ke liye (without full loop)
    location.pathname.includes(route)
  );   //ahi true ke false return thay...   

  return (
    <div className='flex'>

    {/* ✅ Sidebar conditionally */}
      {!hideSidebarOnThisPage && (
        <Sidebar open={open} setOpen={setOpen} />
      )}
 
{/* ✅ Special case: Orders page → md range me sidebar hide */}
{hideSidebarOnThisPage && (
  <>
    {/* mobile pe allowed // uparni style apply karvathi mobile ma to table nathi aavtu tem chhata tya pan side bar open nato thato because aa route ma hidden rakhvano chhe to mate aa code lakhvo padyo   */}
    <div className="block md:hidden">
      <Sidebar open={open} setOpen={setOpen} />
    </div>

    {/* lg+ pe wapas show kar sakte ho */}
    <div className="hidden lg:block">
      <Sidebar open={open} setOpen={setOpen} />
    </div>
  </>
)}

      {/* ✅ Main Content */}
      <div className='flex-1 w-full'>

        {/* ✅ Mobile Top Bar */}
<div className='md:hidden fixed top-16 left-0 w-full z-30 flex items-center p-4 shadow bg-white'>
  <Menu onClick={() => setOpen(true)} className='cursor-pointer' />
  <h1 className='ml-4 font-bold text-lg'>Admin Panel</h1>
</div>

        {/* ✅ Content, , apply margin according to condition */}
      <div
  className={`
    md:mt-16    w-full
    ${hideSidebarOnThisPage ? 'md:pl-0 lg:pl-[260px] ' : 'md:pl-[260px]'}
  `}
>    {/* aapane andar badhi jagyae je pl ke ml-350 aapi e abadhu setting aapane ahi outlet mathi j kari nakhvani jarur hati ..ahi niche ek div ma badhi responsiveness nakhine like md:pl-[350] evu badhu karine tema outlet nakhvo etale dar vakhte outlet aave to e aa layout apply thay evi rite j aave... */}
          <Outlet />
        </div>



      </div>
    </div>
  )
}

export default Dashboard



