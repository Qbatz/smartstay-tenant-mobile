import { getAxios } from "../Config/AxiosConfig";

export const hostelList = async (token) => {
    try {
        const axios = getAxios()
        const response = await axios.get("/v2/tenant/hostels", {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response.data;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }
}

export const hostelDetails = async (hostelId, token) => {
    try {
        const axios = getAxios()
        const response = await axios.get("/v2/tenant/hostels/" + hostelId, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }
}

export const complaints = async (hostelId, token) => {
    try {
        const axios = getAxios()
        const response = await axios.get('/v2/complaints/' + hostelId, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }


}


export const getComplaints = async (hostelId, complaintId, token) => {
    try {
        const axios = getAxios()
        const response = await axios.get('/v2/complaints/' + hostelId + "/" + complaintId, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }
}

export const getAmenitiesList = async (hostelId, token) => {
    try {
        const axios = getAxios()
        const response = await axios.get('/v2/amenities/' + hostelId, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }

}

export const getAmenties = async (hostelId, amenityId, token) => {
    const axios = getAxios()
    const response = await axios.get('/v2/amenities/' + hostelId + "/" + amenityId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return response;
}

export const deleteComplaint = async (hostelId, complaintId, token, reason) => {


    const data = {
        message: reason
    }
    try {
        const axios = getAxios()
        console.log('/v2/complaints/' + hostelId + "/" + complaintId)
        const response = await axios.delete('/v2/complaints/' + hostelId + "/" + complaintId, {
            headers: {
                Authorization: 'Bearer ' + token
            },
            data: {
                message: reason
            }
        })
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }

}

export const addComment = async (complaintId, token, data) => {
    console.log(complaintId, token, data)
    const axios = getAxios()
    const response = await axios.post('/v2/complaints/comment/' + complaintId, data, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return response;
}

export const postRequestBedChange = async (hostelId, data, token) => {
    try {
        const axios = getAxios()
        const response = await axios.post('/v2/bed/request-bedChange/' + hostelId, data, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }
}

export const postRquestAmenties = async (hostelId, token, amenityId) => {
    try {
        const axios = getAxios()
        const response = await axios.post('/v2/amenities/request-amenity/' + hostelId + "/" + amenityId, {}, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }
}


// export const getPaymentList = async (hostelId, token, startDate, endDate, dateFilter,page,size) => {

//     console.log("moorthi",hostelId,startDate,endDate,page,size)
//     try {
//         const axios = getAxios()
//         const config = {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         };

//         const params = {};

//         if (dateFilter) {
//             params.dateFilterOption = dateFilter;
//         }

//         if(page){
//             params.page= page
//         }

//         if(size){
//             params.size = size
//         }

//         if (startDate !== "DD-MM-YYYY" && endDate !== "DD-MM-YYYY") {
//             params.startDate = startDate;
//             params.endDate = endDate;
//         }

//         if (Object.keys(params).length > 0) {
//             config.params = params;
//         }

//         console.log("config",config)

//         const response = await axios.get(`/v2/invoices/${hostelId}`, config);
//        console.log("Request config:", response?.config);
// console.log("Request params:", response?.config?.params);
// console.log("Backend response:", response?.data);
//         return response;
//     } catch (error) {
//         return { status: error.response.status, message: error.response.data }
//     }
// }


export const getPaymentList = async (
  hostelId,
  token,
  startDate,
  endDate,
  dateFilter,
  page,
  size
) => {
  try {
    console.log("kiran",page,size)
    const axios = getAxios();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const params = {};

    if (dateFilter) {
      params.dateFilterOption = dateFilter;
    }

    if (page !== undefined && page !== null) {
      params.page = page;
    }

    if (size !== undefined && size !== null) {
      params.size = size;
    }

    // Send dates only when both are provided
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    if (Object.keys(params).length > 0) {
      config.params = params;
    }

    const response = await axios.get(
      `/v2/invoices/${hostelId}`,
      config
    );
    console.log(response)

    return response;
  } catch (error) {
    console.log("kamamla",error)
     console.log("Error status:", error.response?.status);
  console.log("Error data:", error.response?.data);
  console.log("Error URL:", error.config?.url);
  console.log("Error params:", error.config?.params);
    return {
      status: error.response?.status || 500,
      message: error.response?.data || error.message,
    };
  }
};

export const getInvoices = async (hostelId, invoiceId, token) => {
    try {
        const axios = getAxios()
        const response = await axios.get('/v2/invoices/' + hostelId + "/" + invoiceId, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }
}

export const getComplaintTypes = async (hostelId, token) => {
    try {
        const axios = getAxios()
        const response = await axios('/v2/ComplaintType/all-complaintTypes/' + hostelId, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data }
    }
}