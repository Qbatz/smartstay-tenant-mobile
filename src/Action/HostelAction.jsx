import AxiosConfig from "../Config/AxiosConfig";

export const hostelList=async(token)=>{
     
    const response= await AxiosConfig.get("/v2/tenant/hostels", {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return response.data;   
}

export const hostelDetails=async(hostelId,token)=>{

    console.log(hostelId)
    const response=await AxiosConfig.get("/v2/tenant/hostels/" + hostelId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
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
        console.log(error.response)
    }
       
      
}

export const getComplaints=async(hostelId,complaintId,token)=>{
    const response=await AxiosConfig.get('/v2/complaints/' + hostelId + "/" + complaintId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return response;
}

export const assignAmenities=async(hostelId,token)=>{

    const response =await AxiosConfig.get('/v2/amenities/assigned/' + hostelId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    console.log(response)
    return response;
}

export const unassignAmeties=async(hostelId, token)=>{
    const response=await AxiosConfig.get('/v2/amenities/unassigned/' + hostelId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return response;
}

export const getAmenties=async(hostelId,amenityId,token)=>{
    const response=await AxiosConfig.get('/v2/amenities/' + hostelId + "/" +amenityId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return response;
}

export const deleteComplaint=async(hostelId,complaintId,token)=>{
    const response=await AxiosConfig.delete('/v2/complaints/' + hostelId + "/" + complaintId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }) 
    return response;
}

export const addComment=async(complaintId,token,data)=>{
    const response=await AxiosConfig.post('/v2/complaints/comment/' + complaintId, data, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    console.log(response)
    return response;
}