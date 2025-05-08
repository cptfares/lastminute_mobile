import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Header() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* Centered Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/lastmin.png')}
          style={styles.logo}
        />
      </View>

      {/* Icons */}
      <View style={styles.rightIcons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/notification')}
        >
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/chat')}
        >
          <Image
            source={{ uri: 'data:image/png;base64,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' }} // use your full Base64 string here
            style={styles.chatIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#fff',
    marginTop: 30, // You can adjust this value as needed

  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: {
    height: 40,
    resizeMode: 'contain',
  },
  rightIcons: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
  },
  iconButton: {
    marginLeft: 15,
  },
  chatIcon: {
    width: 24,
    height: 24,
  },
});

