import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    profile_picture: '', // Initially empty, will be set from user data
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newImageUri, setNewImageUri] = useState(null);

  // Fetch user profile data
  const fetchProfileData = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        console.error('No username found in AsyncStorage');
        return;
      }

      const response = await fetch(`http://192.168.1.34/crimeless/api.php?action=profile&username=${username}`);
      const data = await response.json();

      if (data.error) {
        console.error('Error fetching profile data:', data.error);
      } else {
        setUserData(data.user);
        setNewImageUri(data.user.profile_picture); // Set the image URI from user data
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image picking
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log('Image Picker Result:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0]; // Access the first asset
      setNewImageUri(selectedImage.uri); // Set the new image URI
      await uploadProfilePicture(selectedImage.uri); // Directly upload the new image
    } else {
      Alert.alert('No Image Selected', 'Please select an image to upload.');
    }
  };

  // Upload the profile picture
  const uploadProfilePicture = async (imageUri) => {
    try {
      const currentUsername = userData.username;

      if (!imageUri) {
        Alert.alert('No Image Selected', 'Please select an image to upload.');
        return;
      }

      const response = await fetch(`http://192.168.1.34/crimeless/api.php?action=update_profile_picture&username=${currentUsername}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile_picture: imageUri }), // Send the image URI
      });

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (data.success) {
        Alert.alert('Profile picture updated successfully!');
        setUserData((prevState) => ({ ...prevState, profile_picture: imageUri })); // Update local state
      } else {
        console.error('Error updating profile picture:', data.error);
        Alert.alert('Error', data.error || 'Profile picture update failed.');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Error', 'Failed to upload profile picture.');
    }
  };

  // Handle saving changes to the profile
  const handleSaveChanges = async () => {
    try {
      const currentUsername = userData.username;

      const updatedProfile = {
        username: userData.username,
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        profile_picture: newImageUri || userData.profile_picture, // Include the new image URI if available
      };

      const response = await fetch(`http://192.168.1.34/crimeless/api.php?action=update_profile&username=${currentUsername}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (data.success) {
        Alert.alert('Profile updated successfully!');
        setIsEditing(false);
      } else {
        console.error('Error updating profile:', data.error);
        Alert.alert('Error', data.error || 'Profile update failed.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <LinearGradient colors={['#FF512F', '#F09819']} style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#E64A19" />
      ) : (
        <>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{ uri: newImageUri || userData?.profile_picture || 'https://via.placeholder.com/150' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <FontAwesome name="user" size={24} color="black" />
            <TextInput
              style={styles.infoText}
              value={userData.username}
              onChangeText={(text) => setUserData({ ...userData, username: text })}
              editable={isEditing}
            />
          </View>

          <View style={styles.infoCard}>
            <FontAwesome name="envelope" size={24} color="black" />
            <TextInput
              style={styles.infoText}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              editable={isEditing}
            />
          </View>

          <View style={styles.infoCard}>
            <FontAwesome name="phone" size={24} color="black" />
            <TextInput
              style={styles.infoText}
              value={userData.phone}
              onChangeText={(text) => setUserData({ ...userData, phone: text })}
              editable={isEditing}
            />
          </View>

          <View style={styles.infoCard}>
            <Entypo name="address" size={24} color="black" />
            <TextInput
              style={styles.infoText}
              value={userData.address}
              onChangeText={(text) => setUserData({ ...userData, address: text })}
              editable={isEditing}
            />
          </View>

          <TouchableOpacity
            style={isEditing ? styles.saveButton : styles.editButton}
            onPress={isEditing ? handleSaveChanges : () => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>{isEditing ? 'SAVE' : 'EDIT'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.logoutButtonText}>LOG OUT</Text>
          </TouchableOpacity>

          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Home')}>
              <FontAwesome name="list-alt" size={24} color="black" />
              <Text style={styles.tabText}>Feed</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Inbox')}>
              <FontAwesome name="envelope" size={24} color="black" />
              <Text style={styles.tabText}>Inbox</Text>
            </TouchableOpacity>

            <View style={styles.alertButtonContainer}>
              <TouchableOpacity style={styles.alertButton} onPress={() => navigation.navigate('Alert')}>
                <FontAwesome name="exclamation-circle" size={40} color="white" />
              </TouchableOpacity>
              <Text style={styles.alertButtonText}>ALERT</Text>
            </View>

            <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Games')}>
              <FontAwesome name="gamepad" size={24} color="black" />
              <Text style={styles.tabText}>Games</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Profile')}>
              <FontAwesome name="user" size={30} color='#E64A19'/>
              <Text style={styles.tabText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  profileHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  editButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#B22222',
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#FFF3E0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabButton: {
    alignItems: 'center',
  },
  alertButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  alertButton: {
    width: 70,
    height: 70,
    backgroundColor: '#E64A19',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
    position: 'absolute',
    bottom: 30,
    zIndex: 10,
  },
  alertButtonText: {
    fontSize: 12,
    color: 'black',
    marginTop: 5,
  },
  tabText: {
    fontSize: 12,
    color: 'black',
    marginTop: 5,
  },
});

export default ProfileScreen;
