import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getLeaderboardData } from '../lib/appwrite';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboardData();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error.message);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇'; // Gold Medal for 1st place
      case 2:
        return '🥈'; // Silver Medal for 2nd place
      case 3:
        return '🥉'; // Bronze Medal for 3rd place
      default:
        return '⭐'; // Star for other ranks
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard 🏆</Text>
      <View style={{ marginTop: 8 }}>
        {leaderboardData.map((user, index) => (
          <View key={user.$id} style={styles.rankContainer}>
            <Text style={styles.rankIcon}>{getRankIcon(index + 1)}</Text>
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.points}>{user.donationCount} pts</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: '#FF9C01',
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'K2D-SemiBold',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingVertical: 8,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  rankIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  username: {
    fontSize: 16,
    color: '#D3D3D3',
    fontFamily: 'K2D-Regular',
  },
  points: {
    fontSize: 16,
    color: '#FF9C01',
    fontFamily: 'K2D-SemiBold',
  },
});

export default Leaderboard;
