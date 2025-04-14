import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const settingsOptions = [
    { title: 'Edit Profile', icon: 'person-outline', route: '/edit-profile' },
    { title: 'Notifications', icon: 'notifications-outline', route: '/notifications' },
    { title: 'Download Data', icon: 'cloud-download-outline', route: '/download-data' },
    { title: 'Payment Methods', icon: 'card-outline', route: '/payment-methods' },
    { title: 'Language Preferences', icon: 'language-outline', route: '/language-preferences' },
    { title: 'Help & Support', icon: 'help-circle-outline', route: '/help-support' },
    { title: 'Privacy Policy', icon: 'lock-closed-outline', route: '/privacy-policy' },
    { title: 'Terms of Service', icon: 'document-text-outline', route: '/terms-of-service' },
    { title: 'Sign Out', icon: 'log-out-outline', route: '/login' },
  ];

  const handleNavigation = (route) => {
    if (route === '/login') {
      // Add sign-out logic here if needed
    }
    router.push(route);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.header}>Settings</Text>
      </View>

      <View style={styles.optionsContainer}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionCard, option.title === 'Sign Out' && styles.logoutCard]}
            onPress={() => handleNavigation(option.route)}
          >
            <Ionicons
              name={option.icon}
              size={24}
              color={option.title === 'Sign Out' ? '#ef4444' : '#6366f1'}
              style={styles.optionIcon}
            />
            <Text
              style={[styles.optionText, option.title === 'Sign Out' && styles.logoutText]}
            >
              {option.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerContainer: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  optionsContainer: {
    padding: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  logoutCard: {
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 24,
    padding: 8,
  },
});