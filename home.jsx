import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';
import { images } from '../../constants';
import fetchTipsFromGemini from '../../utils/fetchTipsFromGemini'; 
import Leaderboard from '../../components/Leaderboard';  // Import the Leaderboard component

// Component for Tips and Suggestions UI
const TipsAndSuggestions = ({ tips }) => (
  <View style={{
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  }}>
    <Text style={{
      fontSize: 18,
      color: '#FF9C01',
      fontWeight: 'bold',
      marginBottom: 8,
      fontFamily: 'K2D-SemiBold',
    }}>
      Savvy Sustainability Tips 🌿
    </Text>
    {tips.map((tip, index) => (
      <View key={index} style={{
        backgroundColor: '#008080',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
      }}>
        <Text style={{
          fontSize: 16,
          color: '#D3D3D3',
          fontFamily: 'K2D-Regular',
        }}>
          {index + 1}. {tip}
        </Text>
      </View>
    ))}
  </View>
);

const Home = () => {
  const { user } = useGlobalContext();
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const loadTips = async () => {
      const generatedTips = await fetchTipsFromGemini();
      setTips(generatedTips);
    };

    loadTips();
  }, []);

  if (!user) {
    return (
      <SafeAreaView className="bg-primary h-full flex justify-center items-center">
        <Text className="text-lg text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        ListHeaderComponent={() => (
          <View style={{ marginVertical: 24, paddingHorizontal: 16 }}>
            {/* Welcome Section */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 20, color: '#fff', marginTop: 8, fontFamily: 'K2D-Bold' }}>
                Welcome Back, {'\n'}
                {user.username ? user.username : 'User'} {/* Default fallback */}
              </Text>
              <Image
                source={images.logoSmall}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 0,
                  width: 90,
                  height: 45,
                }}
              />
            </View>
            {/* Horizontal Line Divider */}
            <View style={{ height: 2, backgroundColor: 'white', marginVertical: 8 }} />
            {/* Tips and Suggestions Section */}
            <TipsAndSuggestions tips={tips} />
            {/* Horizontal Line Divider */}
            <View style={{ height: 2, backgroundColor: 'white', marginVertical: 8 }} />
            {/* Leaderboard Section */}
            <Leaderboard />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
