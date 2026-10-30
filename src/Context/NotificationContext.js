import React,{createContext, useState} from "react";

 export const notificationContexts=createContext();

const NotificationContext=(props)=> {

    
        const[NotificationList,setNotificationList]=useState([])
        const [onlyNotificationList,setOnlyNotificationList]=useState([])

    return<notificationContexts.Provider value={{updateNoticationList:setNotificationList,getNotificationList:NotificationList,
        updateOnlyNotificationList:setOnlyNotificationList,getOnlyNotificationList:onlyNotificationList
         
    }} >
        {props.children}
    </notificationContexts.Provider>

}
export default NotificationContext;