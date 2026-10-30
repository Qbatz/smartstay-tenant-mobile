import  { getAxios } from "../Config/AxiosConfig";

export const getNotification=async(hostelId,token, page=1,size=10)=>{
    console.log(hostelId)
    console.log(token)
    try{
        const axios = getAxios()
        const response=await axios.get('/v2/notifications/all-notifications/' + hostelId, {
            params:{
                page: page,
                size: size,
            },
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    }catch(error){
            return{status: error.response.status, message: error.response.data}
    }
}