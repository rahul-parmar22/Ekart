import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { X } from "lucide-react";

const ImageUpload = ({ productData, setProductData }) => {
                            // aa code ahiyathi image change mate je setProductData kare to aana parent ma tya set thai jay data
const handleFiles=(e)=>{
    const files= Array.from(e.target.files || []) //input thi je images select kare e badhi array ma no hoy mate ema map() no chale mate tene array ma convert kare..jetali images select hoy te size no array banave ane iamges no hoy to []; 
    if(files.length){ //jo images select kri hoy to 
        setProductData((prev)=>({
            ...prev,    //aa card admin na addProducts and editProducts bannema user karvanu chhe mate aama images pahelathi pan hoy to e tya cloudinary ni string hoy ane aa new image add thay to e file hoy to mate badhi mix hoy ane mate j preview ma niche badha alag alag if-else lagadela chhe     
            productImg:[...prev.productImg,  ...files ]  //productImg field ma je old images hoy product ni etale ...prev.productImg to e emnam re ane new files ma images aavi hoy ...files e iamges ne productImg ma nakhi de..ane files array chhe pan e spread operator no use kato etale e array mathi bahar aavi jay...jo spread operator no hoy to aam thay [  ["img1.jpg","img2.jpg"],   [File1,File2]  ] ane jo chhe to ["img1.jpg", "img2.jpg", File1, File2] aam thay
        })) 
    }
    console.log(files)
}

const removeImage = (index)=>{
    setProductData((prev)=>{ //ahi prev ma je badhi images niche show chhe ej chhe... to  prev.productImg.filter((_, i) aama i ane niche je  {productData.productImg?.map((file, idx) ema pan productData prev chhe to ema pan je idx chhe e j remove fun ma aapvi ..jo delete par click karo ane je banne same hoy to ene delete karvani chhe means je same nathi tene rakho 
        const updatedImages = prev.productImg.filter((_, i)=>  i !== index);
        return {...prev, productImg:updatedImages}
    })
}

  return (
    <div className="grid gap-2">
      <Label>Product Images</Label>
      <Input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFiles}
      />
      <Button variant="outline">
        <label htmlFor="file-upload" className="cursor-pointer ">
          Upload Images
        </label>
        {/* id="file-upload" no use e input field ni id aa uparna label e html for ma nakhi means jyare aa lable par click thay etale pelu input khule em..ane e input hidden kari didhu good UI mate */}
      </Button>
      {/* image Preview  */}
      {productData?.productImg?.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3">
          {productData.productImg?.map((file, idx) => {
            //check if file is already a file(from input) or a DB object/string
            let preview;
            if (file instanceof File) {  //File object → browser ke file input se aayi hui nayi image... Agar image File object hai (user ne upload kiya hai abhi), to browser ke local memory se temporary URL banate hain.
              preview = URL.createObjectURL(file);//File object ko blob URL me convert karta hai....Example: "blob:http://localhost:3000/6c8a9e..."...Ye URL <img> tag me dikh sakta hai preview ke liye bina upload kiye.
            } else if (typeof file === "string") { //Agar image direct string hai, to assume karo ki ye URL hai backend ya cloud ka...koi extra  link hoy to e aaya handle thay..like obline google mathi je iamges levi evi koi hoy to eno preview
              preview = file;
            } else if (file?.url) { // Agar image object hai aur { url, publicId } format me hai, to url ko preview me dikhate hain....Ye mainly existing images ke liye hota hai (jo editProduct ke time backend se aate hain).....old iamge no url je save hoy already e ..product modle ma img ma url pan ek field chhe to old iamge to ek object ja avti hoy to ema url ne destructure karel chhe
              preview = file.url;
            } else {
              return null;
            }

            return (
              <Card key={idx} className={"relative group overflow-hidden"}>
                <CardContent>
                  <img
                    src={preview}
                    alt=""
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-md  "
                  />
                  {/* remove button // group-hover style nice..image ma enter thay user tyare remove button dekhade..khas logic */}
                  <button onClick={()=>removeImage(idx)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <X size={14} />
                  </button>
                </CardContent>
              </Card>
            ); 
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
