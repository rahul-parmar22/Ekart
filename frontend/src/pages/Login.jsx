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
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

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
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        formData,
        { headers: { "Content-Type": "Application/json" } },
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
    <div className="min-h-screen flex justify-center items-center bg-red-200">
      <Card className="w-full max-w-sm ">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter given detailes below to login your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="create a password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                {showPassword ? (
                  <EyeOff
                    onClick={() => setShowPassword(false)}
                    className="h-5 text-gray-700 absolute bottom-2 right-5"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowPassword(true)}
                    className="h-5 text-gray-700 absolute bottom-2 right-5"
                  />
                )}

                <div>{showPassword} </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            onClick={submitHandler}
            type="submit"
            className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500 "
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
          <p>
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="hover:underline cursor-pointer text-pink-800 text-sm"
            >
              Signup
            </Link>{" "}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
