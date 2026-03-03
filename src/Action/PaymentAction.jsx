import {getAxios} from "../Config/AxiosConfig";

export const getPaymentInvoiceDetail=async(hostelId,token,invoiceId)=>{
        try{
            const axios = getAxios()
            const response=await axios.get('/v2/invoices/invoice-details/' + hostelId + "/" + invoiceId, {
                headers: {
                    Authorization: ' Bearer ' + token
                }
            })
            return response;
        }catch (error){
             return{status: error.response.status, message: error.response.data}
        }
}

export const getPaymentReceiptDetails=async(hostelId,token,transactionId)=>{
    try{
        const axios = getAxios()
        const response= await axios.get('/v2/invoices/receipt-details/' + hostelId + "/" + transactionId, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    }catch (error){
         return{status: error.response.status, message: error.response.data}
    }
}

export const getInvoiceDownload=async(hostelId, invoiceId, token)=>{
    try{
        const axios=getAxios()
        const response=await axios.get('/v2/invoices/pdf/' + hostelId + "/" + invoiceId, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        console.log(response)
        return response;
    }catch (error){
        console.log(error)
        return{status: error.response.status, message: error.response.data}
    }
}

export const getReceiptDownload=async(hostelId, receiptId, token)=>{
    console.log(hostelId,receiptId)
    console.log(token)
    try{
        const axios=getAxios();
        const response=await axios.get("/v2/invoices/pdf/receipts/" + hostelId + "/" + receiptId, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        return response;
    }catch(error){
        console.log(error)
        return{status: error.response.status, message: error.response.data}
    }
}