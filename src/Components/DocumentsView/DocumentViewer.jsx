// import React, { useState, useEffect } from "react";

// import {
//   View,
//   Text,
//   StyleSheet,
//   Modal,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions, BackHandler,
//   NativeModules,
// } from "react-native";
// import BackIcon from "../../assets/Images/LeftArrow.png"

// const { width } = Dimensions.get("window");

// export default function DocumentViewer({
//   visible,
//   documents = [],
//   initialIndex = 0,
//   onClose,
// }) {
//   const [currentIndex, setCurrentIndex] = useState(initialIndex);
//   const { CommonModule } = NativeModules;

//   const handleScroll = (event) => {
//     const slideIndex = Math.round(
//       event.nativeEvent.contentOffset.x / width
//     );
//     setCurrentIndex(slideIndex);
//   };

//   useEffect(() => {
//     const backAction = () => {
//       if (visible) {
//         onClose();
//         return true;
//       }
//       return false;
//     };

//     const backHandler = BackHandler.addEventListener(
//       "hardwareBackPress",
//       backAction
//     );

//     return () => backHandler.remove();
//   }, [visible]);

//   const imageDocs = documents.filter(doc => doc.documentFileType || doc?.docFileType === "IMAGE");

  


//   const handleDownload = (docUrl) => {
//     console.log(docUrl)

//     if (docUrl) {

//       CommonModule.downloadPDF(docUrl)

//     }


//   };


//   const sharePdf = (docUrl) => {
//     console.log(docUrl)
//     console.log("calling share pdf function")

//     if (docUrl) {
//       CommonModule.sharePDF(docUrl)
//     }


//   }

//   console.log(imageDocs)


//   return (
//     <Modal visible={visible}
//       transparent={false}
//       animationType="slide"
//       onRequestClose={onClose}  >
//       <View style={styles.container}>

//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={onClose}>
//             {/* <Text style={styles.back}>←</Text> */}
//             <Image source={BackIcon} style={styles.back} />
//           </TouchableOpacity>

//           <View>
//             <Text style={styles.title}>Manual Documents</Text>
//             {/* <Text style={styles.subtitle}>{customerdetails?.fullName} </Text> */}
//           </View>

//           <Text style={styles.count}>
//             {currentIndex + 1} / {imageDocs?.length}
//           </Text>
//         </View>

//         {/* Image Swipe */}
//         <ScrollView
//           horizontal
//           pagingEnabled
//           showsHorizontalScrollIndicator={false}
//           onScroll={handleScroll}
//           scrollEventThrottle={16}
//         >
//           {imageDocs.map((doc, index) => (
//             <View key={index} style={styles.imageContainer}>

//               <Image
//                 source={{ uri: doc.documentUrl || doc?.docFileUrl }}
//                 style={styles.image}
//                 resizeMode="contain"
//               />
//             </View>
//           ))}
//         </ScrollView>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <TouchableOpacity style={styles.shareBtn}
//           onPress={()=>handleDownload(doc.documentUrl || doc?.docFileUrl)}>
//             <Text style={styles.shareText}>Share</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.downloadBtn}>
//             <Text style={styles.downloadText}>Download</Text>
//           </TouchableOpacity>
//         </View>

//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     backgroundColor: "#1f1f1f"
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingTop: 50,
//     paddingHorizontal: 16,
//     justifyContent: "space-between"
//   },

//   back: {
//     color: "#fff",
//     height: 20, width: 25,
//     transform: "rotate(90deg)"

//     // fontSize: 22
//   },

//   title: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600"
//   },

//   subtitle: {
//     color: "#bbb",
//     fontSize: 12
//   },

//   count: {
//     color: "#fff",
//     fontSize: 14
//   },

//   imageContainer: {
//     width,
//     justifyContent: "center",
//     alignItems: "center"
//   },

//   image: {
//     width: width - 40,
//     height: 250,
//     borderRadius: 10
//   },

//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 20
//   },

//   shareBtn: {
//     borderWidth: 1,
//     borderColor: "#fff",
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 10
//   },

//   shareText: {
//     color: "#fff"
//   },

//   downloadBtn: {
//     backgroundColor: "#2563EB",
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 10
//   },

//   downloadText: {
//     color: "#fff"
//   }

// });


import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  BackHandler,
  NativeModules,
} from "react-native";

import BackIcon from "../../assets/Images/LeftArrow.png";

const { width } = Dimensions.get("window");

export default function DocumentViewer({
  visible,
  documents = [],
  initialIndex = 0,
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const scrollRef = useRef(null);

  const { CommonModule } = NativeModules;

  const imageDocs = documents.filter(
    doc => doc?.documentFileType === "IMAGE" ||
           doc?.docFileType === "IMAGE"
  );

  // Current document and URL
  const currentDocument = imageDocs[currentIndex];

  const currentDocumentUrl =
    currentDocument?.documentUrl || currentDocument?.docFileUrl;

  // Open previously selected document
  useEffect(() => {
    if (visible) {
      const validIndex = Math.max(
        0,
        Math.min(initialIndex, imageDocs.length - 1)
      );

      setCurrentIndex(validIndex);

      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          x: validIndex * width,
          animated: false,
        });
      });
    }
  }, [visible, initialIndex, imageDocs.length]);

  const handleScroll = event => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    setCurrentIndex(slideIndex);
  };

  // Hardware back
  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose?.();
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [visible, onClose]);

  // Download current document
  const handleDownload = () => {
    if (currentDocumentUrl) {
      CommonModule.downloadPDF(currentDocumentUrl);
    }
  };

  // Share current document
  const handleShare = () => {
    if (currentDocumentUrl) {
      CommonModule.sharePDF(currentDocumentUrl,"Sharing the PDF");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Image source={BackIcon} style={styles.back} />
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>Manual Documents</Text>
          </View>

          <Text style={styles.count}>
            {imageDocs.length > 0 ? currentIndex + 1 : 0} / {imageDocs.length}
          </Text>
        </View>

        {/* Image Swipe */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {imageDocs.map((doc, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image
                source={{
                  uri: doc.documentUrl || doc?.docFileUrl,
                }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            disabled={!currentDocumentUrl}
          >
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={handleDownload}
            disabled={!currentDocumentUrl}
          >
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  back: {
    height: 20,
    width: 25,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  count: {
    color: "#fff",
    fontSize: 14,
  },
  imageContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width - 40,
    height: 250,
    borderRadius: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  shareBtn: {
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  shareText: {
    color: "#fff",
  },
  downloadBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  downloadText: {
    color: "#fff",
  },
});
