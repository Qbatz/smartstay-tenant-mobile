import  { getAxios } from "../Config/AxiosConfig";

export const getNotification=async(hostelId,token)=>{
    console.log(hostelId)
    console.log(token)
    try{
        const axios = getAxios()
        const response=await axios.get('/v2/notifications/all-notifications/' + hostelId, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    }catch(error){
            return{status: error.response.status, message: error.response.data}
    }
}