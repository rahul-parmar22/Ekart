import { Input } from "@/components/ui/input";
import { Edit, Eye, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import userLogo from '/public/defaultProfilePic.png'
//import ram from '../../../public/defaultProfilePic.png' //aa real path chhe..to folder find karva mate ke kya chhe, parent ma 1 step , 2 step, 3 step pachhal kem javu to aa dot ne use karela chhe to joi levu ek ek dot and / mukine check kartu javu... 
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { privateApi } from "@/api/axios";

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
      const res = await privateApi.get(
       "/user/all-user",
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
    <div  className="p-4 md:p-6 lg:p-10 mt-32 md:mt-0">
      <h1 className="font-bold text-2xl">User Management</h1>
      <p>View and manage registered users</p>
      <div className="flex relative w-full max-w-sm mt-6 ">
        <Search className="absolute left-2 top-1 text-gray-600 " />
        <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search Userse" className="pl-10" />
      </div>
      <div className= " max-w-7xl grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-7">
        {
          filteredUsers.map((user,index)=>{
            return <div key={index} className="bg-pink-100 p-4 sm:p-5 rounded-lg flex flex-col justify-between h-full">
              <div className="flex items-center gap-3">
                <img src={user?.profilePic || userLogo } alt="userProfilePic" className="rounded-full w-16 aspect-square object-cover  border-pink-600" />
                <div>
                  <h1 className="font-semibold">{user?.firstName} {user?.lastName}</h1>
                <h3 className="break-all" >{user?.email}</h3>
                </div>
              </div>

              <div className="flex gap-3 mt-4 flex-wrap">
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
