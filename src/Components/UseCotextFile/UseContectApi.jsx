// ApiContext.js
import React, { createContext, useState } from "react";
import config from "../../Config/AxiosConfig";
import axios from "axios";

export const ApiContext = createContext(null);

export default function ApiProvider({ children }) {
  const [result, setResult] = useState(null);

//   const sendOtp = async (mobile) => {
//     try {
//       let res = await axios.post(`${config.apiBaseUrl}/v2/customers-otp/send`, {
//         mobileNo: mobile,
//       });
//       return res.data;
//     } catch (e) {
//       console.log("sendOtp error", e.response?.data || e);
//     }
//   };
const sendOtp = async (mobile) => {
  try {
    let res = await axios.post(
      `${config.apiBaseUrl}/v2/customers-users/verify-mobile`,{
        mobile: mobile
      }
    );
    return res.data;
  } catch(e) {
    console.log("sendOtp error", e.response?.data || e);
  }
}



  const verifyOtp = async (mobileNo, otp) => {
    try {
      const res = await axios.post(
        `${config.apiBaseUrl}/v2/customers-users/verify-otp`,
        { mobileNo, otp }
      );
      setResult(res.data);
      return res.data; 
    } catch (err) {
      console.log("OTP Error:", err.response?.data || err);
    }
  };

  return (
    <ApiContext.Provider value={{ sendOtp, verifyOtp, result }}>
      {children}
    </ApiContext.Provider>
  );
}
