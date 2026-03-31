import DataUriParser from "datauri/parser.js"
import path from 'path'

const parser= new DataUriParser();


const getDataUri= (file)=>{
    const extName= path.extname(file.originalname).toString(); //extention find kare..je file multer  ne through upload karvani chhe tenu extention 
      // console.log(parser.format(extName, file.buffer));  aa karo etale khabar pade ke shu shu aave chhe em 
    return parser.format(extName, file.buffer).content;  // file.buffer aape karan ke photo je upload thay tene basex64 ma convert kare image chhe jethi te easily cloudinary ma uplaod thai jay...base 64 ma convert thay file etale e ecncoding karva mate extra 30% space le..(Base64 encoding 30% extra space use karta hai)
 
  
}
export default getDataUri;      


//data uri method only learning mate chhe ke aa pan ek way chhe cloudinary ma image upload karvano
//dataUri  file buffer(binary format 0 1 valu)ne pela parse karine base64 string ma convert kare then e string upload thay to jyare bov moti file hoy tyare aa converstion time le ane memory pan use kare ...to small photo hoy 2-5 mb na to vandho no aave pan vadhare mb na photo, videos, reels to tyare streaming j use karvanu karane ke e convert karya vina direct binary ne j upload kari de
// Streaming is generally the best method for Cloudinary uploads, especially for large files or high-throughput applications. It is more memory-efficient as it avoids loading entire files into memory. While DataURI (Base64) is convenient for small images (under 60MB), streaming offers better network tolerance and efficiency. 

//🔹 1. Data URI (Base64) Method me problem kya hai?// Jab tum image ko base64 me convert karte ho::📈 File size ~33% badh jata hai//3MB ki image → ~4MB ban sakti hai//💾 Server ki RAM zyada use hoti hai//🐌 Performance slow ho sakti hai large file ke liye//🔥 Large files me server crash ka risk