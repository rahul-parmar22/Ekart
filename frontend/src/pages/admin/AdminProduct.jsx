import React, {useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Search, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "sonner";
import { setProducts } from "@/redux/productSlice";
import userLogo from '/public/defaultProfilePic.png'
import { useNavigate } from "react-router-dom";
import { privateApi } from "@/api/axios";

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);
  const [editProduct, setEditProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [search,setSearch]= useState(""); 
  const [sortOrder,setSortOrder] = useState(''); 
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

let filteredProducts = products.filter((product)=> //jo ahi { } use karo to return aapvu mendatory 1110% nahito ena wina direct karo wihotu paranthesis to no aapvu
  product.productName.toLowerCase().includes(search.toLowerCase()) ||
  product.productName.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
)

if(sortOrder === 'lowToHigh'){
  filteredProducts = [...filteredProducts].sort((a,b)=>a.productPrice - b.productPrice)
}

if(sortOrder === 'highToLow'){
  filteredProducts = [...filteredProducts].sort((a,b)=>b.productPrice - a.productPrice)
}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("productName", editProduct.productName);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("category", editProduct.category);
    formData.append("brand", editProduct.brand);
   formData.append("productStock", editProduct.productStock)
    //Add existing images public_ids //old image ne rakhva mate nicheno code
    const existingImages = editProduct.productImg //jo old iamges hoy to kem khabar pade? ans:: !(img instanceof File) && img.public_id image e instance no hoy File no means select no kari hoy ane public_id hoy means cloudinary ma chhe e image to tene existing image ma nakhi dyo em..te have multer ma handle nahi thay 
      .filter((img) => !(img instanceof File) && img.publicId) //Kyunki File object browser ke file input se aati hai, aur agar user ne existing image ko change nahi kiya to wo already server pe stored hai, isliye wo File nahi hai.
      .map((img) => img.publicId); //upar filter array ma je ave img tena par map kare..ane aa map ek array return kare... ahi productImg no array banavshe ..kemke jetali vat chale etali vat ek ek img.publicId add karto jashe

    formData.append("existingImages", JSON.stringify(existingImages));//JSON.stringify karke array ko string me convert kar rahe hain, kyunki FormData me sirf string ya File hi directly ja sakta hai.
     
    //Add new files //new images add karva mate
    editProduct.productImg // aa fun last ma chalshe to  aapne image upload kari hoy imageupload component mathi to e pan editproduct ma set thai hoy ane aa fun last ma chalshe...to aani pase hoy editProduct.ProductImg
      .filter((img) => img instanceof File)  // jo image file hoy means select kareli chhe ane aa ImageUpload component je chhe emathi set kare chhe state ne ane tyathi image jo aavi hoy to tene filter karine append kare chhe files ma to tene multer handle kari le
      .forEach((file) => {    //upar editProduct.productImg ma have old images e  url em hoy ane new selected iamges pan hoy
        formData.append("files", file);
      });

    try {
      const res = await privateApi.put(
       "/product/update/${editProduct._id}",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success("Product updated successfully");
        const updateProducts = products.map((p) => {
          return p._id === editProduct._id ? res.data.product : p;
        });
        dispatch(setProducts(updateProducts));
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProductHandler = async(productId) => {
    try {
      const remainingProducts = products.filter(
        (product) => product._id !== productId,
      );
      const res = await privateApi.delete(
      "/product/delete/${productId}",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setProducts(remainingProducts));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };



  return (
    <div className="bg-gray-100">

    <div className="md:ml-[350px] ml-4 max-w-7xl  py-20 pr-20 flex flex-col gap-3 min-h-screen ">

      <div>jyare admin product ne ahithi delete kari nakhe ane user e past ma e order karelo hoy to pachhi user na jya order show tahya tya  product no batave..ka pachhi tyare e samaye tya user ne kaik biju lakhelu aave ke this product was deleted evu kaik karvu setting</div>
      <div className="flex  justify-between ">
        <div className="relative bg-white rounded-lg">
          <Input
            type="text"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search Product..."
            className="w-[400px] items-center"
          />
          <Search className="absolute right-3 top-1.5 text-gray-500" />
        </div>

        <Select  onValueChange={(value)=>setSortOrder(value)} >
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="lowToHigh" >Price: Low to High</SelectItem>
              <SelectItem value="highToLow" >Price:High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filteredProducts.map((product, index) => {
        return (
          <Card key={index} className="px-4 ">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <img
                onClick={()=>navigate(`/products/${product._id}`)}
                  //  src={product.productImg[0].url}  //cloudinary thi account nu setting thay etale aa comment uncomment kari nakhvi
                    src={ product?.productImg[0]?.url|| userLogo}
                  alt="product Image"
                  className="w-25 h-25 cursor-pointer rounded-md"

                />
                <h1 className="font-bold w-96 text-gray-700">
                  {product.productName}
                </h1>
              </div>
              <h1>₹{product.productPrice}</h1>
              <div className="flex gap-3">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Edit
                      onClick={() => {
                        (setOpen(true), setEditProduct(product));
                      }}
                      className="text-green-500 cursor-pointer "
                    />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px] max-h-[740px] overflow-y-scroll">
                    <DialogHeader>
                      <DialogTitle>Edit Products</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>

                    <div className=" flex flex-col gap-2">
                      <div className="grid gap-2">
                        {/* aama badhe grid aapel chhe upar to e gap aapva mate chhe..jaruri nathi ke dat vakhte aapane flex j use karvi  */}
                        <Label className="">Product Name</Label>
                        <Input
                          type="text"
                          value={editProduct?.productName}
                          onChange={handleChange}
                          name="productName"
                          placeholder="Ex-Iphone"
                          required
                        />
                      </div>

<div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                        <Label className="">Price</Label>
                        <Input
                          value={editProduct?.productPrice}
                          onChange={handleChange}
                          name="productPrice"
                          placeholder="Ex-Iphone"
                          type="number"
                          required
                        />
                      </div>
                                            <div className="grid gap-2">
                        <Label className="">Stock</Label>
                        <Input
                          value={editProduct?.productStock}
                          onChange={handleChange}
                          name="productStock"
                             placeholder="0"
                          type="number"
                          min="0"
                          required
                        />
                      </div>
</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Brand</Label>
                          <Input
                            type="text"
                            value={editProduct?.brand}
                            onChange={handleChange}
                            name="brand"
                            placeholder="Ex-apple"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Category</Label>
                          <Input
                            type="text"
                            value={editProduct?.category}
                            onChange={handleChange}
                            name="category"
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
                          value={editProduct?.productDesc}
                          onChange={handleChange}
                          placeholder="Enter brief description of product"
                        />
                      </div>
                      <ImageUpload
                        productData={editProduct}
                        setProductData={setEditProduct}
                      />
                    </div>

                    <DialogFooter>
                      <DialogClose>
                        {/* aa badha ma DialogClose e ek button jem j kam kre chhe ane pachhi ema ek <Button> aapyu to console ma warming erro show kare..upar dialog open time pan evu hatu to wihout button direct text lakhi nakho to error nahi aape  */}
                        <Button variant="outline">Cancel</Button>{" "}
                      </DialogClose>
                      <Button onClick={handleSave} type="submit">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {/* Delete product confirmation dialog*/}

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Trash2 className="text-red-500 cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>                                           
                        This action cannot be undone. This will permanently
                        delete your account from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteProductHandler(product._id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
    </div>
  );
};

export default AdminProduct;
