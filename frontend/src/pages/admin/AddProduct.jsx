import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";
import { Loader2 } from "lucide-react";

const AddProducts = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch= useDispatch()
  const {products}= useSelector((store)=>store.product)
  const [loading,setLoading]= useState(false)
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0, 
    productDesc: "",
    productImg: [],
    productStock:0, 
    brand: "",
    category: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
     const formData = new FormData();//FormData browser ka object hai jo HTTP request ke through files aur data send karne ke liye use hota hai. aama only string ke file j directly mokli shako...mate editProduct ma existing image array me stringify karta hta
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("productStock", productData.productStock);
    formData.append("brand", productData.brand);
    formData.append("category", productData.category);


    if (productData.productImg.length === 0) {
      toast.error("Please select at least one image");
      return;
    }
    productData.productImg.forEach((img) => {
      formData.append("files", img); //ahi addproducts chhe to ahi images new images j hashe badhi means files hashe  e badhi multer ne through req.files ma jashe... 
    });
    try { 
      setLoading(true); 
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if(res.data.success) {
        dispatch(setProducts([...products, res.data.product]))
        toast.success(res.data.message)
      }
      console.log(res);
      
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className=" bg-gray-100 min-h-screen">


    <div className="md:ml-[350px] max-w-7xl py-20 pr-20 mx-auto px-4  ">
      <Card className= " max-w-4xl my-20">
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription> Enter Product details below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 ">
            <div className="grid gap-2">
              <Label>Product Name</Label>
              <Input
                type="text"
                name="productName"
                value={productData.productName}
                onChange={handleChange}
                placeholder="Ex Iphone"
                required
              />
            </div>
       <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
              <Label>Price</Label>
              <Input
                type="number"
                name="productPrice"
                value={productData.productPrice}
                onChange={handleChange}
                placeholder="0"
                min='0'
                required
              />
            </div>
                        <div className="grid gap-2">
              <Label>Stock</Label>
              <Input
                type="number"
                name="productStock"
                value={productData.productStock}
                onChange={handleChange}
                placeholder="0"
                 min='0'
                required
              />
            </div>
       </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Brand</Label>
                <Input
                  type="text"
                  name="brand"
                  value={productData.brand}
                  onChange={handleChange}
                  placeholder="Ex-apple"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input
                  type="text"
                  name="category"
                  value={productData.category}
                  onChange={handleChange}
                  placeholder="Ex-mobile"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label>Description</Label>
              </div>
              <Textarea
                name="productDesc"
                value={productData.productDesc}
                onChange={handleChange}
                placeholder="Enter brief description of product"
              />
            </div>

            <ImageUpload
             productData={productData} 
             setProductData={setProductData}
             />
          </div>
          <CardFooter className="flex-col gap-2">
            <Button
            disabled={loading}
              onClick={submitHandler}
              className="w-full bg-pink-600 cursor-pointer mt-6"
              type="submit"
            >
              {
                loading? <span className='flex gap-1 items-center'> <Loader2 className="animate-spin"/> Please wait</span> : 'Add Products'
              }
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default AddProducts;
