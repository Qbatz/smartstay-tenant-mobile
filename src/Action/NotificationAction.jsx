import AxiosConfig from "../Config/AxiosConfig";

export const getNotification=async(hostelId,token)=>{
    console.log(hostelId)
    console.log(token)
    try{
        const response=await AxiosConfig.get('/v2/notifications/all-notifications/' + hostelId, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    }catch(error){
            return{status: error.response.status, message: error.response.data}
    }
}