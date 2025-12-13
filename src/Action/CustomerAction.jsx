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

export const getRequestRaised=async(hostelId, token)=>{
    console.log(token)
   try{
    const response=await AxiosConfig.get('/v2/tenant/hostels/requests/' + hostelId, {
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
        const response=await AxiosConfig.get('/v2/customer/rentDetails/' + hostelId , {
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
    console.log(hostelId);
    console.log(complaintId);
    console.log(token);
    console.log(formData);

    try {
        const response = await AxiosConfig.put(
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
        console.log(error?.response); // debug
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
        const response=await AxiosConfig.get('/v2/tenant/login/hostels-list/' + userId, {
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