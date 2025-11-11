import { useContext } from "react"
import AxiosConfig from "../Config/AxiosConfig"

 

export const verifyPhoneNo= async(phoneNo)=>{

    const data={
        mobile:phoneNo
    }

   const response=await AxiosConfig.post("/v2/customers-users/verify-mobile", data)
   return response;
}

export const verifyOtp =async(phoneNo,otp,serialNo)=>{
    const data={
        mobileNo: phoneNo,
        serialNo: serialNo,
        otp: otp,

    }

    const response=await AxiosConfig.post("/v2/customers-users/verify-otp", data)
    return response;
}