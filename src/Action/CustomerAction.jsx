import AxiosConfig from "../Config/AxiosConfig";

export const customerDetails=async(token)=>{
    try{
        const response=await AxiosConfig.get("/v2/customer/details", {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return response;
    }catch(error){
            return {status: error.response.status, message: error.response.data}
    } 
}

export const editProfile=async(token,formData)=>{
    try{
        const response=await AxiosConfig.put('/v2/customer/', formData, {
        headers: {
            Authorization: 'Bearer ' + token,
            "Content-Type": "multipart/form-data",
        }
    })   
    return response;    

    }catch(error){
        return {status: error.response.status, message: error.response.data}
        
    }
}

export const postComplaint=async(hostelId,token,formData)=>{

    console.log(formData)
    try{
         const response=await AxiosConfig.post('/v2/complaints/' + hostelId, formData,   {
            headers: {
                Authorization: 'Bearer ' + token,
                 "Content-Type": "multipart/form-data",
            }
        })
        console.log(response)
        return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }     
}