import React,{createContext, useState} from "react";
import { hostelDetails } from "../Action/HostelAction";

 export const UsersContext=createContext();

const UserContext=(props)=> {

    const [AccessToken, settoken]=useState();
    const [complaint, setcomplaint]=useState();
    const [SerialNo, setSerialNo]=useState();
    const [phoneNumber, setPhoneNo]=useState();
    const [LoggedIn,setLoggedIn]=useState()
    const [UserId,setUserId]=useState();
    const [HostelDetail,setHostelDetail]=useState();

    console.log(HostelDetail)
    console.log(UserId)


    function accessTokenfn(value){
        settoken(value)
        console.log(value)
    }
    function jumpcomplainfn(value){
        setcomplaint(value)
    }
    function amenitiesfn(value){
        setcomplaint(value)
    }
    function serialNofn(value){
        setSerialNo(value)
    }
    function PhoneNofn(value){
        setPhoneNo(value)
    }
    function loggedinfn(value){
        setLoggedIn(value)
    }
    function logoutfn(value){
        setLoggedIn(value)
    }

    return<UsersContext.Provider value={{updateToken:accessTokenfn, getToken:AccessToken, jumpComplain:jumpcomplainfn,
         Complaint:complaint,Amenities:amenitiesfn, serialNo:serialNofn, SerialNo:SerialNo, phoneNo:PhoneNofn,phoneNumber:phoneNumber,
         loggedin:loggedinfn,LoggedIn:LoggedIn,logout:logoutfn,userId:setUserId,getUserId:UserId,updateHostelDetail:setHostelDetail,getHostelDetail:HostelDetail
    }} >
        {props.children}
    </UsersContext.Provider>

}
export default UserContext;