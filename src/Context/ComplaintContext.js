import React,{createContext, useState} from "react";

 export const compliantContexts=createContext();

const ComplaintContext=(props)=> {

    const [complaintsList, setComplaintsList] = useState([]);
    const [complaintComments,setComplaintComments]=useState([])
    const [complaintDetail,setComplaintDetails]=useState()
    const [newComplaintUpdates,setComplaintNewUpdates]=useState([])
    const[onlyComplaintList,setOnlyComplaintList]=useState([])

    console.log(complaintComments)

    function complaintListfn(value){
        setOnlyComplaintList(value)
    }

    

    return<compliantContexts.Provider value={{ updateComplaintList:setComplaintsList, getComplaintList:complaintsList,
        updateComments:setComplaintComments,getComplaintComments:complaintComments,updateComplaint:setComplaintDetails,
         getComplaintDetail:complaintDetail, complaintUpdates:setComplaintNewUpdates, NewComplaintUpdates:newComplaintUpdates,
         updateonlyComplaintList:complaintListfn,getOnlyComplaintList:onlyComplaintList
    }} >
        {props.children}
    </compliantContexts.Provider>

}
export default ComplaintContext;