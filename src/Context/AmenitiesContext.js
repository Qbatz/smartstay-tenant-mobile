import React,{createContext, useState} from "react";

 export const amenitiesContexts=createContext();

const AmenitiesContext=(props)=> {

     const [assignedAmenities, setAssignedAmenity] = useState([])
     const [unassignedAmenities, setUnasignedAmenities] = useState([])


    return<amenitiesContexts.Provider value={{updateAssignedAmenities:setAssignedAmenity,getAssignedAmenities:assignedAmenities,
        updateUnassginedAmenites:setUnasignedAmenities,getUnassignedAmenities:unassignedAmenities
         
    }} >
        {props.children}
    </amenitiesContexts.Provider>

}
export default AmenitiesContext;