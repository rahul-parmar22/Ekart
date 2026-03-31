import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userLogo from "/public/defaultProfilePic.png";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "@/redux/userSlice";

const UserInfo = () => {
  const navigate = useNavigate();
  const [updateUser, setUpdateUser] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  //const { user } = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.id;
  const dispatch = useDispatch(); 

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);

    setFile(selectedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    }); //preview only
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    try {
      setLoading(true);

      //use FormData for text + file
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file); //image file for backend multer //ahi name shu aapvu te khas khyal rakhvo...
      }

      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
         dispatch(setUser(res.data.user)); //jo aa no kro to backend ma change to thai jay ...pan je component ma ke page ma data redux thi lavine show karo chho te component ma old data show kare ane je page ma data direct api call karine valo chho tya j only real data show thay...current working hoy tyare redux ma change no thay pan jyare biji var login karo aakhu new tyare to pachhi redux ma new updtae data store thay karan ke redux ma first time store karavti vakhte pan data backend thi aavyo hoy to tyrae updated data aave pan currently working hoy tyare update no thay redux no data tena mate aa line lakhvi pade 
      }

      console.log(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/user/get-user/${userId}`,
      );
      if (res.data.success) {
        setUpdateUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserDetails();
  }, []);
  console.log(updateUser);
  return (
    <div className="pt-5 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
          <div className="flex justify-between gap-10">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />{" "}
            </Button>
            <h1 className="font-bold mb-7  text-2xl text-gray-800">
              Update Profile
            </h1>
          </div>
          <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
            {/* profile picture  */}
            <div className="flex flex-col items-center">
              <img
                src={updateUser?.profilePic || userLogo}
                alt="defaultProfilePic"
                className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"
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
            <form
              onSubmit={handleSubmit}
              className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={updateUser?.firstName || ""} //aa  || "" no karo to react warning aape jo aa remove karo etale khabar pade..starting ma value null che ane e api thi data aavya pachhi input ma set thay chhe to react ne lage ke value starting ma nati to e component uncontrolled chhe ane have value aavi state thi to react ne lage ke uncontroller component ne controlled thi change karo chho value to error ape..niche badha input ma sudharo kari nakhvo...
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={updateUser?.lastName}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>
              <div>
                <Label className="block font-medium text-sm">Email</Label>
                <Input
                  type="email"
                  name="email"
                  disabled
                  value={updateUser?.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <Label className="block font-medium text-sm">
                  Phone Number
                </Label>
                <Input
                  type="text"
                  name="phoneNo"
                  placeholder="Enter your Contact No"
                  value={updateUser?.phoneNo}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 "
                />
              </div>
              <div>
                <Label className="block font-medium text-sm"> Address</Label>
                <Input
                  type="text"
                  name="address"
                  placeholder="Enter your Address"
                  value={updateUser?.address}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 "
                />
              </div>
              <div className="flex justify-between">
                <div>
                  <Label className="block font-medium text-sm">City</Label>
                  <Input
                    type="text"
                    name="city"
                    placeholder="Enter your City"
                    value={updateUser?.city}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 "
                  />
                </div>

                <div>
                  <Label className="block font-medium text-sm">Zip Code</Label>
                  <Input
                    type="text"
                    name="zipCode"
                    placeholder="Enter your ZipCode"
                    value={updateUser?.zipCode}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 "
                  />
                </div>
              </div>
              <div className="flex gap-3 items-center ">
                <Label className="block text-sm font-medium">Role : </Label>
                <RadioGroup
                 value={updateUser?.role} 
                 onValueChange = {(value)=>setUpdateUser({...updateUser, role:value})}
                 className="flex items-center">
                  <div className=" flex items-center space-x-2 ">
                    <RadioGroupItem value='user' id='user' />
                    <Label htmlFor='user'>User</Label>
                  </div>
                    <div className=" flex items-center space-x-2 ">
                    <RadioGroupItem value='admin' id='admin' />
                    <Label htmlFor='admin'>Admin</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button
                type="submit"
                className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg"
              >
                {loading ? (
                  <>
                    Please Wait <Loader className="size-5 animate-spin" />
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
