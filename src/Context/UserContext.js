import React,{createContext, useState, useEffect} from "react";

 export const UsersContext=createContext();

const UserContext=(props)=> {

    const [accessToken, settoken]=useState();

    console.log('nothing showing')


    useEffect(()=>{
        settoken('ebb12iii')
    },[])

    return<UsersContext.Provider value={{accessToken:accessToken}} >
        {props.children}
    </UsersContext.Provider>

}
export default UserContext;