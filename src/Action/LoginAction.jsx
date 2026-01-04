import { getAxios } from "../Config/AxiosConfig"
import { LoginContexts } from "../Context/LoginContext";
import { BASE_URL } from "../Utils/Constant";



export const verifyPhoneNo = async (phoneNo) => {
    try {
        const data = {
            mobile: phoneNo
        }
        // const response = await AxiosConfig.post("/v2/tenant/user/verify-mobile", data)
        const axios = getAxios();
        const res = await axios.post("/v2/tenant/user/verify-mobile", data)
        return res;
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return { status: error.response.status, message: error.response.data }
    }
}

export const verifyOtp = async (phoneNo, otp, ) => {
    const data = {
        mobileNo: phoneNo,
        otp: otp,
    }
    try {
        const axios = getAxios();
        const response = await axios.post("/v2/tenant/user/verify-otp", data)
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }

}

export const getToken = async (data) => {
    try {
        const axios = getAxios();
        const response = await axios.post('/v2/tenant/login/request-token', data)
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }

}


export const verifyMPin = async (data) => {
    try {
        const axios = getAxios();
        const response = await axios.post('/v2/tenant/login/verify-Mpin', data)
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }
}

export const postMPin = async (data) => {
    try {
        const axios = getAxios();
        const response = await axios.post('/v2/tenant/login/set-Mpin', data)
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }
}

export const postResendOtp = async (userId) => {
    console.log("******")
    console.log(userId)
    try {
        const axios = getAxios();
        const response = await axios.post('/v2/tenant/user/resend-otp/' + userId)
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }

}

export const updateFCMToken = async (xuid, token, authToken) => {
    const data = {
        xuid: xuid,
        fcmToken: token
    }

    console.log("data", data)

    try {
        const axios = getAxios();
        const response = await axios.post('/v2/config/update-fcm', data, {
            headers: {
                Authorization: 'Bearer ' + authToken
            }
        })
        console.log(response)
        return response;
    } catch (error) {
        console.log(error)
        return { status: error.response.status, message: error.response.data }
    }
}

