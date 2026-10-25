import Config from 'react-native-config';

export const ACCESS_TOKEN='access-token'
export const PHONE_NO='PhoneNumber'
export const LOGGEDIN='loggedin'
export const USERID= 'userId'
export const FCM_TOKEN = 'FCM-TOKEN'
export const SHOULD_TOKEN_UPDATE = "SHOULD-TOKEN-UPDATE"
export const LOGGEDOUT="loggedout"
export const CUSTOMERDETAIL="customerDetail"
export const CUSTOMERPROFILEPIC= "customerProfilePic"
export const CUSTOMERINITIALS= "customerinitials"
export const HOSTELLIST= "hostelList"
export const HOSTELDETAIL ="hostelDetail"
export const LOGIN_ANOTHER_NUMBER ="login-With-AnotherNumber"


export function BASE_URL() {
  return Config.API_BASE_URL;
}