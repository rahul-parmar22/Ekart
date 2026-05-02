import { LayoutDashboard, PackagePlus, PackageSearch, Users, X } from 'lucide-react'
import React from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      {/* ✅ OVERLAY (mobile) */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ✅ SIDEBAR */}
<div className={`
  fixed top-16 left-0 h-[calc(100vh-64px)] w-[260px] 
  bg-pink-50 border-r border-pink-200 p-6 z-40
  transform transition-transform duration-300
  ${open ? 'translate-x-0' : '-translate-x-full'}
  md:translate-x-0
`}>

        {/* ✅ Close button (mobile only) */}
        <div className='flex justify-end md:hidden'>
          <X onClick={() => setOpen(false)} className='cursor-pointer' />
        </div>

        <div className='text-center pt-6 space-y-3'>

          
        {/* navlink use karvathi aa nichena badha feature male ke url pramane je styling aapi chhe e  isActive... e badhu  navigate ma no male ...aa main diff chhe navigate and Navlink no  */}

          <NavLink to='/dashboard/sales'
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-lg ${isActive ? "bg-pink-600 text-white" : ""}
              flex items-center gap-2 font-semibold p-3 rounded-xl`
            }>
            <LayoutDashboard /> Dashboard
          </NavLink>

          <NavLink to='/dashboard/add-product'
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-lg ${isActive ? "bg-pink-600 text-white" : ""}
              flex items-center gap-2 font-semibold p-3 rounded-xl`
            }>
            <PackagePlus /> Add Product
          </NavLink>

          <NavLink to='/dashboard/products'
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-lg ${isActive ? "bg-pink-600 text-white" : ""}
              flex items-center gap-2 font-semibold p-3 rounded-xl`
            }>
            <PackageSearch /> Products
          </NavLink>

          <NavLink to='/dashboard/users'
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-lg ${isActive ? "bg-pink-600 text-white" : ""}
              flex items-center gap-2 font-semibold p-3 rounded-xl`
            }>
            <Users /> Users
          </NavLink>

          <NavLink to='/dashboard/orders'
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-lg ${isActive ? "bg-pink-600 text-white" : ""}
              flex items-center gap-2 font-semibold p-3 rounded-xl`
            }>
            <FaRegEdit /> Orders
          </NavLink>

        </div>
      </div>
    </>
  )
}

export default Sidebar


