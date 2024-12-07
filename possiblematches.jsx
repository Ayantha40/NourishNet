import { View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';  // Import context for notifications
import { images } from '../../constants';  // Ensure correct path for images
import { getCurrentUser } from '../../lib/appwrite';
import { fetchFoodAlerts, fetchFoodAlertMatches, fetchUserFoodRequests, updateMatchStatus } from '../../lib/appwrite';
import * as Location from 'expo-location';
import { databases } from '../../lib/appwrite';
import { config } from '../../lib/appwrite';

const PossibleMatches = () => {
  const { user, notifications, setNotifications } = useGlobalContext();  // Access notifications from context
  const [foodRequestMatches, setFoodRequestMatches] = useState([]);
  const [foodAlertMatches, setFoodAlertMatches] = useState([]);
  const [userFoodRequests, setUserFoodRequests] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);  // To toggle notification view

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        if (!user) {
          Alert.alert("Error", "User not logged in.");
          return;
        }

        const location = await fetchUserLocation();
        if (!location) return;
        setUserLocation(location);

        const userRequests = await fetchUserFoodRequests(user.$id);
        setUserFoodRequests(userRequests);

        let requestMatches = [];
        if (userRequests.length > 0) {
          requestMatches = await fetchFoodAlerts(location);
          setFoodRequestMatches(requestMatches);
        }

        const alertMatches = await fetchFoodAlertMatches(user.$id);
        setFoodAlertMatches(alertMatches);

        // Only create notifications if there are actual matches
        const newNotifications = [];

        // Check if any food alerts are matched
        const matchedAlerts = alertMatches.filter(alert => alert.isMatched);
        if (matchedAlerts.length > 0) {
          newNotifications.push({ message: "Your Food Alert Has Been Matched!", type: 'alert' });
        }

        // Notify about new food postings for users with requests
        if (requestMatches.length > 0) {
          newNotifications.push({ message: "New Food Postings Are Available!", type: 'request' });
        }

        // Update notifications in global state
        setNotifications(newNotifications);

      } catch (error) {
        console.error("Error loading matches:", error.message);
        Alert.alert("Error", "Unable to load matches.");
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [setNotifications]);

  const fetchUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to fetch your location.');
        return null;
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let address = reverseGeocode[0];
      let formattedAddress = `${address.street}, ${address.city}, ${address.region}, ${address.country}`;
      return formattedAddress;
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert("Error", "Could not fetch your location. Please try again.");
      return null;
    }
  };

  const handleAccept = async (item) => {
    try {
      Alert.alert(
        'Delivery Options',
        `You Accepted ${item.foodType}, Choose Your Delivery Method:`,
        [
          { text: 'Self Pickup', onPress: async () => await updateMatchStatus(item) },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error("Error handling accept:", error.message);
    }
  };

  const updateMatchStatus = async (item) => {
    try {
      await databases.updateDocument(
        config.databaseId,
        config.foodAlertCollectionId,
        item.$id,
        {
          isMatched: true
        }
      );

      setFoodRequestMatches(prevMatches => prevMatches.filter(match => match.$id !== item.$id));

      console.log("Alert successfully matched and removed from list");
    } catch (error) {
      console.error("Error updating match status:", error.message);
      Alert.alert("Error", "Failed to update match status.");
    }
  };

  // Function to handle notification icon click (show notifications and clear them)
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications); // Toggle visibility instead of clearing immediately
  };

  // Function to remove notification after it is viewed
  const removeNotification = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);  // Remove the clicked notification
    setNotifications(updatedNotifications);  // Update global notifications
  };

  const renderRequestMatchCard = ({ item }) => (
    <View style={{
      backgroundColor: 'black',
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      marginHorizontal: 16,
    }}>
      <Text style={{ fontSize: 18, color: '#CDCDE0', fontFamily: 'K2D-SemiBold' }}>Food Type: {item.foodType || 'N/A'}</Text>
      <Text style={{ fontSize: 14, color: '#FFF', fontFamily: 'K2D-Regular', marginVertical: 4 }}>Special Notes: {item.specialNotes || 'N/A'}</Text>
      <Text style={{ fontSize: 14, color: '#FFF', fontFamily: 'K2D-Regular' }}>Expiration Date: {item.expirationDate ? new Date(item.expirationDate).toDateString() : 'N/A'}</Text>
      <Text style={{ fontSize: 14, color: '#FFF', fontFamily: 'K2D-Regular' }}>Quantity: {item.quantity || 'N/A'}</Text>
      <Text style={{ fontSize: 14, color: '#FFF', fontFamily: 'K2D-Regular' }}>Location: {item.location || 'N/A'}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
        <TouchableOpacity onPress={() => handleAccept(item)} style={{ backgroundColor: '#00FF00', padding: 10, borderRadius: 10 }}>
          <Text style={{ color: 'black', fontFamily: 'K2D-SemiBold' }}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAlertMatchItem = (item) => (
    <View key={item.$id ? item.$id.toString() : Math.random().toString()} style={{
      backgroundColor: 'black',
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      marginHorizontal: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, color: '#FFF', fontFamily: 'K2D-Regular' }}>Food Type: {item.foodType}</Text>
        <Text style={{ fontSize: 14, color: '#AAA', fontFamily: 'K2D-Regular' }}>Special Notes: {item.specialNotes}</Text>
        <Text style={{ fontSize: 14, color: '#FFF', fontFamily: 'K2D-Regular' }}>Posted Date: {new Date(item.$createdAt).toDateString()}</Text>
      </View>
      {item.isMatched && (
        <Image 
          source={require('../../assets/images/tick.png')} 
          style={{ width: 20, height: 20 }} // Success tick icon
        />
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ backgroundColor: '#161622', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#FFF', fontSize: 24, fontFamily: 'K2D-SemiBold', textAlign: 'center' }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#161622', flex: 1 }}>
      {/* Header with Notification Icon */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 }}>
        <Text style={{ fontSize: 24, color: '#FFF', fontFamily: 'K2D-SemiBold' }}>Possible Matches</Text>
        <TouchableOpacity onPress={handleNotificationClick} style={{ position: 'relative' }}>
          <Image source={images.empty} style={{ width: 30, height: 30 }} />
          {notifications.length > 0 && (
            <View style={{
              position: 'absolute',
              top: -5,
              right: -5,
              backgroundColor: 'red',
              borderRadius: 10,
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{ color: 'white', fontSize: 12 }}>{notifications.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Show notifications if any */}
      {showNotifications && (
        <View style={{ paddingHorizontal: 16 }}>
          {notifications.map((notification, index) => (
            <TouchableOpacity key={index} onPress={() => removeNotification(index)}>
              <View style={{ backgroundColor: 'black', padding: 16, borderRadius: 10, marginBottom: 10 }}>
                <Text style={{ color: 'white', fontSize: 16 }}>{notification.message}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Display matches and alerts */}
      <FlatList
        data={userFoodRequests.length === 0 && foodAlertMatches.length === 0 ? [] : foodRequestMatches} 
        ListHeaderComponent={
          <>
            <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
              <Text style={{ fontSize: 20, color: '#FF9C01', fontFamily: 'K2D-SemiBold', marginBottom: 8 }}>Nourish Matches</Text>
            </View>

            {userFoodRequests.length === 0 && (
              <View style={{ paddingHorizontal: 16, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'black', borderRadius: 16, padding: 20 }}>
                  <Text style={{ color: '#FFF', fontSize: 16 }}>You Have not Made any Food Requests Yet. Post Your First Food Request!</Text>
                </View>
              </View>
            )}
          </>
        }
        renderItem={renderRequestMatchCard}
        keyExtractor={item => item.$id ? item.$id.toString() : Math.random().toString()} 
        ListFooterComponent={
          <>
            <View style={{ paddingHorizontal: 16 }}>
              <View style={{ height: 2, backgroundColor: 'white', marginVertical: 8, marginTop: 16 }} />
              <Text style={{ fontSize: 20, color: '#FF9C01', fontFamily: 'K2D-SemiBold', marginBottom: 8, marginTop: 4 }}>Nourish Alerts</Text>
              {foodAlertMatches.length === 0 ? (
                <View style={{ paddingHorizontal: 16, marginVertical: 10 }}>
                  <View style={{ backgroundColor: 'black', borderRadius: 16, padding: 20 }}>
                    <Text style={{ color: '#FFF', fontSize: 16 }}>You Have not Made any Food Alerts Yet. Post Your First Food Alert!</Text>
                  </View>
                </View>
              ) : (
                foodAlertMatches.map(renderAlertMatchItem)
              )}
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default PossibleMatches;
