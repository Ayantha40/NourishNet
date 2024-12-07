import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Images, images } from '../../constants';
import FormField from '../../components/FormField';
import { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { getCurrentUser, LogIn } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const LogInScreen = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [isSubmitting, setisSubmitting] = useState(false);
  const { setUser, setisLoggedIn } = useGlobalContext(); // Accessing setUser and setisLoggedIn from context

  const submit = async () => {
    if (form.email === "" || form.password === "") {
        Alert.alert("Error", "Please Fill in all the Required Fields");
        return; 
    }

    setisSubmitting(true);

    try {
        // Log the user in
        await LogIn(form.email, form.password);

        // Fetch the current user immediately after login
        const result = await getCurrentUser();
        
        // Ensure the result contains the necessary user data
        if (result) {
            setUser(result);
            setisLoggedIn(true);
            console.log("User logged in successfully:", result); // Add this for debugging
            Alert.alert("Success", "User Logged in Successfully!");
            router.replace('/home');
        } else {
            Alert.alert("Error", "Failed to fetch user information after login.");
        }

    } catch (error) {
        Alert.alert("Error", error.message);
        console.error("Login Error:", error); // Add this for debugging
    } finally {
        setisSubmitting(false);
    }
};


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[88vh] px-4 my-6">
          <Image source={images.logo} className="w-[200px] h-[100px]" />

          <Text className="text-2xl text-secondary text-ksemibold mt-2 font-ksemibold">Log In </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry
          />

          <CustomButton 
            title="Log In"
            handlePress={submit}
            containerStyles="mt-8"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-white font-ksemibold">
              Don't have an Account ?
            </Text>
            <Link href="/createaccount" className="text-lg font-ksemibold text-secondary"> Sign Up </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default LogInScreen;
