import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const InboxScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#FFB74D', '#FF9800']} // Gradient for the background
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Inbox</Text>
        <Text style={styles.placeholderText}>No messages available</Text>
      </View>

      {/* Bottom Tab Navigation - Same as ProfileScreen */}
      <View style={styles.tabContainer}>
        {/* Feed Button */}
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="list-alt" size={24} color="black" />
          <Text style={styles.tabText}>Feed</Text>
        </TouchableOpacity>

        {/* Inbox Button */}
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Inbox')}>
          <FontAwesome name="envelope" size={30} color='#E64A19' />
          <Text style={styles.tabText}>Inbox</Text>
        </TouchableOpacity>

        {/* Central Alert Button */}
        <View style={styles.alertButtonContainer}>
          <TouchableOpacity style={styles.alertButton} onPress={() => navigation.navigate('Alert')}>
            <FontAwesome name="exclamation-circle" size={40} color="white" />
          </TouchableOpacity>
          <Text style={styles.alertButtonText}>ALERT</Text>
        </View>

        {/* Games Button */}
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Games')}>
          <FontAwesome name="gamepad" size={24} color="black" />
          <Text style={styles.tabText}>Games</Text>
        </TouchableOpacity>

        {/* Profile Button */}
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user" size={24} color="black" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 100, // Space for the navbar
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E64A19',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#777',
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

export default InboxScreen;
