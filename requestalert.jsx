import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Updates from 'expo-updates'; // Import Updates from expo-updates
import { images } from '../../constants';
import FormField from '../../components/FormField';
import Dropdown from '../../components/Dropdown';  
import LocationPicker from '../../components/LocationPicker';
import CustomButton from '../../components/CustomButton';
import { useGlobalContext } from '../../context/GlobalProvider';
import { saveFoodRequest } from '../../lib/appwrite';

const RequestAlert = () => {
  const { user } = useGlobalContext();

  const [form, setForm] = useState({
    rfoodtype: '',
    rquantity: '',
    rspecialnotes: '',
    rlocation: ''
  });

  const [isSubmitting, setisSubmitting] = useState(false);

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

      if (formattedAddress.length > 50) {
        formattedAddress = formattedAddress.substring(0, 50) + '...';
      }

      setForm({ ...form, rlocation: formattedAddress });

    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const validateForm = () => {
    if (!form.rfoodtype) {
      Alert.alert('Validation Error', 'Please Select a Food Type.');
      return false;
    }
    if (!form.rquantity) {
      Alert.alert('Validation Error', 'Please Enter the Quantity.');
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validateForm()) {
      return;
    }

    setisSubmitting(true);
    try {
      console.log("Form Data:", form);
      console.log("User Account ID:", user.$id);
      await saveFoodRequest(form, user.$id);

      Alert.alert('Success', 'Food Request Has Been Posted Successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setForm({
              rfoodtype: '',
              rquantity: '',
              rspecialnotes: '',
              rlocation: form.rlocation // Keep the current location value
            });
            reloadApp(); // Trigger app reload after submission
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setisSubmitting(false);
    }
  };

  // Function to reload the app
  const reloadApp = async () => {
    try {
      await Updates.reloadAsync(); // Reload the app to reflect changes
    } catch (error) {
      console.error("Error reloading app:", error);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-ksemibold">
         Request Food 
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

        <View style={{ height: 2, backgroundColor: 'white', marginVertical: 8, marginTop: 16}} />

        <Dropdown
          title="Food Type"
          options={['Vegetarian', 'Non-Vegetarian', 'Fruits and Vegetables', 'Dairy Products', 'Grains and Cereals', 'Proteins', 'Snacks', 'Beverages', 'Canned Goods', 'Baked Goods']}
          selectedValue={form.rfoodtype}
          onValueChange={(value) => setForm({ ...form, rfoodtype: value })}
          otherStyles={{ marginTop: 16 }}
        />

        <FormField
          title="Quantity"
          value={form.rquantity}
          placeholder="Enter the number of Portions Required"
          keyboardType="numeric"
          handleChangeText={(e) => setForm({ ...form, rquantity: e })}
          otherStyles="mt-6"
        />

        <LocationPicker
          title="Location"
          selectedLocation={form.rlocation}
          onLocationSelect={(rlocation) => setForm({ ...form, rlocation })}
          otherStyles="mt-6"
        />

        <FormField
          title="Special Notes"
          value={form.rspecialnotes}
          placeholder="Any Additional Notes"
          multiline={true}
          numberOfLines={6}
          handleChangeText={(e) => setForm({ ...form, rspecialnotes: e })}
          otherStyles="mt-6"
        />

        <CustomButton 
          title="Post Request"
          handlePress={submit}
          containerStyles="mt-8"
          isLoading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestAlert;
