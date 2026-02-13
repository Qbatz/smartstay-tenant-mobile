import { getAxios } from "../Config/AxiosConfig";

export const customerDetails=async(token)=>{
    try{
        const axios = getAxios()
        const response=await axios.get("/v2/customer/details", {
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
        const axios = getAxios()
        const response=await axios.put('/v2/customer/', formData, {
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
   
    try{
        const axios = getAxios()
         const response=await axios.post('/v2/complaints/' + hostelId, formData,   {
            headers: {
                Authorization: 'Bearer ' + token,
                 "Content-Type": "multipart/form-data",
            },
        })
        return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }     
}

export const getRequestRaised=async(hostelId, token)=>{
   try{
    const axios = getAxios()
    const response=await axios.get('/v2/tenant/hostels/requests/' + hostelId, {
        headers: {
            Authorization: 'Bearer ' + token,
        }
    })
    return response;
   }catch(error){
        return{status: error.response.status, message: error.response.data}
   }
}

export const getRentalDetials=async(hostelId,token)=>{
    try{
        const axios = getAxios()
        const response=await axios.get('/v2/customer/rentDetails/' + hostelId , {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }

}

export const putComplaint = async (hostelId, complaintId, token, formData) => {


    try {
        const axios = getAxios()
        const response = await axios.put(
            `/v2/complaints/${hostelId}/${complaintId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        return response;

    } catch (error) {
        return { 
            status: error.response?.status, 
            message: error.response?.data 
        };
    }
};


// export const putComplaint=async(hostelId,complaintId,token,formData)=>{
//     console.log(hostelId)
//     console.log(complaintId)
//     console.log(token)
//     console.log(formData)
//     try{
//         const response=await AxiosConfig.put('/v2/complaints/' +hostelId + "/" + complaintId, formData, {
//             headers: {
//                 Authorization: 'Bearer ' + token,
//                 "Content-Type": "application/json"
//             }
//         } )
//         return response;
//     }catch(error){
//         return{status: error.response.status, message: error.response.data}
//     }
// }

// export const getHostelRentalDetails = async (userId, token) => {
//     console.log(userId);
//     console.log(token);

//     try {
//         const response = await AxiosConfig.post(
//             `/v2/tenant/login/hostels-list/${userId}`,
//             {},   // body (empty because POST requires a body)
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         return response;
//     } catch (error) {
//         console.log(error.response);
//         return { status: error.response?.status, message: error.response?.data };
//     }
// };


export const getHostelRentalDetails=async(userId,token)=>{
    console.log(userId)
    console.log(token)
    try{
        const axios = getAxios()
        const response=await axios.get('/v2/tenant/login/hostels-list/' + userId, {
            headers: {
                Authorization: "Bearer " + token
            }
        } )
        return response;
    }catch(error){
        console.log(error.response)
         return{status: error.response.status, message: error.response.data}
    }

}

export const getComplaintsUpdates=async(hostelId,token, complaintId)=>{
    try{
        const axios=getAxios()
        const response=await axios.get('/v2/complaints/updates/' + hostelId + "/" + complaintId , {
            headers: {
                Authorization: "Bearer " + token
            }
        }) 
        return response;
    }catch(error){
        console.log(error.response)
         return{status: error.response.status, message: error.response.data}
    }
}

export const deleteImage=async(imageId,complaintId,token,hostelId)=>{
        try{
            const axios=getAxios()
            const response=await axios.delete('/v2/complaints/image/' + complaintId + "/" + hostelId + "/" + imageId , {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
        return response;
        }catch(error){
            console.log(error.response)
            return{status: error.response.status, message: error.response.data}
        }
}