import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import uploadimg from '../../assets/Images/camera.png';
import { pickFileOrImage } from '../UploadFileScreen/uploadFilePage';
import SuccessModal from '../ToastFile/TostFilePage';

export default function KYCUpload({ navigation }) {
  const [selectedType, setSelectedType] = useState('Aadhar');
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSelectType = type => setSelectedType(type);

  const handleFilePick = async side => {
    try {
      const file = await pickFileOrImage('all');
      console.log('Selected file:', file);
      if (!file) return;

      side === 'front' ? setFrontFile(file) : setBackFile(file);
    } catch (error) {
      console.log('Error picking file:', error);
      Alert.alert('Error', 'Unable to pick file. Please try again.');
    }
  };
  const handleSubmitKYC = () => {
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
      navigation.navigate('KycSuccess');
    }, 2000);
  };

  const isImageFile = file => {
    if (!file) return false;

    return (
      file.isImage ||
      file.type?.startsWith('image/') ||
      file.name?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ||
      file.uri?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
    );
  };

  const renderFilePreview = file => {
    if (!file) return null;

    if (isImageFile(file)) {
      return (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: file.uri }} style={styles.uploadedImage} />
          <View></View>
        </View>
      );
    } else {
      return (
        <View style={styles.fileContainer}>
          <Text style={styles.fileIcon}>📄</Text>

          <Text style={styles.fileType}>
            {file.type?.split('/')[1]?.toUpperCase() || 'FILE'}
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="KYC Submitted Successfully!"
        type="sucess"
      />
      <Text style={styles.title}>Verify KYC</Text>

      <Text style={styles.subtitle}>Choose Document Type</Text>
      <View style={styles.typeContainer}>
        {['Aadhar', 'Pan Card', 'Others'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.activeTypeButton,
            ]}
            onPress={() => handleSelectType(type)}
          >
            <Text
              style={[
                styles.typeText,
                selectedType === type && styles.activeTypeText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.uploadTitle}>Upload ID Proof</Text>
      <Text style={styles.uploadSubtitle}>
        Please upload a valid government-issued ID proof (Aadhar, PAN, or
        others) to verify your identity and complete the registration process.
      </Text>

      <View style={styles.uploadContainer}>
        {/* Front */}
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => handleFilePick('front')}
        >
          {frontFile ? (
            renderFilePreview(frontFile)
          ) : (
            <View style={styles.placeholderContainer}>
              <Image
                source={uploadimg}
                style={styles.uploadedImG}
                resizeMode="contain"
              />
              <Text style={styles.uploadText}>Upload ID Front</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Back */}
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => handleFilePick('back')}
        >
          {backFile ? (
            renderFilePreview(backFile)
          ) : (
            <View style={styles.placeholderContainer}>
              <Image
                source={uploadimg}
                style={styles.uploadedImG}
                resizeMode="contain"
              />
              <Text style={styles.uploadText}>Upload ID Back</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          !(frontFile || backFile) && styles.disabledButton,
        ]}
        disabled={!(frontFile || backFile)}
        onPress={handleSubmitKYC}
      >
        <Text style={styles.submitText}>Submit KYC</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeTypeButton: {
    backgroundColor: '#1A73E8',
    borderColor: '#1A73E8',
  },
  typeText: {
    color: '#000',
    fontWeight: '500',
  },
  activeTypeText: {
    color: '#fff',
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#7C7C7C',
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: 'Gilroy',
    fontWeight: '400',
  },
  uploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  uploadBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    width: '47%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadText: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedImG: {
    width: 40,
    height: 40,
    tintColor: '#2F66F6',
    marginBottom: 8,
  },

  fileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
  },
  fileIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  fileName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  fileType: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
  },

  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  fileNameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 4,
  },

  submitButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginTop: 180,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#A8C1FF',
  },
});
