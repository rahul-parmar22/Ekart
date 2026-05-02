import React from "react";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart } from "@/redux/productSlice";
import Products from "@/pages/Products";
import { privateApi } from "@/api/axios";

const ProductCard = ({ product, img, loading }) => {
  const { productName, productImg, productPrice ,productStock } = product;
  console.log(loading); //false chhe loading atyare..karan ke product ma finally run thay ane loading false thai jay
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const addToCart = async (productId) => {

    //MY ADDED FEATURE...EXCEPT TUTORIAL
    if(!accessToken){
      return navigate('/login') //jo koi new user je website visit kare chhe ane jo te product ma add to cart button click kare to ene login page par redirect  kari dyo
    }   //upare return lakhvu jaruri chhe nahito karan vina nicheno code to run thashe j ..extra api call thashe

    try {
      const res = await privateApi.post(
        "/cart/add",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Product added to Cart");
        dispatch(setCart(res.data.cart));
      }
      console.log(res.data);
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className=" bg-white  shadow-md  rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
   {/* Image */} 
      <div className="aspect-square overflow-hidden bg-gray-100">
        {loading ? (
          <div>
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <img //image scale karo tyare bahar no jay img tethi aani parent div ma overflow hidden chhe
               src={productImg[0]?.url || img}
            onClick={()=>navigate(`/products/${product._id}`)}
         
            alt="product"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col flex-1 justify-between">

      {loading ? (
        <div className="space-y-2">
         <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[40%]" />
        <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        <div className=" space-y-1">
          <h1 className="text-sm sm:text-base font-medium line-clamp-2 min-h-[40px]">
          {productName}
        </h1>

                <h2 className="text-pink-600 font-bold text-sm sm:text-base mt-1">
          ₹{productPrice}
        </h2>

          <Button disabled={productStock <= 1} onClick={()=>addToCart(product._id)} className="mt-3 bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm h-9 w-full">
            <ShoppingCart className="w-4 h-4 " />
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline"> Add to Cart</span>
          </Button>
  
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductCard;
