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
import { useDispatch, useSelector} from "react-redux";
import { setProducts } from "@/redux/productSlice";
import { privateApi } from "@/api/axios";

const Products = () => {

 
  const { products } = useSelector((store) => store.product);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search,setSearch]= useState("")
  const [category,setCategory]= useState("All")
  const [brand, setBrand]= useState("All")
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [sortOrder,setSortOrder]= useState('')
 const [openFilter, setOpenFilter] = useState(false);

  const dispatch = useDispatch();


  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await privateApi.get(
       "/product/getallproducts",
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
    <div className="pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
       {/* SIDEBAR (DESKTOP ONLY) */}
          <div className="hidden md:block lg:w-[260px] w-full">

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
        </div>
{/* MOBILE FILTER DRAWER */}
        {/* MOBILE FILTER DRAWER */}
        {openFilter && (
          <div className="fixed inset-0 z-50 flex">

            <div
              className="flex-1 bg-black/40"
              onClick={() => setOpenFilter(false)}
            />

            <div className="w-[280px] bg-white p-4 overflow-y-auto">

              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Filters</h2>
                <button onClick={() => setOpenFilter(false)}>✕</button>
              </div>

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
            </div>
          </div>
        )}






        {/* Main product section// flex-1 important..flex to e extra vadheli badhi space lai le horizontally..temporary flex-1 and wihout flex-1 bg lagavine check karvu */}
        <div className="flex flex-col flex-1 ">

          {/* sort */} 
<div className="flex flex-col min-[350px]:flex-row justify-between items-center mb-4">

  <h2 className="font-semibold text-lg">Products</h2>

  <div className="flex gap-2 items-center">

    {/* MOBILE FILTER BUTTON */}
    <button 
      onClick={() => setOpenFilter(true)}
      className="md:hidden px-3 py-1 border rounded-md text-sm"
    >
      Filters
    </button>

    {/* SORT */}
    <Select onValueChange={(value)=>setSortOrder(value)}>
      <SelectTrigger className="w-[140px] sm:w-[180px]">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="lowToHigh">Low → High</SelectItem>
          <SelectItem value="highToLow">High → Low</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

  </div>
</div>

          {/* product grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
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
