import AxiosConfig from "../Config/AxiosConfig"

 

export const verifyPhoneNo= async(phoneNo)=>{

    const data={
        mobile:phoneNo
    }

   const response=await AxiosConfig.post("/v2/tenant/user/verify-mobile", data)
   return response;
}

export const verifyOtp =async(phoneNo,otp,serialNo)=>{
    const data={
        mobileNo: phoneNo,
        serialNo: serialNo,
        otp: otp,
    }
    try{
         const response=await AxiosConfig.post("/v2/tenant/user/verify-otp", data)
    return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }
   
}
