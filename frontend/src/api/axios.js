import axios from "axios";

export const publicApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASEURL}/api/v1`,
});

export const privateApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASEURL}/api/v1`,
  withCredentials: true,   //  //withcredentials jya jya aapela chhe tya tya khas aapvana ...server.js ma , login forntnend api call karvi tya,login backend contorller jya chhe tya,  ane ahiya .... 
});
 
privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

privateApi.interceptors.response.use(
  //✅ Response interceptor: error catch karta hai //refresh token use karta hai // request retry karta hai
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (  error.response && error.response.status === 401 && !originalRequest._retry) {  // condition etale chhe ke jo ek var 401 aavyu to retry thay ane pachhu retry ma pan 401 aavyu to aa ek loop banine infine request moklya kare to very bad...like jyare refresh token j expire thai gyu hoy tyare aa situation aave  to mate aa conditino ke jo ek var retry karyu to biji var mate reject...
      originalRequest._retry = true;                                             //upar condition ma _retry ka role: ek request ko sirf 1 baar refresh allow..dubara fail hua → direct reject

      //refresh call
      const res = await privateApi.post("/user/refreshAccessToken", {});  
      
      const newAccessToken = res.data.accessToken;
console.log("🔄 New Access Token Generated:", newAccessToken);

      //save new token
      localStorage.setItem("accessToken", newAccessToken);

      //retry original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return privateApi(originalRequest);
    }
    return Promise.reject(error);
  },
);
