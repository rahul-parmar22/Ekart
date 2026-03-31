import {v2 as cloudinary} from 'cloudinary';  
  //cloudinary ek SDK chhe 
  cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
  });

// Test upload
// cloudinary.uploader
//   .upload("https://res.cloudinary.com/demo/image/upload/sample.jpg")
//   .then(res => console.log("✅ Cloudinary test upload success:", res.secure_url))
//   .catch(err => console.log("❌ Cloudinary test upload error:", err));


  export default cloudinary; 