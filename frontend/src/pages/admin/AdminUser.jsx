import { Input } from "@/components/ui/input";
import axios from "axios";
import { Edit, Eye, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import userLogo from '/public/defaultProfilePic.png'
//import ram from '../../../public/defaultProfilePic.png' //aa real path chhe..to folder find karva mate ke kya chhe, parent ma 1 step , 2 step, 3 step pachhal kem javu to aa dot ne use karela chhe to joi levu ek ek dot and / mukine check kartu javu... 
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(""); 
  const navigate = useNavigate()


   const filteredUsers = users?.filter(user=>
     `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    ); 





  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/user/all-user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );  
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  console.log(users);
  
  return (
    <div  className="pl-[350px] py-20 pr-20 mx-auto">
      <h1 className="font-bold text-2xl">User Management</h1>
      <p>View and manage registered users</p>
      <div className="flex relative w-[350px] mt-6 ">
        <Search className="absolute left-2 top-1 text-gray-600 " />
        <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search Userse" className="pl-10" />
      </div>
      <div className= "max-w-7xl grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7 mt-7 bg-amber-200 ">
        {
          filteredUsers.map((user,index)=>{
            return <div key={index} className="bg-pink-100 p-5 rounded-lg">
              <div className="flex items-center gap-2">
                <img src={user?.profilePic || userLogo } alt="userProfilePic" className="rounded-full w-16 aspect-square object-cover  border-pink-600" />
                <div>
                  <h1 className="font-semibold">{user?.firstName} {user?.lastName}</h1>
                <h3 className="break-all" >{user?.email}</h3>
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <Button onClick = {()=>navigate(`/dashboard/users/${user?._id}`)} variant="outline" ><Edit/>Edit </Button>
                <Button onClick={()=> navigate(`/dashboard/users/orders/${user?._id}`) } ><Eye/>Show Order</Button>
              </div>
            </div>
          })
        }
      </div>
    </div>
  );
};

export default AdminUser;
