import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../components/Header';


const notifications = [
  { id: '1', title: 'Steve and 8 others added comments on Design Assets - Smart Tags file', time: '2m' },
  { id: '2', title: 'Ashwin Bose commented on your listing!', time: '1h' },
  { id: '3', title: 'New Feature Alert! Smart Tags are now live! Organize and find assets faster.', time: '14h', action: 'Try now' },
  { id: '4', title: 'Samantha has shared a file with you', time: '14h', file: 'Demo File.pdf', size: '2.2 MB' },
];

const NotificationScreen = () => {
  const router = useRouter();

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Ionicons name="notifications" size={24} color="#6366f1" style={styles.icon} />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>{item.title}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
        {item.action && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>{item.action}</Text>
          </TouchableOpacity>
        )}
        {item.file && (
          <Text style={styles.fileText}>{item.file} ({item.size})</Text>
        )}
      </View>
    </View>
  );

  return (
    <>
                  <Header />

        <View style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14, // Reduced font size
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
  actionButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6366f1',
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  fileText: {
    marginTop: 5,
    fontSize: 14,
    color: '#6366f1',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
});

export default NotificationScreen;