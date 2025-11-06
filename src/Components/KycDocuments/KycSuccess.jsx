import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const KycSuccessDesign = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.outerMostCircle}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Icon name="checkmark" size={40} color="#fff" />
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.title}>Succeeded</Text>
      <Text style={styles.subtitle}>
        Your KYC Details were{'\n'}Uploaded to Digilocker.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default KycSuccessDesign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 150,
  },
  iconContainer: {
    marginBottom: 30,
  },
  outerMostCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(227, 233, 255, 0.61)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(127, 153, 255, 0.27)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2D6CDF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: 'rgba(156, 156, 156, 1)',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#2D6CDF',
    paddingVertical: 14,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
