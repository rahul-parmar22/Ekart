import React, { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader, Type } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { publicApi } from "@/api/axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch= useDispatch(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };


  const submitHandler = async (e) => {
    e.preventDefault();
    try {
         setLoading(true);
      const response = await publicApi.post(
        "/user/login",
        formData,
        { withCredentials:true,  //with credentials must chhe...jo aa nahi aapo to cookie ma refresh token  je login samye browser ma store thay chhe e nahi thay store // headers ni andar nahi aave...configuration chhe to header ni bahar aavshe
            //withcred:true means Browser ko bol rahe ho:: “Bhai, request ke saath cookies bhi bhejna aur server se aane wali cookies ko save bhi karna”
          headers: { "Content-Type": "Application/json"  } }, 
      );
      console.log(response.data);

      if (response.data.success) {
        navigate("/");
        dispatch(setUser(response.data.user))
        localStorage.setItem("accessToken", response.data.accessToken)
        localStorage.setItem('user', response.data.user.firstName)
        toast.success(response.data.message,{position:'top-center'} )
        
      }                      
    } catch (error) {    
       toast.error(error?.response?.data?.message || error.message,{position:'top-center'})
      console.log(error?.response?.data?.message || error.message);
    } finally{
        setLoading(false); 
    }
  };               

  return (
    <div className="min-h-screen flex justify-center items-center bg-red-200 px-4 sm:px-6">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg shadow-lg">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <CardTitle  className="text-xl sm:text-2xl font-bold">Login to your account</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter given detailes below to login your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                 className="text-sm sm:text-base"
              />
            </div>

            <div className="grid gap-2">
            <Label htmlFor="password" className="text-sm sm:text-base">
              Password
            </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="create a password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-12 text-sm sm:text-base"
                />
                {showPassword ? (
                  <EyeOff
                    onClick={() => setShowPassword(false)}
                   className="h-5 w-5 text-gray-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowPassword(true)}
                    className="h-5 w-5 text-gray-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                 />
                )}

                <div>{showPassword} </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className=" flex flex-col gap-3">
          <Button
            onClick={submitHandler}
            type="submit"
           className="w-full bg-pink-600 hover:bg-pink-500 text-sm sm:text-base"
         >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Please wait
              </>
            ) : (
              "Login"
            )}
          </Button>
          <p className="text-center text-sm sm:text-base">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
            className="hover:underline text-pink-800"   >
              Signup
            </Link>{" "}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
