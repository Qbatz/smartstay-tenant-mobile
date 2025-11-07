import React, { createContext, useState } from "react";
import AxiosConfig from "../Config/AxiosConfig";
import { storeData } from "../Utils/Storage";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [user, setUser] = useState(null);

  //  Send OTP
 const sendOtp = async (mobileNumber) => {
  try {
    const response = await AxiosConfig.post("/v2/customers-users/verify-mobile",
      { mobile: mobileNumber }
    );
     console.log("response", response);
     
    if (response.data?.success) {
      setMobile(mobileNumber);
      setOtpSent(true);
      return true; 
    } else {
      alert("Invalid mobile number");
      return false;
    }
  } catch (error) {
    console.log("Send OTP Error:", error);
    alert("Error sending OTP");
    return false;
  }
};


  //  Verify OTP
 const verifyOtp = async (mobile, otp) => {
  try {
    const response = await AxiosConfig.post("/v2/customers-users/verify-otp", {
      mobile,
      otp,
    });
    console.log("Verify OTP Response:", response?.data);

    if (response?.data?.success) {
      setUser(response?.data?.user);

      if (response?.data?.token) {
        await storeData("token", response?.data?.token);
        console.log("Token stored successfully!");
      }
      return true; 
    } 
    else {
      alert("Invalid OTP");
      return false;
    }
  } catch (error) {
    console.log("Verify OTP Error:", error);
    alert("Error verifying OTP");
    return false;
  }
};


  //  Resend OTP
  const resendOtp = async () => {
    try {
      await sendOtp(mobile);
      alert("OTP resent successfully");
    } catch (error) {
      alert("Error resending OTP");
    }
  };

  return (
    <LoginContext.Provider
      value={{
        mobile,
        otpSent,
        user,
        sendOtp,
        verifyOtp,
        resendOtp,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
