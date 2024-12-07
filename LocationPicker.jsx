import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const LocationPicker = ({ title, selectedLocation, onLocationSelect, otherStyles }) => {
  return (
    <View style={[styles.container, otherStyles]}>
      <Text style={styles.label}>{title}</Text>
      <TextInput
        value={selectedLocation}
        onChangeText={(text) => onLocationSelect(text)}
        placeholder="Enter Your Location"
        placeholderTextColor="#7b7b8b"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'K2D-SemiBold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#161622', 
    color: '#FFF', 
    borderRadius: 16, 
    borderWidth: 2,
    borderColor: '#FF9C01', 
    paddingHorizontal: 20,
    paddingVertical: 20, 
    fontFamily: 'K2D-SemiBold', 
    fontSize: 16,
  },
});

export default LocationPicker;
