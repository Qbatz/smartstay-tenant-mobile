import React,{createContext, useState} from "react";
import { getComplaints, hostelDetails } from "../Action/HostelAction";

 export const UsersContext=createContext();

const UserContext=(props)=> {


    const [complaint, setcomplaint]=useState();
    const [HostelDetail,setHostelDetail]=useState();
    const [hostelList,setHostelList]=useState([])
     const [customer, setCustomers] = useState()
     const [requestRaised,setUpdateRequest]=useState([])



   
    function jumpcomplainfn(value){
        setcomplaint(value)
    }
    function amenitiesfn(value){
        setcomplaint(value)
    }
    function hostelListfn(value){
        console.log(value)
        setHostelList(value)
    }
    

    return<UsersContext.Provider value={{ jumpComplain:jumpcomplainfn,Complaint:complaint,Amenities:amenitiesfn, 
         updateHostelDetail:setHostelDetail,getHostelDetail:HostelDetail,updateHostelList:hostelListfn,getHostelList:hostelList,
         updateCustomer:setCustomers,getCustomerDetail:customer,updateRequestRaised:setUpdateRequest,getRequestRaised:requestRaised
       
         
    }} >
        {props.children}
    </UsersContext.Provider>

}
export default UserContext;