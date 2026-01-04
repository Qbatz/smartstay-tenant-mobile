import React, { createContext, useState } from "react";

export const LoginContexts = createContext();

export const LoginProvider = (props) => {

      const [AccessToken, settoken]=useState();
      const [Network,setCheckNetConnectivity]=useState(true)
      const [UserId,setUserId]=useState();
      const [LoggedIn,setLoggedIn]=useState()
      const [phoneNumber, setPhoneNo]=useState();
      const [route,setRoute]=useState()


  const accessToken=(value)=>{
      settoken(value)
  }

  const fetchNetwork=(value)=>{
    setCheckNetConnectivity(value)
  }

  const userIdfn=(value)=>{
      setUserId(value)
  }

  const loggedInfn=(value)=>{
      setLoggedIn(value)
  }


  const phoneNofn=(value)=>{
    setPhoneNo(value)
  }

  const logoutfn=(value)=>{
    console.log(value)
        setLoggedIn(value)
    }

  const routeNamefn=(value)=>{
    console.log(value)
    setRoute(value)
  }
  
  return <LoginContexts.Provider
      value={{updateToken:accessToken, getToken:AccessToken,internet:fetchNetwork,getNetworkConnectivity:Network,
        userId:userIdfn,getUserId:UserId,loggedin:loggedInfn,LoggedIn:LoggedIn, 
        phoneNo:phoneNofn,getPhoneNo:phoneNumber,logout:logoutfn,updateRoute:routeNamefn,getRoute:route
      }}
    >
      {props.children}
    </LoginContexts.Provider>
  
};
