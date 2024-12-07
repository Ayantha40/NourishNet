import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';

const Account = () => {
  const { user, LogOut } = useGlobalContext();

  const handleLogout = async () => {
    await LogOut(); // Log out the user
    router.replace('/login'); // Redirect to the login page
  };

  if (!user) {
    return (
      <SafeAreaView className="bg-primary h-full flex justify-center items-center">
        <Text className="text-lg text-white">Loading user information...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full p-4">
      {/* Container for Logo and Heading */}
      <View style={{ width: '100%', position: 'relative', alignItems: 'center' }}>
        {/* Logo at the Top Left */}
        <Image
          source={require('../../assets/images/logo.png')}
          style={{
            width: 200,
            height: 100,
            position: 'absolute',
            left: 2,
            top: 4, 
          }}
        />

        {/* My Account Heading */}
        <Text style={{
          fontSize: 24,
          color: '#FF9C01',
          fontFamily: 'K2D-Bold',
          marginTop: 100,
          textAlign: 'center',
        }}>
          My Account
        </Text>
      </View>

      {/* Profile Information Section */}
      <View className="flex-1 justify-center items-center">
        {/* Avatar Image */}
        <Image
          source={require('../../assets/images/profile.png')} // Load the local sample image
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 20,
            borderWidth: 2,
            borderColor: 'white',
          }}
        />

        {/* Username */}
        <View style={{ marginBottom: 10, alignItems: 'center' }}>
          <Text style={{
            fontSize: 18,
            color: '#FF9C01', // Label color
            fontFamily: 'K2D-Bold',
          }}>
            UserName
          </Text>
          <Text style={{
            fontSize: 18,
            color: '#D3D3D3',
            fontFamily: 'K2D-Regular',
          }}>
            {user.username}
          </Text>
        </View>

        {/* Contact Number */}
        {user.contactno && (
          <View style={{ marginBottom: 10, alignItems: 'center' }}>
            <Text style={{
              fontSize: 18,
              color: '#FF9C01', // Label color
              fontFamily: 'K2D-Bold',
            }}>
              Contact No
            </Text>
            <Text style={{
              fontSize: 18,
              color: '#D3D3D3',
              fontFamily: 'K2D-Regular',
            }}>
              {user.contactno}
            </Text>
          </View>
        )}

        {/* Email */}
        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={{
            fontSize: 18,
            color: '#FF9C01', // Label color
            fontFamily: 'K2D-Bold',
          }}>
            Email
          </Text>
          <Text style={{
            fontSize: 18,
            color: '#D3D3D3',
            fontFamily: 'K2D-Regular',
          }}>
            {user.email}
          </Text>
        </View>

        {/* Horizontal Line Divider */}
        <View style={{ width: '80%', height: 2, backgroundColor: '#FF9C01', marginVertical: 20 }} />

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout}>
          <Image
            source={require('../../assets/icons/logout.png')}
            style={{ width: 28, height: 26 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Account;
