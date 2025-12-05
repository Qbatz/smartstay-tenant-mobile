import React,{createContext, useState} from "react";

 export const compliantContexts=createContext();

const ComplaintContext=(props)=> {

    const [complaintsList, setComplaintsList] = useState([]);

    console.log(complaintsList)

    

    return<compliantContexts.Provider value={{ updateComplaintList:setComplaintsList, getComplaintList:complaintsList
         
    }} >
        {props.children}
    </compliantContexts.Provider>

}
export default ComplaintContext;