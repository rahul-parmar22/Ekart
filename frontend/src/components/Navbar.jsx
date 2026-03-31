import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
     
                        //DROPDOWN MENU: navbar na menu ne click karvathi khule bdha option tene dropdown menu kevay shadcn ma
const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const {cart}= useSelector(store=>store.product) //product store ma product and cart banne nakhela chhe to cart ne destructure karine lidhu chhe...etale jyare first time page load thay etale cart mathi value aave ane succes res aave etale tene usedispatch thi cart ma store karvi aapane ane ahiya pachhi e cart ni value male...jyare add karvi cart ma etale redux ma pan add thay and backend ma pan add thay axios dwara....pachhie backend thi res aave success to pachhi pachhu redux ma kaik karvi em loop chalya rakhe
  console.log(cart);                     
  const accessToken = localStorage.getItem("accessToken");
  const admin = user?.role === "admin" ? true : false
  const dispatch = useDispatch();
  const navigate= useNavigate();   // jyare koi fun ni page ne te fun run thya pachhi shift karvanu hoy tyare aa vapray
                                  //<Link> jyare koi div par, ke button par click karya pachhi page ne change karvu hoy like navbar ni andar na , footer ni andarna  badha click karvathi change thay page evi jagyae link tag no use thay 
                                  //<Navigate> aa tyare vapray jyare conditional based pagene redirect karvanu hoy tyare ane protected routes ma...like {!user && <Navigate to="/login" />}...pachhi aama callback fun aapine navigate no karvanu hoy...aa direct instantly redirect kare page ne.... .most of protected routes ma...ke user admin no hoy to route change kare user url ma to automatic direct redirect kare login page ma..
                                  //<Navigate> redirect kare page ne.. uparna bey url ma change kare ane pachhi page show thay em..aa direct par java de....
                                  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(null));
      }
    } catch (error) {
      console.log(error);
    }
  };
 

  return (
    <header className="bg-pink-50 fixed w-full z-20 border-b border-pink-200 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
        {/* logo section */}
        <div className="text-lg text-pink-600 flex items-center">
          <ShoppingCart className="size-9" />
          <span className=" font-bold ">KART</span>
        </div>

        {/* nav section  */}
        <nav className="flex gap-10 justify-between items-center">
          <ul className="flex gap-7 items-center text-xl font-semibold">
            <Link to={"/"}> 
              <li>Home</li>
            </Link>
            <Link to={"/products"}>
              <li>Products</li>
            </Link>
            {user && (
              <Link to={`/profile/${user._id}`}>
                <li>Hello, {user.firstName}</li>
              </Link>
            )}
             {admin && (
              <Link to={`/dashboard/sales`}>
                <li>Dashboard</li>
              </Link>
            )}
          </ul>
          <Link to={"/cart"} className="relative">
            <ShoppingCart />
            <span className="bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2">
              {cart?.items?.length}
            </span>
          </Link>
          {user ? (
            <Button onClick={logoutHandler} className="bg-pink-600 text-white cursor-pointer">
              Logout
            </Button>
          ) : (
            <Button onClick={()=>navigate('/login')} className="bg-linear-to-tl from-blue-600  to-purple-600  text-white cursor-pointer">
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
