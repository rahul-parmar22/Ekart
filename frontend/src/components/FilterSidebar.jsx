import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

const FilterSidebar = ({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  priceRange,
  setPriceRange,
  allProducts,
}) => {
  const Categories = allProducts.map((p) => p.category);
  const UniqueCategory = ["All", ...new Set(Categories)];

  const Brands = allProducts.map((p) => p.brand);
  const UniqueBrand = ["All", ...new Set(Brands)];
  console.log(UniqueBrand);


  const handleCategoryClick = (val) => {
    setCategory(val);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleMinChange = (e) => {
    const val = Number(e.target.value);
    if (val <= priceRange[1]) setPriceRange([val, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const val = Number(e.target.value);
    if (val >= priceRange[0]) setPriceRange([priceRange[0], val]);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 999999]);
  };
  return (
    <div className="bg-gray-100 mt-10 p-4  rounded-md h-max hidden md:block w-64">
      {/* Search  */}
      <Input
        type="text"
        placeholder="Search..."
        value= {search}
        onChange={(e)=>setSearch(e.target.value)}
        className="bg-white  p-2 rounded-md border-gray-400 border-2 w-full"
      />
      {/* Category  */}
      <h1 className="mt-5 font-semibold text-xl  ">Category</h1>
      <div className="flex flex-col gap-2 mt-3">
        {UniqueCategory.map((item, index) => (
          <div key={index} className="flex  items-center gap-2">
            {/* darek jagyae shadcn component use no karva..ahi niche bydefult component use karvathi ui kharab avto hto to have  simple input and label use karvathi saro aave chhe to use nathi karya */}
            <input 
            type="radio" 
            checked={category===item}
            onChange={()=>handleCategoryClick(item)}
            />
            <label htmlFor="ram">{item}</label>
          </div>
        ))}
      </div>

      {/*Brands  */}
      <h1 className="mt-5 font-semibold text-xl  ">Brand</h1>
      <select value={brand} onChange={handleBrandChange} className="bg-white w-full p-2 border-gray-200 border-2 rounded-md ">
        {UniqueBrand.map((item, index) => {
          return <option key={index} value={item} >{item.toUpperCase()}</option>;
        })}
      </select>
      {/* Price range */}
      <h1 className="mt-5 font-semibold text-xl mb-3">Price Range</h1>

      <div className="flex flex-col gap-2">
        <label>
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </label>
        <div className="flex gap-2 items-center ">
          <input
            type="number"
            min="0"
            max="5000"
            value={priceRange[0]}
            onChange={handleMinChange}
            className="w-20 p-1 border border-gray-300 rounded"
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            max="999999"
               value={priceRange[1]}
            onChange={handleMaxChange}
            className="w-20 p-1 border border-gray-300 rounded"
          />
        </div>
        <input type="range" min="0" max="5000" value={priceRange[0]} onChange={handleMinChange} step="100" className="w-full"  />
        <input
          type="range"
          min="0"
          max="999999"
          value={priceRange[1]} 
          onChange={handleMaxChange}
          step="100"
          className="w-full"
        />
      </div>
      {/* Reset button  */}
      <Button onClick={resetFilters} className="bg-pink-600 text-white mt-5 cursor-pointer w-full">
        Reset Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;
