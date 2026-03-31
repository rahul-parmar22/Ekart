import React from "react";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart } from "@/redux/productSlice";
import Products from "@/pages/Products";

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
      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/add",
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
    <div className="shadow-lg rounded-lg overflow-hidden h-max">
      <div className="w-full h-full aspect-square overflow-hidden">
        {loading ? (
          <div>
            <Skeleton className="w-full h-full rounded-full " />
          </div>
        ) : (
          <img //image scale karo tyare bahar no jay img tethi aani parent div ma overflow hidden chhe
               src={productImg[0]?.url || img}
            onClick={()=>navigate(`/products/${product._id}`)}
         
            alt="image"
            className="w-full h-full transition-transform duration-300 hover:scale-105"
          />
        )}
      </div>
      {loading ? (
        <div className="px-2 space-y-2 my-2">
          <Skeleton className="w-50 h-4 " />
          <Skeleton className="w-25 h-4 " />
          <Skeleton className="w-40 h-8 " />
        </div>
      ) : (
        <div className="px-2 space-y-1">
          <h1 className="font-semibold h-12 line-clamp-2">{productName}</h1>
          <h2 className="font-bold">₹{productPrice}</h2>
          <Button disabled={productStock <= 1} onClick={()=>addToCart(product._id)} className="bg-pink-600 mb-2 w-full cursor-pointer">
            <ShoppingCart />
            Add to Cart{" "}
          </Button>
  
        </div>
      )}
    </div>
  );
};

export default ProductCard;
