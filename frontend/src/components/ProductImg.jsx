import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({images}) => {
    const [mainImg,setMainImg]= useState(images?.[0]?.url)

  return (
    <div className='flex flex-col-reverse sm:flex-row gap-5'>
  <div className='flex sm:flex-col  gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0'>
    { 
        images?.map((img)=>{ //ahi question mark hatavi deva jarur nathi karan ke product uplaod time admin image add karshe..pan jo nahi kare to error aave...to reva deva😁😁😁(to shu kam ke chho hatavanu)
            return <img onClick={()=>setMainImg(img.url)} src={img.url} alt="product image" className='cursor-pointer w-16 h-16 sm:w-20 sm:h-20   object-cover border shadow-lg rounded-md
              flex-shrink-0' />
        })
    }
  </div>
  
  <Zoom>
     {/* aama zoom be command install karvana chhe npm na.. ek --save valu pan */}
   <img src={mainImg} alt="mainImage" className='w-full max-w-[400px] sm:max-w-[500px]  object-contain border shadow-lg rounded-lg' />
  </Zoom>
    </div>
  )
  
}

export default ProductImg
