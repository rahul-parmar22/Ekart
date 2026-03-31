import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  const VerifyEmail = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/verify",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        setStatus("✅ Email verified Successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setStatus("❌ Verifcation failed. Please try again");
      //console.log(error.response.data.message)
    }
  };

  useEffect(() => {
    VerifyEmail();  //aa underline na solution mate niche comments jovo
  }, [token]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden ">
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md ">
          <h2 className="text-xl font-semibold text-gray-800">{status}</h2>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;


//learning things:
//ahi useeffect ma niche warning aave chhe karan ke verifyemail ma setstate thay chhe to eslint(sirf AST (Abstract Syntax Tree) analyze karta hai...aa code no run kare ) to aa eslint tree jove ane VerifyEmail ke andar setStatus() hai..to Rule bolta hai: "Effect ke andar state update indirectly ho raha hai".. to mate e line batave..karan ke eslint ne aa fun ma Async hai ya nahi — usko deeply track nahi karta...ene no khabar hoy ke andar async fun chhe to setstatus pachhi thay chhe evi ene no kahabr hoy ..ene lage ke direct pela setatus set thay chhe to mate aa line aave...
//pan e line ne remove karvi hoy to useefecet ma reference aapo chho eni jagyae direct verifyemail fun aakho lakhi nakhvo to e line by line jo to tya async chhe e khabar pade ne error no aave
//token niche line chhe to useeffect ma eslint ne lage ke ama to only fun chhe ..token to dekhatu nathi..to token ni jagyae aa akho fun dependency ma nakho to change thya to ...pan aa loop creat  kare..aavu no karvu koi di ..pan jo tene remove karvi hoy to if(token){verifyEmail()} to e samje ke token hoy to chale nahi to nahi em..
//useParams() wo object return karta hai to always destructure {token}=useparams  , write token etc in braces
//useeffect ma useeffect(()=>{ logic })  ; ahi logic lakhyu tya direct function nu logic lakhva mandvu nahi...teni andar function banavvo ka pacchi fun bahar banavine useeffectma pass kari devo
//header mokalti valkhte authorization ma "Bearer token"  bearer lakhvanu no bhulvu
//error catch block ma aave to exact aapno moklelo response mate error.response.data.message ma male to te use karvo to aapanane khabar pade ke controller na kaya part ma kya logic ni errro chhe...nahi to status code pramane bydefault sentence api de browser jo onlu error.message karo to o
