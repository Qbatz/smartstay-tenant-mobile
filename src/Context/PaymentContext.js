import React,{createContext, useState} from "react";

 export const paymentContexts=createContext();

const PaymentContext=(props)=> {

     
    const [invoiceList,setInvoiceList]=useState([])
    const [invoiceDetail,setInvoiceDetial]=useState()

    return<paymentContexts.Provider value={{updateInvoiceList:setInvoiceList,getInvoiceList:invoiceList,
        updateInvoice:setInvoiceDetial,getInvoiceDetail:invoiceDetail
    }} >
        {props.children}
    </paymentContexts.Provider>

}
export default PaymentContext;