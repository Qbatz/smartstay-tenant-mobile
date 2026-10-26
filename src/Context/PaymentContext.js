import React,{createContext, useEffect, useState} from "react";

 export const paymentContexts=createContext();

const PaymentContext=(props)=> {

     
    const [invoiceList,setInvoiceList]=useState([])
    const [invoiceDetail,setInvoiceDetial]=useState(null)
    const [loading, setLoading]=useState(false)
    const [onlyInvoiceList,setOnlyInvoiceList]=useState([])

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

    const loadingFn=(value)=>{
        setLoading(value)
    }

//     const updateInvoiceListFn = (data, append = false) => {
//   setInvoiceList(prev => ({
//     ...data,
//     invoices: append
//       ? [...(prev?.invoices || []), ...(data?.invoices || [])]
//       : (data?.invoices || []),
//   }));
// };
// const updateInvoiceListFn = (data, append = false) => {
//   setInvoiceList(prev => {
//     const newData = data?.data ?? data;

//     return {
//       ...(append ? prev : {}),
//       ...newData,
//       invoices: append
//         ? [
//             ...(prev?.invoices || []),
//             ...(newData?.invoices || []),
//           ]
//         : (newData?.invoices || []),
//     };
//   });
// };
const updateInvoiceListFn = (data, append = false) => {
  setInvoiceList(prev => {
    const newData = data?.data ?? data;
    const newInvoices = newData?.invoices || [];

    let invoices;

    if (append && prev) {
      const existingInvoices = prev.invoices || [];

      // Replace duplicates using the invoice's unique ID
      const invoiceMap = new Map();

      existingInvoices.forEach(invoice => {
        invoiceMap.set(invoice.invoiceId, invoice);
      });

      newInvoices.forEach(invoice => {
        invoiceMap.set(invoice.invoiceId, invoice);
      });

      invoices = Array.from(invoiceMap.values());
    } else {
      invoices = newInvoices;
    }

    return {
      ...(append && prev ? prev : {}),
      ...newData,
      invoices,
    };
  });
};
      console.log(invoiceDetail)

    return<paymentContexts.Provider value={{updateInvoiceList:setInvoiceList,getInvoiceList:invoiceList,
        updateInvoice:invoiceDetailfn,getInvoiceDetail:invoiceDetail,updateLoading:loadingFn,getLoading:loading,
        updateOnlyInvoiceList: setOnlyInvoiceList,getOnlyInvoiceList:onlyInvoiceList
    }} >
        {props.children}
    </paymentContexts.Provider>

}
export default PaymentContext;