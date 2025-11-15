import AxiosConfig from "../Config/AxiosConfig";

export const hostelList=async(token)=>{
     
    const response= await AxiosConfig.get("/v2/hostels", {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    console.log(response)
    return response.data;
    
}

export const hostelDetails=async(hostelId,token)=>{

    console.log(hostelId)
    const response=await AxiosConfig.get("/v2/hostels/" + hostelId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    console.log(response)
    return response;

}

export const complaints=async(hostelId,token)=>{
    const response=await AxiosConfig.get('/v2/complaints/' + hostelId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    console.log(response)
    return response

}

export const addComplaints=async()=>{
        const response=await AxiosConfig.post('/v2/complaints/{hostelId}')
}