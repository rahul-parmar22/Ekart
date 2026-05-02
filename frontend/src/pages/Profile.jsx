import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "../components/ui/label.jsx";   //manually rite import location
import { Input } from "@/components/ui/input"; //bydefault shadcn ni rite location aave
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { setUser } from "@/redux/userSlice.js";
import MyOrder from "./MyOrder.jsx";
import { privateApi } from "@/api/axios.js";

const Profile = () => {

  const {user}= useSelector(store=>store.user);


  //console.log(allUser)
const params= useParams();
const userId= params.userId;
const [updateUser, setUpdateUser] = useState({
  firstName:user?.firstName,
  lastName:user?.lastName,
  email:user?.email,
  phoneNo:user?.phoneNo,
  address:user?.address,
  city:user?.city,
  zipCode:user?.zipCode,
  profilePic:user?.profilePic,
  role:user?.role
})

const navigate = useNavigate(); 
const [file,setFile] = useState(null);
const[loading , setLoading] = useState(false); 
const dispatch = useDispatch(); 

const handleChange= (e)=>{
  setUpdateUser({...updateUser, [e.target.name]:e.target.value})
}

const handleFileChange = (e)=>{
  const selectedFile= e.target.files[0];
  console.log(selectedFile);
  
  setFile(selectedFile)
  setUpdateUser({...updateUser, profilePic:URL.createObjectURL(selectedFile)}) //preview only
}

const handleSubmit = async(e)=>{
  e.preventDefault()

  const accessToken= localStorage.getItem("accessToken");

  try {
    setLoading(true); 

     //use FormData for text + file
     const formData= new FormData();
    formData.append("firstName", updateUser.firstName)
    formData.append("lastName", updateUser.lastName)
    formData.append("email", updateUser.email)
    formData.append("phoneNo", updateUser.phoneNo)
    formData.append("address", updateUser.address)
    formData.append("city", updateUser.city)
    formData.append("zipCode", updateUser.zipCode)
    formData.append("role", updateUser.role)
 
if(file){
  formData.append("file",file )//image file for backend multer //ahi name shu aapvu te khas khyal rakhvo...
} 

const res= await privateApi.put(`/user/update/${userId}`,formData, {
  headers:{
  Authorization: `Bearer ${accessToken}`,
  "Content-Type":"multipart/form-data"
}})

if(res.data.success){
  toast.success(res.data.message)
  dispatch(setUser(res.data.user))
}

console.log(res.data)

   

  } catch (error) {
    console.log(error)
    toast.error('Failed to update profile')
  }finally{
    setLoading(false)
  }
}

  return (
    <div className="pt-20 min-h-screen bg-gray-100 px-4">
      <Tabs  value={params.tab || "profile"} onValueChange={(value)=>navigate(`/profile/${userId}/${value}`)} className="max-w-7xl mx-auto items-center">
        <TabsList>         
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="flex flex-col items-center justify-center bg-gray-100 ">
            <h1 className="text-2xl font-bold  mb-6 text-gray-800">
              Update Profile
            </h1>
            <div className="w-full flex flex-col md:flex-row gap-8 md:gap-10 justify-between items-center  md:items-start px-4 md:px-7 max-w-2xl">

            {/* profile picture  */}
            <div className="flex flex-col items-center">
         
                <img
                  src={updateUser.profilePic ||'/defaultProfilePic.png'}
                  alt="defaultProfilePic"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-pink-800"
                />

                 <Label className="mt-4 cursor-pointer  bg-pink-600  text-white px-4 py-2  rounded-lg  hover:bg-pink-700">
                {" "}
                Change Profile{" "}
                <input 
                type="file"
                 accept="image/*" 
                 className="hidden"
                 onChange={handleFileChange}
                  />
              </Label>
           
              
             
            </div>
            {/* profile form  */}
            <form onSubmit={handleSubmit} className="w-full md:w-auto space-y-4 shadow-lg p-5 rounded-lg bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className='block text-sm font-medium'>First Name</Label>
                        <Input
                         type='text' 
                         name="firstName" 
                           placeholder='John'
                           value= {updateUser.firstName}
                           onChange={handleChange}
                         className='w-full border rounded-lg px-3 py-2 mt-1'/>
                    </div>
                       <div>
                        <Label className='block text-sm font-medium'>Last Name</Label>
                        <Input 
                        type='text' 
                        name="lastName"
                          placeholder='Doe'
                          value= {updateUser.lastName}
                           onChange={handleChange}
                         className='w-full border rounded-lg px-3 py-2 mt-1'/>
                    </div>
                      
                </div>
                <div>
                    <Label className='block font-medium text-sm' >Email</Label>
                    <Input
                     type='email'
                       name="email" 
                       disabled 
                       value= {updateUser.email}
                        onChange={handleChange}
                       className='w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed' />
                </div>
                 <div>
                    <Label className='block font-medium text-sm' >Phone Number</Label>
                    <Input 
                    type='text' 
                     name="phoneNo"
                     placeholder='Enter your Contact No'
                     value= {updateUser.phoneNo}
                           onChange={handleChange}
                     className='w-full border rounded-lg px-3 py-2 mt-1 ' />
                </div>
                 <div>
                    <Label className='block font-medium text-sm' > Address</Label>
                    <Input 
                    type='text' 
                     name="address"
                     placeholder='Enter your Address'
                     value= {updateUser.address}
                           onChange={handleChange}

                     className='w-full border rounded-lg px-3 py-2 mt-1 ' />
                </div>
                <div className="flex flex-col md:flex-row gap-4 md:justify-between">
                   <div>
                    <Label className='block font-medium text-sm' >City</Label>
                    <Input 
                    type='text' 
                     name="city"
                     placeholder='Enter your City'
                     value= {updateUser.city}
                           onChange={handleChange}
                     className='w-full border rounded-lg px-3 py-2 mt-1 ' />
                </div>

                 <div>
                    <Label className='block font-medium text-sm' >Zip Code</Label>
                    <Input 
                    type='text' 
                     name="zipCode"
                     placeholder='Enter your ZipCode'
                     value= {updateUser.zipCode}
                           onChange={handleChange}
                     className='w-full border rounded-lg px-3 py-2 mt-1 ' />
                </div>
                </div> 
                                             
                <Button type='submit' className='w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg'>
                 {
                  loading? (
                  <>
                  Please Wait <Loader className="size-5 animate-spin"/>
                  </>) :
                  ('Update Profile')
                 }
                 </Button>
            </form>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="orders">
           <MyOrder/>
        </TabsContent>
      </Tabs>


    </div>
  );
};

export default Profile;
