import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Dropdown = ({ title, options, selectedValue, onValueChange, otherStyles }) => {
  return (
    <View style={[styles.container, otherStyles]}>
      <Text style={styles.title}>
        {title}
      </Text>
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => onValueChange(itemValue)}
          style={styles.picker}
          dropdownIconColor="#FFF"
        >
          <Picker.Item label="Please Select" value="" color="#8D8D8D" />
          {options.map((option, index) => (
            <Picker.Item
              label={option}
              value={option}
              key={index}
              color="black"
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'K2D-SemiBold',
    marginBottom: 8,
  },
  dropdownContainer: {
    borderWidth: 2,
    borderColor: '#FF9C01',
    backgroundColor: '#161622',
    borderRadius: 16,
    paddingVertical: 6, 
    paddingHorizontal: 2, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    color: '#FFF',
    fontFamily: 'K2D-SemiBold',
    flex: 1,
    backgroundColor: '#161622',
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
  },
});

export default Dropdown;
