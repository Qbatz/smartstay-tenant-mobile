import  { getAxios } from "../Config/AxiosConfig";

export default logoutSetup=async(data,token)=>{
    console.log(data)
    console.log(token)
    try{
        const axios = getAxios()
        const response =await axios.post('/v2/tenant/login/log-out', data, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        console.log(response)
        return response;
    }catch (error){
        console.log(error.response)
        return { status: error.response.status, message: error.response.data }
    }
}
