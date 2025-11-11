import React,{createContext, useState, useEffect} from "react";

 export const UsersContext=createContext();

const UserContext=(props)=> {

    const [accessToken, settoken]=useState();
    const [complaint, setcomplaint]=useState();
    const [SerialNo, setSerialNo]=useState();
    const [phoneNumber, setPhoneNo]=useState();


    useEffect(()=>{
        settoken('ebb12iii')
    },[])

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

    return<UsersContext.Provider value={{accessToken:accessToken, jumpComplain:jumpcomplainfn, Complaint:complaint,Amenities:amenitiesfn, serialNo:serialNofn, SerialNo:SerialNo,
        phoneNo:PhoneNofn,phoneNumber:phoneNumber
    }} >
        {props.children}
    </UsersContext.Provider>

}
export default UserContext;