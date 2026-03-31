import FilterSidebar from "@/components/FilterSidebar";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector} from "react-redux";
import { setProducts } from "@/redux/productSlice";

const Products = () => {
  const { products } = useSelector((store) => store.product);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search,setSearch]= useState("")
  const [category,setCategory]= useState("All")
  const [brand, setBrand]= useState("All")
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [sortOrder,setSortOrder]= useState('')
  const dispatch = useDispatch();

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/product/getallproducts`,
      );
      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
        console.log(res.data.products)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.res.data.message);
    } finally {
      setLoading(false);
    }
  };

//khas dhyan rakhvu ke ahi niche filter lagadela chhe to jo koi product ma koi field rahi gai hoy baki ke pachhi price limit 999999 thi vadhi jay ane kai random data nakhi dyo to filter ma e remove thai jay...ane redux ma store no thay to pachhi bhale backend ma vadhare product hoy pan only badhi filter fullfield kare ej store thay ane show kare

  useEffect(()=>{
    if(allProducts.length === 0) return;
    let filtered=[...allProducts]

if(search.trim() !== ""){
  filtered= filtered.filter(p=>p.productName?.toLowerCase().includes(search.toLowerCase()))
}
if(category !== "All"){
  filtered= filtered.filter(p=>p.category === category)
}
if(brand !== "All"){
  filtered= filtered.filter(p=>p.brand === brand)
}

filtered= filtered.filter(p=>p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])
 
if(sortOrder=== "lowToHigh"){
  filtered.sort((a,b)=>a.productPrice - b.productPrice)
}else if(sortOrder === "highToLow"){
   filtered.sort((a,b)=>b.productPrice - a.productPrice)
}

dispatch(setProducts(filtered))
},[search, category, brand, sortOrder, priceRange, allProducts, dispatch])

  useEffect(() => {
    getAllProducts();
  }, []);
  console.log(allProducts);
  return (
    <div className="pt-20 pb-10 ">
      <div className="max-w-7xl mx-auto flex gap-7">
        {/* sidebar */}
        <FilterSidebar 
        search={search}
        setSearch={setSearch}
        brand={brand}
        setBrand={setBrand}
        category={category}
        setCategory={setCategory}
        allProducts={allProducts} 
        priceRange={priceRange}
        setPriceRange={setPriceRange}
         />

        {/* Main product section// flex-1 important..flex to e extra vadheli badhi space lai le horizontally..temporary flex-1 and wihout flex-1 bg lagavine check karvu */}
        <div className="flex flex-col flex-1 ">
          <div className="flex justify-end mb-4">
            <Select onValueChange={(value)=>setSortOrder(value)} >
              <SelectTrigger className="w-full max-w-50">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowToHigh">Price:Low to High</SelectItem>
                  <SelectItem value="highToLow">Price:High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {products?.map((product) => { //? optional chaining nu question mark(?) must chhe..nahi to error because first time redux store ma prodcuts no hoy , api fetch thay pachhi aave products to tyare may be error aavi shake chhe 
              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  img={"./public/phone.png"}
                  loading={loading}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
