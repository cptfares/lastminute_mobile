import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function OrderSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1200px-Eo_circle_green_checkmark.svg.png',
          }}
          style={styles.successImage}
        />
        <Text style={styles.title}>Order Placed Successfully</Text>
        <Text style={styles.description}>
          You will receive an email confirmation
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/orders')}
      >
        <Text style={styles.buttonText}>See Order details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366f1',
    padding: 24,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: 48,
  },
  successImage: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
});
