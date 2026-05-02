import React from 'react'
import { Button } from './components/ui/button.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Verify from './pages/Verify.jsx'
import Error from './pages/Error.jsx'
import Navbar from './components/Navbar.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import Home from './pages/Home.jsx'
import Footer from './components/Footer.jsx'
import Profile from './pages/Profile.jsx'
import Products from './pages/Products.jsx'
import Cart from './pages/Cart.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminSales from './pages/admin/AdminSales.jsx'
import AdminProduct from './pages/admin/AdminProduct.jsx'
import AddProducts from './pages/admin/AddProduct.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import ShowUserOrders from './pages/admin/ShowUserOrders.jsx'
import AdminUser from './pages/admin/AdminUser.jsx'
import UserInfo from './pages/admin/UserInfo.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import SingleProduct from './pages/SingleProduct.jsx'
import AddressForm from './pages/AddressForm.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'


const router = createBrowserRouter([
  {
    path:'/', 
    element:<><Navbar/><Home/><Footer/></> 
  },         
  {
    path:'/signup',
    element:<><Signup/></>   //fragment unnecessary chhe... only direct <Signup/> rakhi shako darek jagyae jya single element chhe tyathi remove
  },
  {
path:'/login',
element:<><Login/></>
  },
  {
    path:'/verify',
    element: <><Verify/></> 
  }, 
  {
    path:'/verify/:token',     //verify/isdfhsf  means verify/ pachhi je pan hoy te badhane token ma nakhi dyo em...  params ma aa  badhu token ma aave {token} = useParams(); 
    element:<><VerifyEmail/></>
  },
  {                       //tab niche etale nakhyu because order pachhi aa order tab ma user ne redirect karvano hto to tyare different url joie....same url pas karo to profile page khule ...url page nahi mate...
    path:'/profile/:userId/:tab', //user aa url nakhe tyare jo user login hoy toj dekahde nahito direct login page par redirect kare user ne..ane jo aa protected route no lagaviye to profile page par user hoy ane logout kare to pan profile page haji re
    element: <ProtectedRoute><Navbar/><Profile/></ProtectedRoute> 
  }, 
    {                                                                
    path:'/products',
    element: <><Navbar/><Products/></> 
  }, 
      {                                                                
    path:'/products/:id',
    element: <><Navbar/><SingleProduct/></> 
  }, 
    {
    path:'/cart', //first time user hoy ane cart par click kare to login page par redirect thay..ane tya registier no hoy to register kare ane pachhi cart open thay
    element: <ProtectedRoute><Navbar/><Cart/></ProtectedRoute> 
  }, 
 
    {
    path:'/address',
    element: <ProtectedRoute><AddressForm/></ProtectedRoute> 
  },
  {
    path:'/order-success',
    element: <ProtectedRoute><OrderSuccess/></ProtectedRoute> 
  },

  {
    path:'dashboard',
    element:  <ProtectedRoute adminOnly={true}> <Navbar/><Dashboard/> </ProtectedRoute>,
    children:[ //aa children badha outlet ma aavshe
      {
        path:'sales',
        element:<AdminSales/>
      },        
         {
        path:'add-product',
        element:<AddProducts/>
      },
         {
        path:'products',
        element:<AdminProduct/>
      },
         {
        path:'orders',
        element:<AdminOrders/>
      },                   
         {
        path:'users/orders/:userId',
        element:<ShowUserOrders/>
      },
               {
        path:'users',
        element:<AdminUser/>
      },
               {
        path:'users/:id',
        element:<UserInfo/>
      }
    ]       
  },
  {
    path:'*',
    element:<><Error/></>
  }
])



const App = () => {
  return (  
   <RouterProvider router={router} />
  )
} 

export default App
