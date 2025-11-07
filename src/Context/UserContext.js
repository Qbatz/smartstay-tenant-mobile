import React,{createContext, useState, useEffect} from "react";

 export const UsersContext=createContext();

const UserContext=(props)=> {

    const [accessToken, settoken]=useState();
    const [complaint, setcomplaint]=useState();

    console.log('nothing showing')
    console.log(complaint)


    useEffect(()=>{
        settoken('ebb12iii')
    },[])

    function jumpcomplainfn(value){
        setcomplaint(value)

    }
    function amenitiesfn(value){
        setcomplaint(value)
    }

    return<UsersContext.Provider value={{accessToken:accessToken, jumpComplain:jumpcomplainfn, Complaint:complaint,Amenities:amenitiesfn}} >
        {props.children}
    </UsersContext.Provider>

}
export default UserContext;