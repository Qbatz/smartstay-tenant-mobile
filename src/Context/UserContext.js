import React,{createContext, useState} from "react";

 export const UsersContext=createContext();

const UserContext=(props)=> {

    const [AccessToken, settoken]=useState();
    const [complaint, setcomplaint]=useState();
    const [SerialNo, setSerialNo]=useState();
    const [phoneNumber, setPhoneNo]=useState();
    const [LoggedIn,setLoggedIn]=useState()



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

    return<UsersContext.Provider value={{updateToken:accessTokenfn, getToken:AccessToken, jumpComplain:jumpcomplainfn, Complaint:complaint,Amenities:amenitiesfn, serialNo:serialNofn, SerialNo:SerialNo,
        phoneNo:PhoneNofn,phoneNumber:phoneNumber,loggedin:loggedinfn,LoggedIn:LoggedIn,logout:logoutfn
    }} >
        {props.children}
    </UsersContext.Provider>

}
export default UserContext;