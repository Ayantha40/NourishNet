import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.NourishNet.nourishnet',
    projectId: '66bea1b5001892760402',
    databaseId: '66bea7af000978953ed2',
    userCollectionId: '66bea7fc001a3586550e',
    imageCollectionId: '66bea85c0035506994f6',
    foodRequestCollectionId: '66d28e77001c13c1a701',  
    foodAlertCollectionId: '66d31ef50032d609caf7',   
    storageId: '66beabbe002b93de76f5'
};

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) 
    .setProject(config.projectId)  
    .setPlatform(config.platform);  

export const account = new Account(client); 
export const avatars = new Avatars(client);
export const databases = new Databases(client);

export const updateMatchStatus = async (item) => {
    try {
      await databases.updateDocument(
        config.databaseId, // Ensure config is used here
        config.foodAlertCollectionId, // Ensure this is the correct collection ID
        item.$id, // Document ID for the item
        {
          isMatched: true // Set isMatched to true when accepted
        }
      );
      console.log('Match status updated successfully');
    } catch (error) {
      console.error("Error updating match status:", error.message);
      throw new Error(error.message);
    }
  };
  

// Fetch food requests made by the current user
export const fetchUserFoodRequests = async (userId) => {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.foodRequestCollectionId,  // Collection ID for food requests
        [
          Query.equal("accountId", userId)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching user food requests:", error.message);
      throw new Error(error.message);
    }
  };

// Fetch food alerts (posted by others) matching the user's location and only non-matched ones
export const fetchFoodAlerts = async (location) => {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.foodAlertCollectionId,
            [
                Query.equal("location", location),  // Filter by location
                Query.equal("isMatched", false),    // Ensure only unmatched alerts are returned
                Query.greaterThanEqual("expirationDate", new Date().toISOString())  // Filter by future dates
            ]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching food alerts:", error.message);
        throw new Error(error.message);
    }
};

// Fetch food alerts that match the current user's donations (user's own alerts)
export const fetchFoodAlertMatches = async (userId) => {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.foodAlertCollectionId,
        [
          Query.equal("accountId", userId)
        ]
      );
      
      // Ensure that the isMatched field is correctly checked
      const alertsWithMatchStatus = response.documents.map(alert => ({
        ...alert,
        isMatched: alert.isMatched || false  // Ensure isMatched defaults to false if not present
      }));
  
      return alertsWithMatchStatus;
    } catch (error) {
      console.error("Error fetching food alert matches:", error.message);
      throw new Error(error.message);
    }
  };
  
// Function to get leaderboard data
export const getLeaderboardData = async () => {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [
                Query.orderDesc("donationCount"), // Sort by donation count
                Query.limit(5) // Limit to top 5 users
            ]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching leaderboard data:", error.message);
        throw new Error(error.message);
    }
};

// Function to increment the user's donation count and points
export const incrementUserDonations = async (accountId) => {
    try {
        console.log("Increment Donations - accountId:", accountId); // Log for debugging

        // Fetch user document using the document ID as accountId
        const userDocument = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [
                Query.equal('$id', accountId) // Match the document ID with accountId
            ]
        );

        console.log("Fetched User Document:", userDocument); // Log for debugging

        if (userDocument.total === 0) {
            throw new Error('User document not found');
        }

        const userData = userDocument.documents[0];

        // Increment the donationCount and points
        const updatedDonationCount = (userData.donationCount || 0) + 1;
        const updatedPoints = (userData.points || 0) + 100; // Example points calculation

        // Update the user document with new donation count and points
        await databases.updateDocument(
            config.databaseId,
            config.userCollectionId,
            userData.$id,
            {
                donationCount: updatedDonationCount,
                points: updatedPoints
            }
        );

        console.log("User donations incremented successfully");
    } catch (error) {
        console.error("Error incrementing user donations:", error.message);
        throw new Error(error.message);
    }
};

// Function to save a food alert
export const saveFoodAlert = async (formData, accountId) => {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.foodAlertCollectionId, // Use the correct collection ID for food alerts
            ID.unique(),
            {
                foodType: formData.dfoodtype,
                quantity: parseInt(formData.dquantity, 10),
                specialNotes: formData.dspecialnotes,
                location: formData.dlocation,
                expirationDate: formData.expirationDate, // Save as ISO string
                accountId: accountId, // Save the account ID of the donor
                isMatched: false // Ensure this is initialized to false
            }
        );

        console.log("Food Alert saved:", response);
        return response;
    } catch (error) {
        console.error("Error saving food alert:", error.message);
        throw new Error(error.message);
    }
};

// Function to save a food request
export const saveFoodRequest = async (formData, accountId) => {
    console.log("accountId passed to saveFoodRequest:", accountId); // Add this line

    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.foodRequestCollectionId,
            ID.unique(),
            {
                foodType: formData.rfoodtype,
                quantity: parseInt(formData.rquantity, 10),
                specialNotes: formData.rspecialnotes,
                location: formData.rlocation,
                accountId: accountId
            }
        );

        console.log("Food Request saved:", response);
        return response;
    } catch (error) {
        console.error("Error saving food request:", error.message);
        throw new Error(error.message);
    }
};

// Function to create a new user
export const createUser = async (email, password, username, contactno) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw new Error('Failed to create user account');

        const avatarUrl = avatars.getInitials(username);

        await LogIn(email, password);

        // Debug: Log account details to verify role
        console.log("Account created:", newAccount);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                contactno: parseInt(contactno, 10),
                avatar: avatarUrl,
            }
        );

        // Debug: Log newUser object
        console.log("New User Document:", newUser);

        return newUser;

    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error(error.message);
    }
};

// Function to log in a user
export const LogIn = async (email, password) => {
    try {
        const response = await account.createEmailPasswordSession(email, password);
        return response;
    } catch (error) {
        console.error("Login failed:", error.message);
        throw new Error(error.message);
    }
};

// Function to fetch the currently logged-in user
export const getCurrentUser = async () => {
    try {
        const currentUser = await account.get();
        if (currentUser) {
            console.log("Fetched Current User:", currentUser);

            // Fetch additional user details from the "Users" collection using the user's Appwrite Auth ID
            const userDocument = await databases.listDocuments(
                config.databaseId,
                config.userCollectionId,
                [
                    Query.equal('accountId', currentUser.$id) // Match accountId with the current user's $id
                ]
            );

            if (userDocument.total > 0) {
                const userDetails = userDocument.documents[0]; // Get the first matching document
                console.log("User details from database:", userDetails);
                return {
                    ...currentUser,
                    ...userDetails, // Merge Auth user details with database user details
                };
            } else {
                console.error("No user document found in database.");
                return currentUser; // Return only Auth details if no additional user document found
            }
        } else {
            console.log("No user session found.");
            return null;
        }
    } catch (error) {
        // console.error("Failed to fetch current user:", error.message);
        return null;
    }
};

// Function to log out the current user
export const LogOut = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        console.error("Logout failed:", error.message);
        throw new Error(error.message);
    }
};
