import AxiosConfig from "../Config/AxiosConfig"

 

export const verifyPhoneNo= async(phoneNo)=>{
    try{
        const data={
        mobile:phoneNo
    }
   const response=await AxiosConfig.post("/v2/tenant/user/verify-mobile", data)
   return response;
    }catch(error){
            return{status: error.response.status, message: error.response.data}
    }   
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

export const generateToken = async (phone, serialNo) => {
    const data = {
        mobileNo: phone,
        serialNo: serialNo
    };

    try {
        const response = await fetch('https://tenentdevapi.qbatz.com/v2/tenant/user/token-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            return { success: false, status: response.status, message: errorBody };
        }

        const result = await response.text();   // or response.json() if backend returns JSON
        return { success: true, data: result };

    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const verifyMPin=async(data)=>{
    try{
        const response=await AxiosConfig.post('/v2/tenant/login/verify-Mpin', data)
        return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }
}

export const postMPin=async(data)=>{
    try{
        const response=await AxiosConfig.post('/v2/tenant/login/set-Mpin', data)
        return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }
}

