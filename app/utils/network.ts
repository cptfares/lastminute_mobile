import { Platform } from 'react-native';

export function getLocalIp(): string {
  // For Android emulator
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }
  // For iOS simulator
  if (Platform.OS === 'ios') {
    return 'localhost';
  }
  // For development, use localhost
  return 'localhost';
}

export default getLocalIp;