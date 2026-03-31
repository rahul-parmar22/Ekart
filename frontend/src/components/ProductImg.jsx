import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({images}) => {
    const [mainImg,setMainImg]= useState(images?.[0].url)

  return (
    <div className='flex gap-5 w-max '>
  <div className='gap-5 flex flex-col'>
    { 
        images?.map((img)=>{ //ahi question mark hatavi deva jarur nathi karan ke product uplaod time admin image add karshe..pan jo nahi kare to error aave...to reva deva😁😁😁(to shu kam ke chho hatavanu)
            return <img onClick={()=>setMainImg(img.url)} src={img.url} alt="product image" className='cursor-pointer w-20 h-20 border shadow-lg' />
        })
    }
  </div>
  <Zoom>
     {/* aama zoom be command install karvana chhe npm na.. ek --save valu pan */}
   <img src={mainImg} alt="mainImage" className='w-[500px] border shadow-lg' />
  </Zoom>
    </div>
  )
}

export default ProductImg
