import AxiosConfig from "../Config/AxiosConfig";

export const customerDetails=async(token)=>{

    const response=await AxiosConfig.get("/v2/customer/details", {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    console.log(response)
    return response


}