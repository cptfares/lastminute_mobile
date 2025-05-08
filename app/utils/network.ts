import { Platform } from 'react-native';

export function getLocalIp(): string {
  // For Android emulator
  if (Platform.OS === 'android') {
    if (__DEV__) {
      return '10.0.2.2'; // Standard Android emulator localhost address
    }
    return '192.168.137.91'; // For physical Android device
  }
  // For iOS simulator and physical devices
  if (Platform.OS === 'ios') {
    if (__DEV__) {
      return 'localhost'; // Standard iOS simulator localhost address
    }
    return '192.168.137.91'; // For physical iOS device
  }
  return '192.168.137.91'; // Fallback IP
}

export default getLocalIp;