import React,{createContext, useState} from "react";

 export const compliantContexts=createContext();

const ComplaintContext=(props)=> {

    const [complaintsList, setComplaintsList] = useState([]);
    const [complaintComments,setComplaintComments]=useState([])
    const [complaintDetail,setComplaintDetails]=useState()
    const [newComplaintUpdates,setComplaintNewUpdates]=useState([])

    console.log(complaintComments)

    

    return<compliantContexts.Provider value={{ updateComplaintList:setComplaintsList, getComplaintList:complaintsList,
        updateComments:setComplaintComments,getComplaintComments:complaintComments,updateComplaint:setComplaintDetails,
         getComplaintDetail:complaintDetail, complaintUpdates:setComplaintNewUpdates, NewComplaintUpdates:newComplaintUpdates
    }} >
        {props.children}
    </compliantContexts.Provider>

}
export default ComplaintContext;