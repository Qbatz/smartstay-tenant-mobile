import React, { useContext, useEffect, useState } from "react";
import { Image, TouchableOpacity, View, Text, FlatList, Linking } from "react-native";
import LeftArrow from "../../assets/Images/LeftArrow.png";
import { useNavigation } from "@react-navigation/native";
import Pdf from "../../assets/Images/pdf.png";
import EyeIcon from "../../assets/Images/view.png";
import DownloadIcon from "../../assets/Images/download.png"
import { pick } from "@react-native-documents/picker";
import { customerDetails, deleteDocuments, postDocuments } from "../../Action/CustomerAction";
import { UsersContext } from "../../Context/UserContext";
import { LoginContexts } from "../../Context/LoginContext";
import AppLoader from "../ToastFile/LoaderPage";
import SuccessModal from "../ToastFile/TostFilePage";
import DocumentViewer from "../DocumentsView/DocumentViewer";



const DocumentsUpload = (route) => {

    const navigation = useNavigation();
    const context = useContext(UsersContext)
    const loginContext = useContext(LoginContexts)

    const [aadharDoc, setAadharDoc] = useState(null);
    const [drivingLicDoc, setDrivingLicDoc] = useState(null);
    const [loading, setLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [toastMessage, setToastMessage] = useState()
    const [modelType, setModelType] = useState();
    const [documents, setDoucument] = useState([])
    const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);


    console.log(route)
    useEffect(() => {
        setDoucument(route.route?.params?.customer?.otherDocuments)
    }, [])

    console.log(documents)


    const pickFiles = async (type) => {
        try {
            const results = await pick({
                allowMultiSelection: true,
                type: ['*/*'],
                copyTo: 'cachesDirectory',
            });

            if (type === "aadhar") {
                setAadharDoc(results)
                console.log(results)

                const formData = new FormData();

                results.forEach((file) => {
                    console.log(file)
                    formData.append("files", file)
                    //   formData.append("files", {
                    //     uri: file.fileCopyUri || file.uri,
                    //     name: file.name || "document.pdf",
                    //     type: file.type || "application/pdf",
                    //   });
                });

                formData.append("payload", {
                    string: JSON.stringify({ type: "OTHER" }),
                    type: "application/json",
                });

                postDocuments(loginContext.getToken, formData).then(r => {
                    console.log(r)
                    if (r.status == 200) {
                        setShowSuccessModal(true);
                        setToastMessage("Uploaded Successfully")
                        setModelType("success")
                        setTimeout(() => {
                            setShowSuccessModal(false)
                        }, 1000);
                    } else {
                        setShowSuccessModal(true)
                        setToastMessage(r.message || "Someting Went Wrong")
                        setModelType("error")
                        setTimeout(() => { setShowSuccessModal(false) }, 1000);
                    }
                })
            }
            if (type === "driving") {
                setDrivingLicDoc(results)
                console.log(results)

                const formData = new FormData();

                results.forEach((file) => {
                    console.log(file)
                    formData.append("files", file)

                });

                formData.append("payload", {
                    string: JSON.stringify({ type: "OTHER" }),
                    type: "application/json",
                });

                postDocuments(loginContext.getToken, formData).then(r => {
                    console.log(r)
                    if (r.status == 200) {
                        setShowSuccessModal(true);
                        setToastMessage("Uploaded Successfully")
                        setModelType("success")
                        setTimeout(() => {
                            setShowSuccessModal(false)
                        }, 1000);
                    } else {
                        setShowSuccessModal(true)
                        setToastMessage(r.message || "Someting Went Wrong")
                        setModelType("error")
                        setTimeout(() => { setShowSuccessModal(false) }, 1000);
                    }
                })
            }

        } catch (err) {
            console.log("Cancelled or error", err);
        }
    };

    const removeDocument = (documentId) => {
        deleteDocuments(loginContext.getToken, documentId).then(r => {
            console.log(r)

            if (r.status == 200) {

                setDoucument(prev =>
                    prev.filter(doc => doc.documentId !== documentId)
                );

                customerDetails(loginContext.getToken).then(r => {
                    console.log(r.data)
                    context.updateCustomer(r.data)

                })
            }
        })
    }

    return <View style={{ backgroundColor: '#ffffff', flex: 1, padding: 20 }}>
        <AppLoader visible={loading} />
        <SuccessModal
            visible={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message={toastMessage}
            type={modelType}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={LeftArrow} style={{ height: 25, width: 25 }} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Semibold', marginLeft: 8 }}>Documents</Text>
        </View>

        <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', marginTop: 25 }}>Documents</Text>

        <View style={{ marginTop: 15 }}>

            {
                !aadharDoc && (
                    <View style={{
                        paddingVertical: 18, borderWidth: 1, backgroundColor: "#EEF1FA", paddingHorizontal: 15,
                        borderColor: "#E5E7EB", borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Aadhar upload</Text>

                        <TouchableOpacity onPress={() => pickFiles("aadhar")}>
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#1E45E1' }}>Upload</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            {
                aadharDoc && (
                    <View
                        style={{
                            borderWidth: 1, paddingVertical: 20, borderColor: '#eaeaec', borderRadius: 10, paddingHorizontal: 10,
                            backgroundColor: "#f9fafc", flexDirection: "row", alignItems: "center", marginBottom: 5,
                            justifyContent: 'space-between'
                        }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 5 }}>
                            <Image source={Pdf} style={{ width: 18, height: 18, marginRight: 8 }} />

                            <View style={{ marginLeft: 3, flex: 1 }}>
                                <Text style={{ fontSize: 13, color: "#111928", fontFamily: 'Gilroy-Medium', flexShrink: 1 }}>
                                    {aadharDoc[0]?.name}</Text>
                                <Text style={{ fontSize: 12, color: "#6B7280", fontFamily: 'Gilroy-Regular', marginTop: 4 }}>
                                    {aadharDoc[0]?.size} • PDF
                                </Text>
                            </View>

                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity>
                                <Image source={EyeIcon} style={{ width: 20, height: 20, tintColor: '#28303F', marginRight: 5 }} />
                            </TouchableOpacity>


                            <Image source={DownloadIcon} style={{ width: 20, height: 20, marginLeft: 8, tintColor: '#28303F' }} />
                        </View>


                    </View>
                )
            }

        </View>

        <View style={{ marginTop: 15 }}>

            {/* {
                !drivingLicDoc && (
                    <View style={{
                        paddingVertical: 18, borderWidth: 1, backgroundColor: "#EEF1FA", paddingHorizontal: 15,
                        borderColor: "#E5E7EB", borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>Driving License</Text>

                        <TouchableOpacity onPress={() => pickFiles("driving")}>
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#1E45E1' }}>Upload</Text>
                        </TouchableOpacity>
                    </View>
                )
            } */}

            {
                documents && documents?.length > 0 && (
                    <FlatList
                        data={documents}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <>

                                <View
                                    style={{
                                        borderWidth: 1, paddingVertical: 20, borderColor: '#eaeaec', borderRadius: 10, paddingHorizontal: 10,
                                        backgroundColor: "#f9fafc", flexDirection: "row", alignItems: "center", marginBottom: 5,
                                        justifyContent: 'space-between', marginTop: 10
                                    }}>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 5 }}>
                                        <Image source={Pdf} style={{ width: 18, height: 18, marginRight: 8 }} />

                                        <View style={{ marginLeft: 3, flex: 1 }}>
                                            <Text style={{ fontSize: 13, color: "#111928", fontFamily: 'Gilroy-Medium', flexShrink: 1 }}>
                                                {item?.documentFileType}</Text>
                                            {/* <Text style={{ fontSize: 12, color: "#6B7280", fontFamily: 'Gilroy-Regular', marginTop: 4 }}>
                                            {?.size} • PDF
                                        </Text> */}
                                        </View>

                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (item?.documentFileType === "PDF") {
                                                    Linking.openURL(item?.documentUrl)
                                                } else {
                                                    const index =documents.findIndex((i)=>
                                                    i.documentId === item.documentId)
                                                    setViewerIndex(index);
                                                    setViewerVisible(true);
                                                }
                                            }}>
                                            <Image source={EyeIcon} style={{ width: 20, height: 20, tintColor: '#28303F', marginRight: 5 }} />
                                        </TouchableOpacity>


                                        <Image source={DownloadIcon} style={{ width: 20, height: 20, marginLeft: 8, tintColor: '#28303F' }} />
                                    </View>


                                </View>
                                <TouchableOpacity onPress={() => removeDocument(item?.documentId)}
                                    style={{
                                        position: "absolute", top: 2, right: 1, width: 20, height: 20, borderRadius: 10,
                                        alignItems: 'center', justifyContent: 'center', backgroundColor: "#E0E0E0"
                                    }}>
                                    <Text style={{ fontSize: 18, textAlign: 'center', lineHeight: 18 }}>x</Text>
                                </TouchableOpacity>
                            </>
                        )} />
                )
            }

        </View>

        <DocumentViewer
            visible={viewerVisible}
            documents={documents}
            initialIndex={viewerIndex}
            onClose={() => setViewerVisible(false)}
        />

    </View>
}

export default DocumentsUpload;