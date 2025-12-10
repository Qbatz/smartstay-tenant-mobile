import React,{createContext, useState} from "react";

 export const notificationContexts=createContext();

const NotificationContext=(props)=> {

    
        const[NotificationList,setNotificationList]=useState([])

    return<notificationContexts.Provider value={{updateNoticationList:setNotificationList,getNotificationList:NotificationList
         
    }} >
        {props.children}
    </notificationContexts.Provider>

}
export default NotificationContext;