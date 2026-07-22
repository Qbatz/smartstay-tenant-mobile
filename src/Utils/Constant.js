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


let _BASE_URL;         
let _initialized = false;

export function initBaseUrl(value) {
  if (_initialized) {
    return;
  }

  _BASE_URL = value;
  _initialized = true;
}

export function BASE_URL() {
  if (!_initialized) {
    // throw new Error("BASE_URL not initialized yet");
  }
  return _BASE_URL;
}