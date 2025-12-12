import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity,Image } from "react-native";
import Signature from "react-native-signature-canvas";
import Clear from "../../assets/Images/clear.png"
import shield from "../../assets/Images/shield.png"
import close from "../../assets/Images/close.png"
import { useNavigation,StackActions,CommonActions } from "@react-navigation/native";

export default function SignatureScreen({ navigation }) {
  const ref = useRef();
  const [signature, setSignature] = useState(null);
  const [canvasKey, setCanvasKey] = useState(1);
  const [disablebtn , setDisableBtn] = useState(true)


 const handleOK = (sig) => {
  setSignature(sig); 
  

  // navigation.navigate("AgreementViewScreen", { signature: sig });
};

 const handleSubmit = () => {  
  
  ref.current.readSignature();

 navigation.dispatch(
  CommonActions.reset({
    index: 2,  
    routes: [
      { name: 'Dashboard' },
      { name: 'CustomerProfile' },
      { name: 'RentalAgreement' }
    ],
  })
);

  // navigation.dispatch(
  //   StackActions.replace('RentalAgreement')
  // );

};



const handleClear = () => {
  if (ref.current) {
    ref.current.clearSignature();
  }
  setSignature(null);
  setCanvasKey(prev => prev + 1); 
};




 

  const handleBack=()=>{
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
    
     
    <View style={styles.headerRow}>
  <View style={{flexDirection:"row", alignItems:"center"}}>
    <Image source={shield} resizeMode="contain" style={styles.shielIcon} />
    <Text style={styles.title}>Signature</Text>
  </View>

  <TouchableOpacity

 onPress={handleBack}
   >
    <Image
      source={close}
      resizeMode="contain"
      style={styles.closeIcon}
    />
  </TouchableOpacity>
</View>


   
      <Text style={styles.subtitle}>
        Please draw your signature to legally sign the Document
      </Text>

    
      <View style={styles.signatureContainer}>
 <Signature
  key={canvasKey}
  ref={ref}
  onOK={handleOK}
  onClear={handleClear}
  autoClear={false}
  onBegin={() => setSignature("started")}   
  descriptionText=""
  webStyle={style.webStyle}
/>





      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
  <View style={{ flexDirection:"row", alignItems:"center" }}>
    <Image
      source={Clear}
      resizeMode="contain"
      style={styles.backIcon}
    />
    <Text style={styles.clearText}>Clear</Text>
  </View>
</TouchableOpacity>
      </View>

    
   <TouchableOpacity 
   
  
    style={[styles.submitButton, !signature && styles.disabledButton]}
    disabled={!signature}
    onPress={handleSubmit} >
  <Text style={styles.submitText}>Submit</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  headerRow:{
  flexDirection:"row",
  alignItems:"center",
  justifyContent:"space-between",
  marginTop:40
},

closeIcon:{
  width:25,
  height:25,
},
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 10,
    fontFamily:"Gilroy",
    fontWeight:400

  },
signatureContainer: {
  borderWidth: 1,
  borderColor: "#2563EB",
  borderRadius: 10,
  height: 350,
  marginTop: 25,
  padding: 0,
  
},
 disabledButton: {
    backgroundColor: "#C7D2FE",
  },
EnableButton : {
  backgroundColor:"#2563EB"
},
  clearButton: {
    position: "absolute",
    top: 8,
    right: 10,
    backgroundColor: "#2563EB",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  clearText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 13,
  },
   backIcon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
   shielIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    
  },
  submitButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop:100
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

const style = {
  webStyle: `
    .m-signature-pad { 
      box-shadow: none !important; 
      border: none !important; 
      margin:0 !important; 
      padding:0 !important;
    }
    .m-signature-pad--body {
      margin:0 !important; 
      padding:0 !important; 
      border-radius:10px;
      border:none !important;
      border-width:0 !important;
      height:100% !important;        
    }
    canvas {
      height:100% !important;     
      width:100% !important;
      border:none !important;
      margin:0 !important;
      padding:0 !important;
      touch-action: none !important;
    }
    .m-signature-pad--footer { display:none !important; }
    body, html { margin:0 !important; padding:0 !important; background:transparent !important; }
  `,
}





