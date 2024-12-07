import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images, images } from '../../constants';
import FormField from '../../components/FormField';
import { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { createUser } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const CreateAccount = () => {
  const { setUser, setisLoggedIn } = useGlobalContext(); // Accessing setUser from context

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    contactno: ''
  });

  const [isSubmitting, setisSubmitting] = useState(false);

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "" || form.contactno === "") {
      Alert.alert("Error", "Please Fill in all the Required Fields");
      return;
    }

    setisSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username, parseInt(form.contactno, 10)); // Convert contactno to integer
      setUser(result); // Correctly setting the user in global state
      setisLoggedIn(true);

      router.replace('/home');
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[88vh] px-4 my-6">
          <Image source={images.logo} className="w-[200px] h-[100px]" />

          <Text className="text-2xl text-secondary text-ksemibold mt-2 font-ksemibold">Create Account </Text>

          <FormField
            title="User Name"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
          />

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

          <FormField
            title="Contact Number"
            value={form.contactno}
            handleChangeText={(e) => {
              const newValue = e.replace(/[^0-9]/g, '');
              if (newValue.length <= 10) {
                setForm({ ...form, contactno: newValue });
              }
            }}
            otherStyles="mt-7"
            keyboardType="phone-pad"
          />

          <CustomButton 
            title="Create Account"
            handlePress={submit}
            containerStyles="mt-8"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-white font-ksemibold">
              Already have an Account ?
            </Text>
            <Link href="/login" className="text-lg font-ksemibold text-secondary"> Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAccount;
