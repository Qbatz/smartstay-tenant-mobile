import React,{createContext, useEffect, useState} from "react";

 export const paymentContexts=createContext();

const PaymentContext=(props)=> {

     
    const [invoiceList,setInvoiceList]=useState([])
    const [invoiceDetail,setInvoiceDetial]=useState(null)

    console.log(invoiceDetail)

   useEffect(() => {
  if (invoiceDetail) {
    console.log('Invoice detail available:', invoiceDetail);
  }
}, [invoiceDetail]);

    const invoiceDetailfn=(value)=>{
        console.log(value)
        setInvoiceDetial(value)
      
    }

      console.log(invoiceDetail)

    return<paymentContexts.Provider value={{updateInvoiceList:setInvoiceList,getInvoiceList:invoiceList,
        updateInvoice:invoiceDetailfn,getInvoiceDetail:invoiceDetail
    }} >
        {props.children}
    </paymentContexts.Provider>

}
export default PaymentContext;