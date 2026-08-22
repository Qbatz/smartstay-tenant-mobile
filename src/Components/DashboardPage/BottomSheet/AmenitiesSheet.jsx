import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, ScrollView, Image, TouchableOpacity, Dimensions, PanResponder, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppLoader from "../../ToastFile/LoaderPage";
import SuccessModal from "../../ToastFile/TostFilePage";
import Dot from '../../../assets/Images/dot.png';
import calenderTick from '../../../assets/Images/calendar-tick.png'
import { UsersContext } from "../../../Context/UserContext";
import { LoginContexts } from "../../../Context/LoginContext";
import { postRquestAmenties } from "../../../Action/HostelAction";
import { paymentContexts } from "../../../Context/PaymentContext";
import { CancelAmenitiesRequest, CancelRequest, getRequestRaised } from "../../../Action/CustomerAction";
import DeleteIcon from "../../../assets/Images/deleteIcon.png"


const SCREEN_HEIGHT = Dimensions.get("window").height;
const AmenitiesBottomSheet = ({
  visible,
  onClose,
  tag,
  myAmenitis,
  available,
  // sheetY,
  // panResponder,

}) => {

  const context = useContext(UsersContext)
  const loginContext = useContext(LoginContexts)
  const { getLoading } = useContext(paymentContexts)

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toastMessage, setToastMessage] = useState()
  const [modelType, setModelType] = useState()
  const [loading, setLoading] = useState(false);
  const [monthlyplan, setPlan] = useState();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (!visible) {
      setPlan(null)
    }
  }, [visible])

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  /* ================= DRAG DOWN ================= */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 150) {
          Keyboard.dismiss();
          onClose && onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;


  const plan = (id) => {
    setPlan(id)
  }

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split(/[-/]/);

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };



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

          getRequestRaised(context.getHostelDetail.hostelId, loginContext.getToken).then(res => {
            console.log(res)
            if (res?.status === 200) {
              context.updateRequestRaised(res.data)
            } else {
              console.log(res)
            }
          })

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

   const ClickCancelReq=async(requestId)=>{
    console.log(requestId)
      setLoading(true)
      try{
          const res=await CancelAmenitiesRequest(context?.getHostelDetail?.hostelId,requestId,loginContext?.getToken)
          console.log(res)
          if(res.status ==200){
              setShowSuccessModal(true)
              setToastMessage(res?.data)
              setModelType('success')
              getRequestRaised(context?.getHostelDetail.hostelId,loginContext?.getToken).then(res => {
                          console.log(res)
                          if(res?.status ===200){
                           context.updateRequestRaised(res.data)
                          }else{
                            console.log(res)
                          }
                        })
                        setTimeout(() => {
                          setLoading(false)
                           setShowSuccessModal(false)
                           onClose()
                        }, 1000);
          }else{
              setShowSuccessModal(true)
              setToastMessage(res?.message)
              setModelType('error')
               setTimeout(() => {
                   setShowSuccessModal(false)
                          setLoading(false)
                           onClose()
                        }, 1000);
          }
          }catch(error){
              console.log(error)
              setLoading(false)
          }
    }
  


  if (!visible) return null;

  return (
    <View style={style.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={StyleSheet.absoluteFillObject} />
      </TouchableWithoutFeedback>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          style.sheet,
          { transform: [{ translateY }] },
        ]}
      >
        <SafeAreaView edges={['bottom']}>

          <View {...panResponder.panHandlers}>
            <View style={style.dragindictor} />
          </View>

          <AppLoader visible={loading || getLoading} />
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
                      <Text style={{ fontSize: 21, fontFamily: 'Gilroy-Semibold' }}>{myAmenitis.amenityName}</Text>
                      <View style={{ justifyContent: 'center', paddingTop: 7 }}>
                        <Image source={Dot} style={{ width: 30.85, height: 30.85 }} />

                      </View>

                    </View>


                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5 }}>
                      {/* <View style={{height: 1, backgroundColor: "#eee", marginTop: 10}} /> */}

                      <View >
                        <TouchableOpacity style={{
                          borderWidth: 1, borderColor: '#eee', paddingTop: 9, paddingBottom: 14, paddingHorizontal: 15,
                          borderRadius: 5, flexDirection: 'row', justifyContent: 'center'
                        }}>
                          <Image source={calenderTick} style={{ width: 16, height: 16, marginTop: 3 }} />
                          <Text style={{ marginLeft: 5, fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Make Deactive</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View>
                      <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>Description</Text>
                      <Text style={{ marginTop: 13, fontSize: 16, fontFamily: 'Gilroy-Medium' }}>
                        {myAmenitis?.description || myAmenitis?.reason || "N/A"}
                      </Text>
                    </View>

                    <View style={{ paddingTop: 18 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>Price plans</Text>
                        <TouchableOpacity>
                          <Text style={{ fontSize: 12, color: '#1E45E1', fontFamily: 'Gilroy-Medium' }}>Change Plan</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', marginTop: 9 }}>{'\u20B9'}{myAmenitis.amenityAmount} /month</Text>
                    </View>

                    <View style={{ paddingTop: 15 }}>
                      <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>Next Bill</Text>
                      <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', marginTop: 9 }}>{formatDate(myAmenitis?.nextBillStartDate)}</Text>
                    </View>

                    <TouchableOpacity style={{ paddingVertical: 13, borderWidth: 1, borderRadius: 10, alignItems: 'center', backgroundColor: '#F5FFF8', borderColor: '#77D391', marginTop: 30 }}>
                      <Text style={{ fontSize: 14.11, fontFamily: 'Gilroy-Semibold', color: '#00A32E' }}>Active</Text>
                    </TouchableOpacity>


                  </View>}


                </View>
              </View>) : tag == null ? (<View style={{ flex: 1 }}>

                {available && <View style={{ paddingTop: 10, flex: 1, paddingBottom: 10 }}>
                  <Text style={{ fontSize: 21, fontFamily: 'Gilroy-Semibold' }}>{available.amenityName}</Text>
                  {available?.isRequestRaised ?
                    <TouchableOpacity onPress={() => ClickCancelReq(available?.requestId)}
                      style={{
                        borderWidth: 1, borderColor: '#eee', paddingTop: 9, paddingBottom: 14, paddingHorizontal: 15,
                        borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignSelf: 'flex-end'
                      }}>
                      <Image source={DeleteIcon} style={{ width: 16, height: 18, tintColor: '#EB6617' }} />
                      <Text style={{ marginLeft: 5, fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Cancel Request</Text>
                    </TouchableOpacity>
                    : <View style={{ width: '100%', borderWidth: 1, borderColor: "#eee", marginTop: 18 }} />}

                  <View style={{ justifyContent: 'space-between', flex: 1 }}>
                    <View style={{ paddingTop: 14 }}>
                      <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>Description</Text>

                      <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', marginBottom: 2 }}>{available?.description || "N/A"}</Text>
                        {/* <Text style={{ fontSize: 16, fontWeight: 400, marginTop: 2 }}>24/7 Access, pickup lopp from lobby</Text> */}
                      </View>

                      <View style={{ paddingTop: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>
                            {available?.isRequestRaised ? "Selected" : "Price"} Plans</Text>

                          {!available?.isRequestRaised && (
                            <TouchableOpacity>
                              <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Medium', color: '#1E45E1', textDecorationLine: 'underline' }}>Select plan</Text>
                            </TouchableOpacity>
                          )}
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View style={{ paddingTop: 10, flexDirection: 'row' }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>{'\u20B9'}{available.amenityAmount}</Text>
                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>/month</Text>
                          </View>

                          {!available?.isRequestRaised && (
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
                          )}

                        </View>
                      </View>

                      {/* {available?.isRequestRaised && (
                        <View style={{ marginTop: 16 }}>
                          <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#4B4B4B' }}>
                            Raised On</Text>
                          <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', marginTop: 10 }}>
                            {'\u20B9'}{available.amenityAmount}</Text>
                        </View>
                      )} */}
                    </View>
                    <View >
                      {available?.isRequestRaised ? (
                        <TouchableOpacity style={{ paddingVertical: 13, borderWidth: 1, borderRadius: 10, alignItems: 'center',
                                                   backgroundColor: '#FFFDF5', borderColor: '#E27625', marginTop: 30 }}>
                          <Text style={{ fontSize: 14.11, fontFamily: 'Gilroy-Semibold', color: '#EB6617' }}>Request Raised</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={() => onRequestAmenities(available.amenityId)}
                          style={{
                            backgroundColor: '#1d41d5', paddingVertical: 12, alignItems: 'center', borderRadius: 10,
                            marginTop: 35
                          }}>
                          <Text style={{ fontSize: 14.11, fontFamily: 'Gilroy-Semibold', color: '#ffffff' }}>Request Amenity</Text>
                        </TouchableOpacity>
                      )}
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

const style = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 16,
    maxHeight: "98%",
    overflow: 'hidden', minHeight: "40%"
    // dynamic height limit
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    minHeight: 45,
    textAlignVertical: "top",
  },
  dragindictor: { width: 50, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 10 },

});