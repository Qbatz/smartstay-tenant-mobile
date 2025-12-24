import AxiosConfig from "../Config/AxiosConfig";

export const getPaymentInvoiceDetail=async(hostelId,token,invoiceId)=>{
        try{
            const response=await AxiosConfig.get('/v2/invoices/invoice-details/' + hostelId + "/" + invoiceId, {
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
        const response= await AxiosConfig.get('/v2/invoices/receipt-details/' + hostelId + "/" + transactionId, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    }catch (error){
         return{status: error.response.status, message: error.response.data}
    }
}