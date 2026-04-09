import React, { useContext, useEffect, useState } from "react";
import EnterMPin from "./Components/CreateAccount/EnterMPin";
import { View } from "react-native";
import { LoginContexts } from "./Context/LoginContext";
import HostelList from "./Components/HostelList";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import KYCUpload from "./Components/KycDocuments/UploadKYC";
import VerifyKYC from "./Components/KycDocuments/VerifyKYC";
import KycSuccessDesign from "./Components/KycDocuments/KycSuccess";
import Dashboard from "./Components/DashboardPage/Dashboard";
import CustomerProfile from "./Components/CustomerProfile/CustomerProfile";
import ProfileHostels from "./Components/CustomerProfile/ProfileHostels";
import RentalAgreement from "./Components/CustomerProfile/RentalAgreement";
import Notification from "./Components/Notification/Notification";
import EditProfile from "./Components/CustomerProfile/EditProfile";
import Agreement from "./Components/RentalAggreements/Aggreements";
import SignatureScreen from "./Components/RentalAggreements/SignatureScreen";
import ReceiptPdfViewer from "./Components/ReceiptPdfviewer";
import AgreementViewScreen from "./Components/RentalAggreements/AggreementView";
import SuccessModal from "./Components/ToastFile/TostFilePage";
import NOCBillPdf from "./Components/NocBillPdf";
import NocReciptPdf from "./Components/NocReceipt";
import InvoiceDesign from "./Components/Payments/BillPDF";
import EnterNumber from "./Components/ForgotMpin/EnterNumber";
import ForgotMpinOtp from "./Components/ForgotMpin/ForgotMpinOtp";
import ResetNewMpin from "./Components/ForgotMpin/ResetNewMpin";
import ComingSoon from "./Components/RentalAggreements/ComingSoon";
import ComplaintUpdatesScreen from "./Components/ComplaintUpdates/Updates";
import BookingInvoice from "./Components/InvoiceReceipt/BookingInvoice";
import BookingReceipt from "./Components/InvoiceReceipt/BookingReceipt";
import CustomerProfileNew from "./Components/CustomerProfile/CustomerProfileNew"
import AccountDetails from "./Components/CustomerProfile/AccountDetails";
import PersonalDetails from "./Components/EditProfileFolder/PersonalDetails";
import BackgroundDetails from "./Components/EditProfileFolder/BackgroundDetails";
import DocumentsUpload from "./Components/EditProfileFolder/DocumentUpload";

const SuccessFlow = ({props, MpinVerified}) => {
  console.log(props)
  console.log(MpinVerified)

  const loginContext = useContext(LoginContexts)
  const Navigation = createStackNavigator();
  const [isMpinVerified, setMpinVerified] = useState(false)

  useEffect(()=>{
    if(MpinVerified === true){
      setMpinVerified(true)
    }
  },[MpinVerified])

  const verifiedmpin = () => {
    setMpinVerified(true)
  }

  console.log(isMpinVerified)

  return <View style={{ flex: 1 }}>

    {loginContext.getRoute === 'confirmMPin' || isMpinVerified ?
      <NavigationContainer>
        <Navigation.Navigator screenOptions={{ headerShown: false }} initialRouteName='HostelList'>
          <Navigation.Screen name='HostelList' component={HostelList} />
          <Navigation.Screen name="KYCUpload" component={KYCUpload} />
          <Navigation.Screen name='VerifyKYC' component={VerifyKYC} />
          <Navigation.Screen name="KycSuccess" component={KycSuccessDesign} />
          <Navigation.Screen name='Dashboard' component={Dashboard} />
          <Navigation.Screen name="CustomerProfile" component={CustomerProfile} />
          <Navigation.Screen name="CustomerProfileNew" component={CustomerProfileNew}/>
          <Navigation.Screen name='ProfileHostels' component={ProfileHostels} />
          <Navigation.Screen name='RentalAgreement' component={RentalAgreement} />
          <Navigation.Screen name="AccountDetails" component={AccountDetails}/>
          <Navigation.Screen name="PersonalDetails" component={PersonalDetails}/>
          <Navigation.Screen name="BackgroundDetails" component={BackgroundDetails}/>
          <Navigation.Screen name="DocumentUpload" component={DocumentsUpload}/>
          <Navigation.Screen name="ComingSoonPage" component={ComingSoon}/>
          <Navigation.Screen name="Updates" component={ComplaintUpdatesScreen}/>
          <Navigation.Screen name="Notification" component={Notification} />
          <Navigation.Screen name="EditProfile" component={EditProfile} />
          <Navigation.Screen name="Agreement" component={Agreement} />
          <Navigation.Screen name="SignatureScreen" component={SignatureScreen} />
          <Navigation.Screen name="ReceiptPdfView" component={ReceiptPdfViewer} />
          <Navigation.Screen name="AgreementViewScreen" component={AgreementViewScreen} />
          <Navigation.Screen name="SuccessModal" component={SuccessModal} />
          <Navigation.Screen name="NocBillPdf" component={NOCBillPdf} />
          <Navigation.Screen name="NocReceiptPdf" component={NocReciptPdf} />
          <Navigation.Screen name="InvoiceDesign" component={InvoiceDesign} />
          <Navigation.Screen name="BookingInvoice" component={BookingInvoice}/>
          <Navigation.Screen name="BookingReceipt" component={BookingReceipt}/>
        </Navigation.Navigator>

      </NavigationContainer>

      : <NavigationContainer>
    <Navigation.Navigator screenOptions={{ headerShown: false }}>
      <Navigation.Screen name="EnterMPin" >
        {(props) => <EnterMPin {...props} callbackMpin={verifiedmpin} />}
      </Navigation.Screen>
       <Navigation.Screen name="EnterNumber" component={EnterNumber} />
      <Navigation.Screen name="ForgotMpinOtp" component={ForgotMpinOtp} />
      <Navigation.Screen name="ResetNewMpin" component={ResetNewMpin}/>
    </Navigation.Navigator>
  </NavigationContainer>
      
      // <EnterMPin callbackMpin={verifiedmpin} />
      
      }

  </View>


}
export default SuccessFlow;