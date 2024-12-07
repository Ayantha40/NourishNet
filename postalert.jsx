import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Updates from 'expo-updates'; // Import Updates from expo-updates
import { icons, images } from '../../constants';
import FormField from '../../components/FormField';
import Dropdown from '../../components/Dropdown';
import LocationPicker from '../../components/LocationPicker';
import CustomButton from '../../components/CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCurrentUser, saveFoodAlert, incrementUserDonations } from '../../lib/appwrite';
import api from '../../lib/api'; // Import the API instance

const PostAlert = () => {
  const [form, setForm] = useState({
    dfoodtype: '',
    dquantity: '',
    dspecialnotes: '',
    expirationDate: new Date(),
    image: null,
    dlocation: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Function to request location permissions and fetch user's location
  const fetchUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to fetch your location.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let address = reverseGeocode[0];
      let formattedAddress = `${address.street}, ${address.city}, ${address.region}, ${address.country}`;
      setForm({ ...form, dlocation: formattedAddress });

    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  // Open camera to capture an image
  const openCamera = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0] });
    }
  };

  // Function to discard the captured image
  const discardImage = () => {
    setForm({ ...form, image: null });
  };

  // Validate the form before submission
  const validateForm = () => {
    if (!form.dfoodtype) {
      Alert.alert('Validation Error', 'Please Select a Food Type.');
      return false;
    }
    if (!form.dquantity) {
      Alert.alert('Validation Error', 'Please Enter the Quantity.');
      return false;
    }
    if (form.expirationDate < new Date()) {
      Alert.alert('Validation Error', 'Expiration Date Cannot Be in the Past.');
      return false;
    }
    if (form.dfoodtype === 'Fruits and Vegetables' && !form.image) {
      Alert.alert('Validation Error', 'Please Capture an Image of the Food Item.');
      return false;
    }
    return true;
  };

  // Function to submit the image to the FastAPI server for classification
  const submitImageForClassification = async () => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: form.image.uri,
        name: 'photo.jpg',
        type: 'image/jpeg'
      });

      const response = await api.post('/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { isFresh } = response.data;
      
      // If the item is rotten, alert the user and stop submission
      if (!isFresh) {
        Alert.alert("Warning", "The Item is Classified as Rotten and Cannot be Donated.");
        setIsSubmitting(false); // Stop the submission
        return false;
      }

      return true;  // Return true if the item is fresh
    } catch (error) {
      console.error('Error classifying image:', error);
      Alert.alert('Error', 'Failed to classify the image');
      setIsSubmitting(false);  // Stop the submission on error
      return false;
    }
  };

  const submit = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setIsSubmitting(true);
    try {
      // Fetch the current user from Appwrite
      const user = await getCurrentUser();

      // Ensure the correct user is logged in and get their accountId
      if (!user || !user.$id) {
        Alert.alert('Error', 'User is not logged in or account ID is missing.');
        setIsSubmitting(false);
        return;
      }

      console.log("User Account ID:", user.$id);  // Log for debugging

      // Only classify image if it's Fruits and Vegetables and image is provided
      if (form.dfoodtype === 'Fruits and Vegetables' && form.image) {
        const isFresh = await submitImageForClassification();
        if (!isFresh) {
          // If the item is rotten, stop the submission
          return;
        }
      }

      // Save the food alert with the correct accountId
      const alertData = {
        dfoodtype: form.dfoodtype,
        dquantity: form.dquantity,
        dspecialnotes: form.dspecialnotes,
        expirationDate: form.expirationDate.toISOString(),
        dlocation: form.dlocation,
        accountId: user.$id,  // Pass the correct account ID
        image: form.dfoodtype === 'Fruits and Vegetables' ? form.image.uri : null  // Conditionally include the image
      };

      const savedAlert = await saveFoodAlert(alertData, user.$id);

      console.log("Food Alert saved:", savedAlert);  // Log for debugging

      Alert.alert(
        'Success',
        'Food Alert Has Been Posted Successfully!',
        [{ text: 'OK', onPress: () => {
          resetForm();
          reloadApp(); // Trigger app reload on successful submission
        }}]
      );

      // Increment user donations after successful alert submission
      await incrementUserDonations(user.$id);

    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to reset the form fields while keeping the location intact
  const resetForm = () => {
    setForm({
      dfoodtype: '',
      dquantity: '',
      dspecialnotes: '',
      expirationDate: new Date(),
      image: null,
      dlocation: form.dlocation // Keep the location intact
    });
  };

  // Function to reload the app
  const reloadApp = async () => {
    try {
      await Updates.reloadAsync();  // Reload the app after submission
    } catch (error) {
      console.error("Error reloading app:", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || form.expirationDate;
    setShowDatePicker(false);
    setForm({ ...form, expirationDate: currentDate });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-ksemibold">
          Alert Food 
        </Text>

        <Image
          source={images.logoSmall}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 90,
            height: 35,
          }}
        />

        <View style={{ height: 2, backgroundColor: 'white', marginVertical: 8, marginTop: 16 }} />

        <Dropdown
          title="Food Type"
          options={['Vegetarian', 'Non-Vegetarian', 'Fruits and Vegetables', 'Dairy Products', 'Grains and Cereals', 'Proteins', 'Snacks', 'Beverages', 'Canned Goods', 'Baked Goods']}
          selectedValue={form.dfoodtype}
          onValueChange={(value) => setForm({ ...form, dfoodtype: value })}
          otherStyles={{ marginTop: 16 }}
        />

        <FormField
          title="Quantity"
          value={form.dquantity}
          placeholder="Enter the number of Portions or Units"
          keyboardType="numeric"
          handleChangeText={(e) => setForm({ ...form, dquantity: e })}
          otherStyles="mt-6"
        />

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 16, color: '#FFF', fontFamily: 'K2D-SemiBold', marginBottom: 8 }}>
            Expiration Date
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              backgroundColor: '#161622',
              padding: 16,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: '#FF9C01',
            }}
          >
            <Text style={{ color: '#CDCDE0', fontFamily: 'K2D-SemiBold', fontSize: 16 }}>
              {form.expirationDate.toDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={form.expirationDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              style={{
                backgroundColor: '#2D2D2D',
                color: '#FFF',
                borderRadius: 8,
                marginTop: 8,
              }}
            />
          )}
        </View>

        <FormField
          title="Special Notes"
          value={form.dspecialnotes}
          placeholder="Any Additional Notes"
          multiline={true}
          numberOfLines={6}
          handleChangeText={(e) => setForm({ ...form, dspecialnotes: e })}
          otherStyles="mt-6"
        />

        <LocationPicker
          title="Location"
          selectedLocation={form.dlocation}
          onLocationSelect={(dlocation) => setForm({ ...form, dlocation })}
          otherStyles="mt-6"
        />

        {/* Conditionally render the image picker if the food type is "Fruits and Vegetables" */}
        {form.dfoodtype === 'Fruits and Vegetables' && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 16, color: '#FFF', fontFamily: 'K2D-SemiBold', marginBottom: 8 }}>
              Upload Image
            </Text>

            {form.image ? (
              <View>
                <Image
                  source={{ uri: form.image.uri }}
                  resizeMode="cover"
                  style={{ width: '100%', height: 200, borderRadius: 16 }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <TouchableOpacity onPress={discardImage} style={{ backgroundColor: '#FF0000', padding: 10, borderRadius: 10 }}>
                    <Text style={{ color: 'black', fontFamily: 'K2D-SemiBold' }}>Discard</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={submit} style={{ backgroundColor: '#00FF00', padding: 10, borderRadius: 10 }}>
                    <Text style={{ color: 'black', fontFamily: 'K2D-SemiBold' }}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity onPress={openCamera}>
                <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                  <Image source={icons.upload} resizeMode="contain" className="w-5 h-5" />
                  <Text className="text-base text-gray-100 font-ksemibold">Capture Image</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}

        <CustomButton
          title="Post Alert"
          handlePress={submit}
          containerStyles="mt-8"
          isLoading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostAlert;
