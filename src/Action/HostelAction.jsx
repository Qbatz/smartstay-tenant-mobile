import AxiosConfig from "../Config/AxiosConfig";

export const hostelList=async(token)=>{
    try{
         const response= await AxiosConfig.get("/v2/tenant/hostels", {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return response.data;  
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }  
}

export const hostelDetails=async(hostelId,token)=>{
    try{
        const response=await AxiosConfig.get("/v2/tenant/hostels/" + hostelId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }
}

export const complaints=async(hostelId,token)=>{
    try{
        const response=await AxiosConfig.get('/v2/complaints/' + hostelId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    console.log(response)
    return response
    } catch (error){
        return{status: error.response.status, message: error.response.data}
    }
    

}


export const getComplaints=async(hostelId,complaintId,token)=>{
    try{
        const response=await AxiosConfig.get('/v2/complaints/' + hostelId + "/" + complaintId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }   
}

export const getAmenitiesList=async(hostelId,token)=>{
    try{
        const response =await AxiosConfig.get('/v2/amenities/' + hostelId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
       return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }

}

export const getAmenties=async(hostelId,amenityId,token)=>{
    const response=await AxiosConfig.get('/v2/amenities/' + hostelId + "/" +amenityId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return response;
}

export const deleteComplaint=async(hostelId,complaintId,token, reason)=>{
   

    const data={
        message: reason
    }
    console.log(data)
    try{
        console.log('/v2/complaints/' + hostelId + "/" + complaintId)
        const response=await AxiosConfig.delete('/v2/complaints/' + hostelId + "/" + complaintId, {
        headers: {
            Authorization: 'Bearer ' + token
        },
        data: {
            message: reason
        }
    }) 
    return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }
    
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

export const postRequestBedChange=async(hostelId,data,token)=>{
    try{
        const response=await AxiosConfig.post('/v2/bed/request-bedChange/' + hostelId, data, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return response;
    } catch(error){
        return{status: error.response.status, message: error.response.data}
    }  
}

export const postRquestAmenties=async(hostelId,token,amenityId)=>{
    try{
        const response=await AxiosConfig.post('/v2/amenities/request-amenity/' + hostelId + "/" + amenityId, {}, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }   
}

export const getNotification=async(hostelId,token)=>{
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

export const getPaymentList=async(hostelId,token)=>{

    try{
        const response=await AxiosConfig.get('/v2/invoices/' + hostelId, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    }catch(error){
        return {status: error.response.status, message: error.response.data}
    }
}

export const getInvoices=async(hostelId,invoiceId,token)=>{
    try{
        const response=await AxiosConfig.get('/v2/invoices/' +hostelId + "/" + invoiceId  ,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    }catch(error){
        return {status: error.response.status, message: error.response.data}
    }
}

export const getComplaintTypes=async(hostelId,token)=>{
    try{
        const response=await AxiosConfig('/v2/ComplaintType/all-complaintTypes/' + hostelId, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    }catch(error){
        return {status: error.response.status, message: error.response.data}
    }
}