import { privateApi } from '@/api/axios';
import OrderCard from '@/components/OrderCard'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const ShowUserOrders = () => {
const params = useParams();
  const [userOrder,setUserOrder ] = useState(null); 

  const getUserOrders = async()=>{

        const  accessToken = localStorage.getItem("accessToken")
         const res = await privateApi.get(`/orders/user-order/${params.userId}`, {
          headers:{
            Authorization:`Bearer ${accessToken}`
          }
         })

           if(res.data.success){
    setUserOrder(res.data.orders)
    console.log(res);
    
  }
      }

 useEffect(()=>{ 
  getUserOrders();
 }, [])

console.log(userOrder);


  return (
<div className='py-20 px-3 md:px-0'>
  <div className='max-w-7xl'>

  <OrderCard userOrder={userOrder} />
  </div>
</div>
  )
}               

export default ShowUserOrders
