import React, { useContext,useEffect,useState } from "react";
import { View,Text, StyleSheet,TouchableWithoutFeedback, Animated,ScrollView,Image,TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppLoader from "../../ToastFile/LoaderPage";
import SuccessModal from "../../ToastFile/TostFilePage";
import Dot from '../../../assets/Images/dot.png';
import calenderTick from '../../../assets/Images/calendar-tick.png'
import { UsersContext } from "../../../Context/UserContext";
import { LoginContexts } from "../../../Context/LoginContext";
import { postRquestAmenties } from "../../../Action/HostelAction";


const AmenitiesBottomSheet = ({
    visible,
    onClose,
    tag,
    myAmenitis,
    available,
    sheetY,
    panResponder,

})=>{
    
    const context=useContext(UsersContext)
    const loginContext=useContext(LoginContexts)

     const [showSuccessModal, setShowSuccessModal] = useState(false);
     const [toastMessage, setToastMessage] = useState()
      const [modelType, setModelType] = useState()
     const [loading, setLoading] = useState(false);
     const [monthlyplan, setPlan] = useState();

     useEffect(()=>{
        if(!visible){
            setPlan(null)
        }
     },[visible])


     const plan = (id) => {
        setPlan(id)
      }
    
      const onRequestAmenities = (amenityId) => {
    
        if (monthlyplan == null) {
          setShowSuccessModal(true)
          setToastMessage('Select plan')
          setModelType('error')
          setTimeout(() => setShowSuccessModal(false), 2000);
          return;
    
        }
        postRquestAmenties(context.getHostelDetail.hostelId, loginContext.getToken, amenityId).then(r => {
    
    
          console.log(r)
          setLoading(true)
    
          setTimeout(() => {
            setLoading(false)
            if (r.status == 200) {
              setShowSuccessModal(true)
              setToastMessage('Request Raised')
              setModelType('success')
    
              setTimeout(() => {
                setShowSuccessModal(false)
                setPlan(null)
                onClose();
              }, 2000);
            } else {
              setShowSuccessModal(true)
              setToastMessage(r.message || 'Something went wrong')
              setModelType('error')
    
              setTimeout(() => {
                setShowSuccessModal(false)
                setPlan(null); onClose();
              }, 2000);
            }
          }, 2000);
    
    
        })
      }


    if (!visible) return null;

    return(
        <View style={style.sheetOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View style={[style.amenitiesBottomSheet, { transform: [{ translateY: sheetY }] }]}
          {...panResponder.panHandlers}>

          <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>

            <View {...panResponder.panHandlers}>
              <View style={style.dragindictor} />
            </View>

            <AppLoader visible={loading} />
            <SuccessModal
              visible={showSuccessModal}
              onClose={() => setShowSuccessModal(false)}
              message={toastMessage}
              type={modelType}
            />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
              <View style={{ paddingLeft: 10, paddingRight: 10, flex: 1 }}>
                {tag == 'My-Amenities' ? (<View>
                  <View style={{ paddingTop: 12 }}>
                    {myAmenitis && <View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 23, fontWeight: 500, fontStyle: 'Gilroy-Semibold' }}>{myAmenitis.amenityName}</Text>
                        <View style={{ justifyContent: 'center', paddingTop: 7 }}>
                          <Image source={Dot} style={{ width: 30.85, height: 30.85 }} />

                        </View>

                      </View>
                      

                      <View style={{ flexDirection: 'row',justifyContent:'flex-end', paddingTop: 5 }}>
                        {/* <View style={{height: 1, backgroundColor: "#eee", marginTop: 10}} /> */}
                       
                        <View >
                          <TouchableOpacity style={{
                            borderWidth: 1, borderColor: '#eee', paddingTop: 9, paddingBottom: 14, paddingHorizontal: 15,
                            borderRadius: 5, flexDirection: 'row', justifyContent: 'center'
                          }}>
                            <Image source={calenderTick} style={{ width: 16, height: 16, marginTop: 3 }} />
                            <Text style={{ marginLeft: 5, fontSize: 14, fontWeight: 400 }}>Make Deactive</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View>
                        <Text style={{ fontSize: 12, fontWeight: 40, color: '#4B4B4B' }}>Description</Text>
                        <Text style={{ marginTop: 13, fontSize: 16, fontWeight: 400 }}>
                          Airtel Fiber 5G/100mpb
                        </Text>
                      </View>

                      <View style={{ paddingTop: 18 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 12, fontWeight: 400, color: '#4B4B4B' }}>Price plans</Text>
                          <TouchableOpacity>
                            <Text style={{ fontSize: 12, color: '#1E45E1' }}>Change Plan</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: 600, marginTop: 9 }}>{'\u20B9'}{myAmenitis.amenityAmount} /month</Text>
                      </View>

                      <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 12, fontWeight: 400, color: '#4B4B4B' }}>Next Bill</Text>
                        <Text style={{ fontSize: 16, fontWeight: 600, marginTop: 9 }}>10 sept Bill</Text>
                      </View>

                      <TouchableOpacity style={{ paddingVertical: 13, borderWidth: 1, borderRadius: 10, alignItems: 'center', backgroundColor: '#F5FFF8', borderColor: '#77D391', marginTop: 30 }}>
                        <Text style={{ fontSize: 14.11, fontWeight: 600, color: '#00A32E' }}>Active</Text>
                      </TouchableOpacity>


                    </View>}


                  </View>
                </View>) : tag == null ? (<View style={{ flex: 1 }}>

                  {available && <View style={{ paddingTop: 10, flex: 1, paddingBottom: 10 }}>
                    <Text style={{ fontSize: 23, fontWeight: 500 }}>{available.amenityName}</Text>
                    <View style={{ width: '100%', height: 1, backgroundColor: "#eee", marginTop: 18 }} />
                    <View style={{ justifyContent: 'space-between', flex: 1 }}>
                      <View style={{ paddingTop: 10 }}>
                        <Text style={{ fontSize: 12, fontWeight: 400, color: '#4B4B4B' }}>Description</Text>

                        <View style={{ paddingTop: 14 }}>
                          <Text style={{ fontSize: 16, fontWeight: 400, marginBottom: 2 }}>Gear,Non Gear</Text>
                          <Text style={{ fontSize: 16, fontWeight: 400, marginTop: 2 }}>24/7 Access, pickup lopp from lobby</Text>
                        </View>

                        <View style={{ paddingTop: 20 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 12, fontWeight: 400, color: '#4B4B4B' }}>Price Plans</Text>
                            <TouchableOpacity>
                              <Text style={{ fontSize: 12, fontWeight: 400, color: '#1E45E1', textDecorationLine: 'underline' }}>Select plan</Text>
                            </TouchableOpacity>
                          </View>

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ paddingTop: 10, flexDirection: 'row' }}>
                              <Text style={{ fontSize: 16, fontWeight: 600 }}>{'\u20B9'}{available.amenityAmount}</Text>
                              <Text style={{ fontSize: 16, fontWeight: 400, color: '#4B4B4B' }}>/month</Text>
                            </View>

                            <TouchableOpacity onPress={() => plan('plan')} style={{
                              borderWidth: 2, width: 20, height: 20, borderRadius: 10,
                              borderColor: plan == 'plan' ? borderColor : monthlyplan == 'plan' ? "#1E45E1" : "#ccc", justifyContent: 'center', marginTop: 12
                            }}>

                              <View style={{ justifyContent: 'center', alignItems: 'center' }}  >

                                {monthlyplan === 'plan' && (
                                  <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: "#1E45E1" }} />
                                )}
                              </View>
                            </TouchableOpacity>

                          </View>

                        </View>
                      </View>
                      <View >
                        <TouchableOpacity onPress={() => onRequestAmenities(available.amenityId)}
                          style={{ backgroundColor: '#1d41d5', paddingVertical: 12, alignItems: 'center', borderRadius: 20 }}>
                          <Text style={{ fontSize: 14.11, fontWeight: 600, color: '#ffffff' }}>Request Amenity</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                  </View>}
                </View>) : null}


              </View>
            </ScrollView>

          </SafeAreaView>

        </Animated.View>
      </View>
    )

}

export default AmenitiesBottomSheet;

const style=StyleSheet.create({
    sheetOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",

  },
  amenitiesBottomSheet: {
    height: '50%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 18,
    paddingTop: 20, paddingBottom: 10
  },
})