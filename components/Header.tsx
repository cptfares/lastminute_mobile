import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>


      {/* Logo Image */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/lastmin.png')}
          style={styles.logo}
        />
      </View>

      {/* Notification Icon */}
      <View style={styles.rightIcons}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('notification')}
      >          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.rightIcons}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('chat')}
      >          <Ionicons name="chatbox-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  iconButton: {
    padding: 8,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
