import React,{createContext, useState} from "react";
import { hostelDetails } from "../Action/HostelAction";

 export const UsersContext=createContext();

const UserContext=(props)=> {


    const [complaint, setcomplaint]=useState();
    const [HostelDetail,setHostelDetail]=useState();
    const [hostelList,setHostelList]=useState([])

    console.log(HostelDetail)


   
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
         updateHostelDetail:setHostelDetail,getHostelDetail:HostelDetail,updateHostelList:hostelListfn,getHostelList:hostelList
         
    }} >
        {props.children}
    </UsersContext.Provider>

}
export default UserContext;