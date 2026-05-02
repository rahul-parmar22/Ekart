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
import axios from "axios";
import { toast } from "sonner";
import { publicApi } from "@/api/axios";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handlechange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      
      setLoading(true)
      const res = await publicApi.post(
       "/user/register",
        formData,
        { headers: { "Content-Type": "application/json" } },
      );
      console.log(res.data);
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message, { position: "top-center" });
      }
    } catch (error) {   
      console.log(error);
      console.log(error.response?.data?.message || "Something went wrong");
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally{
      setLoading(false); 
    }
  };  

 return (
  <div className="min-h-screen flex justify-center items-center bg-red-100 px-4 sm:px-6">
    <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg shadow-lg">
      <CardHeader className="space-y-1 text-center sm:text-left">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Create your account
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Enter given detailes below to create you account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="grid gap-2">
              <Label htmlFor="firstName" className="text-sm sm:text-base">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="john"
                required
                value={formData.firstName}
                onChange={handlechange}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName" className="text-sm sm:text-base">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="doe"
                required
                value={formData.lastName}
                onChange={handlechange}
                className="text-sm sm:text-base"
              />
            </div>

          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm sm:text-base">
              Email
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              value={formData.email}
              onChange={handlechange}
              className="text-sm sm:text-base"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-sm sm:text-base">
                Password
              </Label>
            </div>

            <div className="relative">
              <Input
                id="password"
                name="password"
                placeholder="create a password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handlechange}
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

      <CardFooter className="flex-col gap-3">
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
            "Signup"
          )}
        </Button>

        <p className="text-center text-sm sm:text-base">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="hover:underline text-pink-800"
          >
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  </div>
);
};

export default Signup;
