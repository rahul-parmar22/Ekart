import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp"; 
import { verifyEmail } from "../emailVerify/verifyEmail.js";

//aakha controller ma jetla pan if lagavela chhe khali ek nana route mate te badha edge case chhe..user kadach aadi avali rite kai pan kare to ek pan case baki no revo joi ane e badhane according response pan return karvano

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required", // jo aane access karvu hoy to (error.response.data.message) thi access karvu.... direct frontend ma error.message ma aa no male..
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Usr already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
  // await  verifyEmail(email, token); //send email here
   console.log("📩 Sending email...");
await verifyEmail(email, token);
console.log("✅ Email function executed");
   
   
   newUser.token = token;
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(400).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }
    const token = authHeader.split(" ")[1]; //[Bearer fasfsdfs89asdf..]
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      //res.json(error)
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token has expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Token verification failed",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    user.token = null;
    user.isVerified = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    //niche email ma order bov matter kare chhe jo ahi (email,token) aa order ma aapel chhe to aa fun ma aaj order ma aapvu (email, token) => {  // jo order change thyo etale error aavshe ..sent nahi thay email
    verifyEmail(email, token); //send email here
    user.token = token;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Verification email sent again successfully",
      token: user.token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(400) //jyare user no hoy to aa status code network tab ma show thay ane 400-499 status code error show kare to error tab ma aa status code batave..jo no aapo to simple nicheno data j send thay
        .json({ success: false, message: "User not exists" });
    }

    // ✅ Correct password verification
    const isPasswordValid = await bcrypt.compare(
      password, // plain password from user
      existingUser.password, // hashed password from DB
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (existingUser.isVerified === false) {
      return res.status(400).json({
        success: false,
        message: "Verify your account than login",
      });
    }

    //generate token
    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m", //10 min ke 15 min rakhvo..mare practice karva ma vandho no aave tethi 1h chhe ..kemke 10 min rakhine pachhi refresh token no use karvano hoy ..je access token no time pura thay to new token refresh kare
      },
    );

    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "30d",
      },
    );

    res.cookie("refreshToken", refreshToken,{     //aanathi aapane refresh token ne cookie ma store karvi chhie..jethi req.cookies thi aapane token ne access kari shakvi
      httpOnly:true,
      secure:false, //production karvi tyare true rakhvi value
      sameSite:"lax"
    })

    existingUser.isLoggedIn = true;
    await existingUser.save();

    //check for existing session and delete it
    const existingSession = await Session.findOne({ userId: existingUser._id });
    if (existingSession) {
      await Session.deleteOne({ userId: existingUser._id });
    }

    //create a new session
    await Session.create({ userId: existingUser._id });

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${existingUser.firstName}`,
      accessToken,
      user: existingUser,
    });
  } catch (error) {
    console.log(error); // 👈 error dekhne ke liye
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const refreshAccessToken = (req,res)=>{
  
  const token = req.cookies?.refreshToken;   //cookies //plural use... not req.cookie
    
  console.log("🔁 Refresh API called");
console.log("Cookies:", req.cookies?.refreshToken);

 if(!token){
  return res.status(401).json({message:"No refresh token"}); 

 }
    try {
const decoded =   jwt.verify(token, process.env.REFRESH_SECRET); 
 
const newAccessToken = jwt.sign(
  {id:decoded.id},
  process.env.JWT_SECRET , 
  {expiresIn:"15m"}
);

res.json({accessToken:newAccessToken});
  } catch (error) {
    return res.status(403).json({success:false, message:"invalid refresh token"})
  }
}

export const logout = async (req, res) => {
  try {
    const userId = req.id;
    await Session.deleteMany({ userId: userId });
    await User.findOneAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: "User logged out succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //const otp =  Math.floor(1000 + Math.random()*9000).toString() otp for four number
    // const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); //10min //date object
    const otpExpiry = Date.now() + 10 * 60 * 1000; //time in millisecond //do chatgpt-->1️⃣ Date.now()  vs 2️⃣ new Date() vs  3️⃣Date()

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    await sendOTPMail(otp, email);
    return res.status(200).json({
      success: true,
      message: "otp sent to email successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Otp is requierd",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Otp is not generated or already verified",
      });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired please request a new One",
      });
    }

    // if(user.otpExpiry<new Date()){  //if otpExpry set in new Date()..use this code
    //   return res.status(400).json(
    //     {
    //       success:true,
    //       message:"OTP has expired please request a new One"
    //     }
    //   )
    // }
    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Otp is invalid",
      });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.params; //params ma je name value aavti hoy tej namethi destructure karvu
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password change successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const allUser = async (_, res) => { //get req chhe user get karva to req ma kai parameterni jarur nathi
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; //extract userId from  request params
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry -token",
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id; //the ID of the use we want to update
    const loggedInUser = req.user; //from isAuthenticated middleware
    const { firstName, lastName, address, city, zipCode, phoneNo, role } =
      req.body;

    if (
      loggedInUser._id.toString() !== userIdToUpdate && // 🔥&& 👉 Dono condition true honi chahiye tabhi pura if block chalega
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile",
      });
    }

    let user = await User.findById(userIdToUpdate);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;
    
    //If a new file is uploaded// biji pan ek method chhe dataUri vali ...e product img upload vala ma use kareli chhe..
    if (req.file) {
      console.log(req.file);
      
      if (profilePicPublicId) {
        await  cloudinary.uploader.destroy(profilePicPublicId);
      }        //cloudinary configure at utils folder


      console.log("without compression",req.file.size)



let compressedBuffer;

if (req.file.size < 5 * 1024) { // 5 KB threshold
  // Very small image → skip compression  //ghani already small images ma compression karvathi minor size vadhi jati hti to ene skip karo 
  compressedBuffer = req.file.buffer;
} else {
  // Get metadata to know original format
  const metadata = await sharp(req.file.buffer).metadata();

  if (metadata.format === "jpeg") { 
    compressedBuffer = await sharp(req.file.buffer)
      .resize({ width: 800, withoutEnlargement: true })  // jo already small image hoy 800px thi tone resize nahi kare em
      .jpeg({ quality: 70, mozjpeg: true }) // better compression for JPEG
      .toBuffer();
  } else if (metadata.format === "png") {  //ghani var png format ma size increase thati hti after compression to e badha issue ne remove karva mate aa badha check lagadela chhe
    compressedBuffer = await sharp(req.file.buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .png({ compressionLevel: 9 }) // maximum compression for PNG
      .toBuffer();
  } else {
    // Other formats (GIF, WebP, etc.)
    compressedBuffer = await sharp(req.file.buffer)   // uparna koi pan check ke kai pan no lagado ane only aa aatlau karo to pan compress thai jay
      .resize({ width: 800, withoutEnlargement: true })
      .toBuffer();
  }
}

console.log("Final size:", compressedBuffer.length, "bytes");


         //aa site ma nicheno code chhe...  https://medium.com/@maxsmouha/uploading-files-to-cloudinary-e84864e409df
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result); 
          },
        );
        stream.end(compressedBuffer);
      });

      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    //update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.phoneNo = phoneNo || user.phoneNo;
    user.role = role;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();
               
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// cloudinary.uploader.upload_stream(options, (error, result) => {
//    if(error){
//       console.log(error)
//    } else {
//       console.log(result)
//    }
// })

// Problem

// cloudinary.uploader.upload_stream() callback based function hai.  means what ke upload stream chalu thai gyu background ma to ene time lagshe ..pan e ek callback fun chhe to e koi promise nathi aaptu ke maru kam pending chhe ke pachhi , succcessfull chhe... async/await e promise ni sathe use thay pan aa sream promise nathi aaptu mate tene aapane promise ma wrap karie chhie new promise karine ....jyare upload finish thay pachhi teni andar nu callback run thay ...je error, resolve ape 

// But modern Node.js me hum async/await use karte hain.

// Isliye hum callback ko Promise me wrap kar rahe hain.


//////////////////////////////
// 1️⃣ Callback Based Function kya hota hai?

// Purane Node.js libraries (jaise Cloudinary) me functions callback pattern use karte the.

// Example:

// cloudinary.uploader.upload_stream(options, (error, result) => {
//    if(error){
//       console.log(error)
//    } else {
//       console.log(result)
//    }
// })

// Yaha kya ho raha hai:

// Function call hua

// Upload background me start hua

// Jab upload complete hoga tab callback function run hoga

// Ye asynchronous callback pattern hai.

// Flow:

// Upload start
//    ↓
// Wait...
//    ↓
// Upload finish
//    ↓
// Callback run
// 2️⃣ Problem kya hai callback me?

// Agar tum async/await use karna chahte ho to problem aati hai.

// Example:

// const result = await cloudinary.uploader.upload_stream(...)

// ❌ Ye kaam nahi karega.

// Kyuki upload_stream() Promise return nahi karta.

// Wo sirf callback accept karta hai.

// 3️⃣ Async / Await kya expect karta hai?

// await sirf Promise ke sath kaam karta hai.

// Example:

// const data = await someFunction()

// Yaha someFunction() ko Promise return karna chahiye.

// Example Promise:

// function someFunction(){
//   return new Promise((resolve,reject)=>{
//      resolve("done")
//   })
// }
// 4️⃣ Isliye Promise me wrap karte hain

// Cloudinary callback ko Promise me convert kar diya.

// Tumhare code me ye ho raha hai:

// const uploadResult = await new Promise((resolve, reject) => {

// Yaha ek naya Promise banaya.